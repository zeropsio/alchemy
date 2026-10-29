import { expect, test } from "bun:test";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { ResourceContext } from "alchemy/ResourceContext";
import { ManagedService, ManagedServiceProvider } from "../../src/ManagedService.ts";
import { Service } from "../../src/Service.ts";
import { ServiceProvider } from "../../src/ServiceProvider.ts";
import { ObjectStorage, ObjectStorageProvider } from "../../src/ObjectStorage.ts";
import { ProjectVariable, ProjectVariableProvider } from "../../src/ProjectVariable.ts";
import { ServiceVariable, ServiceVariableProvider } from "../../src/ServiceVariable.ts";
import { ZeropsClient, type Http } from "../../src/client/Http.ts";
import { ZeropsValidation } from "../../src/client/Errors.ts";
import { ZeropsConfig, readConfig } from "../../src/Config.ts";
import { EnvClaims, makeEnvClaims } from "../../src/internal/EnvClaims.ts";
import { desiredDigest, variableOperations } from "../../src/internal/Variable.ts";
import type { VariableRow } from "../../src/internal/Variable.ts";
import type { ServiceStackRecord } from "../../src/client/operations/ServiceStack.ts";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { inspectSource } from "../../src/source/Source.ts";
import { deployIdentity } from "../../src/internal/Deploy.ts";

interface Hooks {
  diff(input: unknown): Effect.Effect<{ action: string } | undefined, unknown>;
  read(input: unknown): Effect.Effect<unknown, unknown>;
  reconcile(input: unknown): Effect.Effect<Record<string, unknown>, unknown>;
}

