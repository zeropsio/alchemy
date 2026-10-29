import * as Provider from "alchemy/Provider";
import * as Layer from "effect/Layer";
import * as Effect from "effect/Effect";
import type * as Redacted from "effect/Redacted";
import { Project, ProjectProvider } from "./Project.ts";
import { Service } from "./Service.ts";
import { ServiceProvider } from "./ServiceProvider.ts";
import { ManagedService, ManagedServiceProvider } from "./ManagedService.ts";
import { ObjectStorage, ObjectStorageProvider } from "./ObjectStorage.ts";
import { HttpRoute, HttpRouteProvider } from "./HttpRoute.ts";
import { PortRoute, PortRouteProvider } from "./PortRoute.ts";
import { ProjectVariable, ProjectVariableProvider } from "./ProjectVariable.ts";
import { ServiceVariable, ServiceVariableProvider } from "./ServiceVariable.ts";
import { EnvClaims, envClaimsFor } from "./internal/EnvClaims.ts";
import { ZeropsConfig, readConfig } from "./Config.ts";
import { ZeropsCredentials, fromAuthProvider } from "./Credentials.ts";
import { ZeropsAuth } from "./AuthProvider.ts";
import { ZeropsClient, makeHttp } from "./client/Http.ts";
import type { ZeropsRequestGuard } from "./client/RequestGuard.ts";
import { RoutingLocks, makeRoutingLocks } from "./internal/RoutingLocks.ts";
export class Providers extends Provider.ProviderCollection<Providers>()("Zerops") {}
export interface ProviderOptions {
  requestGuard?: ZeropsRequestGuard;
  endpoint?: string;
  organizationId?: string;
}
export const providers = (options: ProviderOptions = {}) => {
  const config = readConfig(options);
  const client = Layer.effect(
    ZeropsClient,
    Effect.gen(function* () {
      const credentials = yield* ZeropsCredentials;
      const resolve = Effect.map(credentials.pipe(Effect.orDie), (creds) =>
        makeHttp({
          endpoint:
            options.endpoint ?? process.env.ZEROPS_ENDPOINT ?? creds.endpoint ?? config.endpoint,
          organizationId:
            options.organizationId ?? process.env.ZEROPS_ORGANIZATION_ID ?? creds.organizationId,
          token: creds.token,
          requestGuard: options.requestGuard,
        }),
      );
      return {
        endpoint: resolve.pipe(Effect.flatMap((http) => http.endpoint)),
        defaultOrganizationId: resolve.pipe(Effect.flatMap((http) => http.defaultOrganizationId)),
        request: <A>(method: string, path: string, body?: unknown) =>
          resolve.pipe(Effect.flatMap((http) => http.request<A>(method, path, body))),
        upload: (url: string, bytes: Uint8Array) =>
          resolve.pipe(Effect.flatMap((http) => http.upload(url, bytes))),
        fetchLog: (url: string, accessToken?: Redacted.Redacted<string>) =>
          resolve.pipe(Effect.flatMap((http) => http.fetchLog(url, accessToken))),
      };
    }),
  );
  const shared = Layer.mergeAll(
    client.pipe(Layer.provide(fromAuthProvider())),
    Layer.succeed(ZeropsConfig, config),
    Layer.sync(RoutingLocks, makeRoutingLocks),
  ).pipe(
    Layer.provideMerge(
      Layer.effect(EnvClaims, Effect.map(ZeropsClient, envClaimsFor)).pipe(
        Layer.provide(client.pipe(Layer.provide(fromAuthProvider()))),
      ),
    ),
  );
  const resources = Layer.mergeAll(
    ProjectProvider(),
    ObjectStorageProvider(),
    HttpRouteProvider(),
    PortRouteProvider(),
    ProjectVariableProvider(),
    ServiceVariableProvider(),
    ManagedServiceProvider(),
    ServiceProvider(),
  );
  return Layer.effect(
    Providers,
    Provider.collection([
      Project,
      ObjectStorage,
      HttpRoute,
      PortRoute,
      ProjectVariable,
      ServiceVariable,
      ManagedService,
      Service,
    ]),
  ).pipe(Layer.provide(resources), Layer.provideMerge(shared), Layer.provideMerge(ZeropsAuth));
};
