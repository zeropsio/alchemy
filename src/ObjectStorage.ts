import { Resource } from "alchemy";
import * as Provider from "alchemy/Provider";
import { Unowned } from "alchemy/AdoptPolicy";
import { isResolved } from "alchemy/Diff";
import { ResourceContext } from "alchemy/ResourceContext";
import * as Effect from "effect/Effect";
import * as Clock from "effect/Clock";
import type { Project } from "./Project.ts";
import type { Providers } from "./Providers.ts";
import { timeoutMs, type TimeoutOptions } from "./Config.ts";
import { ZeropsClient } from "./client/Http.ts";
import { ZeropsValidation } from "./client/Errors.ts";
import { waitProcessWith } from "./client/Process.ts";
import { storageOperations } from "./client/operations/Storage.ts";
import {
  serviceStackOperations,
  type ServiceStackRecord,
} from "./client/operations/ServiceStack.ts";
import { generatedHostname, validateHostname } from "./internal/Names.ts";
import { readService, settleService, deleteService } from "./internal/ServiceLifecycle.ts";

export type StoragePolicy =
  | "private"
  | "public-read"
  | "public-objects-read"
  | "public-write"
  | "public-read-write"
  | "custom";
export type StoragePolicyProps =
  | { policy?: Exclude<StoragePolicy, "custom">; rawPolicy?: never }
  | { policy?: "custom"; rawPolicy: string };
export type ObjectStorageProps = StoragePolicyProps & {
  /** Project resource or existing project ID. */
  project: Project | string;
  /** Immutable hostname; generated when omitted. */
  hostname?: string;
  /** Allocated bucket quota in GB (at least one). */
  quotaGb: number;
  /** Lifecycle operation deadlines. */
  timeouts?: TimeoutOptions;
};
export interface ObjectStorageAttributes {
  serviceId: string;
  projectId: string;
  hostname: string;
  bucketName: string;
  apiUrl: string;
  accessKeyId: string;
  quotaGb: number;
  policy: StoragePolicy;
  rawPolicy?: string;
}
export type ObjectStorage = Resource<
  "Zerops.ObjectStorage",
  ObjectStorageProps,
  ObjectStorageAttributes,
  never,
  Providers
>;
export const ObjectStorage = Resource<ObjectStorage>("Zerops.ObjectStorage");

const invalid = (message: string) =>
  new ZeropsValidation({
    status: 400,
    code: "objectStorageInvalid",
    operation: "objectStorage",
    message,
  });