const cases = [
  {
    name: "managed",
    resource: ManagedService,
    layer: ManagedServiceProvider,
    props: {
      project: "p",
      hostname: "db",
      type: "valkey@7.2",
      autoscaling: { vertical: { minRam: 1 } },
    },
  },
  {
    name: "service",
    resource: Service,
    layer: ServiceProvider,
    props: { project: "p", hostname: "app", type: "nodejs@22", state: "running" },
  },
  {
    name: "storage",
    resource: ObjectStorage,
    layer: ObjectStorageProvider,
    props: { project: "p", hostname: "bucket", quotaGb: 5 },
  },
  {
    name: "project variable",
    resource: ProjectVariable,
    layer: ProjectVariableProvider,
    props: { project: "p", key: "FOO", value: "desired" },
  },
  {
    name: "service variable",
    resource: ServiceVariable,
    layer: ServiceVariableProvider,
    props: { service: "s", key: "FOO", value: "desired" },
  },
];
const saved = {
  serviceId: "s",
  projectId: "p",
  hostname: "app",
  variableId: "row",
  userDataId: "row",
  key: "FOO",
  digest: desiredDigest("desired"),
  sensitive: false,
  quotaGb: 5,
  policy: "private",
  appVersionId: "v",
  activeAppVersionId: "v",
  envDigests: {},
};
const privateRaw = '{"websiteAccess":false,"indexDocument":null,"errorDocument":null}';
function fixture(name: string, drift: string) {
  const writes: string[] = [];
  let quota = drift === "changed" ? 9 : 5;
  let row: VariableRow | undefined =
    drift === "missing"
      ? undefined
      : {
          id: "row",
          key: drift === "spelling" ? "foo" : "FOO",
          content: drift === "changed" ? "external" : "desired",
          sensitive: false,
          type: "USER",
          editable: true,
        };
  const stack =
    drift === "missing"
      ? undefined
      : {
          id: "s",
          projectId: "p",
          name: "app",
          base: name === "managed" ? "valkey:single@7.2" : "nodejs@22",
          serviceStackTypeId: "object_storage",
          status: drift === "changed" ? "STOPPED" : "ACTIVE",
          activeAppVersion: { id: drift === "version" ? "external" : "v" },
          customAutoscaling: {
            verticalAutoscaling: { minResource: { memoryGBytes: drift === "scaling" ? 2 : 1 } },
          },
        };
  const missing = () =>
    Effect.fail(
      new ZeropsValidation({
        status: 400,
        code: name.includes("variable")
          ? name.startsWith("project")
            ? "projectEnvNotFound"
            : "userDataNotFound"
          : "serviceStackNotFound",
        operation: "get",
        message: "Absent",
      }),
    );
  const http = {
    request: (method: string, path: string, body?: unknown) => {
      if (method !== "GET") writes.push(method + " " + path);
      if (drift === "error")
        return Effect.fail(
          new ZeropsValidation({
            status: 403,
            code: "forbidden",
            operation: "get",
            message: "Denied",
          }),
        );
      if (path === "/process/process") return Effect.succeed({ id: "process", status: "FINISHED" });
      if (method === "PUT" && path.endsWith("object-storage-size")) {
        if (
          !body ||
          typeof body !== "object" ||
          !("diskGBytes" in body) ||
          typeof body.diskGBytes !== "number"
        )
          return Effect.die("Invalid quota DTO");
        quota = body.diskGBytes;
        return Effect.succeed({ id: "process", status: "FINISHED" });
      }
      if (path.endsWith("object-storage-size")) return Effect.succeed({ rawPolicy: privateRaw });
      if (path.endsWith("/env") && !name.includes("variable"))
        return Effect.succeed({
          items: [
            { type: "SYSTEM", key: "quotaGBytes", content: String(quota) },
            ...["bucketName", "apiUrl", "accessKeyId"].map((key) => ({
              type: "SYSTEM",
              key,
              content: "public",
            })),
          ],
        });
      if (name.includes("variable")) {
        if (method === "POST" || method === "PUT") {
          if (
            !body ||
            typeof body !== "object" ||
            !("key" in body) ||
            typeof body.key !== "string" ||
            !("content" in body) ||
            typeof body.content !== "string" ||
            !("sensitive" in body) ||
            typeof body.sensitive !== "boolean"
          )
            return Effect.die("Invalid variable DTO");
          row = {
            key: body.key,
            content: body.content,
            sensitive: body.sensitive,
            id: "row",
            type: "USER",
            editable: true,
          };
          return Effect.succeed({ id: "process" });
        }
        if (path.includes("?")) return Effect.succeed({ list: row ? [row] : [] });
        if (path.endsWith("/env")) return Effect.succeed({ items: row ? [row] : [] });
        return row ? Effect.succeed(row) : missing();
      }
      if (path.includes("/process?")) return Effect.succeed({ list: [] });
      return stack ? Effect.succeed(stack) : missing();
    },
  } as unknown as Http;
  return { http, writes };
}
// Exercise actual provider hooks, with the same persisted-output inputs used by beta.84.
function run<A>(
  c: (typeof cases)[number],
  http: Http,
  fn: (provider: Hooks) => Effect.Effect<A, unknown>,
): Promise<A> {
  const dependencies = Layer.mergeAll(
    Layer.succeed(ZeropsClient, http),
    Layer.succeed(ZeropsConfig, readConfig()),
    Layer.succeed(EnvClaims, makeEnvClaims()),
  );
  // The table deliberately erases each resource's distinct prop/attribute type.
  const program = Effect.gen(function* () {
    const provider = (yield* c.resource.Provider) as unknown as Hooks;
    return yield* fn(provider);
  }).pipe(
    // Each case's layer has a distinct provider type; the table erases them (see Hooks).
    Effect.provide((c.layer() as unknown as Layer.Layer<never>).pipe(Layer.provide(dependencies))),
    Effect.provideService(ResourceContext, {
      logicalId: "Resource",
      fqn: "Resource",
      instanceId: "instance",
      type: "Zerops.Test",
    }),
  );
  return Effect.runPromise(program as Effect.Effect<A, unknown>);
}
for (const c of cases) {
  for (const drift of [
    "none",
    "missing",
    "changed",
    ...(c.name === "managed" ? ["scaling"] : []),
    ...(c.name.includes("variable") ? ["spelling"] : []),
  ]) {
    test(`${c.name} diff observes ${drift} without mutations`, async () => {
      const f = fixture(c.name, drift);
      const diff = await run(c, f.http, (p) =>
        p.diff({ olds: c.props, news: c.props, output: saved }),
      );
      if (drift === "none") expect(diff?.action ?? "noop").toBe("noop");
      else expect(diff).toEqual({ action: "update" });
      expect(f.writes).toEqual([]);
    });
  }
  test(`${c.name} diff propagates observation errors`, async () => {
    await expect(
      run(c, fixture(c.name, "error").http, (p) =>
        p.diff({ olds: c.props, news: c.props, output: saved }),
      ),
    ).rejects.toThrow();
  });
  test(`${c.name} recovery tolerates stripped props`, async () => {
    const http = { request: () => Effect.die("Unexpected recovery request") } as unknown as Http;
    for (const olds of [
      {},
      ...(c.name === "storage" ? [] : [{ project: "p" }]),
      { service: {} },
      { project: {} },
    ]) {
      expect(await run(c, http, (p) => p.read({ olds, output: undefined }))).toBeUndefined();
    }
  });
}

