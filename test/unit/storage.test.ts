import { expect, test } from "bun:test";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { ResourceContext } from "alchemy/ResourceContext";
import { Unowned } from "alchemy/AdoptPolicy";
import {
  ObjectStorage,
  ObjectStorageProvider,
  canonicalStoragePolicy,
  observedStoragePolicy,
  storagePolicy,
  storageAttributes,
} from "../../src/ObjectStorage.ts";
import { readService } from "../../src/internal/ServiceLifecycle.ts";
import { ZeropsClient, type Http } from "../../src/client/Http.ts";
import { storageOperations } from "../../src/client/operations/Storage.ts";
import { ZeropsValidation } from "../../src/client/Errors.ts";
import { generatedHostname } from "../../src/internal/Names.ts";

const privateRaw = '{"errorDocument":null,"indexDocument":null,"websiteAccess":false}';
const service = {
  id: "storage-id",
  projectId: "project-id",
  name: "bucket",
  status: "ACTIVE",
};
// Public SYSTEM rows from observed API responses; no credential secrets are fixtures.
const rows = [
  { key: "apiUrl", content: "https://s3.example.invalid", type: "SYSTEM" },
  { key: "accessKeyId", content: "public-access-key-id", type: "SYSTEM" },
  { key: "bucketName", content: "project-bucket", type: "SYSTEM" },
  { key: "quotaGBytes", content: "5", type: "SYSTEM" },
];

test("policy union validates defaults and custom JSON", () => {
  expect(storagePolicy({})).toEqual({ policy: "private" });
  expect(storagePolicy({ rawPolicy: '{"b":2,"a":1}' })).toEqual({
    policy: "custom",
    rawPolicy: '{"a":1,"b":2}',
  });
  expect(() => storagePolicy({ policy: "custom" })).toThrow();
  expect(() => storagePolicy({ policy: "public-read", rawPolicy: "{}" })).toThrow();
  expect(() => storagePolicy({ policy: "invalid" })).toThrow();
  expect(() => storagePolicy({ rawPolicy: "not JSON" })).toThrow();
});

test("canonical JSON sorts nested keys without losing fields or array order", () => {
  expect(canonicalStoragePolicy('{"z":[{"b":2,"a":1},3],"a":null}')).toBe(
    '{"a":null,"z":[{"a":1,"b":2},3]}',
  );
});

test("adoption only identifies unambiguous private policy", () => {
  expect(observedStoragePolicy(privateRaw)).toEqual({ policy: "private" });
  expect(observedStoragePolicy('{"Version":"2012-10-17","Statement":[]}')).toEqual({
    policy: "private",
  });
  for (const raw of [
    '{"websiteAccess":true,"indexDocument":"index.html","errorDocument":null}',
    '{"websiteAccess":false,"unknown":true}',
    "{}",
  ]) {
    expect(observedStoragePolicy(raw)).toEqual({
      policy: "custom",
      rawPolicy: canonicalStoragePolicy(raw),
    });
  }
});

test("attributes whitelist public SYSTEM keys and use allocated quota", () => {
  const attrs = storageAttributes(
    service,
    [{ key: "quotaGBytes", content: "999", type: "USER" }, ...rows],
    privateRaw,
  );
  expect(attrs).toEqual({
    serviceId: "storage-id",
    projectId: "project-id",
    hostname: "bucket",
    bucketName: "project-bucket",
    apiUrl: "https://s3.example.invalid",
    accessKeyId: "public-access-key-id",
    quotaGb: 5,
    policy: "private",
  });
  expect(attrs).not.toHaveProperty("secretAccessKey");
  expect(() => storageAttributes(service, rows.slice(1), privateRaw)).toThrow();
  const publicAttrs = storageAttributes(service, rows, '{"websiteAccess":true}', {
    policy: "public-read",
  });
  expect(publicAttrs.policy).toBe("public-read");
  expect(publicAttrs).not.toHaveProperty("rawPolicy");
});

test("service ownership requires previous state, never hostname alone", async () => {
  const http = { request: () => Effect.succeed(service) } as unknown as Http;
  const base = { projectId: service.projectId, hostname: service.name };
  const foreign = await Effect.runPromise(readService(http, { ...base, owned: false }));
  expect(Unowned.is(foreign)).toBe(true);
  const owned = await Effect.runPromise(
    readService(http, {
      ...base,
      id: service.id,
      owned: true,
    }),
  );
  expect(Unowned.is(owned)).toBe(false);
});

test("storage writes use dedicated DTOs and preserve CDN on quota edits", async () => {
  const requests: Array<{ method: string; path: string; body?: unknown }> = [];
  const http = {
    request: (method: string, path: string, body?: unknown) => {
      requests.push({ method, path, body });
      return Effect.succeed({ id: "process-id", status: "FINISHED" });
    },
  } as unknown as Http;
  const ops = storageOperations(http);
  await Effect.runPromise(
    ops.create("project-id", {
      name: "bucket",
      diskGBytes: 1,
      policy: "private",
      rawPolicy: null,
      cdnEnabled: false,
    }),
  );
  await Effect.runPromise(
    ops.update("storage-id", {
      diskGBytes: 2,
      policy: "public-read",
      rawPolicy: null,
    }),
  );
  expect(requests).toEqual([
    {
      method: "POST",
      path: "/project/project-id/service-stack/object_storage_v1",
      body: {
        name: "bucket",
        diskGBytes: 1,
        policy: "private",
        rawPolicy: null,
        cdnEnabled: false,
      },
    },
    {
      method: "PUT",
      path: "/service-stack/storage-id/object-storage-size",
      body: { diskGBytes: 2, policy: "public-read", rawPolicy: null },
    },
  ]);
});

