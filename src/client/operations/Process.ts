import * as Effect from "effect/Effect";
import type { Http } from "../Http.ts";
import type { ProcessRecord } from "../Process.ts";
import { identity, segment } from "./Decode.ts";
export const processOperations = (http: Http) => ({
  get: (id: string) =>
    http.request<ProcessRecord>("GET", "/process/" + segment(id)).pipe(Effect.flatMap(identity)),
});