/** Canonical JSON preserves every field and array order. */
export function canonicalStoragePolicy(raw: string): string {
  const sort = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(sort);
    if (value !== null && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value)
          .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
          .map(([key, item]) => [key, sort(item)]),
      );
    }
    return value;
  };
  try {
    return JSON.stringify(sort(JSON.parse(raw)));
  } catch {
    throw invalid("rawPolicy must be valid JSON");
  }
}
export function storagePolicy(props: { policy?: string; rawPolicy?: string }): {
  policy: StoragePolicy;
  rawPolicy?: string;
} {
  const policy = props.policy ?? (props.rawPolicy === undefined ? "private" : "custom");
  if (
    ![
      "private",
      "public-read",
      "public-objects-read",
      "public-write",
      "public-read-write",
      "custom",
    ].includes(policy)
  )
    throw invalid("Invalid storage policy");
  if ((policy === "custom") !== (props.rawPolicy !== undefined)) {
    throw invalid("custom policy requires rawPolicy; other policies forbid rawPolicy");
  }
  return {
    policy: policy as StoragePolicy,
    ...(props.rawPolicy === undefined
      ? {}
      : {
          rawPolicy: canonicalStoragePolicy(props.rawPolicy),
        }),
  };
}
export function observedStoragePolicy(raw: string): {
  policy: StoragePolicy;
  rawPolicy?: string;
} {
  const canonical = canonicalStoragePolicy(raw);
  const p = JSON.parse(canonical);
  if (p !== null && !Array.isArray(p) && typeof p === "object") {
    const keys = Object.keys(p);
    const aws =
      keys.length === 2 &&
      p.Version === "2012-10-17" &&
      Array.isArray(p.Statement) &&
      p.Statement.length === 0;
    const native =
      p.websiteAccess === false &&
      p.indexDocument == null &&
      p.errorDocument == null &&
      keys.every((key) => ["websiteAccess", "indexDocument", "errorDocument"].includes(key));
    if (aws || native) return { policy: "private" };
  }
  return { policy: "custom", rawPolicy: canonical };
}
/** Map only explicitly public SYSTEM keys; never copy generated secret rows. */
export function storageAttributes(
  service: Pick<ServiceStackRecord, "id" | "projectId" | "name">,
  rows: ReadonlyArray<{ key: string; type: string; content: string }>,
  raw: string,
  previous?: Pick<ObjectStorageAttributes, "policy" | "rawPolicy">,
): ObjectStorageAttributes {
  const required = (key: string) => {
    const value = rows.find((row) => row.type === "SYSTEM" && row.key === key)?.content;
    if (!value || value === "REDACTED") throw invalid("Missing public SYSTEM storage key: " + key);
    return value;
  };
  const quotaGb = Number(required("quotaGBytes"));
  if (!Number.isSafeInteger(quotaGb) || quotaGb < 1) {
    throw invalid("Invalid allocated storage quota");
  }
  const policy =
    previous?.policy === "custom"
      ? { policy: "custom" as const, rawPolicy: canonicalStoragePolicy(raw) }
      : previous
        ? { policy: previous.policy }
        : observedStoragePolicy(raw);
  return {
    serviceId: service.id,
    projectId: service.projectId,
    hostname: service.name,
    bucketName: required("bucketName"),
    apiUrl: required("apiUrl"),
    accessKeyId: required("accessKeyId"),
    quotaGb,
    ...policy,
  };
}
// Lifecycle props are resolved by Alchemy before these IDs reach the client.
const projectId = (props: ObjectStorageProps): string =>
  typeof props.project === "string"
    ? props.project
    : (props.project.projectId as unknown as string);
const hostname = (props: { hostname?: string }) =>
  Effect.gen(function* () {
    const context = yield* ResourceContext;
    return yield* checked(() =>
      props.hostname === undefined
        ? generatedHostname(context.logicalId, context.instanceId)
        : validateHostname(props.hostname),
    );
  });
const checked = <A>(f: () => A) =>
  Effect.try({
    try: f,
    catch: (error) => (error instanceof ZeropsValidation ? error : invalid(String(error))),
  });
