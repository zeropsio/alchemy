import { expect, test } from "bun:test";
import * as Effect from "effect/Effect";
import * as Deferred from "effect/Deferred";
import * as Fiber from "effect/Fiber";
import * as Redacted from "effect/Redacted";
import * as Clock from "effect/Clock";
import * as TestClock from "effect/testing/TestClock";
import { makeHttp } from "../../src/client/Http.ts";
import { RoutingLocks } from "../../src/internal/RoutingLocks.ts";
import { syncRouting } from "../../src/internal/RoutingSync.ts";
import { makeRoutingLocks } from "../../src/internal/RoutingLocks.ts";
import { guardForeignRouting, routingNeedsUpdate } from "../../src/internal/RoutingSync.ts";
import {
  discoverHttpRoute,
  normalizedDomains,
  httpRouteConfiguration,
  httpRouteMatches,
} from "../../src/HttpRoute.ts";
import {
  validatePortRoute,
  portRouteConfiguration,
  portRouteMatches,
  type PortRouteProps,
} from "../../src/PortRoute.ts";
import type {
  HttpRouteRecord,
  PortRouteRecord,
  HttpRouteBody,
  PortRouteBody,
} from "../../src/client/operations/Routing.ts";
import { routingOperations } from "../../src/client/operations/Routing.ts";

const key = {
  endpoint: "https://test.invalid",
  organizationId: "org",
  projectId: "project",
  kind: "http",
};
test("same-kind exclusion and independent routing kinds", async () => {
  await Effect.runPromise(
    Effect.gen(function* () {
      const locks = makeRoutingLocks();
      const entered = yield* Deferred.make<void>();
      const release = yield* Deferred.make<void>();
      const secondStarted = yield* Deferred.make<void>();
      const order: string[] = [];
      const first = yield* Effect.forkChild(
        locks.withLock(
          key,
          Effect.gen(function* () {
            order.push("first");
            yield* Deferred.succeed(entered, undefined);
            yield* Deferred.await(release);
            order.push("first-done");
          }),
        ),
      );
      yield* Deferred.await(entered);
      const second = yield* Effect.forkChild(
        Effect.gen(function* () {
          yield* Deferred.succeed(secondStarted, undefined);
          yield* locks.withLock(
            key,
            Effect.sync(() => {
              order.push("second");
            }),
          );
        }),
      );
      yield* Deferred.await(secondStarted);
      yield* locks.withLock(
        { ...key, kind: "port" },
        Effect.sync(() => {
          order.push("port");
        }),
      );
      expect(order).toEqual(["first", "port"]);
      yield* Deferred.succeed(release, undefined);
      yield* Fiber.join(first);
      yield* Fiber.join(second);
      expect(order).toEqual(["first", "port", "first-done", "second"]);
    }),
  );
});
test("foreign pending rows refuse with IDs; owned pending rows are exempt", async () => {
  const rows = [
    { id: "owned", isSynced: false, deleteOnSync: true },
    { id: "foreign", isSynced: false, deleteOnSync: false },
    { id: "deleted", isSynced: true, deleteOnSync: true },
    { id: "clean", isSynced: true, deleteOnSync: false },
  ];
  const error = await Effect.runPromise(
    guardForeignRouting(rows, "owned", false).pipe(Effect.flip),
  );
  expect(error._tag).toBe("ZeropsForeignRoutingChanges");
  expect(error.routeIds).toEqual(["deleted", "foreign"]);
  const notes: string[] = [];
  await Effect.runPromise(
    guardForeignRouting(rows, "owned", true, (message) =>
      Effect.sync(() => {
        notes.push(message);
      }),
    ),
  );
  expect(notes[0]).toContain("forceSync");
  expect(notes[0]).toContain("foreign");
});
const row = (id: string, domains: string[], editable = true) =>
  ({
    id,
    isEditable: editable,
    domains: domains.map((domainName) => ({ domainName })),
  }) as HttpRouteRecord;
