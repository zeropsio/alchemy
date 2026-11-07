import { afterEach, beforeEach, describe, expect, spyOn, test } from "bun:test";
import { chmodSync, mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createGuardFromEnv } from "../support/guard.ts";
import {
  alchemyProjects,
  alchemyProjectIntents,
  readLedger,
  recordProject,
  recordProjectIntent,
} from "../support/ledger.ts";
import { sweep } from "../../scripts/sweep.ts";
import type { ZeropsRequestInfo } from "../../src/client/RequestGuard.ts";
import { createLiveApi, liveAbsent, LiveApi5xx, rawProjectAbsent } from "../live/harness.ts";

const PROD = "https://api.app-prg1.zerops.io";
// Synthetic fixture identity and reserved test hosts, never a real organization or endpoint.
const ORG = "fixture-organization";
const DEV = "https://api.dev.example.test";
let dir: string, ledger: string;
let saved: NodeJS.ProcessEnv;
const request = (method: string, path: string, body?: unknown): ZeropsRequestInfo => ({
  method,
  url: new URL(`${process.env.ZEROPS_ENDPOINT}/api/rest/public${path}`),
  kind: "api",
  body,
});
function prod(): void {
  process.env.ZEROPS_TARGET = "prod";
  process.env.ZEROPS_ENDPOINT = PROD;
}
function fetching(fn: (...args: Parameters<typeof fetch>) => Promise<Response>): typeof fetch {
  return Object.assign(fn, { preconnect: globalThis.fetch.preconnect });
}
/** Resolves to the guard's refusal; a successful guard call fails the test. */
function rejection(result: void | Promise<void>): Promise<Error & Record<string, unknown>> {
  return Promise.resolve(result).then(
    () => {
      throw new Error("expected the guard to refuse");
    },
    (error: unknown) => error as Error & Record<string, unknown>,
  );
}
function mockLookup(objects: Record<string, unknown> = {}, membership = true) {
  return spyOn(globalThis, "fetch").mockImplementation(
    fetching(async (input, init) => {
      const url = new URL(String(input));
      expect(init?.redirect).toBe("error");
      expect(new Headers(init?.headers).get("Authorization")).toBe("Bearer test-private-token");
      expect(url.origin).toBe(process.env.ZEROPS_ENDPOINT!);
      const path = url.pathname.replace("/api/rest/public", "");
      if (path === "/user/client-list")
        return Response.json({
          list: membership
            ? [{ id: "membership-not-org", clientId: ORG, client: { id: ORG } }]
            : [],
          total: membership ? 1 : 0,
        });
      if (path in objects) return Response.json(objects[path]);
      return Response.json({ clientId: ORG, name: "alchtest-owned" });
    }),
  );
}
beforeEach(() => {
  saved = { ...process.env };
  dir = mkdtempSync(join(tmpdir(), "alchemy-guard-test-"));
  ledger = join(dir, "ledger");
  Object.assign(process.env, {
    ZEROPS_TARGET: "dev",
    ZEROPS_ENDPOINT: DEV,
    ZEROPS_DEV_DOMAIN: "dev.example.test",
    ZEROPS_TOKEN: "test-private-token",
    ZEROPS_ORGANIZATION_ID: ORG,
    ZEROPS_CI_ORGANIZATION_ID: ORG,
    ZEROPS_PROD_LEDGER: ledger,
    ZEROPS_DEV_LEDGER: ledger,
    ZEROPS_RUN_LOCK: join(dir, "run.lock"),
  });
});
afterEach(() => {
  for (const key of Object.keys(process.env)) if (!(key in saved)) delete process.env[key];
  Object.assign(process.env, saved);
  spyOn(globalThis, "fetch").mockRestore();
  rmSync(dir, { recursive: true, force: true });
});

describe("production CI cleanup", () => {
  test("requires a nonempty matching organization pin", () => {
    prod();
    delete process.env.ZEROPS_CI_ORGANIZATION_ID;
    expect(createGuardFromEnv).toThrow("pinned organization");
    process.env.ZEROPS_CI_ORGANIZATION_ID = "different-org";
    expect(createGuardFromEnv).toThrow("pinned organization");
    process.env.ZEROPS_CI_ORGANIZATION_ID = ORG;
    expect(createGuardFromEnv()).toBeDefined();
  });

  for (const leftovers of [false, true]) {
    test(`discovers only alchtest- IDs and checks final inventory (leftovers=${leftovers})`, async () => {
      prod();
      process.env.ZEROPS_CI_CLEANUP = "1";
      const rows = [
        { id: "old", clientId: ORG, name: "alchtest-prior-run" },
        { id: "personal", clientId: ORG, name: "personal-project" },
        { id: "family", clientId: ORG, name: "alchfam-local" },
      ];
      let deleted = false;
      const mutations: string[] = [];
      spyOn(globalThis, "fetch").mockImplementation(fetching(async (input, init) => {
        const url = new URL(String(input));
        const path = url.pathname.replace("/api/rest/public", "");
        if (init?.method === "DELETE") {
          mutations.push(path);
          expect(alchemyProjects(ledger).has("old")).toBe(true);
          deleted = true;
          return Response.json({ id: "delete-process" });
        }
        if (path === "/user/client-list")
          return Response.json({ list: [{ clientId: ORG }], total: 1 });
        if (path === `/client/${ORG}/project`) {
          const current = deleted && !leftovers ? rows.slice(1) : rows;
          const offset = Number(url.searchParams.get("offset"));
          return Response.json({ list: current.slice(offset, offset + 1), total: current.length });
        }
        if (path === "/process/delete-process") return Response.json({ status: "FINISHED" });
        if (path === "/project/old")
          return deleted
            ? Response.json({ error: { code: "projectNotFound" } }, { status: 400 })
            : Response.json(rows[0]);
        throw new Error("unexpected cleanup request");
      }));
      const output = spyOn(console, "log").mockImplementation(() => {});
      try {
        const result = sweep(["--all", "--prefix", "alchtest-", "--yes", "--assert-empty"]);
        if (leftovers) await expect(result).rejects.toThrow("leftovers");
        else await result;
        expect(mutations).toEqual(["/project/old"]);
        expect([...alchemyProjects(ledger).keys()]).toEqual(["old"]);
      } finally {
        output.mockRestore();
      }
    });
  }

  test("refuses foreign-organization inventory without recording ownership", async () => {
    prod();
    process.env.ZEROPS_CI_CLEANUP = "1";
    mockLookup({
      [`/client/${ORG}/project`]: {
        list: [{ id: "foreign", clientId: "other-org", name: "alchtest-foreign" }],
        total: 1,
      },
    });
    await expect(sweep(["--all", "--prefix", "alchtest-", "--yes", "--assert-empty"]))
      .rejects.toThrow("foreign organization");
    expect(alchemyProjects(ledger).size).toBe(0);
  });

  test("refuses broad CI cleanup selectors", async () => {
    prod();
    process.env.ZEROPS_CI_CLEANUP = "1";
    await expect(sweep(["--all", "--yes"])).rejects.toThrow("--prefix alchtest-");
    await expect(sweep(["--all", "--prefix", "alchfam-", "--yes"]))
      .rejects.toThrow("--prefix alchtest-");
  });

  test("refuses shared IPv4 allocation and project requests", async () => {
    prod();
    mockLookup();
    const guard = createGuardFromEnv();
    await expect(guard.before(request("PUT", "/project/p/public-ipv4-shared", {})))
      .rejects.toThrow("IPv4");
    await expect(guard.before(request("POST", `/client/${ORG}/project`,
      { name: "alchtest-ipv4", publicIpV4Shared: true }))).rejects.toThrow("IPv4");
  });
});

