import { Resource } from "alchemy";
import * as Provider from "alchemy/Provider";
import { Unowned } from "alchemy/AdoptPolicy";
import { isResolved } from "alchemy/Diff";
import * as Effect from "effect/Effect";
import * as Clock from "effect/Clock";
import type { Service } from "./Service.ts";
import type { ManagedService } from "./ManagedService.ts";
import type { Providers } from "./Providers.ts";
import { ZeropsClient } from "./client/Http.ts";
import { ZeropsConfig, timeoutMs, type TimeoutOptions } from "./Config.ts";
import { isNotFound, ZeropsValidation } from "./client/Errors.ts";
import { projectOperations } from "./client/operations/Project.ts";
import { serviceStackOperations } from "./client/operations/ServiceStack.ts";
import {
  routingOperations,
  type PortRouteRecord,
  type PortRouteBody,
} from "./client/operations/Routing.ts";
import { routingNeedsUpdate, syncRouting } from "./internal/RoutingSync.ts";

export interface PortRouteProps {
  /** Target service; changing it replaces the route. */
  service: Service | ManagedService | string;
  /** Declared internal service port. */
  port: number;
  /** Public port; defaults to the internal port. */
  publicPort?: number;
  /** Declared service transport protocol. */
  protocol: "TCP" | "UDP";
  /** IPv4 is intentionally unsupported. */
  ipType: "IP_V6";
  /** Declarative firewall; ranges must be IPv6 CIDRs. */
  firewall?: { policy?: "BLACKLIST" | "WHITELIST"; ipRanges?: string[] };
  /** Adoption-only selector, not part of replacement identity. */
  existingRouteId?: string;
  /** Explicitly commit foreign staged changes in this project. */
  forceSync?: boolean;
  /** Lifecycle deadlines. */
  timeouts?: TimeoutOptions;
}
export interface PortRouteAttributes {
  routeId: string;
  serviceId: string;
  projectId: string;
  publicAddress: string;
  configuration: PortRouteBody;
  synced: boolean;
  deleteOnSync?: boolean;
}
export type PortRoute = Resource<
  "Zerops.PortRoute",
  PortRouteProps,
  PortRouteAttributes,
  never,
  Providers
>;
export const PortRoute = Resource<PortRoute>("Zerops.PortRoute");
export const validatePortRoute = (props: PortRouteProps) =>
  props.ipType !== "IP_V6"
    ? Effect.fail(
        new ZeropsValidation({
          status: 400,
          code: "ipv4Unsupported",
          operation: "portRoute",
          message: "PortRoute supports only ipType IP_V6",
        }),
      )
    : Effect.void;
/** Canonical observable rule fields; service/project identity remains in attributes. */
export const portRouteConfiguration = (body: PortRouteBody): PortRouteBody => ({
  internalPort: body.internalPort,
  publicPort: body.publicPort,
  internalProtocol: body.internalProtocol,
  publicIpType: body.publicIpType,
  firewallPolicy: body.firewallPolicy,
  firewallIpRanges: [...new Set(body.firewallIpRanges)].sort(),
  firewallAllowMyIp: body.firewallAllowMyIp,
});
const desiredPortRoute = (props: PortRouteProps): PortRouteBody =>
  portRouteConfiguration({
    internalPort: props.port,
    publicPort: props.publicPort ?? props.port,
    internalProtocol: props.protocol.toLowerCase() as "tcp" | "udp",
    publicIpType: props.ipType,
    firewallPolicy: props.firewall?.policy ?? "BLACKLIST",
    firewallIpRanges: props.firewall?.ipRanges ?? [],
    firewallAllowMyIp: false,
  });
export const portRouteMatches = (row: PortRouteRecord, desired: PortRouteBody) =>
  JSON.stringify(portRouteConfiguration(row)) === JSON.stringify(portRouteConfiguration(desired));
