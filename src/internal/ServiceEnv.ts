import { createHash } from "node:crypto";
import * as Effect from "effect/Effect";
import type { Http } from "../client/Http.ts";
import type { components } from "../client/api.gen.ts";
import { ZeropsValidation } from "../client/Errors.ts";
import type { ZeropsError } from "../client/Errors.ts";
import { environmentOperations } from "../client/operations/Environment.ts";
import { waitProcessWith, type ProcessRecord } from "../client/Process.ts";
import { envDigest } from "./Environment.ts";
import { envClaimsFor } from "./EnvClaims.ts";
import { withinEnvDeadline } from "./EnvDeadline.ts";

export interface ServiceEnvArgs {
  serviceId: string;
  owner: string;
  desired: Readonly<Record<string, string>>;
  sensitive?: ReadonlyArray<string>;
  previousDigests: Readonly<Record<string, string>>;
  deadline: number;
  note?: (message: string) => Effect.Effect<void>;
}
export const editableEnv = (row: { type: string; editable: boolean; internal?: boolean }) =>
  row.type === "USER" && row.editable && !row.internal;
export const envOwnershipError = (key: string) =>
  new ZeropsValidation({
    status: 400,
    code: "environmentKeyNotEditable",
    operation: "writeEnvironment",
    message: `Refusing non-USER, non-editable or internal environment key ${key}`,
  });

export const convergeServiceEnv = (
  http: Http,
  args: ServiceEnvArgs,
): Effect.Effect<Record<string, string>, ZeropsError> =>
  Effect.gen(function* () {
    const ops = environmentOperations(http);
    const claims = envClaimsFor(http);
    const desiredKeys = new Set<string>();
    for (const key of Object.keys(args.desired)) {
      const identity = key.toLowerCase();
      if (desiredKeys.has(identity)) {
        return yield* Effect.fail(
          new ZeropsValidation({
            status: 400,
            code: "duplicateEnvironmentKey",
            operation: "writeEnvironment",
            message: `Desired environment contains duplicate case-insensitive key ${key}`,
          }),
        );
      }
      desiredKeys.add(identity);
    }
    const previous = new Map(
      Object.entries(args.previousDigests).map(([key, digest]) => [key.toLowerCase(), digest]),
    );
    const sensitiveKeys = new Set(args.sensitive?.map((key) => key.toLowerCase()));
    const keys = new Set([...Object.keys(args.desired), ...Object.keys(args.previousDigests)]);
    // Claim all keys before making the first mutation, including keys being removed.
    for (const key of keys) yield* claims.claim("service", args.serviceId, key, args.owner);
    const response = yield* http.request<components["schemas"]["ResponseServiceStackEnvList"]>(
      "GET",
      "/service-stack/" + encodeURIComponent(args.serviceId) + "/env",
    );
    const rows = new Map<string, components["schemas"]["ResponseUserData"]>();
    for (const key of keys) {
      const candidates = response.items.filter(
        (row) => row.key.toLowerCase() === key.toLowerCase(),
      );
      if (candidates.length > 1) return yield* Effect.fail(envOwnershipError(key));
      if (candidates[0]) {
        if (candidates[0].type !== "USER") return yield* Effect.fail(envOwnershipError(key));
        const row = yield* ops.serviceGet(candidates[0].id);
        if (!editableEnv(row)) return yield* Effect.fail(envOwnershipError(key));
        rows.set(key.toLowerCase(), row);
      }
    }
    const wait = (process: ProcessRecord) =>
      waitProcessWith(http, process.id, {
        deadline: args.deadline,
        onStatus: args.note ? (p) => args.note!("environment: " + p.status) : undefined,
      });
    const result: Record<string, string> = {};
    for (const [key, content] of Object.entries(args.desired)) {
      const digest = createHash("sha256").update(content).digest("hex");
      const row = rows.get(key.toLowerCase());
      const sensitive = sensitiveKeys.has(key.toLowerCase());
      if (!row) {
        yield* wait(yield* ops.serviceCreate(args.serviceId, { key, content, sensitive }));
      } else if (
        envDigest(row.content, previous.get(key.toLowerCase())) !== digest ||
        row.sensitive !== sensitive
      ) {
        yield* wait(yield* ops.serviceUpdate(row.id, { key, content, sensitive }));
      }
      result[key] = digest;
    }
    for (const key of Object.keys(args.previousDigests)) {
      if (desiredKeys.has(key.toLowerCase())) continue;
      const row = rows.get(key.toLowerCase());
      if (row) yield* wait(yield* ops.serviceDelete(row.id));
    }
    return result;
  }).pipe(withinEnvDeadline(args.serviceId, args.deadline));

/** Observe only owned keys; masked values retain their last successfully sent digest. */
export const observeServiceEnv = (
  http: Http,
  serviceId: string,
  previousDigests: Readonly<Record<string, string>> = {},
) =>
  Effect.gen(function* () {
    const response = yield* http.request<components["schemas"]["ResponseServiceStackEnvList"]>(
      "GET",
      "/service-stack/" + encodeURIComponent(serviceId) + "/env",
    );
    const digests: Record<string, string> = {};
    for (const [key, previous] of Object.entries(previousDigests)) {
      const row = response.items.find((candidate) => candidate.key === key);
      if (row) digests[key] = envDigest(row.content, previous) ?? previous;
    }
    return digests;
  });
