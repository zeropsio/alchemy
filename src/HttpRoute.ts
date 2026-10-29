import { Resource } from "alchemy";
import * as Provider from "alchemy/Provider";
import { Unowned } from "alchemy/AdoptPolicy";
import { isResolved } from "alchemy/Diff";
import * as Effect from "effect/Effect";
import * as Clock from "effect/Clock";
import type { Project } from "./Project.ts";
import type { Service } from "./Service.ts";
import type { ManagedService } from "./ManagedService.ts";
import type { Providers } from "./Providers.ts";
import { ZeropsClient } from "./client/Http.ts";
import { ZeropsConfig, timeoutMs, type TimeoutOptions } from "./Config.ts";
import { isNotFound, ZeropsValidation } from "./client/Errors.ts";
import { projectOperations } from "./client/operations/Project.ts";
import {
  routingOperations,
  type HttpRouteRecord,
  type HttpRouteBody,
} from "./client/operations/Routing.ts";
import { routingNeedsUpdate, syncRouting } from "./internal/RoutingSync.ts";

export interface HttpRouteProps {
  /** Project owning the routing table. */
  project: Project | string;
  /** Exact domain set; case and trailing dots are normalized. */
  domains: string[];
  /** Request SSL; certificate issuance is not awaited. */
  ssl?: boolean;
  /** HTTP backend locations. */
  locations: Array<{ path: string; service: Service | ManagedService | string; port: number }>;
  /** Explicitly commit foreign staged changes in this project. */
  forceSync?: boolean;
  /** Lifecycle deadlines. */
  timeouts?: TimeoutOptions;
}
export interface HttpRouteAttributes {
  routeId: string;
  projectId: string;
  domains: Array<{ name: string }>;
  configuration: HttpRouteBody;
  synced: boolean;
  deleteOnSync?: boolean;
}
export type HttpRoute = Resource<
  "Zerops.HttpRoute",
  HttpRouteProps,
  HttpRouteAttributes,
  never,
  Providers
>;
export const HttpRoute = Resource<HttpRoute>("Zerops.HttpRoute");
export const normalizedDomains = (domains: ReadonlyArray<string>) =>
  [...new Set(domains.map((domain) => domain.trim().toLowerCase().replace(/\.$/, "")))].sort();

/** Stable user-controlled routing configuration, independent of DNS/certificate progress. */
export const normalizeHttpRouteConfig = (body: HttpRouteBody): HttpRouteBody => ({
  domains: normalizedDomains(body.domains),
  sslEnabled: body.sslEnabled,
  cdnEnabled: body.cdnEnabled ?? false,
  locations: body.locations
    .map((location) => ({
      path: location.path,
      port: location.port,
      serviceStackId: location.serviceStackId,
    }))
    .sort(
      (a, b) =>
        a.path.localeCompare(b.path) ||
        a.serviceStackId.localeCompare(b.serviceStackId) ||
        a.port - b.port,
    ),
});
const desiredHttpRoute = (props: HttpRouteProps): HttpRouteBody =>
  normalizeHttpRouteConfig({
    domains: props.domains,
    sslEnabled: props.ssl ?? false,
    cdnEnabled: false,
    locations: props.locations.map((location) => ({
      path: location.path,
      port: location.port,
      serviceStackId: (typeof location.service === "string"
        ? location.service
        : location.service.serviceId) as unknown as string,
    })),
  });
export const httpRouteConfiguration = (row: HttpRouteRecord): HttpRouteBody =>
  normalizeHttpRouteConfig({
    domains: row.domains.map((domain) => domain.domainName),
    sslEnabled: row.sslEnabled,
    cdnEnabled: row.cdnEnabled,
    locations: row.locations,
  });
export const httpRouteMatches = (row: HttpRouteRecord, desired: HttpRouteBody) =>
  JSON.stringify(httpRouteConfiguration(row)) === JSON.stringify(normalizeHttpRouteConfig(desired));
export const discoverHttpRoute = (rows: ReadonlyArray<HttpRouteRecord>, domains: string[]) =>
  Effect.gen(function* () {
    const wanted = normalizedDomains(domains);
    const overlapping = rows.filter(
      (row) =>
        row.isEditable &&
        row.domains.some((domain) => wanted.includes(normalizedDomains([domain.domainName])[0]!)),
    );
    const exact = overlapping.filter(
      (row) =>
        JSON.stringify(normalizedDomains(row.domains.map((domain) => domain.domainName))) ===
        JSON.stringify(wanted),
    );
    if (overlapping.length > 1 || (overlapping.length && exact.length !== 1)) {
      return yield* Effect.fail(
        new ZeropsValidation({
          status: 400,
          code: "ambiguousHttpRoute",
          operation: "readHttpRoute",
          message: "Overlapping HTTP domain routes: " + overlapping.map((row) => row.id).join(", "),
        }),
      );
    }
    return exact[0];
  });