for (const c of cases.filter((c) => c.name === "service" || c.name === "managed")) {
  test(`${c.name} recovery read then diff tolerates incomplete identity without output`, async () => {
    const http = { request: () => Effect.die("Unexpected recovery request") } as unknown as Http;
    // Match the interrupted-create path in beta.84 Plan.ts: it passes old
    // checkpoint props to diff even when read recovers no attributes.
    const news = { ...c.props, hostname: undefined };
    for (const olds of [{ project: "p" }, {}, { project: {} }]) {
      await run(c, http, (p) =>
        Effect.gen(function* () {
          const output = yield* p.read({ olds, output: undefined });
          expect(output).toBeUndefined();
          expect(yield* p.diff({ olds, news, output })).toBeUndefined();
        }),
      );
    }
  });
}

for (const status of ["READY_TO_DEPLOY", "ACTIVE", "STOPPED"]) {
  test(`code-free running service diff accepts reconcile state ${status}`, async () => {
    const c = cases[1]!;
    const f = fixture(c.name, "none");
    const http = {
      request: (method: Parameters<Http["request"]>[0], path: string, body?: unknown) =>
        f.http
          .request(method, path, body)
          .pipe(
            Effect.map((value) =>
              path === "/service-stack/s"
                ? { ...(value as ServiceStackRecord), status, activeAppVersion: undefined }
                : value,
            ),
          ),
    } as unknown as Http;
    const diff = await run(c, http, (p) =>
      p.diff({
        olds: c.props,
        news: c.props,
        output: { ...saved, appVersionId: undefined, activeAppVersionId: undefined },
      }),
    );
    expect(diff?.action ?? "noop").toBe(status === "STOPPED" ? "update" : "noop");
    expect(f.writes).toEqual([]);
  });
}
for (const c of cases.filter((c) => c.name.includes("variable"))) {
  test(`${c.name} case-only rename updates the same row`, async () => {
    const f = fixture(c.name, "none");
    const news = { ...c.props, key: "foo" };
    expect(await run(c, f.http, (p) => p.diff({ olds: c.props, news, output: saved }))).toEqual({
      action: "update",
    });
    const row = await Effect.runPromise(
      variableOperations(f.http, c.name.startsWith("project") ? "project" : "service").write(
        "p",
        "foo",
        "desired",
        false,
        saved.digest,
        { deadline: Date.now() + 5000 },
      ),
    );
    expect(row.id).toBe("row");
    expect(row.key).toBe("foo");
    expect(f.writes).toEqual([
      c.name.startsWith("project") ? "PUT /project-env/row" : "PUT /user-data/row",
    ]);
  });
  test(`${c.name} missing saved row is recreated`, async () => {
    const f = fixture(c.name, "missing");
    const attrs = await run(c, f.http, (p) =>
      p.reconcile({ news: c.props, output: saved, session: { note: () => Effect.void } }),
    );
    expect(attrs.key).toBe("FOO");
    expect(f.writes[0]).toStartWith("POST ");
  });
}
test("storage reconcile corrects freshly observed quota despite unchanged saved output", async () => {
  const c = cases[2]!;
  const f = fixture(c.name, "changed");
  // Storage settling requires ACTIVE; quota drift is independent of lifecycle status.
  const http = {
    request: (method: Parameters<Http["request"]>[0], path: string, body?: unknown) =>
      f.http
        .request(method, path, body)
        .pipe(
          Effect.map((value) =>
            path === "/service-stack/s"
              ? { ...(value as ServiceStackRecord), status: "ACTIVE" }
              : value,
          ),
        ),
  } as unknown as Http;
  const attrs = await run(c, http, (p) =>
    p.reconcile({ news: c.props, output: saved, session: { note: () => Effect.void } }),
  );
  expect(attrs.quotaGb).toBe(5);
  expect(f.writes).toContain("PUT /service-stack/s/object-storage-size");
});