export const ObjectStorageProvider = () =>
  Provider.effect(
    ObjectStorage,
    Effect.gen(function* () {
      const http = yield* ZeropsClient;
      const ops = storageOperations(http);
      const stacks = serviceStackOperations(http);
      const attributes = (
        s: ServiceStackRecord,
        previous?: Pick<ObjectStorageAttributes, "policy" | "rawPolicy">,
      ) =>
        Effect.gen(function* () {
          if (s.serviceStackTypeId !== "object_storage") {
            return yield* Effect.fail(invalid("Hostname belongs to a non-object-storage service"));
          }
          const rows = (yield* stacks.env(s.id)).items;
          const size = yield* ops.size(s.id);
          return yield* checked(() => storageAttributes(s, rows, size.rawPolicy, previous));
        });
      return {
        stables: ["serviceId", "projectId", "hostname", "bucketName", "apiUrl", "accessKeyId"],
        read: ({ output, olds }) =>
          Effect.gen(function* () {
            const project =
              output?.projectId ??
              (typeof olds.project === "string" ? olds.project : olds.project?.projectId);
            // Recovery can run before parent Outputs have been resolved.
            if (typeof project !== "string" || !project) return undefined;
            const service = yield* readService(http, {
              id: output?.serviceId,
              projectId: project,
              hostname: output?.hostname ?? (yield* hostname(olds)),
              owned: output !== undefined || olds.hostname === undefined,
            });
            if (!service) return undefined;
            if (!output) {
              yield* Effect.logWarning(
                "ObjectStorage adoption uses observed policy; the original enum cannot be recovered.",
              );
            }
            const attrs = yield* attributes(service, output);
            return Unowned.is(service) ? Unowned(attrs) : attrs;
          }),
        diff: ({ olds, news, output }) =>
          Effect.gen(function* () {
            if (!isResolved(news)) return undefined;
            const desired = yield* checked(() => storagePolicy(news));
            if (projectId(olds) !== projectId(news) || olds.hostname !== news.hostname) {
              return { action: "replace" as const };
            }
            const remote = output
              ? yield* readService(http, {
                  id: output.serviceId,
                  projectId: output.projectId,
                  hostname: output.hostname,
                  owned: true,
                })
              : undefined;
            if (output && !remote) return { action: "update" as const };
            const previous = remote
              ? yield* attributes(remote, output)
              : {
                  quotaGb: olds.quotaGb,
                  ...storagePolicy(olds),
                };
            return {
              action:
                previous.quotaGb === news.quotaGb &&
                previous.policy === desired.policy &&
                previous.rawPolicy === desired.rawPolicy
                  ? ("noop" as const)
                  : ("update" as const),
            };
          }),
        reconcile: ({ news, output, session }) =>
          Effect.gen(function* () {
            const desired = yield* checked(() => {
              if (!Number.isSafeInteger(news.quotaGb) || news.quotaGb < 1) {
                throw invalid("quotaGb must be an integer of at least one GB");
              }
              return storagePolicy(news);
            });
            const options = {
              deadline:
                (yield* Clock.currentTimeMillis) +
                timeoutMs(output ? "update" : "create", news.timeouts),
              onStatus: (p: { actionName?: string; status: string; id: string }) =>
                session.note((p.actionName ?? "process") + ": " + p.status + " (" + p.id + ")"),
            };
            const existing = output
              ? yield* readService(http, {
                  id: output.serviceId,
                  projectId: projectId(news),
                  hostname: yield* hostname(news),
                  owned: true,
                })
              : undefined;
            let id = existing?.id;
            const observed = existing ? yield* attributes(existing, output) : undefined;
            if (!id) {
              const created = yield* ops.create(projectId(news), {
                name: yield* hostname(news),
                diskGBytes: news.quotaGb,
                policy: desired.policy,
                rawPolicy: desired.rawPolicy ?? null,
                cdnEnabled: false,
              });
              id = created.id;
              if (created.process) yield* waitProcessWith(http, created.process.id, options);
            } else if (
              observed &&
              (observed.quotaGb !== news.quotaGb ||
                observed.policy !== desired.policy ||
                observed.rawPolicy !== desired.rawPolicy)
            ) {
              if (observed.policy === "custom" && !news.rawPolicy) {
                yield* session.note(
                  "Adopted policy is observed JSON; original policy enum is not recoverable.",
                );
              }
              const process = yield* ops.update(id, {
                diskGBytes: news.quotaGb,
                policy: desired.policy,
                rawPolicy: desired.rawPolicy ?? null,
              });
              yield* waitProcessWith(http, process.id, options);
            }
            const service = yield* settleService(http, id, ["ACTIVE"], options);
            const actual = yield* attributes(service, desired);
            if (
              actual.quotaGb !== news.quotaGb ||
              (desired.policy === "custom" && actual.rawPolicy !== desired.rawPolicy)
            ) {
              return yield* Effect.fail(
                invalid("Storage quota/policy did not round-trip after write"),
              );
            }
            return actual;
          }),
        delete: ({ output, olds, session }) =>
          Effect.gen(function* () {
            yield* deleteService(http, output.serviceId, {
              deadline: (yield* Clock.currentTimeMillis) + timeoutMs("delete", olds.timeouts),
              onStatus: (p) => session.note((p.actionName ?? "process") + ": " + p.status),
            });
          }),
      };
    }),
  );
