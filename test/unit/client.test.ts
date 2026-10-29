import { test, expect } from "bun:test";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import { makeHttp, normalizeEndpoint } from "../../src/client/Http.ts";
import { ZeropsGuardRefused } from "../../src/client/Errors.ts";
test("endpoint normalization rejects credential leakage paths", () => {
  expect(normalizeEndpoint("https://api.test/api/rest/public").origin).toBe("https://api.test");
  for (const url of [
    "http://api.test",
    "https://user:pass@api.test",
    "https://api.test/other",
    "https://api.test/#fragment",
  ])
    expect(() => normalizeEndpoint(url)).toThrow();
});
test("API versus upload headers and guard hooks", async () => {
  const seen: any[] = [];
  const hooks: string[] = [];
  const http = makeHttp({
    endpoint: "https://api.test",
    token: Redacted.make("synthetic"),
    fetch: (async (url, init) => {
      seen.push({ url: String(url), ...init });
      return new Response(String(url).includes("upload") ? "" : JSON.stringify({ ok: true }));
    }) as typeof fetch,
    requestGuard: {
      before: (req) => {
        hooks.push(req.kind);
      },
      after: () => {
        hooks.push("after");
      },
    },
  });
  await Effect.runPromise(http.request("GET", "/project/a"));
  await Effect.runPromise(http.upload("https://upload.test/x", new Uint8Array([1])));
  expect(seen[0].headers.Authorization).toBe("Bearer synthetic");
  expect(seen[1].headers.Authorization).toBeUndefined();
  expect(seen[1].headers["Content-Type"]).toBeUndefined();
  expect(seen[0].redirect).toBe("error");
  expect(hooks).toEqual(["api", "after", "upload", "after"]);
});
test("guard refusal is tagged and prevents fetch", async () => {
  let called = false;
  const http = makeHttp({
    endpoint: "https://api.test",
    token: Redacted.make("synthetic"),
    fetch: (async () => {
      called = true;
      return new Response();
    }) as unknown as typeof fetch,
    requestGuard: {
      before: () => {
        throw new Error("secret");
      },
    },
  });
  const result = await Effect.runPromise(http.request("GET", "/x").pipe(Effect.flip));
  expect(result._tag).toBe("ZeropsGuardRefused");
  expect(result.message).toBe("Request guard refused request/response");
  expect(called).toBe(false);
});
for (const hook of ["before", "after"] as const) {
  test(`typed guard refusal passes through unchanged from ${hook}`, async () => {
    const refusal = new ZeropsGuardRefused({
      code: "guardRefused",
      message: "Custom policy refused this operation",
    });
    const http = makeHttp({
      endpoint: "https://api.test",
      token: Redacted.make("synthetic"),
      fetch: (async () => Response.json({ ok: true })) as unknown as typeof fetch,
      requestGuard: {
        before: () => {
          if (hook === "before") throw refusal;
        },
        after: () => {
          if (hook === "after") throw refusal;
        },
      },
    });
    const result = await Effect.runPromise(http.request("GET", "/x").pipe(Effect.flip));
    expect(result).toBe(refusal);
  });
}
test("uncertain mutations are not retried", async () => {
  let calls = 0;
  const http = makeHttp({
    endpoint: "https://api.test",
    token: Redacted.make("synthetic"),
    fetch: (async () => {
      calls++;
      return new Response('{"code":"500"}', { status: 500 });
    }) as unknown as typeof fetch,
  });
  await Effect.runPromise(http.request("POST", "/x", {}).pipe(Effect.flip));
  expect(calls).toBe(1);
});
import * as TestClock from "effect/testing/TestClock";
import * as Fiber from "effect/Fiber";
test("GET retry window is bounded by real Effect clock time", async () => {
  await Effect.runPromise(
    Effect.gen(function* () {
      let calls = 0;
      const http = makeHttp({
        endpoint: "https://api.test",
        token: Redacted.make("synthetic"),
        fetch: (async () => {
          calls++;
          return new Response('{"error":{"code":"overloaded"}}', { status: 503 });
        }) as unknown as typeof fetch,
      });
      const fiber = yield* http.request("GET", "/x").pipe(Effect.flip, Effect.forkChild);
      yield* TestClock.adjust(60000);
      const failure = yield* Fiber.join(fiber);
      expect(failure._tag).toBe("ZeropsServerError");
      expect(calls).toBeGreaterThan(1);
      expect(calls).toBeLessThan(20);
    }).pipe(Effect.provide(TestClock.layer())),
  );
});
test("Retry-After is respected without exceeding the transient deadline", async () => {
  await Effect.runPromise(
    Effect.gen(function* () {
      let calls = 0;
      const http = makeHttp({
        endpoint: "https://api.test",
        token: Redacted.make("synthetic"),
        fetch: (async () => {
          calls++;
          return new Response('{"code":"rateLimited"}', {
            status: 429,
            headers: { "Retry-After": "120" },
          });
        }) as unknown as typeof fetch,
      });
      const fiber = yield* http.request("GET", "/x").pipe(Effect.flip, Effect.forkChild);
      yield* TestClock.adjust(60000);
      const failure = yield* Fiber.join(fiber);
      expect(failure._tag).toBe("ZeropsRateLimited");
      expect(calls).toBe(1);
    }).pipe(Effect.provide(TestClock.layer())),
  );
});
test("log requests attach only explicitly supplied log credentials through guard", async () => {
  const headers: Array<Headers> = [];
  const hooks: string[] = [];
  const http = makeHttp({
    endpoint: "https://api.test",
    token: Redacted.make("synthetic-api-token"),
    fetch: (async (_url, init) => {
      headers.push(new Headers(init?.headers));
      return new Response("safe log text");
    }) as typeof fetch,
    requestGuard: {
      before: (request) => {
        hooks.push(request.kind);
      },
      after: () => {
        hooks.push("after");
      },
    },
  });
  expect(
    await Effect.runPromise(
      http.fetchLog("https://logs.test/build", Redacted.make("synthetic-log-token")),
    ),
  ).toBe("safe log text");
  await Effect.runPromise(http.fetchLog("https://logs.test/build"));
  expect(headers[0]!.get("Authorization")).toBe("Bearer synthetic-log-token");
  expect(headers[1]!.has("Authorization")).toBe(false);
  expect(hooks).toEqual(["log", "after", "log", "after"]);
});
test("a hanging mutation times out once without replay", async () => {
  await Effect.runPromise(
    Effect.gen(function* () {
      let calls = 0;
      let aborted = false;
      const http = makeHttp({
        endpoint: "https://api.test",
        token: Redacted.make("synthetic"),
        fetch: (async (_url, init) => {
          calls++;
          init?.signal?.addEventListener("abort", () => {
            aborted = true;
          });
          return await new Promise<Response>(() => {});
        }) as typeof fetch,
      });
      const fiber = yield* http
        .request("DELETE", "/service-stack/s")
        .pipe(Effect.flip, Effect.forkChild);
      yield* TestClock.adjust(60000);
      const error = yield* Fiber.join(fiber);
      expect(error._tag).toBe("ZeropsTransportError");
      expect(error.code).toBe("requestTimeout");
      expect(calls).toBe(1);
      expect(aborted).toBe(true);
    }).pipe(Effect.provide(TestClock.layer())),
  );
});
import { serviceStackOperations } from "../../src/client/operations/ServiceStack.ts";
import { autoscalingDto } from "../../src/internal/Autoscaling.ts";
test("autoscaling update uses recorded wire keys and accepts null process", async () => {
  let sent: unknown;
  const http = makeHttp({
    endpoint: "https://api.test",
    token: Redacted.make("synthetic"),
    fetch: (async (_url, init) => {
      sent = JSON.parse(String(init?.body));
      return new Response('{"process":null}');
    }) as typeof fetch,
  });
  const response = await Effect.runPromise(
    serviceStackOperations(http).autoscaling("s", {
      customAutoscaling: autoscalingDto({
        vertical: { maxRam: 4 },
        horizontal: { maxContainers: 2 },
      }),
    }),
  );
  expect(sent).toEqual({
    customAutoscaling: {
      verticalAutoscaling: {
        minResource: {},
        maxResource: { memoryGBytes: 4 },
        minFreeResource: {},
      },
      horizontalAutoscaling: { maxContainerCount: 2 },
    },
  });
  expect(response.process).toBeNull();
});