describe("target and host boundaries", () => {
  for (const endpoint of [
    PROD,
    "http://api.dev.example.test",
    `${DEV}/`,
    `${DEV}/path`,
    `${DEV}?private-signature`,
    "https://secret@api.dev.example.test",
    "https://evildev.example.test",
    "https://api.dev.example.test.evil",
  ]) {
    test(`refuses development endpoint ${endpoint.replace("private-signature", "redacted")}`, () => {
      process.env.ZEROPS_ENDPOINT = endpoint;
      expect(createGuardFromEnv).toThrow();
    });
  }
  for (const domain of [
    "",
    "test",
    "api.app-prg1.zerops.io",
    "https://dev.example.test",
    ".dev.example.test",
    "dev..example.test",
    "dev.example.test.",
    "-dev.example.test",
  ])
    test(`refuses domain ${domain}`, () => {
      process.env.ZEROPS_DEV_DOMAIN = domain;
      expect(createGuardFromEnv).toThrow();
    });
  test("defaults to dev, rejects unknown target and missing credentials", () => {
    delete process.env.ZEROPS_TARGET;
    expect(createGuardFromEnv()).toBeDefined();
    process.env.ZEROPS_TARGET = "production";
    expect(createGuardFromEnv).toThrow();
    process.env.ZEROPS_TARGET = "dev";
    delete process.env.ZEROPS_TOKEN;
    expect(createGuardFromEnv).toThrow();
  });
  test("development requires an explicit absolute ledger path", () => {
    delete process.env.ZEROPS_DEV_LEDGER;
    expect(createGuardFromEnv).toThrow("ZEROPS_DEV_LEDGER must be absolute");
    process.env.ZEROPS_DEV_LEDGER = "relative-ledger";
    expect(createGuardFromEnv).toThrow("ZEROPS_DEV_LEDGER must be absolute");
    process.env.ZEROPS_DEV_LEDGER = ledger;
    expect(createGuardFromEnv()).toBeDefined();
  });
  test("production requires exact origin and explicitly allowed organization", () => {
    prod();
    for (const endpoint of [DEV, `${PROD}/`, `${PROD}:443`, `${PROD}.evil`, `${PROD}?`]) {
      process.env.ZEROPS_ENDPOINT = endpoint;
      expect(createGuardFromEnv).toThrow();
    }
    process.env.ZEROPS_ENDPOINT = PROD;
    process.env.ZEROPS_ORGANIZATION_ID = "foreign";
    expect(createGuardFromEnv).toThrow();
  });
  test("upload and log allowlists never expose signed URLs", async () => {
    const fetch = mockLookup({ "/service-stack/s": { projectId: "p" } });
    const guard = createGuardFromEnv();
    const version = request("POST", "/service-stack/s/app-version", { name: "build" });
    await guard.before(version);
    guard.after!(version, {
      status: 200,
      body: { id: "v", uploadUrl: "https://proxy.dev.example.test/upload?private-signature" },
    });
    const logs = request("GET", "/project/p/log");
    await guard.before(logs);
    guard.after!(logs, {
      status: 200,
      body: { urlPlain: "https://proxy.dev.example.test/upload?private-signature" },
    });
    for (const kind of ["upload", "log"] as const) {
      await guard.before({
        method: kind === "upload" ? "PUT" : "GET",
        kind,
        url: new URL("https://proxy.dev.example.test/upload?private-signature"),
      });
      for (const host of [
        "proxy.app-prg1.zerops.io",
        "proxy.dev.example.test.evil",
        "evildev.example.test",
      ]) {
        try {
          await guard.before({
            method: "PUT",
            kind,
            url: new URL(`https://${host}/upload?private-signature`),
          });
          throw new Error("accepted");
        } catch (error) {
          expect(String(error)).not.toContain("private-signature");
          expect(String(error)).not.toContain("/upload");
        }
      }
    }
    prod();
    recordProject(ledger, "p", "alchtest-owned");
    fetch.mockRestore();
    mockLookup({ "/service-stack/s": { projectId: "p" } });
    const production = createGuardFromEnv();
    const productionVersion = request("POST", "/service-stack/s/app-version", { name: "build" });
    await production.before(productionVersion);
    production.after!(productionVersion, {
      status: 200,
      body: { id: "v", uploadUrl: "https://proxy.app-prg1.zerops.io/upload?private-signature" },
    });
    await production.before({
      method: "PUT",
      kind: "upload",
      url: new URL("https://proxy.app-prg1.zerops.io/upload?private-signature"),
    });
    await expect(
      production.before({
        method: "PUT",
        kind: "upload",
        url: new URL("https://proxy.app-prg1.zerops.io:8443/upload?private-signature"),
      }),
    ).rejects.toThrow("host");
  });
});

