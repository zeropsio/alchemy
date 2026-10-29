import * as Provider from "alchemy/Provider";
import { Unowned } from "alchemy/AdoptPolicy";
import { isResolved } from "alchemy/Diff";
import { ResourceContext } from "alchemy/ResourceContext";
import * as Effect from "effect/Effect";
import * as Clock from "effect/Clock";
import * as Redacted from "effect/Redacted";
import { Service, type ServiceProps, type ServiceAttributes } from "./Service.ts";
import { ZeropsClient, type Http } from "./client/Http.ts";
import { isNotFound, ZeropsValidation } from "./client/Errors.ts";
import { timeoutMs } from "./Config.ts";
import {
  serviceStackOperations,
  type ServiceStackRecord,
} from "./client/operations/ServiceStack.ts";
import { routingOperations } from "./client/operations/Routing.ts";
import { waitProcessWith } from "./client/Process.ts";
import { autoscalingDto } from "./internal/Autoscaling.ts";
import { canonicalServiceType, generatedHostname, validateHostname } from "./internal/Names.ts";
import {
  createService,
  deleteService,
  readService,
  convergeServiceState,
  settleService,
  serviceStateMatches,
} from "./internal/ServiceLifecycle.ts";
import { convergeServiceEnv, observeServiceEnv } from "./internal/ServiceEnv.ts";
import { inspectDeployment, deployService, deploymentIsCurrent } from "./internal/Deploy.ts";

const projectId = (project: ServiceProps["project"]): string =>
  typeof project === "string" ? project : (project.projectId as unknown as string);
export function runtimeType(type: string, mode?: "NON_HA" | "HA"): string {
  const canonical = canonicalServiceType(type);
  if (mode === "HA" && !/:ha@/.test(canonical)) return canonical.replace(/@/, ":ha@");
  if (mode === "NON_HA" && /:ha@/.test(canonical))
    throw new Error("Service type :ha conflicts with mode NON_HA");
  return canonical;
}
export const serviceNeedsReplace = (olds: ServiceProps, news: ServiceProps) =>
  projectId(olds.project) !== projectId(news.project) ||
  olds.hostname !== news.hostname ||
  runtimeType(olds.type, olds.mode) !== runtimeType(news.type, news.mode) ||
  olds.envIsolation !== news.envIsolation ||
  olds.sshIsolation !== news.sshIsolation ||
  (olds.startWithoutCode ?? false) !== (news.startWithoutCode ?? false);
export const serviceDiff = (
  olds: ServiceProps,
  news: ServiceProps,
  output?: ServiceAttributes,
  hostname = news.hostname ?? output?.hostname ?? "",
) =>
  Effect.gen(function* () {
    if (!isResolved(news)) return undefined;
    // With no recovered resource, Plan.ts resumes creation rather than replacing
    // the interrupted attempt's potentially incomplete identity.
    if (!output) return undefined;
    if (serviceNeedsReplace(olds, news))
      return {
        action: "replace" as const,
        deleteFirst:
          news.hostname !== undefined &&
          news.hostname === (output?.hostname ?? olds.hostname) &&
          projectId(news.project) === projectId(olds.project),
      };
    const candidate = yield* inspectDeployment(news, hostname);
    if (candidate && !deploymentIsCurrent(candidate, output)) return { action: "update" as const };
    return undefined;
  });
export const serviceAttributes = (
  service: ServiceStackRecord,
  previous?: Partial<ServiceAttributes>,
): ServiceAttributes => ({
  serviceId: service.id,
  projectId: service.projectId,
  hostname: service.name,
  type: canonicalServiceType(service.base),
  mode: /:ha@/.test(service.base) ? "HA" : "NON_HA",
  status: service.status,
  autoscaling: service.customAutoscaling ?? null,
  appVersionId: previous?.appVersionId,
  activeAppVersionId: service.activeAppVersion?.id,
  sourceHash: previous?.sourceHash,
  gitCommit: previous?.gitCommit,
  subdomainUrls: previous?.subdomainUrls,
  envDigests: previous?.envDigests ?? {},
});

export const existingService = (http: Http, id: string) =>
  serviceStackOperations(http)
    .get(id)
    .pipe(
      Effect.catch((error) =>
        isNotFound(error, "serviceStackNotFound") ? Effect.succeed(undefined) : Effect.fail(error),
      ),
    );

export const ensureServiceType = (
  service: Pick<ServiceStackRecord, "base">,
  props: ServiceProps,
) =>
  canonicalServiceType(service.base) === runtimeType(props.type, props.mode)
    ? Effect.void
    : Effect.fail(
        new ZeropsValidation({
          status: 400,
          code: "serviceTypeMismatch",
          operation: "adoptService",
          message: "Existing service has a different canonical type; refusing adoption",
        }),
      );
const validate = (props: ServiceProps) =>
  Effect.try({
    try: () => {
      if (props.hostname !== undefined) validateHostname(props.hostname);
      runtimeType(props.type, props.mode);
      return props.autoscaling ? autoscalingDto(props.autoscaling) : undefined;
    },
    catch: (cause) =>
      new ZeropsValidation({
        status: 400,
        code: "invalidService",
        operation: "service",
        message: cause instanceof Error ? cause.message : "Invalid service configuration",
      }),
  });
