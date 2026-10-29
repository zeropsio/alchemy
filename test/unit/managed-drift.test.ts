import { expect, test } from "bun:test";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { ResourceContext } from "alchemy/ResourceContext";
import {
  ManagedService,
  ManagedServiceProvider,
  assertManagedIdentity,
  getManagedService,
  observeManagedService,
  type ManagedServiceProps,
} from "../../src/ManagedService.ts";
import { ZeropsClient, type Http } from "../../src/client/Http.ts";
import { ZeropsConfig, readConfig } from "../../src/Config.ts";
import { ZeropsValidation } from "../../src/client/Errors.ts";
import type {
  ServiceStackRecord,
  ServiceStackCreate,
} from "../../src/client/operations/ServiceStack.ts";

function fixture(missing = false) {
  let service = missing
    ? undefined
    : ({
        id: "service",
        projectId: "project",
        name: "db",
        base: "postgresql:single@16",
        status: "STOPPED",
        customAutoscaling: {},
      } as unknown as ServiceStackRecord);
  const mutations: string[] = [];
  const http = {
    request: (method: string, path: string, body?: unknown) => {
      if (method !== "GET") mutations.push(method + " " + path);
      if (path === "/project/project/service-stack") {
        const create = body as ServiceStackCreate;
        service = {
          id: "service",
          projectId: "project",
          name: create.name,
          base: create.serviceStackVersionName,
          status: "ACTIVE",
          customAutoscaling: create.customAutoscaling,
        } as ServiceStackRecord;
        return Effect.succeed(service);
      }
      if (path.endsWith("/start")) {
        service = { ...service!, status: "ACTIVE" };
        return Effect.succeed({ id: "process", status: "FINISHED" });
      }
      if (path === "/process/process") {
        return Effect.succeed({ id: "process", status: "FINISHED" });
      }
      if (path.includes("/process?")) return Effect.succeed({ list: [] });
      if (path.endsWith("/autoscaling")) return Effect.succeed({ process: null });
      if (path.endsWith("/env")) return Effect.succeed({ items: [] });
      if (service) return Effect.succeed(service);
      return Effect.fail(
        new ZeropsValidation({
          status: 400,
          code: "serviceStackNotFound",
          operation: "get",
          message: "Service absent",
        }),
      );
    },
  } as unknown as Http;
  return { http, mutations, current: () => service };
}
const desired = { project: "project", hostname: "db", type: "postgresql@16" };

test("managed adoption refuses incompatible family, version and availability before writes", async () => {
  const f = fixture();
  for (const base of ["valkey:single@7.2", "postgresql:single@17", "postgresql:ha@16"]) {
    const result = await Effect.runPromise(
      Effect.result(assertManagedIdentity({ ...f.current()!, base }, desired)),
    );
    expect(result._tag).toBe("Failure");
  }
  await Effect.runPromise(assertManagedIdentity(f.current()!, desired));
  expect(f.mutations).toEqual([]);
});
test("managed observations preserve stable shape and expose status/scaling drift", async () => {
  const f = fixture();
  const observed = await Effect.runPromise(observeManagedService(f.http, f.current()!));
  expect(observed.status).toBe("STOPPED");
  expect(observed.autoscaling).toEqual({});
  const active = await Effect.runPromise(
    observeManagedService(f.http, {
      ...f.current()!,
      status: "ACTIVE",
      customAutoscaling: {
        verticalAutoscaling: { maxResource: { memoryGBytes: 2 } },
      },
    }),
  );
  expect(active).not.toEqual(observed);
  expect(await Effect.runPromise(getManagedService(fixture(true).http, "service"))).toBeUndefined();
});
for (const missing of [false, true]) {
  test(
    "managed reconcile repairs " + (missing ? "missing IDs" : "observed stopped services"),
    async () => {
      const f = fixture(missing);
      const layer = ManagedServiceProvider().pipe(
        Layer.provide(
          Layer.mergeAll(
            Layer.succeed(ZeropsClient, f.http),
            Layer.succeed(ZeropsConfig, readConfig()),
          ),
        ),
      );
      const reconciled = await Effect.runPromise(
        Effect.gen(function* () {
          const provider = yield* ManagedService.Provider;
          return yield* provider.reconcile({
            id: "Database",
            fqn: "Database",
            instanceId: "instance",
            news: desired,
            olds: desired,
            bindings: [],
            output: {
              serviceId: "service",
              projectId: "project",
              hostname: "db",
              type: "postgresql@16",
              mode: "NON_HA",
              status: "STOPPED",
              autoscaling: {},
              envDigests: {},
            },
            session: { note: () => Effect.void } as unknown as Parameters<
              typeof provider.reconcile
            >[0]["session"],
          });
        }).pipe(
          Effect.provide(layer),
          Effect.provideService(ResourceContext, {
            logicalId: "Database",
            fqn: "Database",
            instanceId: "instance",
            type: "Zerops.ManagedService",
          }),
        ),
      );
      expect(reconciled.status).toBe("ACTIVE");
      expect(
        f.mutations.some((mutation) =>
          mutation.includes(missing ? "/project/project/service-stack" : "/start"),
        ),
      ).toBe(true);
    },
  );
}

test("managed recovery skips unresolved or stripped project props without lookup", async () => {
  const http = {
    request: () => Effect.die("Unexpected recovery request with unresolved project"),
  } as unknown as Http;
  const layer = ManagedServiceProvider().pipe(
    Layer.provide(
      Layer.mergeAll(Layer.succeed(ZeropsClient, http), Layer.succeed(ZeropsConfig, readConfig())),
    ),
  );
  for (const stripped of [{}, { project: {} }]) {
    const observed = await Effect.runPromise(
      Effect.gen(function* () {
        const provider = yield* ManagedService.Provider;
        return yield* provider.read!({
          id: "Database",
          fqn: "Database",
          instanceId: "instance",
          olds: stripped as unknown as ManagedServiceProps,
          output: undefined,
        });
      }).pipe(Effect.provide(layer)),
    );
    expect(observed).toBeUndefined();
  }
});
