import { expect, test } from "bun:test";
import { Unowned } from "alchemy/AdoptPolicy";
import { ResourceContext } from "alchemy/ResourceContext";
import type { ScopedPlanStatusSession } from "alchemy/Report";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { ProjectVariable, ProjectVariableProvider } from "../../src/ProjectVariable.ts";
import { ServiceVariable, ServiceVariableProvider } from "../../src/ServiceVariable.ts";
import { ZeropsClient, type Http } from "../../src/client/Http.ts";
import { ZeropsConfig, readConfig } from "../../src/Config.ts";
import { EnvClaims, envClaimsFor } from "../../src/internal/EnvClaims.ts";
import { apiError } from "../../src/client/Errors.ts";
import type { ZeropsError } from "../../src/client/Errors.ts";
import { desiredDigest } from "../../src/internal/Variable.ts";
import type { ProjectVariableProps } from "../../src/ProjectVariable.ts";
import type { ServiceVariableProps } from "../../src/ServiceVariable.ts";

for (const scope of ["project", "service"] as const) {
  test(`${scope} variable state-free keys are Unowned; saved IDs prove ownership`, async () => {
    const row = {
      id: "row",
      key: "KEY",
      type: "USER",
      editable: true,
      internal: false,
      content: "value",
      sensitive: false,
    };
    const http = {
      request: (_method: string, path: string) =>
        Effect.succeed(
          path.includes("offset=")
            ? { list: [row], total: 1 }
            : path.endsWith("/env")
              ? { items: [row] }
              : row,
        ),
    } as unknown as Http;
    const shared = Layer.mergeAll(
      Layer.succeed(ZeropsClient, http),
      Layer.succeed(ZeropsConfig, readConfig()),
      Layer.succeed(EnvClaims, envClaimsFor(http)),
    );
    if (scope === "project") {
      await Effect.runPromise(
        Effect.gen(function* () {
          const provider = yield* ProjectVariable.Provider;
          const input = {
            id: "v",
            fqn: "v",
            instanceId: "v",
            olds: { project: "p", key: "KEY", value: "value" },
            output: undefined,
          };
          const discovered = yield* provider.read!(input);
          expect(Unowned.is(discovered)).toBe(true);
          const owned = yield* provider.read!({
            ...input,
            output: {
              variableId: "row",
              projectId: "p",
              key: "KEY",
              sensitive: false,
              digest: "prior",
            },
          });
          expect(Unowned.is(owned)).toBe(false);
          expect(owned).not.toHaveProperty("value");
        }).pipe(Effect.provide(ProjectVariableProvider().pipe(Layer.provide(shared)))),
      );
    } else {
      await Effect.runPromise(
        Effect.gen(function* () {
          const provider = yield* ServiceVariable.Provider;
          const input = {
            id: "v",
            fqn: "v",
            instanceId: "v",
            olds: { service: "s", key: "KEY", value: "value" },
            output: undefined,
          };
          expect(Unowned.is(yield* provider.read!(input))).toBe(true);
          const owned = yield* provider.read!({
            ...input,
            output: {
              userDataId: "row",
              serviceId: "s",
              key: "KEY",
              sensitive: false,
              digest: "prior",
            },
          });
          expect(Unowned.is(owned)).toBe(false);
          expect(owned).not.toHaveProperty("value");
        }).pipe(Effect.provide(ServiceVariableProvider().pipe(Layer.provide(shared)))),
      );
    }
  });
}

