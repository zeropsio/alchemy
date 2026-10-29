import type { components } from "../api.gen.ts";
import type { Http } from "../Http.ts";
import { collectPages } from "../Pagination.ts";
import type { ProcessRecord } from "../Process.ts";
import { segment as s } from "./Decode.ts";
type S = components["schemas"];
export type EnvRow = S["ResponseProjectEnv"];
export const environmentOperations = (http: Http) => ({
  projectList: (project: string) =>
    http.request<S["ResponseProjectEnvList"]>("GET", "/project/" + s(project) + "/env"),
  projectGet: (id: string) => http.request<EnvRow>("GET", "/project-env/" + s(id)),
  projectCreate: (project: string, body: S["RequestProjectEnvPost"]) =>
    http.request<ProcessRecord>("POST", "/project/" + s(project) + "/env", body),
  projectUpdate: (id: string, body: S["RequestProjectEnvPut"]) =>
    http.request<ProcessRecord>("PUT", "/project-env/" + s(id), body),
  projectDelete: (id: string) => http.request<ProcessRecord>("DELETE", "/project-env/" + s(id)),
  serviceList: (service: string) =>
    collectPages((offset, limit) =>
      http.request<S["ResponseUserDataList"]>(
        "GET",
        "/service-stack/" + s(service) + "/user-data?offset=" + offset + "&limit=" + limit,
      ),
    ),
  serviceGet: (id: string) => http.request<S["ResponseUserData"]>("GET", "/user-data/" + s(id)),
  serviceCreate: (service: string, body: S["RequestUserDataPost"]) =>
    http.request<ProcessRecord>("POST", "/service-stack/" + s(service) + "/user-data", body),
  serviceUpdate: (id: string, body: S["RequestUserDataPut"]) =>
    http.request<ProcessRecord>("PUT", "/user-data/" + s(id), body),
  serviceDelete: (id: string) => http.request<ProcessRecord>("DELETE", "/user-data/" + s(id)),
});
