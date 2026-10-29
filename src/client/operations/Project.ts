import * as Effect from "effect/Effect";
import type { components } from "../api.gen.ts";
import type { Http } from "../Http.ts";
import { collectPages } from "../Pagination.ts";
import { identity, segment as s } from "./Decode.ts";
import type { ProcessRecord } from "../Process.ts";
export type ProjectRecord = components["schemas"]["ResponseProject"];
export type ProjectCreate = components["schemas"]["RequestPostProject"];
export type ProjectUpdate = components["schemas"]["RequestPutProject"];
export const projectOperations = (http: Http) => ({
  get: (id: string) =>
    http.request<ProjectRecord>("GET", "/project/" + s(id)).pipe(Effect.flatMap(identity)),
  create: (org: string, body: ProjectCreate) =>
    http
      .request<ProjectRecord>("POST", "/client/" + s(org) + "/project", body)
      .pipe(Effect.flatMap(identity)),
  update: (id: string, body: ProjectUpdate) =>
    http.request<ProjectRecord>("PUT", "/project/" + s(id), body).pipe(Effect.flatMap(identity)),
  delete: (id: string) =>
    http.request<ProcessRecord>("DELETE", "/project/" + s(id)).pipe(Effect.flatMap(identity)),
  list: (org: string) =>
    collectPages((offset, limit) =>
      http.request<{ list: ProjectRecord[] }>(
        "GET",
        "/client/" + s(org) + "/project?offset=" + offset + "&limit=" + limit,
      ),
    ),
  byName: (org: string, name: string) =>
    http.request<{ projects: ProjectRecord[] }>(
      "GET",
      "/client/" + s(org) + "/projects-by-name/" + s(name),
    ),
  processes: (id: string) =>
    collectPages((offset, limit) =>
      http.request<{ list: ProcessRecord[] }>(
        "GET",
        "/project/" + s(id) + "/process?offset=" + offset + "&limit=" + limit,
      ),
    ),
  upgrade: (id: string) =>
    http.request<{ process?: ProcessRecord }>("PUT", "/project/" + s(id) + "/mode-upgrade", {
      mode: "SERIOUS",
    }),
  sharedIpv4: (id: string, enabled: boolean) =>
    http.request<ProjectRecord>("PUT", "/project/" + s(id) + "/public-ipv4-shared", { enabled }),
});