test("HTTP discovery uses normalized domain sets and excludes generated routes", async () => {
  expect(normalizedDomains(["B.Example.COM.", "a.example.com", "a.example.com"])).toEqual([
    "a.example.com",
    "b.example.com",
  ]);
  const found = await Effect.runPromise(
    discoverHttpRoute(
      [
        row("generated", ["a.example.com"], false),
        row("exact", ["B.Example.com.", "a.example.com"]),
      ],
      ["a.example.com", "b.example.com"],
    ),
  );
  expect(found?.id).toBe("exact");
  expect(await Effect.runPromise(discoverHttpRoute([], ["new.example.com"]))).toBeUndefined();
  const error = await Effect.runPromise(
    discoverHttpRoute(
      [row("one", ["a.example.com"]), row("two", ["a.example.com", "b.example.com"])],
      ["a.example.com"],
    ).pipe(Effect.flip),
  );
  expect(error.code).toBe("ambiguousHttpRoute");
  expect(
    await Effect.runPromise(
      discoverHttpRoute(
        [row("partial", ["a.example.com", "b.example.com"])],
        ["a.example.com"],
      ).pipe(Effect.flip),
    ),
  ).toMatchObject({ code: "ambiguousHttpRoute" });
});
test("IPv4 is rejected before routing requests", async () => {
  const error = await Effect.runPromise(
    validatePortRoute({ ipType: "IP_V4" } as unknown as PortRouteProps).pipe(Effect.flip),
  );
  expect(error.code).toBe("ipv4Unsupported");
  await Effect.runPromise(validatePortRoute({ ipType: "IP_V6" } as PortRouteProps));
});
test("owned unsynced or pending-deletion observations force an update", () => {
  expect(routingNeedsUpdate({ synced: false })).toBe(true);
  expect(routingNeedsUpdate({ synced: true, deleteOnSync: true })).toBe(true);
  expect(routingNeedsUpdate({ synced: true, deleteOnSync: false })).toBe(false);
});

test("nothingToSync verifies intended state instead of claiming success", async () => {
  const calls: string[] = [];
  const http = makeHttp({
    endpoint: "https://test.invalid",
    token: Redacted.make("unit-only"),
    fetch: (async (input: string | URL | Request, init?: RequestInit) => {
      const url = new URL(String(input));
      calls.push(init?.method + " " + url.pathname);
      if (url.pathname.endsWith("/public-http-routing")) {
        return Response.json({ list: [] });
      }
      return Response.json({ error: { code: "nothingToSync" } }, { status: 400 });
    }) as typeof fetch,
  });
  let staged = 0;
  let verified = 0;
  const run = (intended: boolean) =>
    syncRouting(http, {
      projectId: "project",
      organizationId: "org",
      kind: "http",
      force: false,
      options: { deadline: Date.now() + 10000 },
      stage: Effect.sync(() => {
        staged++;
        return "route";
      }),
      verify: () =>
        Effect.sync(() => {
          verified++;
          return intended;
        }),
    }).pipe(Effect.provideService(RoutingLocks, makeRoutingLocks()));
  const error = await Effect.runPromise(run(false).pipe(Effect.flip));
  expect(error.code).toBe("routingDidNotConverge");
  await Effect.runPromise(run(true));
  expect(staged).toBe(2);
  expect(verified).toBe(2);
  expect(calls).toEqual([
    "GET /api/rest/public/project/project/public-http-routing",
    "PUT /api/rest/public/project/project/sync-public-http-routing",
    "GET /api/rest/public/project/project/public-http-routing",
    "PUT /api/rest/public/project/project/sync-public-http-routing",
  ]);
});

test("port inventory paginates both project services and each service's routing", async () => {
  const calls: string[] = [];
  const http = makeHttp({
    endpoint: "https://test.invalid",
    token: Redacted.make("unit-only"),
    fetch: (async (input: string | URL | Request) => {
      const url = new URL(String(input));
      const offset = Number(url.searchParams.get("offset"));
      calls.push(url.pathname + ":" + offset);
      if (url.pathname.endsWith("/service-stack")) {
        return Response.json({ list: [{ id: offset === 0 ? "s1" : "s2" }], total: 2 });
      }
      const service = url.pathname.includes("/s1/") ? "s1" : "s2";
      return Response.json({
        list: [{ id: service + "-" + offset, isSynced: true, deleteOnSync: false }],
        total: service === "s1" ? 2 : 1,
      });
    }) as typeof fetch,
  });
  const rows = await Effect.runPromise(routingOperations(http).portInventory("project"));
  expect(rows.map((item) => item.id)).toEqual(["s1-0", "s1-1", "s2-0"]);
  expect(calls).toEqual([
    "/api/rest/public/project/project/service-stack:0",
    "/api/rest/public/project/project/service-stack:1",
    "/api/rest/public/service-stack/s1/public-port-routing:0",
    "/api/rest/public/service-stack/s1/public-port-routing:1",
    "/api/rest/public/service-stack/s2/public-port-routing:0",
  ]);
});

