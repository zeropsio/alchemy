import { mkdtemp, mkdir, writeFile, rm, readFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
import { randomBytes } from "node:crypto";
import { createGuardFromEnv } from "../support/guard.ts";
import { devLedgerPath, readLedger } from "../support/ledger.ts";
import type { ZeropsRequestInfo } from "../../src/client/RequestGuard.ts";
import { acquireRunLock } from "../support/runLock.ts";
export class LiveApi5xx extends Error {
  constructor(
    readonly method: string,
    readonly path: string,
    readonly status: number,
  ) {
    super(`LIVE_API_5XX ${method} ${path} HTTP ${status}`);
  }
}

/** The guard owns target validation, including the pinned production org and absolute ledger. */
function createLiveRequest() {
  const guard = createGuardFromEnv();
  const endpoint = process.env.ZEROPS_ENDPOINT!;
  const token = process.env.ZEROPS_TOKEN!;
  return async (
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    body?: unknown,
    options: { allowError?: boolean } = {},
  ): Promise<{ status: number; body: unknown }> => {
    if (!path.startsWith("/") || path.startsWith("//")) throw new Error("Invalid live API path");
    const request: ZeropsRequestInfo = {
      method,
      kind: "api",
      url: new URL(endpoint + "/api/rest/public" + path),
      ...(body === undefined ? {} : { body }),
    };
    await guard.before(request);
    let response: Response;
    try {
      response = await fetch(request.url, {
        method,
        redirect: "error",
        signal: AbortSignal.timeout(30000),
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch (error) {
      try {
        await guard.failed?.(request);
      } catch {
        // Preserve the original transport failure.
      }
      throw error;
    }
    let result: unknown;
    try {
      const text = await response.text();
      try {
        result = JSON.parse(text);
      } catch {
        result = undefined;
      }
    } finally {
      try {
        await guard.after?.(request, { status: response.status, body: result });
      } finally {
        if (response.status >= 500) throw new LiveApi5xx(method, path, response.status);
      }
    }
    if (!response.ok && !options.allowError)
      throw new Error(`LIVE_API_ERROR ${method} ${path} HTTP ${response.status}`);
    if (result === undefined)
      throw new Error(`LIVE_API_INVALID_JSON ${method} ${path} HTTP ${response.status}`);
    return { status: response.status, body: result };
  };
}

export function createLiveApi() {
  const request = createLiveRequest();
  return async <T = unknown>(...args: Parameters<typeof request>): Promise<T> =>
    (await request(...args)).body as T;
}

/** Absence is confirmed only by HTTP 400 and the endpoint's exact documented code. */
export async function liveAbsent(path: string, code: string): Promise<boolean> {
  acquireRunLock();
  const response = await createLiveRequest()("GET", path, undefined, { allowError: true });
  const body = response.body as { code?: string; error?: { code?: string } } | null;
  if (response.status === 400 && (body?.code ?? body?.error?.code) === code) return true;
  if (response.status < 200 || response.status >= 300)
    throw new Error(`LIVE_API_ERROR GET ${path} HTTP ${response.status}`);
  return false;
}

export async function liveApi<T = unknown>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: unknown,
  options: { allowError?: boolean } = {},
): Promise<T> {
  acquireRunLock();
  return createLiveApi()<T>(method, path, body, options);
}
export const packageRoot = resolve(import.meta.dir, "../..");
export interface CommandResult {
  code: number;
  output: string;
}
/** Takes the shared run lock for the rest of the process (the read-only monitor never does). */
export async function createLiveHarness(fixture: string, props: Record<string, string> = {}) {
  acquireRunLock();
  // Validate before spawning any CLI that might mutate the target.
  createGuardFromEnv();
  const started = Date.now();
  await mkdir(join(packageRoot, ".cache/live"), { recursive: true });
  const dir = await mkdtemp(join(packageRoot, ".cache/live/", fixture + "-"));
  // Development family runs use `alchfam-` (ALCHTEST_PREFIX); production is always `alchtest-`.
  const prefix =
    process.env.ZEROPS_TARGET === "prod"
      ? "alchtest-"
      : (process.env.ALCHTEST_PREFIX ?? "alchtest-");
  if (prefix !== "alchtest-" && prefix !== "alchfam-")
    throw new Error("ALCHTEST_PREFIX must be alchtest- or alchfam-");
  const name = prefix + fixture + "-" + randomBytes(6).toString("hex");
  const fixtureUrl = pathToFileURL(
    join(packageRoot, "test/live/stacks", fixture, "alchemy.run.ts"),
  ).href;
  await writeFile(
    join(dir, "alchemy.run.ts"),
    "export {default} from " + JSON.stringify(fixtureUrl) + ";\n",
  );
  await writeFile(
    join(dir, "package.json"),
    JSON.stringify({
      type: "module",
      dependencies: { "@zerops/alchemy": "file:" + packageRoot },
      alchemy: { contributes: [pathToFileURL(join(packageRoot, "src/Contributions.ts")).href] },
    }),
  );
  const env = { ...process.env, ALCHTEST_NAME: name, ...props };
  const transcript: CommandResult[] = [];
  const run = async (
    command: "deploy" | "plan" | "destroy" | "drift",
    options: { adopt?: boolean; repair?: boolean; props?: Record<string, string> } = {},
  ): Promise<CommandResult> => {
    const proc = Bun.spawn(
      [
        "bun",
        join(packageRoot, "node_modules/alchemy/bin/cli.js"),
        command,
        ...(command === "plan" || command === "drift" ? [] : ["--yes"]),
        ...(command === "drift" ? ["--no-input", ...(options.repair ? ["--repair"] : [])] : []),
        "--stage",
        "live",
        ...(options.adopt ? ["--adopt"] : []),
      ],
      { cwd: dir, env: { ...env, ...options.props }, stdout: "pipe", stderr: "pipe" },
    );
    const [stdout, stderr, code] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
      proc.exited,
    ]);
    const result = { code, output: stdout + stderr };
    transcript.push(result);
    return result;
  };
  const outputs = async () =>
    JSON.parse(
      await readFile(
        join(dir, ".alchemy/state/ZeropsProjectLive/live/__stack_output__.json"),
        "utf8",
      ),
    );
  return {
    dir,
    name,
    run,
    outputs,
    transcript,
    loseState: () => rm(join(dir, ".alchemy/state"), { recursive: true, force: true }),
    remove: async () => {
      let id = "unknown";
      let absent = false;
      try {
        const rows = readLedger(
          process.env.ZEROPS_TARGET === "prod" ? process.env.ZEROPS_PROD_LEDGER! : devLedgerPath(),
        );
        id = rows.findLast((row) => row.kind === "project" && row.name === name)?.id ?? id;
        if (id !== "unknown") absent = await rawProjectAbsent(id);
      } finally {
        console.log(
          `LIVE_RESULT file=${fixture}.test.ts projectId=${id} absent=${absent} seconds=${((Date.now() - started) / 1000).toFixed(1)}`,
        );
        await rm(dir, { recursive: true, force: true });
      }
    },
  };
}
export async function rawProjectAbsent(id: string): Promise<boolean> {
  return liveAbsent("/project/" + encodeURIComponent(id), "projectNotFound");
}
