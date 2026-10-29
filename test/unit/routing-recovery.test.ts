import { expect, test } from "bun:test";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Output from "alchemy/Output";
import { HttpRoute, HttpRouteProvider, type HttpRouteProps } from "../../src/HttpRoute.ts";
import { PortRoute, PortRouteProvider, type PortRouteProps } from "../../src/PortRoute.ts";
import { ZeropsClient, type Http } from "../../src/client/Http.ts";
import { ZeropsConfig, readConfig } from "../../src/Config.ts";
import { RoutingLocks, makeRoutingLocks } from "../../src/internal/RoutingLocks.ts";

test("routing recovery ignores stripped or unresolved identities without requests", async () => {
  let requests = 0;
  const http = {
    request: () =>
      Effect.sync(() => {
        requests++;
        throw new Error("Incomplete recovery props must not perform requests");
      }),
  } as unknown as Http;
  const layer = Layer.mergeAll(HttpRouteProvider(), PortRouteProvider()).pipe(
    Layer.provide(
      Layer.mergeAll(
        Layer.succeed(ZeropsClient, http),
        Layer.succeed(ZeropsConfig, readConfig()),
        Layer.sync(RoutingLocks, makeRoutingLocks),
      ),
    ),
  );
  await Effect.runPromise(
    Effect.gen(function* () {
      const httpProvider = yield* HttpRoute.Provider;
      const portProvider = yield* PortRoute.Provider;
      const input = { id: "Route", fqn: "Route", instanceId: "instance", output: undefined };
      const httpProps = [
        undefined,
        {},
        { project: {}, domains: ["example.com"] },
        { project: Output.literal("project"), domains: ["example.com"] },
      ];
      for (const olds of httpProps) {
        expect(
          yield* httpProvider.read!({ ...input, olds: olds as HttpRouteProps }),
        ).toBeUndefined();
      }
      const portProps = [
        undefined,
        {},
        { service: {}, ipType: "IP_V6", port: 3000, protocol: "TCP" },
        { service: Output.literal("service"), ipType: "IP_V6", port: 3000, protocol: "TCP" },
      ];
      for (const olds of portProps) {
        expect(
          yield* portProvider.read!({ ...input, olds: olds as PortRouteProps }),
        ).toBeUndefined();
      }
      const diff = {
        ...input,
        olds: {} as HttpRouteProps,
        news: { project: "project", domains: ["example.com"], locations: [] },
        oldBindings: [],
        newBindings: [],
      };
      expect(yield* httpProvider.diff!(diff)).toBeUndefined();
      expect(
        yield* portProvider.diff!({
          ...diff,
          olds: {} as PortRouteProps,
          news: { service: "service", ipType: "IP_V6", port: 3000, protocol: "TCP" },
        }),
      ).toBeUndefined();
    }).pipe(Effect.provide(layer)),
  );
  expect(requests).toBe(0);
});