const attributes = (row: HttpRouteRecord): HttpRouteAttributes => ({
  routeId: row.id,
  projectId: row.projectId,
  domains: normalizedDomains(row.domains.map((domain) => domain.domainName)).map((name) => ({
    name,
  })),
  configuration: httpRouteConfiguration(row),
  synced: row.isSynced,
  deleteOnSync: row.deleteOnSync,
});
export const HttpRouteProvider = () =>
  Provider.effect(
    HttpRoute,
    Effect.gen(function* () {
      const http = yield* ZeropsClient;
      const config = yield* ZeropsConfig;
      const ops = routingOperations(http);
      const get = (id: string) =>
        ops
          .httpGet(id)
          .pipe(
            Effect.catch((error) =>
              isNotFound(error, "publicHttpRoutingNotFound", "projectNotFound")
                ? Effect.succeed(undefined)
                : Effect.fail(error),
            ),
          );
      return {
        stables: ["routeId", "projectId"],
        read: ({ output, olds }) =>
          Effect.gen(function* () {
            if (output) {
              const row = yield* get(output.routeId);
              return row ? attributes(row) : undefined;
            }
            // Interrupted-create checkpoints can contain stripped dependency outputs.
            if (!olds?.project || !isResolved(olds) || !Array.isArray(olds.domains))
              return undefined;
            const project = (typeof olds.project === "string"
              ? olds.project
              : olds.project.projectId) as unknown as string;
            if (typeof project !== "string" || !project) return undefined;
            const row = yield* discoverHttpRoute(yield* ops.httpList(project), olds.domains);
            return row ? Unowned(attributes(row)) : undefined;
          }),
        diff: ({ news, output }) =>
          Effect.gen(function* () {
            if (!isResolved(news) || !output) return undefined;
            const project = (typeof news.project === "string"
              ? news.project
              : news.project.projectId) as unknown as string;
            if (output.projectId !== project)
              return { action: "replace" as const, deleteFirst: true };
            // beta.84 does not refresh persisted resources through read during ordinary planning.
            const current = yield* get(output.routeId);
            return !current ||
              routingNeedsUpdate({
                synced: current.isSynced,
                deleteOnSync: current.deleteOnSync,
              }) ||
              !httpRouteMatches(current, desiredHttpRoute(news))
              ? { action: "update" as const }
              : undefined;
          }),
        reconcile: ({ news, output, session }) =>
          Effect.gen(function* () {
            const projectId = (typeof news.project === "string"
              ? news.project
              : news.project.projectId) as unknown as string;
            const project = yield* projectOperations(http).get(projectId);
            const body = desiredHttpRoute(news);
            const options = {
              deadline:
                (yield* Clock.currentTimeMillis) +
                timeoutMs(output ? "update" : "create", news.timeouts),
              onStatus: (p: { status: string; id: string }) =>
                session.note(p.status + " (" + p.id + ")"),
            };
            let final: HttpRouteRecord | undefined;
            yield* syncRouting(http, {
              projectId,
              organizationId: project.clientId,
              kind: "http",
              ownedId: output?.routeId,
              force: news.forceSync === true || config.routingForceSync,
              options,
              note: (message) => session.note(message),
              stage: Effect.gen(function* () {
                if (!output) return yield* ops.httpCreate(projectId, body);
                const current = yield* get(output.routeId);
                if (!current) return yield* ops.httpCreate(projectId, body);
                if (!current.isEditable)
                  return yield* Effect.fail(
                    new ZeropsValidation({
                      status: 400,
                      code: "readOnlyHttpRoute",
                      operation: "updateHttpRoute",
                      message: "Generated HTTP routes cannot be managed by HttpRoute",
                    }),
                  );
                if (current.deleteOnSync) yield* ops.restore("http", current.id);
                return yield* ops.httpUpdate(current.id, body);
              }),
              verify: (staged) =>
                Effect.gen(function* () {
                  final = yield* get(staged.id);
                  return (
                    !!final &&
                    final.isSynced &&
                    !final.deleteOnSync &&
                    httpRouteMatches(final, body)
                  );
                }),
            });
            return attributes(final!);
          }),
        delete: ({ output, olds, session }) =>
          Effect.gen(function* () {
            if (!(yield* get(output.routeId))) return;
            const project = yield* projectOperations(http).get(output.projectId);
            yield* syncRouting(http, {
              projectId: output.projectId,
              organizationId: project.clientId,
              kind: "http",
              ownedId: output.routeId,
              force: olds.forceSync === true || config.routingForceSync,
              options: {
                deadline: (yield* Clock.currentTimeMillis) + timeoutMs("delete", olds.timeouts),
                onStatus: (p) => session.note(p.status + " (" + p.id + ")"),
              },
              note: (message) => session.note(message),
              stage: ops.delete("http", output.routeId),
              verify: () => Effect.map(get(output.routeId), (row) => row === undefined),
            });
          }),
      };
    }),
  );
