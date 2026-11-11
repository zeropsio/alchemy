import { createGuardFromEnv } from "../test/support/guard.ts";
import { alchemyProjects, alchemyProjectIntents, recordProject } from "../test/support/ledger.ts";
import { acquireRunLock } from "../test/support/runLock.ts";
import type { ZeropsRequestInfo } from "../src/client/RequestGuard.ts";

function object(value: unknown): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    throw new Error("invalid sweeper API object");
  return value as Record<string, unknown>;
}

function notFound(result: { status: number; body: Record<string, unknown> }): boolean {
  return (
    (result.status === 400 || result.status === 404) &&
    result.body.error !== null &&
    typeof result.body.error === "object" &&
    "code" in result.body.error &&
    result.body.error.code === "projectNotFound"
  );
}

/** Dry-run by default. Collect every page before deleting, so offsets cannot skip rows. */
export async function sweep(args = process.argv.slice(2)): Promise<void> {
  acquireRunLock();
  let yes = false,
    all = false,
    assertEmpty = false,
    olderThan: number | undefined,
    prefix: string | undefined;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--yes") yes = true;
    else if (args[i] === "--all") all = true;
    else if (args[i] === "--assert-empty") assertEmpty = true;
    else if (args[i] === "--older-than") {
      const value = args[++i];
      if (!value || !/^\d+(?:\.\d+)?$/.test(value) || !Number.isFinite(Number(value)))
        throw new Error("--older-than requires nonnegative minutes");
      olderThan = Number(value);
    } else if (args[i] === "--prefix") {
      prefix = args[++i];
      if (!prefix || !/^alch(?:test|fam|probe)-[a-z0-9-]*$/.test(prefix))
        throw new Error("--prefix must start with alchtest-, alchfam- or alchprobe-");
    } else
      throw new Error(
        "usage: bun scripts/sweep.ts [--all | --older-than MINUTES] [--prefix P] [--yes] [--assert-empty]",
      );
  }
  if (all && olderThan !== undefined)
    throw new Error("--all and --older-than are mutually exclusive");
  // Bare invocation is the non-destructive inventory requested by the CLI contract.
  if (yes && !all && olderThan === undefined)
    throw new Error("--yes requires --all or --older-than MINUTES");
  const age = olderThan ?? 0;
  const guard = createGuardFromEnv();
  const endpoint = process.env.ZEROPS_ENDPOINT!;
  const org = process.env.ZEROPS_ORGANIZATION_ID!.trim();
  const prod = process.env.ZEROPS_TARGET === "prod";
  const ci = prod && process.env.ZEROPS_CI_CLEANUP === "1";
  if (ci && (prefix !== "alchtest-" || !all || olderThan !== undefined))
    throw new Error("production CI sweeper requires --all --prefix alchtest-");
  const owned = prod ? alchemyProjects(process.env.ZEROPS_PROD_LEDGER!) : undefined;
  const intents = prod ? alchemyProjectIntents(process.env.ZEROPS_PROD_LEDGER!) : undefined;
  const deadline = Date.now() + 110 * 60_000;
  async function request(
    method: string,
    path: string,
  ): Promise<{ status: number; body: Record<string, unknown> }> {
    const req: ZeropsRequestInfo = {
      method,
      url: new URL(`${endpoint}/api/rest/public${path}`),
      kind: "api",
    };
    await guard.before(req);
    let response: Response;
    try {
      response = await fetch(req.url, {
        method,
        redirect: "error",
        headers: {
          Authorization: `Bearer ${process.env.ZEROPS_TOKEN!}`,
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(Math.max(1, Math.min(120_000, deadline - Date.now()))),
      });
    } catch {
      throw new Error("sweeper request failed");
    }
    let body: Record<string, unknown>;
    try {
      body = object(await response.json());
    } catch {
      throw new Error("invalid sweeper API response");
    }
    await guard.after?.(req, { status: response.status, body });
    if (!response.ok && !notFound({ status: response.status, body }))
      throw new Error(`API request failed (HTTP ${response.status})`);
    return { status: response.status, body };
  }
  async function inventory(): Promise<Array<{ id: string; name: string }>> {
    const projects: Array<{ id: string; name: string }> = [];
    for (let offset = 0; ;) {
      const { body } = await request("GET", `/client/${org}/project?offset=${offset}&limit=100`);
      if (!Array.isArray(body.list) || typeof body.total !== "number" ||
          !Number.isInteger(body.total) || body.total < offset + body.list.length ||
          (!body.list.length && offset < body.total))
        throw new Error("invalid project listing");
      for (const row of body.list) {
        const project = object(row);
        if (typeof project.name !== "string" ||
            !(ci ? project.name.startsWith("alchtest-") :
              /^(alchtest-|alchfam-|alchprobe-)/.test(project.name)) ||
            (prefix !== undefined && !project.name.startsWith(prefix)))
          continue;
        if (typeof project.id !== "string" || !/^[a-zA-Z0-9_-]{1,128}$/.test(project.id) ||
            /[\t\r\n]/.test(project.name))
          throw new Error("unsafe project inventory row");
        if ((prod || project.clientId) && project.clientId !== org)
          throw new Error("foreign organization in project listing");
        // CI cleanup discovers only approved names in the pinned dedicated organization.
        // Normal production runs retain the existing ledger-only selection.
        if (prod && !ci && !owned!.has(project.id) && !intents!.has(project.name))
          continue;
        if (age > 0 && (typeof project.created !== "string" ||
            !Number.isFinite(Date.parse(project.created)) ||
            Date.parse(project.created) > Date.now() - age * 60_000))
          continue;
        projects.push({ id: project.id, name: project.name });
      }
      offset += body.list.length;
      if (offset >= body.total) return projects;
    }
  }
  const projects = await inventory();
  let failures = 0;
  for (const project of projects) {
    if (project.name.startsWith("alchprobe-")) {
      console.log(`${project.id}\t${project.name}\tskip: not alchtest-\treport-only`);
      continue;
    }
    if (!yes) {
      console.log(`${project.id}\t${project.name}\tdry-run\twould-delete`);
      continue;
    }
    try {
      if (ci) recordProject(process.env.ZEROPS_PROD_LEDGER!, project.id, project.name);
      const deleted = await request("DELETE", `/project/${project.id}`);
      if (!notFound(deleted)) {
        const processId = deleted.body?.id;
        if (typeof processId !== "string" || !/^[a-zA-Z0-9_-]{1,128}$/.test(processId))
          throw new Error("delete response has no process ID");
        for (;;) {
          if (Date.now() >= deadline) throw new Error("delete process timed out");
          const { body } = await request("GET", `/process/${processId}`);
          if (typeof body.status !== "string") throw new Error("invalid delete process status");
          if (["FAILED", "ERROR", "CANCELLED", "CANCELED"].includes(body.status))
            throw new Error("delete process failed");
          if (body.status === "FINISHED") break;
          await Bun.sleep(2000);
        }
      }
      for (;;) {
        if (Date.now() >= deadline) throw new Error("project absence timed out");
        const result = await request("GET", `/project/${project.id}`);
        if (notFound(result)) break;
        await Bun.sleep(2000);
      }
      console.log(`${project.id}\t${project.name}\tdelete\tprojectNotFound`);
    } catch (error) {
      failures++;
      // Guard and request errors contain only controlled text, never response bodies or URLs.
      console.log(
        `${project.id}\t${project.name}\tdelete\tFAILED: ${error instanceof Error ? error.message : "unknown error"}`,
      );
    }
  }
  if (!projects.length) console.log("-\t-\tinventory\tempty");
  if (failures) throw new Error(`${failures} project deletion(s) failed`);
  if (assertEmpty && (await inventory()).length)
    throw new Error("project leftovers remain in the selected cleanup scope");
}

if (import.meta.main) {
  try {
    await sweep();
  } catch (error) {
    console.error(error instanceof Error ? error.message : "sweep failed");
    process.exitCode = 1;
  }
}
