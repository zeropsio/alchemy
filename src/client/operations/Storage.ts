import * as Effect from "effect/Effect";
import type { components } from "../api.gen.ts";
import type { Http } from "../Http.ts";
import type { ProcessRecord } from "../Process.ts";
import { identity, segment as s } from "./Decode.ts";

type S = components["schemas"];
export const storageOperations = (http: Http) => ({
  create: (project: string, body: S["RequestPostObjectStorageServiceStack"]) =>
    http
      .request<S["ResponseServiceStackProcess"]>(
        "POST",
        "/project/" + s(project) + "/service-stack/object_storage_v1",
        body,
      )
      .pipe(Effect.flatMap(identity)),
  size: (id: string) =>
    http.request<S["ResponseServiceStackDiskGBytesUsed"]>(
      "GET",
      "/service-stack/" + s(id) + "/object-storage-size",
    ),
  update: (id: string, body: S["RequestPutServiceStackObjectStorageSize"]) =>
    http
      .request<ProcessRecord>("PUT", "/service-stack/" + s(id) + "/object-storage-size", body)
      .pipe(Effect.flatMap(identity)),
});