const attributes = (row: PortRouteRecord, ipv6: string): PortRouteAttributes => ({
  routeId: row.id,
  serviceId: row.serviceStackId,
  projectId: row.projectId,
  publicAddress: "[" + ipv6 + "]:" + row.publicPort,
  configuration: portRouteConfiguration(row),
  synced: row.isSynced,
  deleteOnSync: row.deleteOnSync,
});
export const PortRouteProvider = () =>
  Provider.effect(
    PortRoute,
    Effect.gen(function* () {
      const http = yield* ZeropsClient;
      const config = yield* ZeropsConfig;
      const ops = routingOperations(http);
      const get = (id: string) =>
        ops
          .portGet(id)
          .pipe(
            Effect.catch((error) =>
              isNotFound(
                error,
                "publicPortRoutingNotFound",
                "serviceStackNotFound",
                "projectNotFound",
              )
                ? Effect.succeed(undefined)
                : Effect.fail(error),
            ),
          );
      const observed = (row: PortRouteRecord) =>
        Effect.gen(function* () {
          const project = yield* projectOperations(http).get(row.projectId);
          if (!project.publicIpV6)
            return yield* Effect.fail(
              new ZeropsValidation({
                status: 400,
                code: "projectIpv6Missing",
                operation: "readPortRoute",
                message: "The route's project has no IPv6 address",
              }),
            );
          return attributes(row, project.publicIpV6);
        });
      return {
        stables: ["routeId", "serviceId", "projectId"],
        read: ({ output, olds }) =>
          Effect.gen(function* () {
            if (output) {
              const row = yield* get(output.routeId);
              return row ? yield* observed(row) : undefined;
            }
            // Interrupted-create checkpoints can contain stripped dependency outputs.
            if (
              !olds?.service ||
              !isResolved(olds) ||
              olds.ipType === undefined ||
              olds.port === undefined ||
              olds.protocol === undefined
            )
              return undefined;
            const serviceId = (typeof olds.service === "string"
              ? olds.service
              : olds.service.serviceId) as unknown as string;
            if (typeof serviceId !== "string" || !serviceId) return undefined;
            yield* validatePortRoute(olds);
            if (olds.existingRouteId) {
              const row = yield* get(olds.existingRouteId);
              if (!row) return undefined;
              if (row.serviceStackId !== serviceId || row.publicIpType !== "IP_V6")
                return yield* Effect.fail(
                  new ZeropsValidation({
                    status: 400,
                    code: "portRouteAdoptionMismatch",
                    operation: "readPortRoute",
                    message: "existingRouteId must identify an IPv6 rule on the declared service",
                  }),
                );
              return Unowned(yield* observed(row));
            }
            const rows = yield* ops.portList(serviceId);
            const matches = rows.filter(
              (row) =>
                row.publicIpType === "IP_V6" &&
                row.internalPort === olds.port &&
                row.internalProtocol === olds.protocol.toLowerCase() &&
                row.publicPort === (olds.publicPort ?? olds.port),
            );
            if (matches.length)
              return yield* Effect.fail(
                new ZeropsValidation({
                  status: 400,
                  code: "foreignPortRouteConflict",
                  operation: "readPortRoute",
                  message:
                    "Matching foreign port rules require existingRouteId and adoption: " +
                    matches.map((row) => row.id).join(", "),
                }),
              );
            return undefined;
          }),
        diff: ({ news, output }) =>
          Effect.gen(function* () {
            if (!isResolved(news)) return undefined;
            yield* validatePortRoute(news);
            if (!output) return undefined;
            const service = (typeof news.service === "string"
              ? news.service
              : news.service.serviceId) as unknown as string;
            if (output.serviceId !== service)
              return { action: "replace" as const, deleteFirst: true };
            // beta.84 calls read for adoption/recovery, not ordinary persisted-resource refresh.
            const current = yield* get(output.routeId);
            return !current ||
              routingNeedsUpdate({
                synced: current.isSynced,
                deleteOnSync: current.deleteOnSync,
              }) ||
              !portRouteMatches(current, desiredPortRoute(news))
              ? { action: "update" as const }
              : undefined;
          }),
        reconcile: ({ news, output, session }) =>
          Effect.gen(function* () {
            yield* validatePortRoute(news);
            const serviceId = (typeof news.service === "string"
              ? news.service
              : news.service.serviceId) as unknown as string;
            const service = yield* serviceStackOperations(http).get(serviceId);
            const project = yield* projectOperations(http).get(service.projectId);
            if (!project.publicIpV6)
              return yield* Effect.fail(
                new ZeropsValidation({
                  status: 400,
                  code: "projectIpv6Missing",
                  operation: "portRoute",
                  message: "PortRoute requires a project IPv6 address; IPv4 is not acquired",
                }),
              );
            const body = desiredPortRoute(news);
            let final: PortRouteRecord | undefined;
            yield* syncRouting(http, {
              projectId: service.projectId,
              organizationId: project.clientId,
              kind: "port",
              ownedId: output?.routeId,
              force: news.forceSync === true || config.routingForceSync,
              options: {
                deadline:
                  (yield* Clock.currentTimeMillis) +
                  timeoutMs(output ? "update" : "create", news.timeouts),
                onStatus: (p) => session.note(p.status + " (" + p.id + ")"),
              },
              note: (message) => session.note(message),
              stage: Effect.gen(function* () {
                if (!output) return yield* ops.portCreate(serviceId, body);
                const current = yield* get(output.routeId);
                if (!current) return yield* ops.portCreate(serviceId, body);
                if (current.deleteOnSync) yield* ops.restore("port", current.id);
                return yield* ops.portUpdate(current.id, body);
              }),
              verify: (staged) =>
                Effect.gen(function* () {
                  final = yield* get(staged.id);
                  return (
                    !!final &&
                    final.isSynced &&
                    !final.deleteOnSync &&
                    final.serviceStackId === serviceId &&
                    portRouteMatches(final, body)
                  );
                }),
            });
            return attributes(final!, project.publicIpV6);
          }),
        delete: ({ output, olds, session }) =>
          Effect.gen(function* () {
            if (!(yield* get(output.routeId))) return;
            const project = yield* projectOperations(http).get(output.projectId);
            yield* syncRouting(http, {
              projectId: output.projectId,
              organizationId: project.clientId,
              kind: "port",
              ownedId: output.routeId,
              force: olds.forceSync === true || config.routingForceSync,
              options: {
                deadline: (yield* Clock.currentTimeMillis) + timeoutMs("delete", olds.timeouts),
                onStatus: (p) => session.note(p.status + " (" + p.id + ")"),
              },
              note: (message) => session.note(message),
              stage: ops.delete("port", output.routeId),
              verify: () => Effect.map(get(output.routeId), (row) => row === undefined),
            });
          }),
      };
    }),
  );