test("routing configuration detects synced drift without volatile domain statuses", () => {
  const desired: HttpRouteBody = {
    domains: ["a.example.com"],
    sslEnabled: false,
    cdnEnabled: false,
    locations: [{ path: "/", port: 3000, serviceStackId: "service" }],
  };
  const observed = {
    ...desired,
    isSynced: true,
    domains: [{ domainName: "A.Example.com.", dnsCheckStatus: "PENDING" }],
  } as unknown as HttpRouteRecord;
  expect(httpRouteMatches(observed, desired)).toBe(true);
  const before = httpRouteConfiguration(observed);
  observed.domains[0]!.dnsCheckStatus = "FAILED";
  expect(httpRouteConfiguration(observed)).toEqual(before);
  expect(httpRouteMatches({ ...observed, sslEnabled: true }, desired)).toBe(false);
  expect(
    httpRouteMatches(
      { ...observed, locations: [{ ...observed.locations[0]!, port: 8080 }] },
      desired,
    ),
  ).toBe(false);
  const port: PortRouteBody = {
    internalPort: 3000,
    publicPort: 23001,
    internalProtocol: "tcp",
    publicIpType: "IP_V6",
    firewallPolicy: "WHITELIST",
    firewallIpRanges: ["2001:db8::/32"],
    firewallAllowMyIp: false,
  };
  const rule = { ...port, isSynced: true } as PortRouteRecord;
  expect(portRouteMatches(rule, port)).toBe(true);
  expect(portRouteMatches({ ...rule, firewallPolicy: "BLACKLIST" }, port)).toBe(false);
  expect(portRouteMatches({ ...rule, firewallIpRanges: [] }, port)).toBe(false);
  expect(portRouteConfiguration(rule)).toEqual(port);
});

test("routing deadline includes lock acquisition and prevents staging after expiry", async () => {
  await Effect.runPromise(
    Effect.gen(function* () {
      const entered = yield* Deferred.make<void>();
      const release = yield* Deferred.make<void>();
      const locks = makeRoutingLocks();
      const holder = yield* Effect.forkChild(
        locks.withLock(
          key,
          Effect.gen(function* () {
            yield* Deferred.succeed(entered, undefined);
            yield* Deferred.await(release);
          }),
        ),
      );
      yield* Deferred.await(entered);
      let requests = 0;
      let staged = false;
      const http = makeHttp({
        endpoint: key.endpoint,
        token: Redacted.make("unit-only"),
        fetch: (async (_input: string | URL | Request) => {
          requests++;
          return Response.json({ list: [] });
        }) as typeof fetch,
      });
      const args = {
        projectId: key.projectId,
        organizationId: key.organizationId,
        kind: "http" as const,
        force: false,
        options: { deadline: (yield* Clock.currentTimeMillis) + 100 },
        stage: Effect.sync(() => {
          staged = true;
        }),
        verify: () => Effect.succeed(true),
      };
      const waiter = yield* Effect.forkChild(
        syncRouting(http, args).pipe(Effect.provideService(RoutingLocks, locks), Effect.flip),
      );
      yield* TestClock.adjust(100);
      expect((yield* Fiber.join(waiter)).code).toBe("routingTimeout");
      yield* Deferred.succeed(release, undefined);
      yield* Fiber.join(holder);
      expect(requests).toBe(0);
      expect(staged).toBe(false);
      const expired = yield* syncRouting(http, args).pipe(
        Effect.provideService(RoutingLocks, locks),
        Effect.flip,
      );
      expect(expired.code).toBe("routingTimeout");
      expect(requests).toBe(0);
    }).pipe(Effect.provide(TestClock.layer())),
  );
});
