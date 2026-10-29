import * as Effect from "effect/Effect";
import type { components } from "../api.gen.ts";
import type { Http } from "../Http.ts";
import { collectPages } from "../Pagination.ts";
import type { ProcessRecord } from "../Process.ts";
import { identity, segment as s } from "./Decode.ts";
export type ServiceStackRecord = components["schemas"]["ResponseServiceStack"];
export type ServiceStackCreate = components["schemas"]["RequestPostServiceStack"];
// RequestAutoscaling references BaseCustomAutoscaling's *Nullable property names,
// but observed PUTs use the same wire keys as create. Reuse the generated create
// DTO for that field.
export type AutoscalingDto = Omit<
  components["schemas"]["RequestAutoscaling"],
  "customAutoscaling"
> & {
  customAutoscaling?: components["schemas"]["InDtoBodyCustomAutoscaling"];
};
export const serviceStackOperations = (http: Http) => ({
  get: (id: string) =>
    http
      .request<ServiceStackRecord>("GET", "/service-stack/" + s(id))
      .pipe(Effect.flatMap(identity)),
  byName: (project: string, name: string) =>
    http
      .request<ServiceStackRecord>("GET", "/service-stack-by-name/" + s(project) + "/" + s(name))
      .pipe(Effect.flatMap(identity)),
  list: (project: string) =>
    collectPages((offset, limit) =>
      http.request<{ list: ServiceStackRecord[] }>(
        "GET",
        "/project/" + s(project) + "/service-stack?offset=" + offset + "&limit=" + limit,
      ),
    ),
  create: (project: string, body: ServiceStackCreate) =>
    http
      .request<components["schemas"]["ResponseServiceStackProcess"]>(
        "POST",
        "/project/" + s(project) + "/service-stack",
        body,
      )
      .pipe(Effect.flatMap(identity)),
  delete: (id: string) =>
    http.request<ProcessRecord>("DELETE", "/service-stack/" + s(id)).pipe(Effect.flatMap(identity)),
  autoscaling: (id: string, body: AutoscalingDto) =>
    http.request<{ process?: ProcessRecord | null }>(
      "PUT",
      "/service-stack/" + s(id) + "/autoscaling",
      body,
    ),
  start: (id: string) =>
    http
      .request<ProcessRecord>("PUT", "/service-stack/" + s(id) + "/start")
      .pipe(Effect.flatMap(identity)),
  stop: (id: string) =>
    http
      .request<ProcessRecord>("PUT", "/service-stack/" + s(id) + "/stop")
      .pipe(Effect.flatMap(identity)),
  subdomain: (id: string, enabled: boolean) =>
    http
      .request<ProcessRecord>(
        "PUT",
        "/service-stack/" +
          s(id) +
          (enabled ? "/enable-subdomain-access" : "/disable-subdomain-access"),
      )
      .pipe(Effect.flatMap(identity)),
  processes: (id: string) =>
    collectPages((offset, limit) =>
      http.request<{ list: ProcessRecord[] }>(
        "GET",
        "/service-stack/" + s(id) + "/process?offset=" + offset + "&limit=" + limit,
      ),
    ),
  env: (id: string) =>
    http.request<components["schemas"]["ResponseServiceStackEnvList"]>(
      "GET",
      "/service-stack/" + s(id) + "/env",
    ),
});