export const ServiceProvider = () =>
  Provider.effect(
    Service,
    Effect.gen(function* () {
      const http = yield* ZeropsClient;
      const ops = serviceStackOperations(http);
      const hostname = (props: ServiceProps) =>
        Effect.gen(function* () {
          const identity = yield* ResourceContext;
          return props.hostname ?? generatedHostname(identity.logicalId, identity.instanceId);
        });
      const urls = (service: ServiceStackRecord) =>
        Effect.gen(function* () {
          if (!service.subdomainAccess) return [];
          return [
            ...new Set(
              (yield* routingOperations(http).httpList(service.projectId))
                .filter(
                  (route) =>
                    !route.isEditable &&
                    !route.deleteOnSync &&
                    route.locations.some((location) => location.serviceStackId === service.id),
                )
                .flatMap((route) => route.domains.map((domain) => "https://" + domain.domainName)),
            ),
          ].sort();
        });
      return {
        stables: ["serviceId", "projectId", "hostname"],
        read: ({ output, olds }) =>
          Effect.gen(function* () {
            const parent =
              output?.projectId ??
              (typeof olds?.project === "string" ? olds.project : olds?.project?.projectId);
            if (!output && (!isResolved(olds) || typeof parent !== "string" || !parent))
              return undefined;
            if (!output && typeof olds.type !== "string") return undefined;
            if (!output) yield* validate(olds);
            const identity = yield* ResourceContext;
            const name = output?.hostname ?? (yield* hostname(olds));
            const observed = yield* readService(http, {
              id: output?.serviceId,
              projectId: parent as string,
              hostname: name,
              owned:
                output !== undefined ||
                name === generatedHostname(identity.logicalId, identity.instanceId),
            });
            if (!observed) return undefined;
            if (Unowned.is(observed)) {
              yield* ensureServiceType(observed, olds);
              return Unowned(serviceAttributes(observed));
            }
            return serviceAttributes(observed, {
              ...output,
              envDigests: yield* observeServiceEnv(http, observed.id, output?.envDigests),
              subdomainUrls: yield* urls(observed),
            });
          }),
        diff: ({ olds, news, output }) =>
          Effect.gen(function* () {
            if (!isResolved(news)) return undefined;
            yield* validate(news);
            const planned = yield* serviceDiff(olds, news, output, yield* hostname(news));
            if (planned?.action === "replace") return planned;
            if (output) {
              const remote = yield* existingService(http, output.serviceId);
              if (
                !remote ||
                (news.source !== undefined &&
                  remote.activeAppVersion?.id !== output.activeAppVersionId) ||
                (news.state !== undefined &&
                  !serviceStateMatches(remote.status, news.state, !remote.activeAppVersion))
              )
                return { action: "update" as const };
            }
            return planned;
          }),
        reconcile: ({ news, output, session }) =>
          Effect.gen(function* () {
            const scaling = yield* validate(news);
            const identity = yield* ResourceContext;
            const options = {
              deadline:
                (yield* Clock.currentTimeMillis) +
                timeoutMs(news.source ? "deploy" : output ? "update" : "create", news.timeouts),
              onStatus: (process: { actionName?: string; status: string; id: string }) =>
                session.note((process.actionName ?? "process") + ": " + process.status),
            };
            let service = output ? yield* existingService(http, output.serviceId) : undefined;
            const previous = service ? output : undefined;
            if (!service)
              service = yield* createService(
                http,
                projectId(news.project),
                {
                  name: yield* hostname(news),
                  serviceStackVersionName: runtimeType(news.type, news.mode),
                  startWithoutCode: news.startWithoutCode ?? false,
                  customAutoscaling: scaling,
                  envIsolation: news.envIsolation,
                  sshIsolation: news.sshIsolation,
                  userData: [],
                },
                options,
                true,
              );
            else {
              service = yield* settleService(
                http,
                service.id,
                ["ACTIVE", "STOPPED", "READY_TO_DEPLOY"],
                options,
              );
              if (scaling) {
                const response = yield* ops.autoscaling(service.id, { customAutoscaling: scaling });
                if (response.process) yield* waitProcessWith(http, response.process.id, options);
              }
            }
            const desired: Record<string, string> = {};
            const sensitive: string[] = [];
            for (const [key, value] of Object.entries(news.env ?? {})) {
              if (Redacted.isRedacted(value)) {
                desired[key] = Redacted.value(value);
                sensitive.push(key);
              } else desired[key] = value as string;
            }
            const envDigests = yield* convergeServiceEnv(http, {
              serviceId: service.id,
              owner: identity.fqn,
              desired,
              sensitive,
              previousDigests: previous?.envDigests ?? {},
              deadline: options.deadline,
              note: (message) => session.note(message),
            });
            const deployed = yield* deployService(http, {
              serviceId: service.id,
              projectId: service.projectId,
              hostname: service.name,
              props: news,
              previous: previous
                ? {
                    ...previous,
                    activeAppVersionId: service.activeAppVersion?.id,
                  }
                : undefined,
              secrets: Object.values(desired),
              options,
            });
            service = yield* ops.get(service.id);
            if (news.subdomain !== undefined && news.subdomain !== service.subdomainAccess) {
              const process = yield* ops.subdomain(service.id, news.subdomain);
              yield* waitProcessWith(http, process.id, options);
              service = yield* settleService(
                http,
                service.id,
                ["ACTIVE", "STOPPED", "READY_TO_DEPLOY"],
                options,
              );
              if (service.subdomainAccess !== news.subdomain)
                return yield* Effect.fail(
                  new ZeropsValidation({
                    status: 400,
                    code: "subdomainNotConverged",
                    operation: "service",
                    message:
                      "Generated subdomain access did not converge; deploy an HTTP port first",
                  }),
                );
            }
            const subdomainUrls = yield* urls(service);
            if (news.state)
              service = yield* convergeServiceState(
                http,
                service.id,
                news.state,
                options,
                !service.activeAppVersion,
              );
            return serviceAttributes(service, { ...deployed, envDigests, subdomainUrls });
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
