import { test, expect } from "bun:test";
import * as Effect from "effect/Effect";
import { ResourceContext } from "alchemy/ResourceContext";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import {
  serviceDiff,
  serviceNeedsReplace,
  serviceAttributes,
  existingService,
  ensureServiceType,
  ServiceProvider,
} from "../../src/ServiceProvider.ts";
import { Service, type ServiceProps, type ServiceAttributes } from "../../src/Service.ts";
import {
  deployIdentity,
  selectDeployYaml,
  deploymentIsCurrent,
  deployService,
  withinDeployDeadline,
} from "../../src/internal/Deploy.ts";
import { redactDeployLog } from "../../src/internal/DeployLog.ts";
import { makeHttp, ZeropsClient, type Http } from "../../src/client/Http.ts";
import type { ServiceStackRecord } from "../../src/client/operations/ServiceStack.ts";
import { appVersionOperations } from "../../src/client/operations/AppVersion.ts";
import * as Redacted from "effect/Redacted";
import { generatedHostname, validateHostname } from "../../src/internal/Names.ts";
import { inspectSource } from "../../src/source/Source.ts";
import { envDigest } from "../../src/internal/Environment.ts";

const props: ServiceProps = { project: "p", hostname: "app", type: "nodejs@22" };
const output: ServiceAttributes = {
  serviceId: "s",
  projectId: "p",
  hostname: "app",
  type: "nodejs@22",
  status: "ACTIVE",
  envDigests: {},
  appVersionId: "v",
  activeAppVersionId: "v",
  autoscaling: null,
};
test("service replacement fields and explicit hostname collision", async () => {
  for (const change of [
    { project: "other" },
    { hostname: "other" },
    { type: "nodejs@24" },
    { mode: "HA" as const },
    { envIsolation: "none" },
    { sshIsolation: "none" },
    { startWithoutCode: true },
  ])
    expect(serviceNeedsReplace(props, { ...props, ...change })).toBe(true);
  expect(serviceNeedsReplace(props, { ...props, type: "ubuntu/nodejs@22" })).toBe(false);
  expect(
    serviceNeedsReplace(props, {
      ...props,
      mode: "NON_HA",
      startWithoutCode: false,
    }),
  ).toBe(false);
  expect(serviceNeedsReplace(props, { ...props, state: "stopped", subdomain: true })).toBe(false);
  expect(
    await Effect.runPromise(serviceDiff(props, { ...props, type: "nodejs@24" }, output)),
  ).toEqual({ action: "replace", deleteFirst: true });
  expect(await Effect.runPromise(serviceDiff(props, { ...props, project: "q" }, output))).toEqual({
    action: "replace",
    deleteFirst: false,
  });
  expect(
    await Effect.runPromise(serviceDiff({ ...props, hostname: undefined }, props, output)),
  ).toEqual({ action: "replace", deleteFirst: true });
});
test("hostnames are validated and instance-derived", () => {
  for (const name of ["app-test", "core", "l7httpbalancer", "UPPER", "1app", "a".repeat(41)])
    expect(() => validateHostname(name)).toThrow();
  expect(validateHostname("app3000")).toBe("app3000");
  const name = generatedHostname("123 App with a very long logical name".repeat(3), "instance1");
  expect(name.length).toBeLessThanOrEqual(40);
  expect(validateHostname(name)).toBe(name);
  expect(generatedHostname("App", "instance1")).not.toBe(generatedHostname("App", "instance2"));
});
test("directory identity changes on content, YAML, setup, build or redeploy", async () => {
  const dir = await mkdtemp(resolve(tmpdir(), "service-unit-"));
  try {
    await writeFile(resolve(dir, "app.js"), "hello");
    const news = {
      ...props,
      source: { dir },
      env: { DATABASE_URL: "${db_connectionString}", GREETING: "hi" },
    };
    const candidate = await Effect.runPromise(inspectSource(news.source));
    const saved = { ...output, ...deployIdentity(news, "app", candidate) };
    expect(await Effect.runPromise(serviceDiff(news, news, saved))).toBeUndefined();
    for (const change of [
      { redeploy: "again" },
      { build: false },
      { setup: "other" },
      { zeropsYaml: "changed" },
    ])
      expect(await Effect.runPromise(serviceDiff(news, { ...news, ...change }, saved))).toEqual({
        action: "update",
      });
    await writeFile(resolve(dir, "app.js"), "changed");
    expect(await Effect.runPromise(serviceDiff(news, news, saved))).toEqual({ action: "update" });
    expect(await Effect.runPromise(serviceDiff(news, props, saved))).toBeUndefined();
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test("git exact commit is part of deployment identity", () => {
  const a = deployIdentity(props, "app", { gitCommit: "a".repeat(40) });
  const b = deployIdentity(props, "app", { gitCommit: "b".repeat(40) });
  expect(a.gitCommit).toBe("a".repeat(40));
  expect(a.sourceHash).not.toBe(b.sourceHash);
});
test("YAML override takes precedence and setup is required", async () => {
  const embedded = "zerops:\n  - setup: app\n";
  const explicit = "zerops:\n  - setup: override\n";
  expect(await Effect.runPromise(selectDeployYaml(undefined, embedded, "app"))).toBe(embedded);
  expect(await Effect.runPromise(selectDeployYaml(explicit, embedded, "override"))).toBe(explicit);
  await expect(Effect.runPromise(selectDeployYaml(undefined, undefined, "app"))).rejects.toThrow();
  await expect(Effect.runPromise(selectDeployYaml(explicit, embedded, "app"))).rejects.toThrow();
});
test("deploy diagnostics are bounded and scrub known values, tokens and signed URLs", () => {
  const safe = redactDeployLog(
    "hello PRIVATE\nhttps://host/upload?token=abc\n" +
      "Bearer xyz\nPASSWORD=supersecret\naccessToken: abc",
    ["PRIVATE"],
  );
  for (const value of ["PRIVATE", "https://", "xyz", "supersecret", "abc"])
    expect(safe).not.toContain(value);
  expect(redactDeployLog("x".repeat(20000)).length).toBeLessThanOrEqual(8000);
});
test("unresolved source inputs do not inspect source or request replacement", async () => {
  const unresolved = {
    ...props,
    source: { dir: Effect.succeed("not-evaluated") as unknown as string },
    type: "nodejs@24",
  };
  expect(await Effect.runPromise(serviceDiff(props, unresolved, output))).toBeUndefined();
});
test("read shape preserves deployment witness while reporting active code drift", () => {
  const remote = {
    id: "s",
    projectId: "p",
    name: "app",
    base: "ubuntu/nodejs@22",
    status: "ACTIVE",
    activeAppVersion: { id: "external" },
    lastUpdate: "volatile",
  } as ServiceStackRecord;
  const previous = {
    ...output,
    sourceHash: "saved",
    gitCommit: "a".repeat(40),
    envDigests: { GREETING: "digest" },
  };
  const observed = serviceAttributes(remote, previous);
  expect(observed).toEqual({
    ...previous,
    activeAppVersionId: "external",
    subdomainUrls: undefined,
    mode: "NON_HA",
  });
  expect(observed).not.toHaveProperty("lastUpdate");
  expect(
    deploymentIsCurrent({ sourceHash: "saved", gitCommit: previous.gitCommit }, observed),
  ).toBe(false);
  expect(
    deploymentIsCurrent(
      { sourceHash: "saved", gitCommit: previous.gitCommit },
      { ...observed, activeAppVersionId: "v" },
    ),
  ).toBe(true);
});
test("entity-specific missing service becomes absent for the recreation branch", async () => {
  const mock = (code: string) =>
    makeHttp({
      endpoint: "https://unit.invalid",
      token: Redacted.make("unit-only"),
      fetch: (async () => Response.json({ code }, { status: 400 })) as unknown as typeof fetch,
    });
  expect(
    await Effect.runPromise(existingService(mock("serviceStackNotFound"), "s")),
  ).toBeUndefined();
  await expect(Effect.runPromise(existingService(mock("projectNotFound"), "s"))).rejects.toThrow();
});
test("adoption rejects a different canonical type before configuration mutation", async () => {
  await expect(Effect.runPromise(ensureServiceType({ base: "nodejs@24" }, props))).rejects.toThrow(
    "different canonical type",
  );
  await Effect.runPromise(ensureServiceType({ base: "ubuntu/nodejs@22" }, props));
  // Real deployed E2E record: base changes to alpine/nodejs@22 after YAML deployment.
  await Effect.runPromise(ensureServiceType({ base: "alpine/nodejs@22" }, props));
});
test("removing source never deploys even when the live active version differs", async () => {
  const previous = { sourceHash: "saved", appVersionId: "ours", activeAppVersionId: "external" };
  expect(
    await Effect.runPromise(
      deployService({} as Http, {
        serviceId: "s",
        projectId: "p",
        hostname: "app",
        props: {},
        previous,
        options: { deadline: 0 },
      }),
    ),
  ).toEqual(previous);
});
test("reconcile recreates a disappeared saved ID without stale deployment or env ownership", async () => {
  let creates = 0;
  const fresh = {
    id: "fresh",
    projectId: "p",
    name: "app",
    base: "nodejs@22",
    status: "ACTIVE",
    subdomainAccess: false,
  };
  const http = makeHttp({
    endpoint: "https://unit.invalid",
    token: Redacted.make("unit-only"),
    fetch: (async (input: string | URL | Request, init?: RequestInit) => {
      const path = new URL(String(input)).pathname.replace("/api/rest/public", "");
      if (path === "/service-stack/s")
        return Response.json({ code: "serviceStackNotFound" }, { status: 400 });
      if (path === "/project/p/service-stack" && init?.method === "POST") {
        creates++;
        return Response.json(fresh);
      }
      if (path === "/service-stack/fresh") return Response.json(fresh);
      if (path === "/service-stack/fresh/process") return Response.json({ list: [] });
      if (path === "/service-stack/fresh/env") return Response.json({ items: [] });
      throw new Error("Unexpected unit request: " + path);
    }) as typeof fetch,
  });
  const result = await Effect.runPromise(
    Effect.gen(function* () {
      const provider = yield* Service.Provider;
      return yield* provider.reconcile({
        id: "App",
        fqn: "App",
        instanceId: "instance",
        news: props,
        olds: props,
        output: { ...output, sourceHash: "stale", envDigests: { STALE: "digest" } },
        bindings: [],
        session: { note: () => Effect.void } as unknown as Parameters<
          typeof provider.reconcile
        >[0]["session"],
      });
    }).pipe(
      Effect.provide(ServiceProvider()),
      Effect.provideService(ZeropsClient, http),
      Effect.provideService(ResourceContext, {
        logicalId: "App",
        fqn: "App",
        instanceId: "instance",
        type: "Zerops.Service",
      }),
    ),
  );
  expect(creates).toBe(1);
  expect(result.serviceId).toBe("fresh");
  expect(result.sourceHash).toBeUndefined();
  expect(result.appVersionId).toBeUndefined();
  expect(result.envDigests).toEqual({});
});
test("log access uses its own token and noisy runtime cannot discard the build failure", async () => {
  const http = makeHttp({
    endpoint: "https://unit.invalid",
    token: Redacted.make("api-only"),
    fetch: (async (input: string | URL | Request, init?: RequestInit) => {
      const url = new URL(String(input));
      if (url.pathname === "/api/rest/public/project/p/log")
        return Response.json({
          urlPlain: "https://logs.unit.invalid/plain",
          accessToken: "log-only",
        });
      expect(new Headers(init?.headers).get("Authorization")).toBe("Bearer log-only");
      expect(url.searchParams.get("limit")).toBe("100");
      return new Response(
        url.searchParams.has("tags")
          ? "ALCHEMY_EXPECTED_BUILD_FAILURE"
          : Array.from({ length: 150 }, (_, i) => "runtime " + i).join("\n"),
      );
    }) as typeof fetch,
  });
  const log = await Effect.runPromise(appVersionOperations(http).logTail("p", "s", "a"));
  expect(log).toContain("ALCHEMY_EXPECTED_BUILD_FAILURE");
  expect(log.split("\n").length).toBeLessThanOrEqual(75);
  expect(log).not.toContain("log-only");
  expect(log).not.toContain("api-only");
});

const runRead = (http: Http, olds: ServiceProps, saved?: ServiceAttributes) =>
  Effect.runPromise(
    Effect.gen(function* () {
      const provider = yield* Service.Provider;
      return yield* provider.read!({
        id: "App",
        fqn: "App",
        instanceId: "instance",
        olds,
        output: saved,
      });
    }).pipe(
      Effect.provide(ServiceProvider()),
      Effect.provideService(ZeropsClient, http),
      Effect.provideService(ResourceContext, {
        logicalId: "App",
        fqn: "App",
        instanceId: "instance",
        type: "Zerops.Service",
      }),
    ),
  );
test("recovery read skips missing and unresolved parent inputs without network", async () => {
  expect(await runRead({} as Http, {} as ServiceProps)).toBeUndefined();
  expect(
    await runRead({} as Http, {
      ...props,
      project: Effect.succeed("p") as unknown as string,
    }),
  ).toBeUndefined();
});
test("saved-ID read observes configured scaling and visible owned env drift", async () => {
  const scaling = { verticalAutoscaling: { maxResource: { memoryGBytes: 4 } } };
  const http = makeHttp({
    endpoint: "https://unit.invalid",
    token: Redacted.make("unit-only"),
    fetch: (async (input: string | URL | Request) => {
      const path = new URL(String(input)).pathname;
      if (path.endsWith("/env"))
        return Response.json({
          items: [
            { key: "VISIBLE", content: "changed" },
            { key: "MASKED", content: "REDACTED" },
            { key: "FOREIGN", content: "ignored" },
          ],
        });
      return Response.json({
        id: "s",
        projectId: "p",
        name: "app",
        base: "alpine/nodejs@22",
        status: "ACTIVE",
        customAutoscaling: scaling,
        subdomainAccess: false,
        activeAppVersion: { id: "external" },
      });
    }) as typeof fetch,
  });
  const observed = await runRead(http, {} as ServiceProps, {
    ...output,
    envDigests: { VISIBLE: "old", MASKED: "saved", DELETED: "old" },
  });
  expect(observed?.autoscaling).toEqual(scaling);
  expect(observed?.envDigests).toEqual({ VISIBLE: envDigest("changed")!, MASKED: "saved" });
  expect(observed?.appVersionId).toBe("v");
  expect(observed?.activeAppVersionId).toBe("external");
});

test("embedded YAML selection and an explicit empty override have distinct identities", async () => {
  const embedded = deployIdentity({}, "app", { contentDigest: "content" });
  const explicit = deployIdentity({ zeropsYaml: "" }, "app", { contentDigest: "content" });
  expect(embedded.sourceHash).not.toBe(explicit.sourceHash);
  await expect(
    Effect.runPromise(selectDeployYaml("", "zerops:\n  - setup: app\n", "app")),
  ).rejects.toThrow();
});
test("an expired deployment deadline prevents all work", async () => {
  let mutations = 0;
  const mutation = Effect.sync(() => {
    mutations++;
  });
  await expect(
    Effect.runPromise(mutation.pipe(withinDeployDeadline(Date.now() - 1))),
  ).rejects.toThrow("deadline");
  expect(mutations).toBe(0);
});
test("deployment deadline interrupts source-style promises through their AbortSignal", async () => {
  let aborted = false;
  const stalled = Effect.tryPromise({
    try: (signal) => {
      const { promise, reject } = Promise.withResolvers<void>();
      signal.addEventListener(
        "abort",
        () => {
          aborted = true;
          reject(new Error("interrupted"));
        },
        { once: true },
      );
      return promise;
    },
    catch: () => new Error("source interrupted"),
  });
  await expect(
    Effect.runPromise(stalled.pipe(withinDeployDeadline(Date.now() + 30))),
  ).rejects.toThrow("deadline");
  expect(aborted).toBe(true);
});
test("a stalled upload is aborted and cannot trigger a remote build after the deadline", async () => {
  const dir = await mkdtemp(resolve(tmpdir(), "service-upload-unit-"));
  let aborted = false;
  let builds = 0;
  const http = makeHttp({
    endpoint: "https://unit.invalid",
    token: Redacted.make("unit-only"),
    fetch: (async (input: string | URL | Request, init?: RequestInit) => {
      const url = new URL(String(input));
      if (url.pathname.endsWith("/app-version"))
        return Response.json({
          id: "version",
          status: "UPLOADING",
          uploadUrl: "https://upload.unit.invalid/source",
        });
      if (url.hostname === "upload.unit.invalid") {
        const { promise, reject } = Promise.withResolvers<Response>();
        init?.signal?.addEventListener(
          "abort",
          () => {
            aborted = true;
            reject(new Error("upload interrupted"));
          },
          { once: true },
        );
        return promise;
      }
      if (url.pathname.endsWith("/build-and-deploy")) builds++;
      throw new Error("Unexpected request");
    }) as typeof fetch,
  });
  try {
    await writeFile(resolve(dir, "server.js"), "hello");
    await expect(
      Effect.runPromise(
        deployService(http, {
          serviceId: "s",
          projectId: "p",
          hostname: "app",
          props: { source: { dir }, zeropsYaml: "zerops:\n  - setup: app\n" },
          options: { deadline: Date.now() + 100 },
        }),
      ),
    ).rejects.toThrow("deadline");
    expect(aborted).toBe(true);
    expect(builds).toBe(0);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test("complete multiline secrets are redacted before every log-tail boundary", async () => {
  const lineSecret = "LINE_SECRET_PREFIX\nLINE_SECRET_SUFFIX";
  const charSecret = "CHAR_SECRET_PREFIX\n" + "s".repeat(13000) + "\nCHAR_SECRET_SUFFIX";
  const charLog = charSecret;
  const http = makeHttp({
    endpoint: "https://unit.invalid",
    token: Redacted.make("unit-only"),
    fetch: (async (input: string | URL | Request) => {
      const url = new URL(String(input));
      if (url.pathname.endsWith("/log"))
        return Response.json({
          urlPlain: "https://logs.unit.invalid/plain",
          accessToken: "log-token",
        });
      const lines = lineSecret + "\n" + Array.from({ length: 49 }, () => "line").join("\n");
      return new Response(url.searchParams.has("tags") ? lines : charLog);
    }) as typeof fetch,
  });
  const log = await Effect.runPromise(
    appVersionOperations(http).logTail("p", "s", "a", [lineSecret, charSecret]),
  );
  const diagnostic = redactDeployLog(log, [lineSecret, charSecret]);
  for (const fragment of [
    "LINE_SECRET_PREFIX",
    "LINE_SECRET_SUFFIX",
    "CHAR_SECRET_PREFIX",
    "CHAR_SECRET_SUFFIX",
  ])
    expect(diagnostic).not.toContain(fragment);
});