describe("ledger safety", () => {
  test("records source alchemy and reads interoperable five-field TSV", () => {
    recordProject(ledger, "p", "alchtest-created");
    expect(readLedger(ledger)[0]).toMatchObject({
      kind: "project",
      id: "p",
      name: "alchtest-created",
      source: "alchemy",
    });
    expect(alchemyProjects(ledger).has("p")).toBe(true);
  });
  test("refuses relative paths, symlinks, directories, unsafe modes and malformed records", () => {
    expect(() => readLedger("relative")).toThrow("absolute");
    recordProject(ledger, "p", "alchtest-created");
    symlinkSync(ledger, join(dir, "link"));
    expect(() => readLedger(join(dir, "link"))).toThrow();
    expect(() => readLedger(dir)).toThrow();
    chmodSync(ledger, 0o644);
    expect(() => readLedger(ledger)).toThrow("0600");
    chmodSync(ledger, 0o600);
    for (const line of [
      "not TSV",
      "bad\tproject\tp\talchtest-x\talchemy\n",
      "2026-10-26T00:00:00Z\tunknown\tp\tx\talchemy\n",
    ]) {
      writeFileSync(ledger, line);
      expect(() => readLedger(ledger)).toThrow("invalid");
    }
  });
  test("foreign sources never confer ownership and later source wins", () => {
    writeFileSync(ledger, "2026-10-26T00:00:00Z\tproject\tp\talchtest-created\tprovider\n", {
      mode: 0o600,
    });
    expect(alchemyProjects(ledger).has("p")).toBe(false);
    expect(() => recordProject(ledger, "p\n", "alchtest-created")).toThrow();
    expect(() => recordProject(ledger, "p", "alchprobe-created")).toThrow();
  });
});

describe("ownership and route policy", () => {
  test("membership is resolved once, never accepts membership ID as org", async () => {
    prod();
    const fetch = mockLookup();
    const guard = createGuardFromEnv();
    await guard.before(request("GET", `/client/${ORG}/project`));
    await guard.before(request("GET", `/client/${ORG}/project?offset=1`));
    expect(fetch).toHaveBeenCalledTimes(1);
    fetch.mockRestore();
    mockLookup({}, false);
    await expect(
      createGuardFromEnv().before(request("GET", `/client/${ORG}/project`)),
    ).rejects.toThrow("membership");
  });
  for (const method of ["GET", "HEAD", "PUT"])
    test(`refuses foreign organization ${method}`, async () => {
      await expect(
        createGuardFromEnv().before(request(method, "/client/foreign/project")),
      ).rejects.toThrow("foreign");
    });
  test("project creation prefix and default-denied mutation routes", async () => {
    const guard = createGuardFromEnv();
    for (const name of [undefined, "important", "alchprobe-probe", "alchtest-bad\n"])
      await expect(
        guard.before(request("POST", `/client/${ORG}/project`, { name })),
      ).rejects.toThrow("prefix");
    await guard.before(request("POST", `/client/${ORG}/project`, { name: "alchtest-created" }));
    for (const path of [
      "/user/settings",
      `/client/${ORG}/integration-token`,
      "/project/p/future-action",
      `/client/${ORG}/project/import`,
    ])
      await expect(guard.before(request("POST", path, {}))).rejects.toThrow("allowlisted");
  });
  test("noncanonical paths and mutation queries are refused", async () => {
    const guard = createGuardFromEnv();
    for (const path of [
      "/project/p?x=1",
      "/project/p?",
      "/project/p/",
      "/project//p",
      "/project/p%2Faction",
      "/project/%70",
    ])
      await expect(guard.before(request("DELETE", path))).rejects.toThrow();
  });
  for (const [org, name, recorded, source, ok] of [
    [ORG, "alchtest-owned", true, "alchemy", true],
    [ORG, "alchtest-owned", false, "alchemy", false],
    ["foreign", "alchtest-owned", true, "alchemy", false],
    [ORG, "important", true, "alchemy", false],
    [ORG, "alchtest-owned", true, "provider", false],
  ] as const) {
    test(`production ownership ${org} ${name} ${recorded} ${source}`, async () => {
      prod();
      if (recorded)
        writeFileSync(ledger, `2026-10-26T00:00:00Z\tproject\tp\talchtest-owned\t${source}\n`, {
          mode: 0o600,
        });
      mockLookup({ "/project/p": { clientId: org, name } });
      const operation = createGuardFromEnv().before(request("DELETE", "/project/p"));
      if (ok) await operation;
      else await expect(operation).rejects.toThrow();
    });
  }
  test("production never owns alchfam- (development family) projects or intents", async () => {
    prod();
    writeFileSync(
      ledger,
      "2026-10-26T00:00:00Z\tnote\talchfam-x\tproject-create-intent\talchemy\n" +
        "2026-10-26T00:00:00Z\tproject\tp\talchfam-x\talchemy\n",
      { mode: 0o600 },
    );
    expect(alchemyProjects(ledger).size).toBe(0);
    expect(alchemyProjectIntents(ledger).size).toBe(0);
    mockLookup({ "/project/p": { clientId: ORG, name: "alchfam-x" } });
    const guard = createGuardFromEnv();
    await expect(guard.before(request("DELETE", "/project/p"))).rejects.toThrow();
    await expect(
      guard.before(request("POST", `/client/${ORG}/project`, { name: "alchfam-x" })),
    ).rejects.toThrow("prefix");
  });
  test("dev requires project prefix but does not require production ledger", async () => {
    const fetch = mockLookup();
    await createGuardFromEnv().before(request("DELETE", "/project/p"));
    expect(fetch).toHaveBeenCalledTimes(1);
    fetch.mockRestore();
    mockLookup({ "/project/p": { clientId: ORG, name: "alchprobe-not-owned" } });
    await expect(createGuardFromEnv().before(request("DELETE", "/project/p"))).rejects.toThrow(
      "ownership",
    );
  });
  for (const kind of [
    "user-data",
    "project-env",
    "public-http-routing",
    "public-port-routing",
    "app-version",
    "service-stack",
  ])
    test(`resolves and caches ${kind} ownership`, async () => {
      const fetch = mockLookup({
        [`/${kind}/o`]: kind === "service-stack" ? { projectId: "p" } : { serviceStackId: "s" },
        "/service-stack/s": { projectId: "p" },
      });
      const guard = createGuardFromEnv();
      const path = `/${kind}/o${kind === "app-version" ? "/deploy" : kind === "service-stack" ? "/restart" : ""}`;
      await guard.before(request("PUT", path, {}));
      const count = fetch.mock.calls.length;
      await guard.before(request("PUT", path, {}));
      expect(fetch.mock.calls.length).toBe(count);
    });
  test("missing ownership, cyclic ownership and lookup failures fail closed", async () => {
    const fetch = mockLookup({ "/user-data/o": {}, "/service-stack/s": { serviceStackId: "s" } });
    const guard = createGuardFromEnv();
    await expect(guard.before(request("DELETE", "/user-data/o"))).rejects.toThrow("ownership");
    await expect(guard.before(request("DELETE", "/service-stack/s"))).rejects.toThrow("cyclic");
    fetch.mockImplementation(
      fetching(async () => {
        throw new Error("test-private-token signed-URL");
      }),
    );
    await expect(guard.before(request("DELETE", "/project/q"))).rejects.toThrow(
      "ZEROPS_5XX GET /project/q status 0",
    );
  });
  test("creation recorder reports created ID loudly if ledger fails", async () => {
    prod();
    const guard = createGuardFromEnv();
    rmSync(ledger);
    mkdirSync(ledger);
    expect(() =>
      guard.after!(request("POST", `/client/${ORG}/project`, { name: "alchtest-created" }), {
        status: 200,
        body: { id: "cleanup-id" },
      }),
    ).toThrow("Created project cleanup-id but ledger recording failed; manual cleanup required");
  });
  test("creation records immediately; unsuccessful responses do not record; redirects refused", () => {
    prod();
    const guard = createGuardFromEnv();
    const req = request("POST", `/client/${ORG}/project`, { name: "alchtest-created" });
    guard.after!(req, { status: 500, body: { id: "not-created" } });
    expect(readLedger(ledger)).toHaveLength(0);
    guard.after!(req, { status: 201, body: { id: "created" } });
    expect(alchemyProjects(ledger).has("created")).toBe(true);
    expect(() => guard.after!(req, { status: 200, body: {} })).toThrow("manual cleanup");
    expect(() => guard.after!(req, { status: 307, body: {} })).toThrow("redirects");
  });
});

