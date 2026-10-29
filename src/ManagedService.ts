import { Resource } from "alchemy";
import * as Provider from "alchemy/Provider";
import { Unowned } from "alchemy/AdoptPolicy";
import { isResolved } from "alchemy/Diff";
import { ResourceContext } from "alchemy/ResourceContext";
import * as Effect from "effect/Effect";
import * as Clock from "effect/Clock";
import * as Redacted from "effect/Redacted";
import type { Project } from "./Project.ts";
import type { Providers } from "./Providers.ts";
import type { ZeropsRef } from "./ref.ts";
import { serviceTypesWithModes, type KnownServiceType } from "./client/serviceTypes.gen.ts";
import { ZeropsClient, type Http } from "./client/Http.ts";
import { isNotFound, ZeropsValidation } from "./client/Errors.ts";
import { ZeropsConfig, timeoutMs, type TimeoutOptions } from "./Config.ts";
import {
  serviceStackOperations,
  type ServiceStackRecord,
} from "./client/operations/ServiceStack.ts";
import { waitProcessWith } from "./client/Process.ts";
import { autoscalingDto, type Autoscaling } from "./internal/Autoscaling.ts";
import { canonicalServiceType, generatedHostname, validateHostname } from "./internal/Names.ts";
import {
  createService,
  deleteService,
  readService,
  convergeServiceState,
} from "./internal/ServiceLifecycle.ts";
import { convergeServiceEnv, observeServiceEnv } from "./internal/ServiceEnv.ts";

export interface ManagedServiceProps {
  /** Parent project or an existing project ID. */
  project: Project | string;
  /** Private hostname; omitted names are generated per physical instance. */
  hostname?: string;
  /** Settings catalogue identifier; custom identifiers remain supported. */
  type: KnownServiceType | (string & {});
  /** Availability mode, default NON_HA. */
  mode?: "NON_HA" | "HA";
  /** Environment visibility policy, fixed at creation. */
  envIsolation?: string;
  /** SSH visibility policy, fixed at creation. */
  sshIsolation?: string;
  /** Resource bounds; PostgreSQL always sends an explicit disk minimum. */
  autoscaling?: Autoscaling;
  /** Desired service status, default running. */
  state?: "running" | "stopped";
  /** Environment keys exclusively owned by this resource. */
  env?: Record<string, string | Redacted.Redacted<string> | ZeropsRef>;
  /** Lifecycle operation deadlines. */
  timeouts?: TimeoutOptions;
}
export interface ManagedServiceAttributes {
  serviceId: string;
  projectId: string;
  hostname: string;
  type: string;
  mode: "NON_HA" | "HA";
  status: string;
  autoscaling: NonNullable<ServiceStackRecord["customAutoscaling"]> | null;
  envDigests: Record<string, string>;
}
export type ManagedService = Resource<
  "Zerops.ManagedService",
  ManagedServiceProps,
  ManagedServiceAttributes,
  never,
  Providers
>;
export const ManagedService = Resource<ManagedService>("Zerops.ManagedService");
export const managedProjectId = (project: ManagedServiceProps["project"]): string =>
  typeof project === "string" ? project : (project.projectId as unknown as string);

