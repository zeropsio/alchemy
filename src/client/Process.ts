import * as Effect from "effect/Effect";
import * as Clock from "effect/Clock";
import { ZeropsProcessFailed, ZeropsProcessTimeout, safeCode } from "./Errors.ts";
import { ZeropsClient, type Http } from "./Http.ts";
export interface ProcessRecord {
  id: string;
  status: string;
  actionName?: string;
  error?: { code?: string } | null;
}
export interface WaitOptions {
  deadline: number;
  onStatus?: (process: ProcessRecord) => Effect.Effect<void>;
}
export const waitProcessWith = (http: Pick<Http, "request">, id: string, options: WaitOptions) =>
  Effect.gen(function* () {
    let delay = 1000;
    let status: string | undefined;
    while (true) {
      const now = yield* Clock.currentTimeMillis;
      if (now >= options.deadline)
        return yield* Effect.fail(
          new ZeropsProcessTimeout({
            code: "processTimeout",
            processId: id,
            status,
            message: "Process deadline exceeded; remote process continues",
          }),
        );
      const p = yield* http
        .request<ProcessRecord>("GET", "/process/" + encodeURIComponent(id))
        .pipe(
          Effect.timeoutOrElse({
            duration: options.deadline - now,
            orElse: () =>
              Effect.fail(
                new ZeropsProcessTimeout({
                  code: "processTimeout",
                  processId: id,
                  status,
                  message: "Process deadline exceeded; remote process continues",
                }),
              ),
          }),
        );
      if (!p || p.id !== id || typeof p.status !== "string")
        return yield* Effect.fail(
          new ZeropsProcessFailed({
            code: "invalidProcess",
            processId: id,
            status: "UNKNOWN",
            message: "Invalid process response",
          }),
        );
      if (p.status !== status) {
        status = p.status;
        if (options.onStatus) yield* options.onStatus(p);
      }
      if (p.status === "FINISHED") return p;
      if (p.status === "FAILED" || p.status === "CANCELED")
        return yield* Effect.fail(
          new ZeropsProcessFailed({
            code: p.error?.code ?? "processFailed",
            processId: id,
            status: p.status,
            action: safeCode(p.actionName),
            failReason: safeCode(p.error?.code ?? "processFailed"),
            message: "Remote process " + p.status,
          }),
        );
      yield* Effect.sleep(
        Math.min(delay, Math.max(0, options.deadline - (yield* Clock.currentTimeMillis))),
      );
      delay = Math.min(5000, delay * 1.5);
    }
  });
export const waitProcess = (id: string, options: WaitOptions) =>
  Effect.gen(function* () {
    return yield* waitProcessWith(yield* ZeropsClient, id, options);
  });