describe("production cost policy", () => {
  beforeEach(() => {
    prod();
    recordProject(ledger, "p", "alchtest-owned");
    mockLookup({
      "/service-stack/s": {
        projectId: "p",
        serviceStackTypeInfo: { serviceStackTypeName: "postgresql" },
      },
    });
  });
  for (const body of [
    { mode: "SERIOUS" },
    { custom: { serviceMode: "HA" } },
    { nested: { clientId: "foreign" } },
    { ipType: "IP_V4" },
  ])
    test(`refuses ${JSON.stringify(body)}`, async () => {
      await expect(
        createGuardFromEnv().before(request("PUT", "/project/p", body)),
      ).rejects.toThrow();
    });
  test("dedicated IPv4 endpoints are always denied", async () => {
    for (const path of [
      "/project/p/request-ipv4",
      "/project/p/public-ipv4",
      "/project/p/public-ipv4/add",
    ])
      await expect(createGuardFromEnv().before(request("PUT", path, {}))).rejects.toThrow(
        "allowlisted",
      );
  });
  test("PG create and autoscaling require explicit min disk floor", async () => {
    const guard = createGuardFromEnv();
    for (const disk of [undefined, 0, 1, 1.99, "2"]) {
      const body = {
        name: "db",
        serviceStackVersionName: "postgresql:single@16",
        customAutoscaling: { verticalAutoscaling: { minResource: { diskGBytes: disk } } },
      };
      await expect(guard.before(request("POST", "/project/p/service-stack", body))).rejects.toThrow(
        "disk",
      );
      await expect(
        guard.before(request("PUT", "/service-stack/s/autoscaling", body)),
      ).rejects.toThrow("disk");
    }
    await guard.before(
      request("POST", "/project/p/service-stack", {
        name: "db",
        serviceStackVersionName: "postgresql:single@16",
        customAutoscaling: { verticalAutoscaling: { minResource: { diskGBytes: 2 } } },
      }),
    );
    await guard.before(
      request("PUT", "/service-stack/s/autoscaling", {
        customAutoscaling: { verticalAutoscaling: { minResource: { diskGBytes: 2 } } },
      }),
    );
    await expect(guard.before(request("PUT", "/service-stack/s/autoscaling", {}))).rejects.toThrow(
      "explicit",
    );
  });
  for (const name of ["", " core ", "l7httpbalancer"])
    test(`reserved service ${name}`, async () => {
      await expect(
        createGuardFromEnv().before(request("POST", "/project/p/service-stack", { name })),
      ).rejects.toThrow("reserved");
    });
});

test("sweeper paginates inventory, skips probes, never deletes in dry-run", async () => {
  const calls: string[] = [];
  spyOn(globalThis, "fetch").mockImplementation(
    fetching(async (input, init) => {
      expect(init?.method).toBe("GET");
      expect(init?.redirect).toBe("error");
      const url = new URL(String(input));
      calls.push(url.search);
      return Response.json({
        list:
          url.searchParams.get("offset") === "0"
            ? [{ id: "p", name: "alchtest-inventory", created: "2020-01-01T00:00:00Z" }]
            : [{ id: "q", name: "alchprobe-inventory", created: "2020-01-01T00:00:00Z" }],
        total: 2,
      });
    }),
  );
  const output = spyOn(console, "log").mockImplementation(() => {});
  try {
    await sweep([]);
    expect(calls).toHaveLength(2);
    expect(output.mock.calls).toEqual([
      ["p\talchtest-inventory\tdry-run\twould-delete"],
      ["q\talchprobe-inventory\tskip: not alchtest-\treport-only"],
    ]);
    await expect(sweep(["--yes"])).rejects.toThrow("requires");
    await expect(sweep(["--older-than", "-1"])).rejects.toThrow("nonnegative");
  } finally {
    output.mockRestore();
  }
});

