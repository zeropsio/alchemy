import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import type { Http } from "../Http.ts";
import type { ProcessRecord } from "../Process.ts";
import type { components } from "../api.gen.ts";
import { identity, segment as s } from "./Decode.ts";
import { redactLog } from "../../internal/DeployLog.ts";

export const appVersionOperations = (http: Http) => ({
  create: (serviceId: string, name: string) =>
    http
      .request<components["schemas"]["ResponsePostAppVersion"]>(
        "POST",
        "/service-stack/" + s(serviceId) + "/app-version",
        { name },
      )
      .pipe(Effect.flatMap(identity)),
  get: (id: string) =>
    http
      .request<components["schemas"]["OutDtoGetAppVersion"]>("GET", "/app-version/" + s(id))
      .pipe(Effect.flatMap(identity)),
  deploy: (id: string, yaml: string, setup: string, build: boolean) =>
    http
      .request<ProcessRecord>(
        "PUT",
        "/app-version/" + s(id) + (build ? "/build-and-deploy" : "/deploy"),
        { zeropsYaml: yaml, zeropsYamlSetup: setup },
      )
      .pipe(Effect.flatMap(identity)),
  logTail: (
    projectId: string,
    serviceId: string,
    appVersionId: string,
    secrets: ReadonlyArray<string> = [],
  ) =>
    Effect.gen(function* () {
      const access = yield* http.request<{ urlPlain: string; accessToken: string }>(
        "GET",
        "/project/" + s(projectId) + "/log",
      );
      if (!access.urlPlain) return "";
      const token = Redacted.make(access.accessToken);
      const sensitive = [...secrets, access.accessToken];
      const window = (query: Record<string, string>) => {
        const url = new URL(access.urlPlain);
        for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value);
        url.searchParams.set("limit", "100");
        return http.fetchLog(url.toString(), token).pipe(
          Effect.map((completeLog) => redactLog(completeLog, sensitive)),
          Effect.catch(() => Effect.succeed("")),
        );
      };
      const build = yield* window({ tags: "zbuilder@" + appVersionId });
      const runtime = yield* window({ serviceStackId: serviceId });
      if (!build.trim() && !runtime.trim()) return "";
      // Keep the failing build last so noisy historical runtime output cannot displace it.
      return (
        "Runtime log tail:\n" +
        runtime.split("\n").slice(-20).join("\n") +
        "\nBuild log tail:\n" +
        build.split("\n").slice(-50).join("\n")
      ).slice(-12000);
    }),
});
