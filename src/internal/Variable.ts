import { createHash } from "node:crypto";
import * as Clock from "effect/Clock";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import type { Http } from "../client/Http.ts";
import { isNotFound, ZeropsProcessTimeout } from "../client/Errors.ts";
import { environmentOperations } from "../client/operations/Environment.ts";
import type { ZeropsError } from "../client/Errors.ts";
import { waitProcessWith, type WaitOptions } from "../client/Process.ts";
import { envDigest, isMasked } from "./Environment.ts";
import { editableEnv, envOwnershipError } from "./ServiceEnv.ts";
import { withinEnvDeadline } from "./EnvDeadline.ts";

export interface VariableRow {
  id: string;
  key: string;
  content: string;
  sensitive: boolean;
  type: string;
  editable: boolean;
  internal?: boolean;
}
export const variableValue = (value: string | Redacted.Redacted<string>) =>
  Redacted.isRedacted(value) ? Redacted.value(value) : value;
export const desiredDigest = (value: string | Redacted.Redacted<string>) =>
  createHash("sha256").update(variableValue(value)).digest("hex");

export const variableOperations = (http: Http, scope: "project" | "service") => {
  const ops = environmentOperations(http);
  const missing = scope === "project" ? "projectEnvNotFound" : "userDataNotFound";
  const get = (id: string) =>
    Effect.gen(function* () {
      const request: Effect.Effect<VariableRow, ZeropsError> =
        scope === "project" ? ops.projectGet(id) : ops.serviceGet(id);
      return yield* request.pipe(
        Effect.catch((error) =>
          isNotFound(error, missing, "projectNotFound", "serviceStackNotFound")
            ? Effect.succeed(undefined)
            : Effect.fail(error),
        ),
      );
    });
  const lookup = (target: string, key: string) =>
    Effect.gen(function* () {
      const rows: ReadonlyArray<VariableRow> =
        scope === "project"
          ? (yield* ops.projectList(target)).items
          : yield* ops.serviceList(target);
      const matches = rows.filter((row) => row.key.toLowerCase() === key.toLowerCase());
      if (matches.length > 1) return yield* Effect.fail(envOwnershipError(key));
      const row = matches[0];
      if (row && !editableEnv(row)) return yield* Effect.fail(envOwnershipError(key));
      return row;
    });
  const read = (target: string, key: string, id?: string) =>
    Effect.gen(function* () {
      const row = id ? yield* get(id) : yield* lookup(target, key);
      if (row && !editableEnv(row)) return yield* Effect.fail(envOwnershipError(key));
      return row;
    });
  const write = (
    target: string,
    key: string,
    value: string | Redacted.Redacted<string>,
    sensitive: boolean,
    previous: string | undefined,
    options: WaitOptions,
    id?: string,
  ) =>
    Effect.gen(function* () {
      let row = id ? yield* read(target, key, id) : undefined;
      if (!row) row = yield* lookup(target, key);
      const body = { key, content: variableValue(value), sensitive };
      if (
        !row ||
        row.key !== key ||
        envDigest(row.content, previous) !== desiredDigest(value) ||
        row.sensitive !== sensitive
      ) {
        const process = row
          ? yield* scope === "project"
              ? ops.projectUpdate(row.id, body)
              : ops.serviceUpdate(row.id, body)
          : yield* scope === "project"
              ? ops.projectCreate(target, body)
              : ops.serviceCreate(target, body);
        yield* waitProcessWith(http, process.id, options);
        row = yield* lookup(target, key);
      }
      if (!row) return yield* Effect.fail(envOwnershipError(key));
      return row;
    }).pipe(withinEnvDeadline(target, options.deadline));
  const remove = (id: string, options: WaitOptions) =>
    Effect.gen(function* () {
      const row = yield* get(id);
      if (!row) return;
      if (!editableEnv(row)) return yield* Effect.fail(envOwnershipError(row.key));
      const process = yield* (
        scope === "project" ? ops.projectDelete(id) : ops.serviceDelete(id)
      ).pipe(
        Effect.catch((error) =>
          isNotFound(error, missing) ? Effect.succeed(undefined) : Effect.fail(error),
        ),
      );
      if (process) yield* waitProcessWith(http, process.id, options);
      while (yield* get(id)) {
        if ((yield* Clock.currentTimeMillis) >= options.deadline) {
          return yield* Effect.fail(
            new ZeropsProcessTimeout({
              code: "environmentDeleteTimeout",
              processId: id,
              message: "Environment row deletion deadline exceeded",
            }),
          );
        }
        yield* Effect.sleep(1000);
      }
    }).pipe(withinEnvDeadline(id, options.deadline));
  return { read, write, remove };
};

export const observedDigest = (row: VariableRow, previous?: string) =>
  envDigest(row.content, previous) ?? "";
export { isMasked };