test("reads preserve projectNotFound and reject foreign response organizations", async () => {
  const guard = createGuardFromEnv();
  await guard.before(request("GET", "/project/absent"));
  guard.after!(request("GET", "/project/absent"), {
    status: 400,
    body: { error: { code: "projectNotFound" } },
  });
  expect(() =>
    guard.after!(request("GET", "/project/foreign"), {
      status: 200,
      body: { clientId: "foreign", name: "important" },
    }),
  ).toThrow("foreign");
});

test("production refuses HA catalogue identifiers and default IPv4 route creation", async () => {
  prod();
  recordProject(ledger, "p", "alchtest-owned");
  mockLookup({ "/service-stack/s": { projectId: "p" } });
  const guard = createGuardFromEnv();
  await expect(
    guard.before(
      request("POST", "/project/p/service-stack", {
        name: "db",
        serviceStackVersionName: "postgresql:ha@16",
      }),
    ),
  ).rejects.toThrow("HA");
  await expect(
    guard.before(request("POST", "/service-stack/s/public-port-routing", {})),
  ).rejects.toThrow("IP_V6");
  await expect(
    guard.before(
      request("POST", "/service-stack/s/public-port-routing", { publicIpType: "IP_V4" }),
    ),
  ).rejects.toThrow("IPv4");
  await guard.before(
    request("POST", "/service-stack/s/public-port-routing", { publicIpType: "IP_V6" }),
  );
});

test("sweeper waits deletion and requires exact projectNotFound verification", async () => {
  const methods: string[] = [];
  spyOn(globalThis, "fetch").mockImplementation(
    fetching(async (input, init) => {
      const path = new URL(String(input)).pathname.replace("/api/rest/public", "");
      methods.push(`${init?.method} ${path}`);
      if (path.startsWith("/client/"))
        return Response.json({
          list: [{ id: "p", name: "alchtest-delete", clientId: ORG }],
          total: 1,
        });
      if (init?.method === "DELETE") return Response.json({ id: "proc" });
      if (path === "/process/proc") return Response.json({ status: "FINISHED" });
      if (methods.filter((x) => x === "GET /project/p").length === 1)
        return Response.json({ clientId: ORG, name: "alchtest-delete" });
      return Response.json({ error: { code: "projectNotFound" } }, { status: 400 });
    }),
  );
  const output = spyOn(console, "log").mockImplementation(() => {});
  try {
    await sweep(["--yes", "--all"]);
    expect(methods).toEqual([
      `GET /client/${ORG}/project`,
      "GET /project/p",
      "DELETE /project/p",
      "GET /process/proc",
      "GET /project/p",
    ]);
    expect(output.mock.calls).toEqual([["p\talchtest-delete\tdelete\tprojectNotFound"]]);
  } finally {
    output.mockRestore();
  }
});

test("sweeper production source filtering and age threshold fail closed", async () => {
  prod();
  recordProject(ledger, "owned", "alchtest-owned");
  const fetch = mockLookup();
  fetch.mockImplementation(
    fetching(async (input) => {
      if (new URL(String(input)).pathname.endsWith("/user/client-list"))
        return Response.json({ list: [{ clientId: ORG }], total: 1 });
      return Response.json({
        list: [
          { id: "owned", name: "alchtest-owned", clientId: ORG, created: "2000-01-01T00:00:00Z" },
          { id: "other", name: "alchtest-other", clientId: ORG, created: "2000-01-01T00:00:00Z" },
          { id: "new", name: "alchtest-new", clientId: ORG, created: new Date().toISOString() },
        ],
        total: 3,
      });
    }),
  );
  const output = spyOn(console, "log").mockImplementation(() => {});
  try {
    await sweep(["--older-than", "60"]);
    expect(output.mock.calls).toEqual([["owned\talchtest-owned\tdry-run\twould-delete"]]);
  } finally {
    output.mockRestore();
  }
});

test("production managed shorthand is refused, explicit single and runtime types allowed", async () => {
  prod();
  recordProject(ledger, "p", "alchtest-owned");
  mockLookup();
  const guard = createGuardFromEnv();
  for (const family of [
    "postgresql",
    "mariadb",
    "valkey",
    "keydb",
    "elasticsearch",
    "nats",
    "kafka",
    "clickhouse",
    "qdrant",
    "typesense",
    "meilisearch",
    "unknown-managed",
  ]) {
    const body = {
      name: "db",
      serviceStackVersionName: `${family}@16`,
      customAutoscaling: { verticalAutoscaling: { minResource: { diskGBytes: 2 } } },
    };
    await expect(guard.before(request("POST", "/project/p/service-stack", body))).rejects.toThrow(
      ":single@",
    );
    await guard.before(
      request("POST", "/project/p/service-stack", {
        ...body,
        serviceStackVersionName: `${family}:single@16`,
      }),
    );
    await expect(
      guard.before(request("PUT", "/service-stack/s/autoscaling", body)),
    ).rejects.toThrow(":single@");
  }
  for (const serviceStackVersionName of [
    "nodejs@22",
    "bun@1",
    "ubuntu/nodejs@22",
    "alpine/nodejs@22",
    "static",
    "object_storage",
  ]) {
    await guard.before(
      request("POST", "/project/p/service-stack", { name: "app", serviceStackVersionName }),
    );
  }
});

test("uploads require exact successful owned app-version grant in dev and prod", async () => {
  for (const production of [false, true]) {
    if (production) {
      prod();
      recordProject(ledger, "p", "alchtest-owned");
    }
    const fetch = mockLookup({
      "/service-stack/s": { projectId: "p" },
      "/service-stack/foreign": { projectId: "other" },
      "/project/other": { clientId: ORG, name: "important" },
    });
    const guard = createGuardFromEnv();
    const upload = {
      kind: "upload" as const,
      method: "PUT",
      url: new URL(
        production
          ? "https://proxy.app-prg1.zerops.io/u?signature=secret"
          : "https://proxy.dev.example.test/u?signature=secret",
      ),
    };
    await expect(guard.before(upload)).rejects.toThrow("grant");
    const failed = request("POST", "/service-stack/s/app-version", { name: "app" });
    await guard.before(failed);
    guard.after!(failed, { status: 500, body: { uploadUrl: upload.url.href } });
    await expect(guard.before(upload)).rejects.toThrow("grant");
    const foreign = request("POST", "/service-stack/foreign/app-version", { name: "app" });
    await expect(guard.before(foreign)).rejects.toThrow();
    guard.after!(foreign, { status: 200, body: { uploadUrl: upload.url.href } });
    await expect(guard.before(upload)).rejects.toThrow("grant");
    guard.after!(failed, { status: 200, body: { uploadUrl: upload.url.href } });
    await guard.before(upload);
    const changed = { ...upload, url: new URL(`${upload.url.href}&extra=value`) };
    await expect(guard.before(changed)).rejects.toThrow("grant");
    fetch.mockRestore();
  }
});