for (const scope of ["project", "service"] as const) {
  test(`${scope} variable observes drift, retains masks and recreates missing saved IDs`, async () => {
    let row:
      | {
          id: string;
          key: string;
          type: string;
          editable: boolean;
          content: string;
          sensitive: boolean;
        }
      | undefined = {
      id: "row",
      key: "KEY",
      type: "USER",
      editable: true,
      content: "value",
      sensitive: false,
    };
    const mutations: string[] = [];
    const http = {
      request: (method: string, path: string, body?: unknown) =>
        Effect.suspend<unknown, ZeropsError, never>(() => {
          if (path.startsWith("/process/")) {
            return Effect.succeed({ id: "process", status: "FINISHED" });
          }
          if (method === "POST" || method === "PUT") {
            mutations.push(method);
            const value = body as { content: string; sensitive: boolean };
            row = { id: "new", key: "KEY", type: "USER", editable: true, ...value };
            return Effect.succeed({ id: "process" });
          }
          if (path.includes("offset=")) {
            return Effect.succeed({ list: row ? [row] : [], total: row ? 1 : 0 });
          }
          if (path.endsWith("/env")) return Effect.succeed({ items: row ? [row] : [] });
          return row
            ? Effect.succeed(row)
            : Effect.fail(
                apiError(
                  400,
                  {
                    code: scope === "project" ? "projectEnvNotFound" : "userDataNotFound",
                  },
                  "readEnvironment",
                ),
              );
        }),
    } as unknown as Http;
    const shared = Layer.mergeAll(
      Layer.succeed(ZeropsClient, http),
      Layer.succeed(ZeropsConfig, readConfig()),
      Layer.succeed(EnvClaims, envClaimsFor(http)),
    );
    await Effect.runPromise(
      Effect.gen(function* () {
        const provider =
          scope === "project" ? yield* ProjectVariable.Provider : yield* ServiceVariable.Provider;
        const props = { project: "target", service: "target", key: "KEY", value: "value" };
        const input = { id: "v", fqn: "v", instanceId: "v", olds: props };
        const output = {
          variableId: "row",
          projectId: "target",
          userDataId: "row",
          serviceId: "target",
          key: "KEY",
          sensitive: false,
          digest: desiredDigest("value"),
        };
        const expected =
          scope === "project"
            ? {
                variableId: "row",
                projectId: "target",
                key: "KEY",
                sensitive: false,
                digest: desiredDigest("value"),
              }
            : {
                userDataId: "row",
                serviceId: "target",
                key: "KEY",
                sensitive: false,
                digest: desiredDigest("value"),
              };
        expect(yield* provider.read!({ ...input, output })).toEqual(expected);
        row!.content = "external";
        expect(yield* provider.read!({ ...input, output })).toEqual({
          ...expected,
          digest: desiredDigest("external"),
        });
        row!.content = "REDACTED";
        row!.sensitive = true;
        expect(yield* provider.read!({ ...input, output })).toEqual({
          ...expected,
          sensitive: true,
        });
        row = undefined;
        expect(yield* provider.read!({ ...input, output })).toBeUndefined();
        const repaired = yield* provider.reconcile({
          ...input,
          news: props,
          output,
          bindings: [],
          session: { note: () => Effect.void } as unknown as ScopedPlanStatusSession,
        });
        expect(mutations).toEqual(["POST"]);
        expect(repaired).toEqual({
          ...expected,
          ...(scope === "project" ? { variableId: "new" } : { userDataId: "new" }),
        });
      }).pipe(
        Effect.provideService(ResourceContext, {
          logicalId: "v",
          fqn: "v",
          instanceId: "v",
          type: "Zerops.Variable",
        }),
        Effect.provide(
          Layer.mergeAll(ProjectVariableProvider(), ServiceVariableProvider()).pipe(
            Layer.provide(shared),
          ),
        ),
      ),
    );
  });
}

test("recovery skips unresolved parents without output and uses saved parents with output", async () => {
  let requests = 0;
  const row = {
    id: "row",
    key: "KEY",
    type: "USER",
    editable: true,
    content: "value",
    sensitive: false,
  };
  const http = {
    request: () =>
      Effect.sync(() => {
        requests++;
        return row;
      }),
  } as unknown as Http;
  const shared = Layer.mergeAll(
    Layer.succeed(ZeropsClient, http),
    Layer.succeed(ZeropsConfig, readConfig()),
    Layer.succeed(EnvClaims, envClaimsFor(http)),
  );
  await Effect.runPromise(
    Effect.gen(function* () {
      const projectProvider = yield* ProjectVariable.Provider;
      const serviceProvider = yield* ServiceVariable.Provider;
      const input = { id: "v", fqn: "v", instanceId: "v", output: undefined };
      for (const parent of [undefined, {}, { projectId: {} }, { serviceId: {} }]) {
        expect(
          yield* projectProvider.read!({
            ...input,
            olds: { project: parent, key: "KEY", value: "value" } as ProjectVariableProps,
          }),
        ).toBeUndefined();
        expect(
          yield* serviceProvider.read!({
            ...input,
            olds: { service: parent, key: "KEY", value: "value" } as ServiceVariableProps,
          }),
        ).toBeUndefined();
      }
      expect(requests).toBe(0);
      expect(
        yield* projectProvider.read!({
          ...input,
          olds: {} as ProjectVariableProps,
          output: {
            projectId: "p",
            variableId: "row",
            key: "KEY",
            sensitive: false,
            digest: desiredDigest("value"),
          },
        }),
      ).toEqual({
        projectId: "p",
        variableId: "row",
        key: "KEY",
        sensitive: false,
        digest: desiredDigest("value"),
      });
      expect(
        yield* serviceProvider.read!({
          ...input,
          olds: {} as ServiceVariableProps,
          output: {
            serviceId: "s",
            userDataId: "row",
            key: "KEY",
            sensitive: false,
            digest: desiredDigest("value"),
          },
        }),
      ).toEqual({
        serviceId: "s",
        userDataId: "row",
        key: "KEY",
        sensitive: false,
        digest: desiredDigest("value"),
      });
      expect(requests).toBe(2);
    }).pipe(
      Effect.provide(
        Layer.mergeAll(ProjectVariableProvider(), ServiceVariableProvider()).pipe(
          Layer.provide(shared),
        ),
      ),
    ),
  );
});
