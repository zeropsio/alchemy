import * as Effect from "effect/Effect";
import * as Zerops from "../../src/index.ts";
import { resolve } from "node:path";

export interface BasicOptions {
  name?: string;
  domain: string;
  greeting: string;
  sourceDir?: string;
}

/** The source directory override lets smoke tests mutate an isolated copy. */
export const basic = (options: BasicOptions) =>
  Effect.gen(function* () {
    const project = yield* Zerops.Project("Project", { name: options.name, mode: "LIGHT" });
    const db = yield* Zerops.Postgres("Database", { project, hostname: "db", version: "16" });
    const api = yield* Zerops.Service("Api", {
      project,
      hostname: "api",
      type: "nodejs@22",
      source: { dir: options.sourceDir ?? resolve(import.meta.dirname, "api") },
      env: { DATABASE_URL: Zerops.ref(db, "connectionString"), GREETING: options.greeting },
      subdomain: true,
    });
    const route = yield* Zerops.HttpRoute("ApiRoute", {
      project,
      domains: [options.domain],
      ssl: false,
      locations: [{ path: "/", service: api, port: 3000 }],
    });
    return {
      projectId: project.projectId,
      serviceId: api.serviceId,
      subdomainUrls: api.subdomainUrls,
      routeId: route.routeId,
      dbHostname: db.hostname,
      appVersionId: api.appVersionId,
    };
  });