test("log URLs require an owned log-access response and retain base scope", async () => {
  mockLookup({
    "/service-stack/s": { projectId: "p" },
    "/app-version/v": { projectId: "p" },
    "/service-stack/foreign": { projectId: "other" },
    "/project/other": { clientId: ORG, name: "important" },
  });
  const guard = createGuardFromEnv();
  const url = new URL("https://proxy.dev.example.test/log?scope=private");
  const log = { kind: "log" as const, method: "GET", url };
  await expect(guard.before(log)).rejects.toThrow("grant");
  const access = request("GET", "/project/p/log");
  await guard.before(access);
  guard.after!(access, { status: 200, body: { urlPlain: url.href, accessToken: "never-log" } });
  await guard.before(log);
  await guard.before({ ...log, url: new URL(`${url.href}&serviceStackId=s&limit=100`) });
  await guard.before({ ...log, url: new URL(`${url.href}&tags=zbuilder@v&limit=100`) });
  await expect(
    guard.before({ ...log, url: new URL(`${url.href}&serviceStackId=foreign`) }),
  ).rejects.toThrow("grant");
  await expect(
    guard.before({ ...log, url: new URL("https://proxy.dev.example.test/other?scope=private") }),
  ).rejects.toThrow("grant");
  await expect(
    guard.before({ ...log, url: new URL("https://proxy.dev.example.test/log?scope=changed") }),
  ).rejects.toThrow("grant");
  await expect(guard.before(request("GET", "/project/other/log"))).rejects.toThrow("ownership");
});

test("dev service and process reads ignore unrelated nested membership metadata", async () => {
  const guard = createGuardFromEnv();
  // ResponseServiceStack embeds OutDtoGetAppVersion and OutDtoProjectLight;
  // createdByUser/client metadata is not the owner of the outer service.
  for (const path of ["/service-stack/s", "/service-stack/s/process"]) {
    const req = request("GET", path);
    await guard.before(req);
    guard.after!(req, {
      status: 200,
      body: {
        id: "s",
        projectId: "p",
        project: { id: "p", clientId: ORG },
        activeAppVersion: { createdByUser: { clientId: "unrelated-membership" } },
        serviceStackTypeInfo: { clientId: null },
        list: [{ id: "proc", projectId: "p", createdByUser: { clientId: "unrelated-membership" } }],
      },
    });
  }
});

test("dev service import allows valid owned YAML without body.name; prod refuses", async () => {
  const fetch = mockLookup();
  const body = { yaml: "services:\n  - hostname: app\n    type: nodejs@22\n" };
  await createGuardFromEnv().before(request("POST", "/project/p/service-stack/import", body));
  for (const yaml of [
    "services:\n - hostname: core\n",
    "services:\n - hostname: l7httpbalancer\n",
    "project:\n name: alchtest-other\nservices:\n - hostname: app\n",
    "services: [",
    "services:\n - hostname: bad-name\n",
  ]) {
    await expect(
      createGuardFromEnv().before(request("POST", "/project/p/service-stack/import", { yaml })),
    ).rejects.toThrow();
  }
  fetch.mockRestore();
  mockLookup({ "/project/p": { clientId: ORG, name: "important" } });
  await expect(
    createGuardFromEnv().before(request("POST", "/project/p/service-stack/import", body)),
  ).rejects.toThrow("ownership");
  prod();
  await expect(
    createGuardFromEnv().before(request("POST", "/project/p/service-stack/import", body)),
  ).rejects.toThrow("allowlisted");
});

