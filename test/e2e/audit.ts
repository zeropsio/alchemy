import { appendFile } from "node:fs/promises";
import { isAbsolute } from "node:path";
import { createGuardFromEnv } from "../support/guard.ts";
import type { ZeropsRequestInfo } from "../../src/client/RequestGuard.ts";

/** Metadata only: signed upload/log paths, queries, headers and bodies never enter the audit. */
export function createAuditedGuard(path = process.env.ZEROPS_E2E_AUDIT) {
  if (path && !isAbsolute(path)) throw new Error("ZEROPS_E2E_AUDIT must be absolute");
  const guard = createGuardFromEnv();
  let sequence = 0;
  const ids = new WeakMap<ZeropsRequestInfo, string>();
  async function record(request: ZeropsRequestInfo, phase: "before" | "after", status?: number) {
    if (!path) return;
    let id = ids.get(request);
    if (!id) {
      id = `${process.pid}-${++sequence}`;
      ids.set(request, id);
    }
    await appendFile(
      path,
      JSON.stringify({
        time: new Date().toISOString(),
        id,
        phase,
        kind: request.kind,
        method: request.method,
        path: request.kind === "api" ? request.url.pathname : request.url.host,
        ...(status === undefined ? {} : { status }),
      }) + "\n",
    );
  }
  return {
    async before(request: ZeropsRequestInfo) {
      await record(request, "before");
      await guard.before(request);
    },
    async after(request: ZeropsRequestInfo, response: { status: number; body: unknown }) {
      try {
        await record(request, "after", response.status);
      } finally {
        await guard.after?.(request, response);
      }
    },
    async failed(request: ZeropsRequestInfo) {
      await guard.failed?.(request);
    },
  };
}
