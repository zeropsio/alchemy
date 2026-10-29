import { expect, test } from "bun:test";
import * as Effect from "effect/Effect";
import { envDigest, isMasked } from "../../src/internal/Environment.ts";
import { convergeServiceEnv } from "../../src/internal/ServiceEnv.ts";
import { envClaimsFor, makeEnvClaims } from "../../src/internal/EnvClaims.ts";
import { desiredDigest, observedDigest, variableOperations } from "../../src/internal/Variable.ts";
import type { Http } from "../../src/client/Http.ts";

function fake(rows: Array<Record<string, unknown>> = []) {
  const writes: Array<{ method: string; path: string; body: unknown }> = [];
  const http = {
    request: (method: string, path: string, body?: unknown) =>
      Effect.sync(() => {
        if (path.endsWith("/env")) return { items: rows };
        if (path.startsWith("/process/")) return { id: "p", status: "FINISHED" };
        if (method === "GET") return rows.find((row) => path.endsWith("/" + row.id));
        writes.push({ method, path, body });
        return { id: "p", status: "FINISHED" };
      }),
  } as unknown as Http;
  return { http, writes };
}
const row = (content = "old", sensitive = false) => ({
  id: "row",
  key: "KEY",
  type: "USER",
  editable: true,
  internal: false,
  content,
  sensitive,
});
const args = {
  serviceId: "service",
  owner: "owner",
  desired: { KEY: "new" },
  previousDigests: {},
  deadline: Date.now() + 60_000,
};

test("mask markers are never digested; known digests survive masked reads", () => {
  for (const mask of ["REDACTED", "*", "********"]) {
    expect(isMasked(mask)).toBe(true);
    expect(envDigest(mask)).toBeUndefined();
    expect(envDigest(mask, "known")).toBe("known");
    expect(observedDigest(row(mask), undefined)).toBe("");
  }
  expect(envDigest("value")).toBe(desiredDigest("value"));
});

test("claims are idempotent for one owner and reject overlapping owners", async () => {
  const claims = makeEnvClaims();
  await Effect.runPromise(claims.claim("service", "id", "KEY", "a"));
  await Effect.runPromise(claims.claim("service", "id", "key", "a"));
  expect(
    await Effect.runPromise(Effect.result(claims.claim("service", "id", "KEY", "b"))),
  ).toMatchObject({ _tag: "Failure" });
  await Effect.runPromise(claims.claim("project", "id", "KEY", "b"));
});

test("convergence creates missing rows and returns only digests", async () => {
  const f = fake();
  expect(await Effect.runPromise(convergeServiceEnv(f.http, args))).toEqual({
    KEY: desiredDigest("new"),
  });
  expect(f.writes).toEqual([
    {
      method: "POST",
      path: "/service-stack/service/user-data",
      body: { key: "KEY", content: "new", sensitive: false },
    },
  ]);
});

test("convergence updates value and sensitivity, but skips equal rows", async () => {
  for (const [content, sensitive, count] of [
    ["old", false, 1],
    ["new", true, 1],
    ["new", false, 0],
  ] as const) {
    const f = fake([row(content, sensitive)]);
    await Effect.runPromise(convergeServiceEnv(f.http, args));
    expect(f.writes.length).toBe(count);
    if (count) expect(f.writes[0]?.method).toBe("PUT");
  }
});

test("masked rows compare prior digest and unknown masks force writes", async () => {
  for (const previousDigests of [{ KEY: desiredDigest("new") }, {}] as Array<
    Record<string, string>
  >) {
    const f = fake([row("REDACTED", true)]);
    await Effect.runPromise(
      convergeServiceEnv(f.http, { ...args, sensitive: ["KEY"], previousDigests }),
    );
    expect(f.writes.length).toBe(Object.hasOwn(previousDigests, "KEY") ? 0 : 1);
  }
});

test("convergence deletes only previously managed keys", async () => {
  const f = fake([row(), { ...row(), id: "foreign", key: "FOREIGN" }]);
  await Effect.runPromise(
    convergeServiceEnv(f.http, {
      ...args,
      desired: {},
      previousDigests: { KEY: desiredDigest("old") },
    }),
  );
  expect(f.writes).toEqual([{ method: "DELETE", path: "/user-data/row", body: undefined }]);
});