test("service diff observes out-of-band app version with unchanged source props", async () => {
  const dir = await mkdtemp(join(tmpdir(), "alchemy-observation-"));
  try {
    await writeFile(join(dir, "app.js"), "console.log('fixture')");
    const c = cases[1]!;
    const props = { project: "p", hostname: "app", type: "nodejs@22", source: { dir } };
    const witness = deployIdentity(
      props,
      "app",
      await Effect.runPromise(inspectSource(props.source)),
    );
    for (const drift of ["none", "version"]) {
      const f = fixture("service", drift);
      const diff = await run(c, f.http, (p) =>
        p.diff({ olds: props, news: props, output: { ...saved, ...witness } }),
      );
      expect(diff?.action ?? "noop").toBe(drift === "none" ? "noop" : "update");
      expect(f.writes).toEqual([]);
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("storage missing saved ID is recreated", async () => {
  const c = cases[2]!;
  const f = fixture("storage", "none");
  let created = false;
  const http = {
    request: (method: Parameters<Http["request"]>[0], path: string, body?: unknown) => {
      if (method === "POST") {
        expect(path).toBe("/project/p/service-stack/object_storage_v1");
        created = true;
        return Effect.succeed({ id: "s", status: "ACTIVE", process: null });
      }
      if (!created && path === "/service-stack/s")
        return Effect.fail(
          new ZeropsValidation({
            status: 400,
            code: "serviceStackNotFound",
            operation: "get",
            message: "Absent",
          }),
        );
      return f.http.request(method, path, body);
    },
  } as unknown as Http;
  const attrs = await run(c, http, (p) =>
    p.reconcile({ news: c.props, output: saved, session: { note: () => Effect.void } }),
  );
  expect(created).toBe(true);
  expect(attrs.serviceId).toBe("s");
});

test("storage custom-policy drift schedules and performs a corrective PUT", async () => {
  const c = cases[2]!;
  const f = fixture("storage", "none");
  const props = { ...c.props, policy: "custom", rawPolicy: '{\"desired\":true}' };
  const output = { ...saved, policy: "custom", rawPolicy: props.rawPolicy };
  let rawPolicy = '{\"external\":true}';
  let writes = 0;
  const http = {
    request: (method: Parameters<Http["request"]>[0], path: string, body?: unknown) => {
      if (path.endsWith("object-storage-size")) {
        if (method === "PUT") {
          if (
            !body ||
            typeof body !== "object" ||
            !("rawPolicy" in body) ||
            typeof body.rawPolicy !== "string"
          )
            return Effect.die("Missing policy DTO");
          rawPolicy = body.rawPolicy;
          writes++;
          return Effect.succeed({ id: "process", status: "FINISHED" });
        }
        return Effect.succeed({ rawPolicy });
      }
      return f.http.request(method, path, body);
    },
  } as unknown as Http;
  expect(await run(c, http, (p) => p.diff({ olds: props, news: props, output }))).toEqual({
    action: "update",
  });
  expect(writes).toBe(0);
  const attrs = await run(c, http, (p) =>
    p.reconcile({ news: props, output, session: { note: () => Effect.void } }),
  );
  expect(writes).toBe(1);
  expect(attrs.rawPolicy).toBe(props.rawPolicy);
});

for (const c of cases.filter((c) => c.name.includes("variable"))) {
  test(`${c.name} repairs remote key rename by saved ID instead of orphaning the owned row`, async () => {
    const f = fixture(c.name, "none");
    let renamed = true;
    const http = {
      request: (method: Parameters<Http["request"]>[0], path: string, body?: unknown) => {
        if (method === "PUT") renamed = false;
        return f.http.request(method, path, body).pipe(
          Effect.map((value) => {
            if (method === "GET" && (path === "/project-env/row" || path === "/user-data/row")) {
              return { ...(value as VariableRow), key: renamed ? "EXTERNAL" : "FOO" };
            }
            return value;
          }),
        );
      },
    } as unknown as Http;
    expect(
      await run(c, http, (p) => p.diff({ olds: c.props, news: c.props, output: saved })),
    ).toEqual({ action: "update" });
    const attrs = await run(c, http, (p) =>
      p.reconcile({ news: c.props, output: saved, session: { note: () => Effect.void } }),
    );
    expect(attrs.key).toBe("FOO");
    expect(f.writes).toEqual([
      c.name.startsWith("project") ? "PUT /project-env/row" : "PUT /user-data/row",
    ]);
  });
  test(`${c.name} masked content retains its last-known digest without claiming secret drift`, async () => {
    const f = fixture(c.name, "none");
    const http = {
      request: (method: Parameters<Http["request"]>[0], path: string, body?: unknown) =>
        f.http.request(method, path, body).pipe(
          Effect.map((value) => {
            if (path === "/project-env/row" || path === "/user-data/row")
              return { ...(value as VariableRow), content: "REDACTED" };
            return value;
          }),
        ),
    } as unknown as Http;
    const diff = await run(c, http, (p) => p.diff({ olds: c.props, news: c.props, output: saved }));
    expect(diff?.action ?? "noop").toBe("noop");
    expect(f.writes).toEqual([]);
  });
}
