import * as Effect from "effect/Effect";
import type { components } from "../api.gen.ts";
import type { Http } from "../Http.ts";
import type { ProcessRecord } from "../Process.ts";
import { collectPages } from "../Pagination.ts";
import { serviceStackOperations } from "./ServiceStack.ts";
import { identity, segment as s } from "./Decode.ts";
import { ZeropsDecodeError } from "../Errors.ts";
export type HttpRouteRecord = components["schemas"]["ResponsePublicHttpRouting"];
export type PortRouteRecord = components["schemas"]["ResponsePublicPortRouting"];
export type HttpRouteBody = components["schemas"]["RequestPublicHttpRoutingPut"];
export type PortRouteBody = components["schemas"]["RequestPublicPortRouting"];
export type RoutingKind = "http" | "port";
const routeIdentity = <A extends { id: string; isSynced: boolean; deleteOnSync: boolean }>(
  row: A,
) =>
  row &&
  typeof row.id === "string" &&
  row.id.length > 0 &&
  typeof row.isSynced === "boolean" &&
  typeof row.deleteOnSync === "boolean"
    ? Effect.succeed(row)
    : Effect.fail(
        new ZeropsDecodeError({
          code: "decode",
          message: "Routing response missing identity or synchronization flags",
        }),
      );
export const routingOperations = (http: Http) => {
  const path = (kind: RoutingKind, id: string) => "/public-" + kind + "-routing/" + s(id);
  return {
    httpList: (project: string) =>
      collectPages((offset, limit) =>
        http.request<{ list: HttpRouteRecord[] }>(
          "GET",
          "/project/" + s(project) + "/public-http-routing?offset=" + offset + "&limit=" + limit,
        ),
      ),
    portList: (service: string) =>
      collectPages((offset, limit) =>
        http.request<{ list: PortRouteRecord[] }>(
          "GET",
          "/service-stack/" +
            s(service) +
            "/public-port-routing?offset=" +
            offset +
            "&limit=" +
            limit,
        ),
      ),
    portInventory: (project: string) =>
      Effect.gen(function* () {
        const services = yield* serviceStackOperations(http).list(project);
        const pages = yield* Effect.forEach(services, (service) =>
          collectPages((offset, limit) =>
            http.request<{ list: PortRouteRecord[] }>(
              "GET",
              "/service-stack/" +
                s(service.id) +
                "/public-port-routing?offset=" +
                offset +
                "&limit=" +
                limit,
            ),
          ),
        );
        return pages.flat();
      }),
    httpGet: (id: string) =>
      http.request<HttpRouteRecord>("GET", path("http", id)).pipe(Effect.flatMap(routeIdentity)),
    portGet: (id: string) =>
      http.request<PortRouteRecord>("GET", path("port", id)).pipe(Effect.flatMap(routeIdentity)),
    httpCreate: (project: string, body: HttpRouteBody) =>
      http
        .request<HttpRouteRecord>("POST", "/project/" + s(project) + "/public-http-routing", body)
        .pipe(Effect.flatMap(routeIdentity)),
    portCreate: (service: string, body: PortRouteBody) =>
      http
        .request<PortRouteRecord>(
          "POST",
          "/service-stack/" + s(service) + "/public-port-routing",
          body,
        )
        .pipe(Effect.flatMap(routeIdentity)),
    httpUpdate: (id: string, body: HttpRouteBody) =>
      http
        .request<HttpRouteRecord>("PUT", path("http", id), body)
        .pipe(Effect.flatMap(routeIdentity)),
    portUpdate: (id: string, body: PortRouteBody) =>
      http
        .request<PortRouteRecord>("PUT", path("port", id), body)
        .pipe(Effect.flatMap(routeIdentity)),
    restore: (kind: RoutingKind, id: string) =>
      http.request<unknown>("PUT", path(kind, id) + "/restore"),
    delete: (kind: RoutingKind, id: string) => http.request<unknown>("DELETE", path(kind, id)),
    sync: (kind: RoutingKind, project: string) =>
      http
        .request<ProcessRecord>(
          "PUT",
          "/project/" + s(project) + "/sync-public-" + kind + "-routing",
        )
        .pipe(Effect.flatMap(identity)),
  };
};