test("convergence refuses protected rows and claim conflicts before mutation", async () => {
  for (const protectedRow of [
    { ...row(), type: "SYSTEM" },
    { ...row(), editable: false },
    { ...row(), internal: true },
  ]) {
    const f = fake([protectedRow]);
    expect(await Effect.runPromise(Effect.result(convergeServiceEnv(f.http, args)))).toMatchObject({
      _tag: "Failure",
    });
    expect(f.writes).toEqual([]);
  }
  const f = fake();
  await Effect.runPromise(envClaimsFor(f.http).claim("service", "service", "KEY", "foreign"));
  expect(await Effect.runPromise(Effect.result(convergeServiceEnv(f.http, args)))).toMatchObject({
    _tag: "Failure",
  });
  expect(f.writes).toEqual([]);
});

test("case-only key changes retain the row and its previous masked digest", async () => {
  const f = fake([{ ...row("REDACTED", true), key: "FOO" }]);
  const result = await Effect.runPromise(
    convergeServiceEnv(f.http, {
      ...args,
      desired: { foo: "new" },
      sensitive: ["FOO"],
      previousDigests: { FOO: desiredDigest("new") },
    }),
  );
  expect(result).toEqual({ foo: desiredDigest("new") });
  expect(f.writes).toEqual([]);
  const changed = fake([{ ...row(), key: "FOO" }]);
  await Effect.runPromise(
    convergeServiceEnv(changed.http, {
      ...args,
      desired: { foo: "new" },
      previousDigests: { FOO: desiredDigest("old") },
    }),
  );
  expect(changed.writes.map((write) => write.method)).toEqual(["PUT"]);
});

test("desired case-insensitive duplicate keys fail before requests or writes", async () => {
  let requests = 0;
  const http = {
    request: () =>
      Effect.sync(() => {
        requests++;
      }),
  } as unknown as Http;
  const result = await Effect.runPromise(
    Effect.result(
      convergeServiceEnv(http, {
        ...args,
        desired: { FOO: "one", foo: "two" },
      }),
    ),
  );
  expect(result).toMatchObject({ _tag: "Failure", failure: { code: "duplicateEnvironmentKey" } });
  expect(requests).toBe(0);
});

test("environment deadlines bound discovery and mutation, not just process waiting", async () => {
  const never = { request: () => Effect.never } as unknown as Http;
  const convergence = await Effect.runPromise(
    Effect.result(
      convergeServiceEnv(never, {
        ...args,
        deadline: Date.now() + 20,
      }),
    ),
  );
  expect(convergence).toMatchObject({ _tag: "Failure", failure: { _tag: "ZeropsProcessTimeout" } });
  for (const scope of ["project", "service"] as const) {
    const ops = variableOperations(never, scope);
    for (const operation of [
      ops.write("target", "KEY", "value", false, undefined, { deadline: Date.now() + 20 }),
      ops.remove("row", { deadline: Date.now() + 20 }),
    ]) {
      expect(await Effect.runPromise(Effect.result(operation))).toMatchObject({
        _tag: "Failure",
        failure: { _tag: "ZeropsProcessTimeout" },
      });
    }
  }
});

test("whole-operation deadlines interrupt hanging mutation requests", async () => {
  for (const scope of ["project", "service"] as const) {
    for (const method of ["POST", "PUT", "DELETE"]) {
      const existing = method !== "POST";
      const requests: string[] = [];
      const http = {
        request: (verb: string, path: string) => {
          requests.push(verb);
          if (verb === method) return Effect.never;
          if (path.includes("offset=")) {
            return Effect.succeed({ list: existing ? [row()] : [], total: existing ? 1 : 0 });
          }
          return Effect.succeed(path.endsWith("/env") ? { items: existing ? [row()] : [] } : row());
        },
      } as unknown as Http;
      const ops = variableOperations(http, scope);
      const options = { deadline: Date.now() + 20 };
      const operation =
        method === "DELETE"
          ? ops.remove("row", options)
          : ops.write("target", "KEY", "new", false, undefined, options);
      expect(await Effect.runPromise(Effect.result(operation))).toMatchObject({
        _tag: "Failure",
        failure: { _tag: "ZeropsProcessTimeout" },
      });
      expect(requests).toContain(method);
    }
  }
});