describe("second-review production safety", () => {
  test("PostgreSQL rejects every identifier except the exact pinned single-node version", async () => {
    prod();
    recordProject(ledger, "p", "alchtest-owned");
    mockLookup();
    const guard = createGuardFromEnv();
    for (const version of [
      "postgresql:single@17",
      "postgresql:single@18",
      "postgresql@16",
      "postgresql",
      "postgresql:single@16.0",
    ]) {
      await expect(
        guard.before(
          request("POST", "/project/p/service-stack", {
            name: "db",
            serviceStackVersionName: version,
            customAutoscaling: { verticalAutoscaling: { minResource: { diskGBytes: 2 } } },
          }),
        ),
      ).rejects.toThrow();
    }
  });

  test("project creation durably records a Go-compatible note before submission", async () => {
    prod();
    mockLookup();
    const guard = createGuardFromEnv();
    const req = request("POST", `/client/${ORG}/project`, { name: "alchtest-intended" });
    await guard.before(req);
    expect(readLedger(ledger)).toEqual([
      {
        time: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
        kind: "note",
        id: "alchtest-intended",
        name: "project-create-intent",
        source: "alchemy",
      },
    ]);
    expect(alchemyProjectIntents(ledger).has("alchtest-intended")).toBe(true);
    expect(alchemyProjects(ledger).size).toBe(0);
    guard.after!(req, { status: 200, body: { id: "created" } });
    expect(alchemyProjects(ledger).has("created")).toBe(true);
  });

  test("ledger replacement or corruption refuses project creation before POST", async () => {
    prod();
    mockLookup();
    const guard = createGuardFromEnv();
    const req = request("POST", `/client/${ORG}/project`, { name: "alchtest-intended" });
    writeFileSync(ledger, "corrupt\n");
    await expect(guard.before(req)).rejects.toThrow("invalid ledger");
    rmSync(ledger);
    mkdirSync(ledger);
    await expect(guard.before(req)).rejects.toThrow("ledger");
  });

  test("intent cleanup is exact-name only and never grants ordinary mutation ownership", async () => {
    prod();
    recordProjectIntent(ledger, "alchtest-intended");
    mockLookup({
      "/project/p": { clientId: ORG, name: "alchtest-intended" },
      "/project/q": { clientId: ORG, name: "alchtest-intended-extra" },
    });
    const guard = createGuardFromEnv();
    await guard.before(request("DELETE", "/project/p"));
    await expect(guard.before(request("PUT", "/project/p", {}))).rejects.toThrow("recorded");
    await expect(guard.before(request("DELETE", "/project/q"))).rejects.toThrow("recorded");
  });

  test("sweep selects an exact production intent name even without an ID row", async () => {
    prod();
    recordProjectIntent(ledger, "alchtest-intended");
    mockLookup({
      [`/client/${ORG}/project`]: {
        list: [
          { id: "p", clientId: ORG, name: "alchtest-intended" },
          { id: "q", clientId: ORG, name: "alchtest-intended-extra" },
        ],
        total: 2,
      },
    });
    const output = spyOn(console, "log").mockImplementation(() => {});
    try {
      await sweep([]);
      expect(output.mock.calls).toEqual([["p\talchtest-intended\tdry-run\twould-delete"]]);
    } finally {
      output.mockRestore();
    }
  });

  for (const status of [500, 503, 0]) {
    test(`internal membership/ownership failures carry sanitized monitor metadata (${status})`, async () => {
      prod();
      recordProject(ledger, "p", "alchtest-owned");
      const fetch = mockLookup();
      const fail = fetching(async () => {
        if (!status) throw new Error("test-private-token signed-secret");
        return new Response("test-private-token signed-secret", { status });
      });
      fetch.mockImplementation(fail);
      const membershipGuard = createGuardFromEnv();
      const first = await rejection(
        membershipGuard.before(request("GET", `/client/${ORG}/project`)),
      );
      expect(first).toMatchObject({ method: "GET", path: "/user/client-list", status });
      expect(first.message).toContain("ZEROPS_5XX");
      expect(first.message).not.toContain("test-private-token");
      fetch.mockRestore();
      const lookup = mockLookup();
      const guard = createGuardFromEnv();
      await guard.before(request("GET", `/client/${ORG}/project`));
      lookup.mockImplementation(fail);
      const error = await rejection(guard.before(request("DELETE", "/project/p")));
      expect(error).toMatchObject({ method: "GET", path: "/project/p", status });
      expect(error.message).toContain("ZEROPS_5XX");
      expect(error.message).not.toContain("signed-secret");
      // Caller GET failures stay in Http's retryable error path.
      expect(() =>
        guard.after!(request("GET", "/project/p"), { status: 503, body: {} }),
      ).not.toThrow();
    });
  }

  function buildInventory() {
    prod();
    recordProject(ledger, "p", "alchtest-owned");
    recordProject(ledger, "ledger-other", "alchtest-old-name");
    let active = false;
    const calls: string[] = [];
    const fetch = mockLookup();
    fetch.mockImplementation(
      fetching(async (input) => {
        const url = new URL(String(input));
        const path = url.pathname.replace("/api/rest/public", "");
        calls.push(path);
        if (path === "/user/client-list")
          return Response.json({ list: [{ clientId: ORG }], total: 1 });
        if (path === `/client/${ORG}/project`) {
          const rows = [
            { id: "p", clientId: ORG, name: "alchtest-owned" },
            { id: "other", clientId: ORG, name: "alchtest-other-run" },
            { id: "ledger-other", clientId: ORG, name: "renamed" },
          ];
          const offset = Number(url.searchParams.get("offset"));
          return Response.json({ list: rows.slice(offset, offset + 1), total: rows.length });
        }
        if (path.endsWith("/process"))
          return Response.json({
            list:
              active && path === "/project/other/process"
                ? [{ id: "remote", actionName: "stack.build", status: "PENDING" }]
                : [],
            total: active && path === "/project/other/process" ? 1 : 0,
          });
        if (path === "/process/submitted")
          return Response.json({
            id: "submitted",
            actionName: "stack.build",
            status: active ? "RUNNING" : "FINISHED",
          });
        if (path === "/app-version/v" || path === "/service-stack/s")
          return Response.json({ projectId: "p" });
        return Response.json({ clientId: ORG, name: "alchtest-owned" });
      }),
    );
    return {
      calls,
      active: (value: boolean) => {
        active = value;
      },
    };
  }

  for (const stage of ["fetch", "body"] as const) {
    for (const deadline of [30000, 120000]) {
      test(`stalled inventory ${stage} releases admission after ${deadline}ms deadline`, async () => {
        buildInventory();
        const fetch = spyOn(globalThis, "fetch");
        const previous = fetch.getMockImplementation()!;
        let signal: AbortSignal | undefined;
        fetch.mockImplementation(
          fetching(async (input, init) => {
            if (new URL(String(input)).pathname.endsWith("/project/p/process")) {
              signal = init?.signal ?? undefined;
              if (stage === "fetch") return Promise.withResolvers<Response>().promise;
              const response = Response.json({});
              spyOn(response, "json").mockImplementation(
                () => Promise.withResolvers<unknown>().promise,
              );
              return response;
            }
            return previous(input, init);
          }),
        );
        const nativeTimeout = AbortSignal.timeout.bind(AbortSignal);
        const timeout = spyOn(AbortSignal, "timeout").mockImplementation((ms) =>
          nativeTimeout(ms === deadline ? 20 : ms),
        );
        const guard = createGuardFromEnv();
        try {
          await expect(
            guard.before(request("PUT", "/app-version/v/build-and-deploy", {})),
          ).rejects.toMatchObject({ status: 0, method: "GET", path: "/project/p/process" });
          expect(signal?.aborted).toBe(true);
        } finally {
          timeout.mockRestore();
          fetch.mockImplementation(previous);
        }
        const next = request("PUT", "/service-stack/s/trigger-pipeline", {});
        await guard.before(next);
        guard.after!(next, { status: 400, body: {} });
      });
    }
  }

  for (const failure of ["fetch", "body"] as const) {
    test(`live API ${failure} failure releases build admission`, async () => {
      buildInventory();
      const fetch = spyOn(globalThis, "fetch");
      const previous = fetch.getMockImplementation()!;
      const original = new Error("original transport failure");
      let submissions = 0;
      fetch.mockImplementation(
        fetching(async (input, init) => {
          if (init?.method === "PUT") {
            if (++submissions > 1) return Response.json({});
            if (failure === "fetch") throw original;
            const response = Response.json({});
            spyOn(response, "text").mockRejectedValue(original);
            return response;
          }
          return previous(input, init);
        }),
      );
      const api = createLiveApi();
      await expect(api("PUT", "/app-version/v/build-and-deploy", {})).rejects.toBe(original);
      await expect(api("PUT", "/service-stack/s/trigger-pipeline", {})).resolves.toEqual({});
      expect(submissions).toBe(2);
    });
  }

  test("live absence requires HTTP 400 and the exact code", async () => {
    const fetch = mockLookup();
    let status = 400;
    let body: unknown = { error: { code: "projectNotFound" } };
    fetch.mockImplementation(fetching(async () => Response.json(body, { status })));
    expect(await rawProjectAbsent("p")).toBe(true);
    body = { code: "projectEnvNotFound" };
    expect(await liveAbsent("/project-env/e", "projectEnvNotFound")).toBe(true);
    for (const code of [
      "projectNotFound",
      "publicHttpRoutingNotFound",
      "publicPortRoutingNotFound",
    ]) {
      body = { code };
      expect(await liveAbsent("/project/p", code)).toBe(true);
      status = 200;
      expect(await liveAbsent("/project/p", code)).toBe(false);
      status = 404;
      await expect(liveAbsent("/project/p", code)).rejects.toThrow("HTTP 404");
      status = 400;
    }
    body = { code: "other" };
    await expect(rawProjectAbsent("p")).rejects.toThrow("HTTP 400");
    status = 503;
    body = { code: "projectNotFound" };
    await expect(rawProjectAbsent("p")).rejects.toBeInstanceOf(LiveApi5xx);
  });

  test("build admission checks every existing prefix/ledger project and refuses active remote builds", async () => {
    const remote = buildInventory();
    remote.active(true);
    for (const path of [
      "/app-version/v/build-and-deploy",
      "/service-stack/s/trigger-pipeline",
      "/app-version/v/deploy",
    ]) {
      await expect(createGuardFromEnv().before(request("PUT", path, {}))).rejects.toThrow(
        "single-build",
      );
    }
    remote.active(false);
    const guard = createGuardFromEnv();
    const req = request("PUT", "/app-version/v/build-and-deploy", {});
    await guard.before(req);
    expect(remote.calls).toContain("/project/ledger-other/process");
    guard.after!(req, { status: 400, body: {} });
  });

  test("concurrent guard instances serialize submission and retain returned process reservation", async () => {
    const remote = buildInventory();
    const firstGuard = createGuardFromEnv();
    const secondGuard = createGuardFromEnv();
    const first = request("PUT", "/app-version/v/build-and-deploy", {});
    const second = request("PUT", "/service-stack/s/trigger-pipeline", {});
    await firstGuard.before(first);
    let settled = false;
    const next = Promise.resolve(secondGuard.before(second)).then(
      () => {
        settled = true;
      },
      (error: unknown) => {
        settled = true;
        throw error;
      },
    );
    await Promise.resolve();
    expect(settled).toBe(false);
    remote.active(true);
    firstGuard.after!(first, { status: 200, body: { id: "submitted" } });
    await expect(next).rejects.toThrow("single-build");
    remote.active(false);
    await secondGuard.before(second);
    secondGuard.after!(second, { status: 400, body: {} });
    expect(remote.calls).toContain("/process/submitted");
  });

  test("build admission fails closed on unreadable or malformed process inventory", async () => {
    const remote = buildInventory();
    const guard = createGuardFromEnv();
    const req = request("PUT", "/app-version/v/build-and-deploy", {});
    await guard.before(req);
    await guard.failed!(req);
    const fetch = spyOn(globalThis, "fetch");
    const previous = fetch.getMockImplementation()!;
    fetch.mockImplementation(
      fetching(async (input, init) => {
        if (new URL(String(input)).pathname.endsWith("/project/p/process"))
          return new Response("private", { status: 503 });
        return previous(input, init);
      }),
    );
    await expect(
      guard.before(request("PUT", "/service-stack/s/trigger-pipeline", {})),
    ).rejects.toMatchObject({
      status: 503,
      method: "GET",
      path: "/project/p/process",
    });
    fetch.mockImplementation(
      fetching(async (input, init) => {
        if (new URL(String(input)).pathname.endsWith("/project/p/process"))
          return Response.json({ list: [], total: 1 });
        return previous(input, init);
      }),
    );
    await expect(
      guard.before(
        request("POST", "/project/p/service-stack", {
          name: "gitapp",
          serviceStackVersionName: "nodejs@22",
          buildFromGit: "https://github.com/example/repo@main",
        }),
      ),
    ).rejects.toThrow("inventory");
    fetch.mockImplementation(previous);
    remote.active(false);
    const cleared = request("PUT", "/service-stack/s/trigger-pipeline", {});
    await guard.before(cleared);
    guard.after!(cleared, { status: 400, body: {} });
  });

  test("production sweep refuses a missing run lock before any request", async () => {
    prod();
    delete process.env.ZEROPS_RUN_LOCK;
    const fetch = mockLookup();
    await expect(sweep([])).rejects.toThrow("absolute ZEROPS_RUN_LOCK");
    expect(fetch).not.toHaveBeenCalled();
  });

  for (const outcome of ["network", "5xx"]) {
    test(`uncertain ${outcome} submission requires successful read-only clearance`, async () => {
      const remote = buildInventory();
      const guard = createGuardFromEnv();
      const req = request("PUT", "/app-version/v/build-and-deploy", {});
      await guard.before(req);
      if (outcome === "network") await guard.failed!(req);
      else guard.after!(req, { status: 503, body: {} });
      remote.active(true);
      await expect(
        guard.before(request("PUT", "/service-stack/s/trigger-pipeline", {})),
      ).rejects.toThrow("single-build");
      remote.active(false);
      const cleared = request("PUT", "/service-stack/s/trigger-pipeline", {});
      await guard.before(cleared);
      guard.after!(cleared, { status: 400, body: {} });
    });
  }
});