test("provider recovery owns generated names and reads live drift attributes", async () => {
  const context = {
    logicalId: "Storage",
    fqn: "Storage",
    instanceId: "instance-id",
    type: "Zerops.ObjectStorage",
  };
  const name = generatedHostname(context.logicalId, context.instanceId);
  const stack = { ...service, name, serviceStackTypeId: "object_storage" };
  let missing = false;
  let requests = 0;
  const http = {
    request: (_method: string, path: string) => {
      requests++;
      if (missing)
        return Effect.fail(
          new ZeropsValidation({
            status: 400,
            code: "serviceStackNotFound",
            operation: "read",
            message: "gone",
          }),
        );
      if (path.endsWith("/env")) return Effect.succeed({ items: rows });
      if (path.endsWith("/object-storage-size")) {
        return Effect.succeed({ diskGBytesUsed: 0, rawPolicy: '{"websiteAccess":true}' });
      }
      return Effect.succeed(stack);
    },
  } as unknown as Http;
  await Effect.runPromise(
    Effect.gen(function* () {
      const provider = yield* ObjectStorage.Provider;
      const input = {
        id: "Storage",
        fqn: "Storage",
        instanceId: context.instanceId,
        olds: { project: "project-id", quotaGb: 5 },
        output: undefined,
      };
      for (const project of [undefined, {}, { projectId: undefined }, () => "unresolved"]) {
        const absent = yield* provider.read!({
          ...input,
          olds: { ...input.olds, project: project as never },
        });
        expect(absent).toBeUndefined();
      }
      expect(requests).toBe(0);
      const generated = yield* provider.read!(input);
      expect(Unowned.is(generated)).toBe(false);
      const explicit = yield* provider.read!({
        ...input,
        olds: { ...input.olds, hostname: name },
      });
      expect(Unowned.is(explicit)).toBe(true);
      const persisted = storageAttributes(stack, rows, privateRaw, { policy: "public-read" });
      const observed = yield* provider.read!({ ...input, output: persisted });
      expect(observed).toEqual(persisted);
      const changed = yield* provider.read!({
        ...input,
        output: { ...persisted, quotaGb: 1 },
      });
      expect(changed?.quotaGb).toBe(5);
      expect(changed).not.toHaveProperty("rawPolicy");
      missing = true;
      expect(yield* provider.read!({ ...input, output: persisted })).toBeUndefined();
    }).pipe(
      Effect.provide(
        ObjectStorageProvider().pipe(Layer.provide(Layer.succeed(ZeropsClient, http))),
      ),
      Effect.provideService(ResourceContext, context),
    ),
  );
});

test("reconcile recreates a missing saved service ID", async () => {
  const context = {
    logicalId: "Storage",
    fqn: "Storage",
    instanceId: "instance-id",
    type: "Zerops.ObjectStorage",
  };
  let created = false;
  const stack = { ...service, id: "new-id", serviceStackTypeId: "object_storage" };
  const http = {
    request: (method: string, path: string) => {
      if (method === "POST") {
        created = true;
        return Effect.succeed(stack);
      }
      if (path === "/service-stack/storage-id") {
        return Effect.fail(
          new ZeropsValidation({
            status: 400,
            code: "serviceStackNotFound",
            operation: "read",
            message: "gone",
          }),
        );
      }
      if (path.endsWith("/env")) return Effect.succeed({ items: rows });
      if (path.endsWith("/process?offset=0&limit=100")) {
        return Effect.succeed({ list: [] });
      }
      if (path.endsWith("/object-storage-size")) {
        return Effect.succeed({ diskGBytesUsed: 0, rawPolicy: privateRaw });
      }
      if (path.includes("/process?")) return Effect.succeed({ list: [] });
      return Effect.succeed(stack);
    },
  } as unknown as Http;
  await Effect.runPromise(
    Effect.gen(function* () {
      const provider = yield* ObjectStorage.Provider;
      const attrs = yield* provider.reconcile({
        id: "Storage",
        fqn: "Storage",
        instanceId: context.instanceId,
        news: { project: "project-id", hostname: "bucket", quotaGb: 5 },
        olds: { project: "project-id", hostname: "bucket", quotaGb: 5 },
        output: storageAttributes(service, rows, privateRaw),
        session: { note: () => Effect.void } as never,
        bindings: [],
      });
      expect(created).toBe(true);
      expect(attrs.serviceId).toBe("new-id");
      expect(attrs).toEqual(storageAttributes(stack, rows, privateRaw));
      const observed = yield* provider.read!({
        id: "Storage",
        fqn: "Storage",
        instanceId: context.instanceId,
        olds: { project: "project-id", hostname: "bucket", quotaGb: 5 },
        output: attrs,
      });
      expect(observed).toEqual(attrs);
    }).pipe(
      Effect.provide(
        ObjectStorageProvider().pipe(Layer.provide(Layer.succeed(ZeropsClient, http))),
      ),
      Effect.provideService(ResourceContext, context),
    ),
  );
});
