import { appendFile, cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { isAbsolute, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { randomBytes } from "node:crypto";
import { createAuditedGuard } from "./audit.ts";
import type { ZeropsRequestInfo } from "../../src/client/RequestGuard.ts";
import { createEvidence } from "./evidence.ts";
import { acquireRunLock } from "../support/runLock.ts";

acquireRunLock();

const root = resolve(import.meta.dirname, "../..");
const target = process.env.ZEROPS_TARGET;
if (target !== "dev" && target !== "prod")
  throw new Error("Set ZEROPS_TARGET to dev or prod explicitly");
if (
  target === "prod" &&
  (process.env.ZEROPS_ENDPOINT !== "https://api.app-prg1.zerops.io" ||
    !process.env.ZEROPS_CI_ORGANIZATION_ID ||
    process.env.ZEROPS_ORGANIZATION_ID !== process.env.ZEROPS_CI_ORGANIZATION_ID ||
    !isAbsolute(process.env.ZEROPS_PROD_LEDGER ?? ""))
) {
  throw new Error(
    "Production requires the pinned endpoint, organization, and an absolute ZEROPS_PROD_LEDGER",
  );
}
const runId =
  new Date().toISOString().replace(/[^0-9]/g, "") + "-" + randomBytes(4).toString("hex");
const dir = join(root, ".cache/e2e", target + "-" + runId);
const state = join(dir, ".alchemy/state");
const backup = join(dir, "state-before-adopt");
const transcript = join(dir, "transcript.log");
const auditPath = join(dir, "requests.log");
const guard = createAuditedGuard(auditPath); // Validate before creating files or spawning a deploy.
const name = "alchtest-basic-" + runId;
const source = join(dir, "api");
let greeting = "smoke-initial-" + runId;
const updatedGreeting = "smoke-updated-" + runId;
const secrets = [
  process.env.ZEROPS_TOKEN,
  process.env.ZEROPS_ORGANIZATION_ID,
  process.env.ZEROPS_ENDPOINT,
  process.env.ZEROPS_DEV_DOMAIN,
  greeting,
  updatedGreeting,
].filter((s): s is string => !!s);
function redact(value: string): string {
  let text = value
    .replace(/\x1b\[[0-9;]*m/g, "")
    .replace(/postgres(?:ql)?:\/\/[^\s"'<>]+/gi, "[REDACTED_DATABASE_URL]")
    .replace(/https?:\/\/[^\s"'<>]+\?[^\s"'<>]*/gi, "[REDACTED_URL]");
  for (const secret of secrets) text = text.replaceAll(secret, "[REDACTED]");
  return text;
}
async function log(message: string) {
  const line = `[${new Date().toISOString()}] ${redact(message)}\n`;
  await appendFile(transcript, line);
  process.stdout.write(line);
}
const summary: { step: string; result: string; duration: string }[] = [];
let failed = false;
async function step(label: string, action: () => Promise<void>) {
  const start = Date.now();
  await log("START " + label);
  try {
    await action();
    summary.push({
      step: label,
      result: "PASS",
      duration: ((Date.now() - start) / 1000).toFixed(1) + "s",
    });
    await log("PASS " + label);
  } catch (error) {
    failed = true;
    summary.push({
      step: label,
      result: "FAIL",
      duration: ((Date.now() - start) / 1000).toFixed(1) + "s",
    });
    await log("FAIL " + label + ": " + String(error));
    throw error;
  }
}
async function command(command: "deploy" | "plan" | "destroy", adopt = false) {
  // Every subprocess is awaited, including both output streams, before another starts.
  const child = Bun.spawn(
    [
      "bun",
      join(root, "node_modules/alchemy/bin/cli.js"),
      command,
      ...(command === "plan" ? [] : ["--yes"]),
      "--stage",
      "smoke",
      ...(adopt ? ["--adopt"] : []),
    ],
    {
      cwd: dir,
      env: {
        ...process.env,
        ZEROPS_E2E_AUDIT: auditPath,
        ALCHTEST_NAME: name,
        ALCHTEST_DOMAIN: name + ".example.com",
        ALCHTEST_SOURCE_DIR: source,
        ALCHTEST_GREETING: greeting,
      },
      stdout: "pipe",
      stderr: "pipe",
    },
  );
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  const output = stdout + stderr;
  await log(command + (adopt ? " --adopt" : "") + ` exited ${code}\n` + output);
  return { code, output };
}
function requireSuccess(result: { code: number }) {
  if (result.code !== 0) throw new Error("Alchemy command exited " + result.code);
}
interface Outputs {
  projectId: string;
  serviceId: string;
  appVersionId: string;
  subdomainUrls: string[];
}
async function outputs(): Promise<Outputs> {
  const value = JSON.parse(
    await readFile(join(state, "ZeropsBasicE2E/smoke/__stack_output__.json"), "utf8"),
  ) as Outputs;
  if (!value.projectId || !value.serviceId || !value.appVersionId)
    throw new Error("Stack outputs lack project, service, or app version identity");
  return value;
}
const { captureLimits, limitsSummary } = createEvidence(dir, log);
async function http(out: Outputs) {
  if (!out.subdomainUrls?.length) throw new Error("No generated subdomain URLs");
  const results = await Promise.all(
    out.subdomainUrls.map(async (url, index) => {
      const deadline = Date.now() + 180_000;
      let finding = "no response";
      do {
        try {
          const response = await fetch(url, {
            signal: AbortSignal.timeout(10_000),
            redirect: "error",
          });
          const body = (await response.json()) as {
            greeting?: string;
            databaseUrlResolved?: boolean;
          };
          if (
            response.status === 200 &&
            body.databaseUrlResolved === true &&
            body.greeting === greeting
          ) {
            await log(`HTTP subdomain ${index + 1}: 200, reference resolved, greeting matched`);
            return true;
          }
          finding = `status=${response.status}, referenceResolved=${body.databaseUrlResolved === true}, greetingMatched=${body.greeting === greeting}`;
        } catch {
          finding = "unreachable or invalid JSON";
        }
        await Bun.sleep(5000);
      } while (Date.now() < deadline);
      await log(`FINDING HTTP subdomain ${index + 1}: ${finding} after 180s`);
      return false;
    }),
  );
  if (results.some((value) => !value)) throw new Error("Subdomain HTTP smoke failed; see findings");
}
async function absent(id: string) {
  const request: ZeropsRequestInfo = {
    method: "GET",
    kind: "api",
    url: new URL(
      "/api/rest/public/project/" + encodeURIComponent(id),
      process.env.ZEROPS_ENDPOINT!,
    ),
  };
  await guard.before(request);
  const response = await fetch(request.url, {
    redirect: "error",
    headers: { Authorization: "Bearer " + process.env.ZEROPS_TOKEN },
  });
  const body = (await response.json()) as { code?: string; error?: { code?: string } };
  await guard.after?.(request, { status: response.status, body });
  if (
    ![400, 404].includes(response.status) ||
    (body.code ?? body.error?.code) !== "projectNotFound"
  )
    throw new Error("Project absence not confirmed");
  await log("Raw guarded absence check: projectNotFound");
}
// Recover the project ID even when an initial deployment fails before stack outputs exist.
async function findProjectId(path = state): Promise<string | undefined> {
  for (const entry of await readdir(path, { withFileTypes: true }).catch(() => [])) {
    const file = join(path, entry.name);
    if (entry.isDirectory()) {
      const id = await findProjectId(file);
      if (id) return id;
    } else if (entry.name.endsWith(".json")) {
      const text = await readFile(file, "utf8");
      const match = /"projectId"\s*:\s*"([a-zA-Z0-9_-]+)"/.exec(text);
      if (match) return match[1];
    }
  }
}
await mkdir(dir, { recursive: true });
await cp(join(root, "examples/basic/api"), source, { recursive: true });
await writeFile(
  join(dir, "alchemy.run.ts"),
  "export { default } from " +
    JSON.stringify(pathToFileURL(join(root, "test/e2e/basic.run.ts")).href) +
    ";\n",
);
await writeFile(
  join(dir, "package.json"),
  JSON.stringify({
    type: "module",
    dependencies: { "@zerops/alchemy": "file:" + root },
    alchemy: { contributes: [pathToFileURL(join(root, "src/Contributions.ts")).href] },
  }),
);
let projectId: string | undefined;
let destroyed = false;
let stateLost = false;
try {
  let first!: Outputs;
  await step("deploy", async () => {
    requireSuccess(await command("deploy"));
    first = await outputs();
    projectId = first.projectId;
    await captureLimits("initial", first);
  });
  await step("initial HTTP", () => http(first));
  await step("noop deploy", async () => {
    const result = await command("deploy");
    requireSuccess(result);
    if (!/Plan: no changes/i.test(result.output))
      throw new Error("Second deploy did not report no changes; exact plan recorded above");
    if ((await outputs()).appVersionId !== first.appVersionId)
      throw new Error("Noop created an app version");
  });
  await step("update source and greeting", async () => {
    greeting = updatedGreeting;
    await appendFile(join(source, "index.js"), "\n// Smoke source update " + runId + "\n");
    requireSuccess(await command("deploy"));
    const updated = await outputs();
    await captureLimits("updated", updated);
    if (!updated.appVersionId || updated.appVersionId === first.appVersionId)
      throw new Error("Update did not create a new app version");
    await http(updated);
  });
  await step("adopt after state loss", async () => {
    await cp(state, backup, { recursive: true });
    await rm(state, { recursive: true, force: true });
    stateLost = true;
    const refused = await command("deploy");
    await log(
      `State-loss deploy: exit=${refused.code}, OwnedBySomeoneElse=${/OwnedBySomeoneElse/.test(refused.output)}`,
    );
    if (refused.code === 0 || !/OwnedBySomeoneElse|unowned|--adopt/i.test(refused.output))
      throw new Error("Expected explicit-hostname ownership refusal");
    requireSuccess(await command("deploy", true));
    stateLost = false;
    const adopted = await outputs();
    await captureLimits("adopted", adopted);
    if (adopted.projectId !== projectId || adopted.serviceId !== first.serviceId)
      throw new Error("Adoption changed resource identities");
    const plan = await command("plan");
    requireSuccess(plan);
    if (!/Plan: no changes/.test(plan.output))
      throw new Error("Post-adopt plan changes resources; exact plan recorded above");
  });
  await step("destroy and confirm absence", async () => {
    requireSuccess(await command("destroy"));
    await absent(projectId!);
    destroyed = true;
  });
} catch {
  failed = true;
} finally {
  if (!destroyed) {
    try {
      await step("finally cleanup", async () => {
        projectId ??= await findProjectId();
        if (stateLost) {
          await rm(state, { recursive: true, force: true });
          await cp(backup, state, { recursive: true });
        }
        requireSuccess(await command("destroy"));
        projectId ??= await findProjectId(backup);
        if (!projectId)
          throw new Error("No project ID available for absence check; inspect state and ledger");
        await absent(projectId);
        destroyed = true;
      });
    } catch {
      await log("CLEANUP FAILED; project=" + (projectId ?? "unknown; inspect ledger"));
    }
  }
  await limitsSummary();
  await log(
    "\nstep | result | duration\n" +
      summary.map((row) => `${row.step} | ${row.result} | ${row.duration}`).join("\n"),
  );
  await log("Transcript: " + transcript);
  process.exitCode = failed || !destroyed ? 1 : 0;
}
