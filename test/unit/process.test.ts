import { test, expect } from "bun:test";
import * as Effect from "effect/Effect";
import * as Fiber from "effect/Fiber";
import * as TestClock from "effect/testing/TestClock";
import { waitProcessWith, type ProcessRecord } from "../../src/client/Process.ts";
import { apiError } from "../../src/client/Errors.ts";
import type { Http } from "../../src/client/Http.ts";
const fake = (get: () => ProcessRecord): Pick<Http, "request"> => ({
  request: <A>() => Effect.sync(() => get() as A),
});
test("poll backoff supports unknown statuses and status notes", async () => {
  await Effect.runPromise(
    Effect.gen(function* () {
      let calls = 0;
      const notes: string[] = [];
      const http = fake(() => ({
        id: "p",
        status: ["FUTURE_STATUS", "RUNNING", "FINISHED"][Math.min(calls++, 2)]!,
      }));
      const fiber = yield* waitProcessWith(http, "p", {
        deadline: 60000,
        onStatus: (p) =>
          Effect.sync(() => {
            notes.push(p.status);
          }),
      }).pipe(Effect.forkChild);
      yield* TestClock.adjust(2500);
      const result = yield* Fiber.join(fiber);
      expect(result.status).toBe("FINISHED");
      expect(calls).toBe(3);
      expect(notes).toEqual(["FUTURE_STATUS", "RUNNING", "FINISHED"]);
    }).pipe(Effect.provide(TestClock.layer())),
  );
});
test("FAILED and CANCELED fail; processNotFound never succeeds", async () => {
  for (const status of ["FAILED", "CANCELED"]) {
    const failure = await Effect.runPromise(
      waitProcessWith(
        fake(() => ({ id: "p", status })),
        "p",
        { deadline: Date.now() + 10000 },
      ).pipe(Effect.flip),
    );
    expect(failure._tag).toBe("ZeropsProcessFailed");
  }
  const http: Pick<Http, "request"> = {
    request: () => Effect.fail(apiError(403, { code: "processNotFound" }, "GET process")),
  };
  const failure = await Effect.runPromise(
    waitProcessWith(http, "p", { deadline: Date.now() + 10000 }).pipe(Effect.flip),
  );
  expect(failure.code).toBe("processNotFound");
});
test("mismatched process identity fails before status callbacks or terminal success", async () => {
  for (const status of ["FINISHED", "RUNNING", "FAILED"]) {
    const notes: string[] = [];
    const failure = await Effect.runPromise(
      waitProcessWith(
        fake(() => ({ id: "different", status })),
        "requested",
        {
          deadline: Date.now() + 10000,
          onStatus: (process) =>
            Effect.sync(() => {
              notes.push(process.id);
            }),
        },
      ).pipe(Effect.flip),
    );
    expect(failure._tag).toBe("ZeropsProcessFailed");
    expect(failure.code).toBe("invalidProcess");
    expect("processId" in failure && failure.processId).toBe("requested");
    expect(notes).toEqual([]);
  }
});
test("deadline interrupts a hanging GET with TestClock", async () => {
  await Effect.runPromise(
    Effect.gen(function* () {
      const http: Pick<Http, "request"> = { request: () => Effect.never };
      const fiber = yield* waitProcessWith(http, "p", { deadline: 3000 }).pipe(
        Effect.flip,
        Effect.forkChild,
      );
      yield* TestClock.adjust(3000);
      const failure = yield* Fiber.join(fiber);
      expect(failure._tag).toBe("ZeropsProcessTimeout");
    }).pipe(Effect.provide(TestClock.layer())),
  );
});
import { makeHttp } from "../../src/client/Http.ts";
import * as Redacted from "effect/Redacted";
import {
  settleService,
  convergeServiceState,
  createService,
  deleteService,
} from "../../src/internal/ServiceLifecycle.ts";
test("all service lifecycle helpers bound hanging requests by the absolute deadline", async () => {
  for (const operation of ["settle", "converge", "create", "delete"] as const) {
    await Effect.runPromise(
      Effect.gen(function* () {
        let calls = 0;
        const http: Http = {
          ...makeHttp({ endpoint: "https://api.test", token: Redacted.make("synthetic") }),
          request: () =>
            Effect.suspend(() => {
              calls++;
              return Effect.never;
            }),
        };
        const options = { deadline: 3000 };
        const effect =
          operation === "settle"
            ? settleService(http, "s", ["ACTIVE"], options)
            : operation === "converge"
              ? convergeServiceState(http, "s", "running", options)
              : operation === "create"
                ? createService(http, "project", {} as Parameters<typeof createService>[2], options)
                : deleteService(http, "s", options);
        const fiber = yield* effect.pipe(Effect.flip, Effect.forkChild);
        yield* TestClock.adjust(3000);
        const error = yield* Fiber.join(fiber);
        expect(error._tag).toBe("ZeropsProcessTimeout");
        expect(error.message).toContain("remote work may continue");
        expect(calls).toBe(1);
      }).pipe(Effect.provide(TestClock.layer())),
    );
  }
});
test("settle rejects expected status delivered after its deadline", async () => {
  await Effect.runPromise(
    Effect.gen(function* () {
      let reads = 0;
      const http: Http = {
        ...makeHttp({ endpoint: "https://api.test", token: Redacted.make("synthetic") }),
        request: <A>(_method: string, path: string) => {
          if (path.includes("/process?")) return Effect.succeed({ list: [], total: 0 } as A);
          const response = { id: "s", status: "ACTIVE" } as A;
          return reads++ === 0
            ? Effect.succeed(response)
            : Effect.sleep(3000).pipe(Effect.as(response));
        },
      };
      const fiber = yield* settleService(http, "s", ["ACTIVE"], { deadline: 3000 }).pipe(
        Effect.flip,
        Effect.forkChild,
      );
      yield* TestClock.adjust(5000);
      expect((yield* Fiber.join(fiber))._tag).toBe("ZeropsProcessTimeout");
    }).pipe(Effect.provide(TestClock.layer())),
  );
});
test("delete bounds the absence GET after a successful deletion process", async () => {
  await Effect.runPromise(
    Effect.gen(function* () {
      const http: Http = {
        ...makeHttp({ endpoint: "https://api.test", token: Redacted.make("synthetic") }),
        request: <A>(method: string, path: string) =>
          method === "DELETE" || path.startsWith("/process/")
            ? Effect.succeed({ id: "p", status: "FINISHED" } as A)
            : Effect.never,
      };
      const fiber = yield* deleteService(http, "s", { deadline: 3000 }).pipe(
        Effect.flip,
        Effect.forkChild,
      );
      yield* TestClock.adjust(3000);
      expect((yield* Fiber.join(fiber))._tag).toBe("ZeropsProcessTimeout");
    }).pipe(Effect.provide(TestClock.layer())),
  );
});