export function managedType(type: string, mode?: "NON_HA" | "HA"): string {
  const normalized = type.toLowerCase().replace(/^ubuntu\//, "");
  const qualified = /:(single|ha)@/.exec(normalized)?.[1];
  if (qualified && mode && (qualified === "ha") !== (mode === "HA")) {
    throw new Error("Managed service type qualifier conflicts with mode " + mode);
  }
  if (qualified) return normalized;
  if (serviceTypesWithModes.has(normalized.split("@")[0])) {
    return normalized.replace("@", mode === "HA" ? ":ha@" : ":single@");
  }
  return normalized;
}
export const managedNeedsReplace = (olds: ManagedServiceProps, news: ManagedServiceProps) =>
  managedProjectId(olds.project) !== managedProjectId(news.project) ||
  olds.hostname !== news.hostname ||
  managedType(olds.type, olds.mode) !== managedType(news.type, news.mode) ||
  olds.envIsolation !== news.envIsolation ||
  olds.sshIsolation !== news.sshIsolation;

export const assertManagedIdentity = (service: ServiceStackRecord, props: ManagedServiceProps) =>
  canonicalServiceType(service.base) === canonicalServiceType(managedType(props.type, props.mode))
    ? Effect.void
    : Effect.fail(
        new ZeropsValidation({
          status: 400,
          code: "incompatibleManagedServiceAdoption",
          operation: "adoptManagedService",
          message:
            "Existing service " +
            service.name +
            " has type " +
            service.base +
            ", incompatible with requested " +
            managedType(props.type, props.mode) +
            "; choose a different hostname or explicitly replace the existing service",
        }),
      );

export const getManagedService = (http: Http, id: string) =>
  serviceStackOperations(http)
    .get(id)
    .pipe(
      Effect.catch((error) =>
        isNotFound(error, "serviceStackNotFound") ? Effect.succeed(undefined) : Effect.fail(error),
      ),
    );

/** Normalize PostgreSQL disk bounds before either planning or mutation. */
export function managedAutoscaling(
  props: ManagedServiceProps,
  configuredFloor: number,
): Autoscaling {
  if (!/^postgresql(?::(?:single|ha))?@/.test(canonicalServiceType(props.type))) {
    return props.autoscaling ?? {};
  }
  const minimum = Math.max(2, configuredFloor);
  const disk = props.autoscaling?.vertical?.minDisk;
  if (disk !== undefined && disk < minimum) {
    throw new Error(
      "PostgreSQL autoscaling.vertical.minDisk must be at least " +
        minimum +
        " GB (ZEROPS_POSTGRESQL_MIN_DISK_GB; minimum safe disk is 2 GB)",
    );
  }
  return {
    ...props.autoscaling,
    vertical: { ...props.autoscaling?.vertical, minDisk: disk ?? minimum },
  };
}
/** Only explicitly configured bounds are owned; API defaults are not desired fields. */
export function managedScalingMatches(desired: unknown, observed: unknown): boolean {
  if (desired === undefined) return true;
  if (desired !== null && typeof desired === "object") {
    return Object.entries(desired).every(([key, value]) =>
      managedScalingMatches(value, (observed as Record<string, unknown> | null)?.[key]),
    );
  }
  return desired === observed;
}
const attributes = (
  service: ServiceStackRecord,
  envDigests: Record<string, string> = {},
): ManagedServiceAttributes => ({
  serviceId: service.id,
  projectId: service.projectId,
  hostname: service.name,
  type: canonicalServiceType(service.base),
  mode: /:ha@/.test(service.base) ? "HA" : "NON_HA",
  status: service.status,
  autoscaling: service.customAutoscaling ?? null,
  envDigests,
});

export const observeManagedService = (
  http: Http,
  service: ServiceStackRecord,
  previousDigests: Record<string, string> = {},
) =>
  Effect.gen(function* () {
    const digests = yield* observeServiceEnv(http, service.id, previousDigests);
    return attributes(service, digests);
  });
const validate = (props: ManagedServiceProps, floor: number) =>
  Effect.try({
    try: () => {
      if (props.hostname !== undefined) validateHostname(props.hostname);
      managedType(props.type, props.mode);
      return autoscalingDto(managedAutoscaling(props, floor));
    },
    catch: (cause) =>
      new ZeropsValidation({
        status: 400,
        code: "invalidManagedService",
        operation: "managedService",
        message: cause instanceof Error ? cause.message : "Invalid managed service configuration",
      }),
  });
export const ManagedServiceProvider = () =>
  Provider.effect(
    ManagedService,
    Effect.gen(function* () {
      const http = yield* ZeropsClient;
      const config = yield* ZeropsConfig;
      const ops = serviceStackOperations(http);
      const hostname = (props: ManagedServiceProps) =>
        Effect.gen(function* () {
          const identity = yield* ResourceContext;
          return props.hostname !== undefined
            ? validateHostname(props.hostname)
            : generatedHostname(identity.logicalId, identity.instanceId);
        });
      return {
        stables: ["serviceId", "projectId", "hostname"],
        read: ({ output, olds }) =>
          Effect.gen(function* () {
            const project = olds.project;
            const projectId =
              output?.projectId ?? (typeof project === "string" ? project : project?.projectId);
            if (typeof projectId !== "string" || projectId.length === 0) return undefined;
            if (!output && (typeof olds.type !== "string" || !isResolved(olds))) return undefined;
            const observed = yield* readService(http, {
              id: output?.serviceId,
              projectId,
              hostname: output?.hostname ?? (yield* hostname(olds)),
              owned: output !== undefined || olds.hostname === undefined,
            });
            if (observed === undefined) return undefined;
            if (output === undefined) yield* assertManagedIdentity(observed, olds);
            const attrs = yield* observeManagedService(http, observed, output?.envDigests);
            return Unowned.is(observed) ? Unowned(attrs) : attrs;
          }),
        diff: ({ olds, news, output }) =>
          Effect.gen(function* () {
            if (!isResolved(news)) return undefined;
            const scaling = yield* validate(news, config.postgresqlMinDiskGb);
            // No recovered resource means Plan.ts resumes creation; checkpoint
            // props may not contain a complete immutable identity yet.
            if (!output) return undefined;
            if (managedNeedsReplace(olds, news))
              return {
                action: "replace" as const,
                deleteFirst:
                  news.hostname !== undefined &&
                  news.hostname === (output?.hostname ?? olds.hostname) &&
                  managedProjectId(news.project) === managedProjectId(olds.project),
              };
            if (output) {
              const remote = yield* getManagedService(http, output.serviceId);
              if (
                !remote ||
                remote.status !==
                  ((news.state ?? "running") === "running" ? "ACTIVE" : "STOPPED") ||
                !managedScalingMatches(scaling, remote.customAutoscaling)
              )
                return { action: "update" as const };
            }
            return undefined;
          }),
        reconcile: ({ news, output, session }) =>
          Effect.gen(function* () {
            const scaling = yield* validate(news, config.postgresqlMinDiskGb);
            const identity = yield* ResourceContext;
            const options = {
              deadline:
                (yield* Clock.currentTimeMillis) +
                timeoutMs(output ? "update" : "create", news.timeouts),
              onStatus: (process: { actionName?: string; status: string; id: string }) =>
                session.note((process.actionName ?? "process") + ": " + process.status),
            };
            let service = output ? yield* getManagedService(http, output.serviceId) : undefined;
            if (service) yield* assertManagedIdentity(service, news);
            if (!service) {
              service = yield* createService(
                http,
                managedProjectId(news.project),
                {
                  name: yield* hostname(news),
                  serviceStackVersionName: managedType(news.type, news.mode),
                  customAutoscaling: scaling,
                  envIsolation: news.envIsolation,
                  sshIsolation: news.sshIsolation,
                  userData: [],
                },
                options,
              );
            } else {
              const response = yield* ops.autoscaling(service.id, { customAutoscaling: scaling });
              if (response.process) yield* waitProcessWith(http, response.process.id, options);
            }
            const desired: Record<string, string> = {};
            const sensitive: string[] = [];
            for (const [key, value] of Object.entries(news.env ?? {})) {
              if (Redacted.isRedacted(value)) {
                desired[key] = Redacted.value(value);
                sensitive.push(key);
              } else {
                desired[key] = value as string;
              }
            }
            const envDigests = yield* convergeServiceEnv(http, {
              serviceId: service.id,
              owner: identity.fqn,
              desired,
              sensitive,
              previousDigests: output?.envDigests ?? {},
              deadline: options.deadline,
              note: (message) => session.note(message),
            });
            service = yield* convergeServiceState(
              http,
              service.id,
              news.state ?? "running",
              options,
            );
            return yield* observeManagedService(http, service, envDigests);
          }),
        delete: ({ output, olds, session }) =>
          output
            ? Effect.gen(function* () {
                yield* deleteService(http, output.serviceId, {
                  deadline: (yield* Clock.currentTimeMillis) + timeoutMs("delete", olds.timeouts),
                  onStatus: (process) => session.note("delete: " + process.status),
                });
              })
            : Effect.void,
      };
    }),
  );
