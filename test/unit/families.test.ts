import { test, expect } from "bun:test";
import * as Effect from "effect/Effect";
import * as Output from "alchemy/Output";
import { StackContext } from "alchemy/StackContext";
import * as Families from "../../src/Families.ts";
import { ManagedService, managedType, managedAutoscaling } from "../../src/ManagedService.ts";
import { readConfig, defaultFamilyFloors, floorEnv } from "../../src/Config.ts";
import { managedCatalogue } from "../../src/client/serviceTypes.gen.ts";
import { ref, type RefTarget } from "../../src/ref.ts";

// Resolve only the literal expression tree built by the helpers, without a runtime or API.
function literal(output: unknown): unknown {
  if (Output.isLiteralExpr(output)) return output.value;
  if (Output.isAllExpr(output)) return output.outs.map(literal);
  if (Output.isOutput(output) && Output.isApplyExpr(output))
    return (output as Output.ApplyExpr<unknown, unknown>).f(literal(output.expr));
  throw new Error("Expected literal helper expression");
}
async function declaration(effect: Effect.Effect<ManagedService, never, unknown>) {
  const { props } = await Effect.runPromise(
    effect.pipe(
      Effect.map((resource) => ({ props: resource.Props })),
      Effect.provideService(StackContext, {
        resources: {},
        bindings: {},
      } as unknown as typeof StackContext.Service),
    ) as Effect.Effect<{ props: ManagedService["Props"] }>,
  );
  return literal(props.type);
}
test("Postgres builds catalogue types and shares provider identity", async () => {
  const version = managedCatalogue["postgresql"].versions[0];
  expect(Families.Postgres.Type).toBe("Zerops.ManagedService");
  expect(Families.Postgres.Provider).toBe(ManagedService.Provider);
  expect(await declaration(Families.Postgres("Default", { project: "p", version }))).toBe(
    "postgresql:single@" + version,
  );
  expect(
    await declaration(Families.Postgres("Single", { project: "p", version, mode: "NON_HA" })),
  ).toBe("postgresql:single@" + version);
  expect(await declaration(Families.Postgres("HA", { project: "p", version, mode: "HA" }))).toBe(
    "postgresql:ha@" + version,
  );
  await expect(
    declaration(Families.Postgres("Invalid", { project: "p", version: "latest" })),
  ).rejects.toThrow("numeric catalogue version");
});
test("MariaDB builds catalogue types and shares provider identity", async () => {
  const version = managedCatalogue["mariadb"].versions[0];
  expect(Families.MariaDB.Type).toBe("Zerops.ManagedService");
  expect(Families.MariaDB.Provider).toBe(ManagedService.Provider);
  expect(await declaration(Families.MariaDB("Default", { project: "p", version }))).toBe(
    "mariadb:single@" + version,
  );
  expect(
    await declaration(Families.MariaDB("Single", { project: "p", version, mode: "NON_HA" })),
  ).toBe("mariadb:single@" + version);
  expect(await declaration(Families.MariaDB("HA", { project: "p", version, mode: "HA" }))).toBe(
    "mariadb:ha@" + version,
  );
  await expect(
    declaration(Families.MariaDB("Invalid", { project: "p", version: "latest" })),
  ).rejects.toThrow("numeric catalogue version");
});
test("Valkey builds catalogue types and shares provider identity", async () => {
  const version = managedCatalogue["valkey"].versions[0];
  expect(Families.Valkey.Type).toBe("Zerops.ManagedService");
  expect(Families.Valkey.Provider).toBe(ManagedService.Provider);
  expect(await declaration(Families.Valkey("Default", { project: "p", version }))).toBe(
    "valkey:single@" + version,
  );
  expect(
    await declaration(Families.Valkey("Single", { project: "p", version, mode: "NON_HA" })),
  ).toBe("valkey:single@" + version);
  expect(await declaration(Families.Valkey("HA", { project: "p", version, mode: "HA" }))).toBe(
    "valkey:ha@" + version,
  );
  await expect(
    declaration(Families.Valkey("Invalid", { project: "p", version: "latest" })),
  ).rejects.toThrow("numeric catalogue version");
});
test("ClickHouse builds catalogue types and shares provider identity", async () => {
  const version = managedCatalogue["clickhouse"].versions[0];
  expect(Families.ClickHouse.Type).toBe("Zerops.ManagedService");
  expect(Families.ClickHouse.Provider).toBe(ManagedService.Provider);
  expect(await declaration(Families.ClickHouse("Default", { project: "p", version }))).toBe(
    "clickhouse:single@" + version,
  );
  expect(
    await declaration(Families.ClickHouse("Single", { project: "p", version, mode: "NON_HA" })),
  ).toBe("clickhouse:single@" + version);
  expect(await declaration(Families.ClickHouse("HA", { project: "p", version, mode: "HA" }))).toBe(
    "clickhouse:ha@" + version,
  );
  await expect(
    declaration(Families.ClickHouse("Invalid", { project: "p", version: "latest" })),
  ).rejects.toThrow("numeric catalogue version");
});
test("Elasticsearch builds catalogue types and shares provider identity", async () => {
  const version = managedCatalogue["elasticsearch"].versions[0];
  expect(Families.Elasticsearch.Type).toBe("Zerops.ManagedService");
  expect(Families.Elasticsearch.Provider).toBe(ManagedService.Provider);
  expect(await declaration(Families.Elasticsearch("Default", { project: "p", version }))).toBe(
    "elasticsearch:single@" + version,
  );
  expect(
    await declaration(Families.Elasticsearch("Single", { project: "p", version, mode: "NON_HA" })),
  ).toBe("elasticsearch:single@" + version);
  expect(
    await declaration(Families.Elasticsearch("HA", { project: "p", version, mode: "HA" })),
  ).toBe("elasticsearch:ha@" + version);
  await expect(
    declaration(Families.Elasticsearch("Invalid", { project: "p", version: "latest" })),
  ).rejects.toThrow("numeric catalogue version");
});
test("Kafka builds catalogue types and shares provider identity", async () => {
  const version = managedCatalogue["kafka"].versions[0];
  expect(Families.Kafka.Type).toBe("Zerops.ManagedService");
  expect(Families.Kafka.Provider).toBe(ManagedService.Provider);
  expect(await declaration(Families.Kafka("Default", { project: "p", version }))).toBe(
    "kafka:single@" + version,
  );
  expect(
    await declaration(Families.Kafka("Single", { project: "p", version, mode: "NON_HA" })),
  ).toBe("kafka:single@" + version);
  expect(await declaration(Families.Kafka("HA", { project: "p", version, mode: "HA" }))).toBe(
    "kafka:ha@" + version,
  );
  await expect(
    declaration(Families.Kafka("Invalid", { project: "p", version: "latest" })),
  ).rejects.toThrow("numeric catalogue version");
});
test("Nats builds catalogue types and shares provider identity", async () => {
  const version = managedCatalogue["nats"].versions[0];
  expect(Families.Nats.Type).toBe("Zerops.ManagedService");
  expect(Families.Nats.Provider).toBe(ManagedService.Provider);
  expect(await declaration(Families.Nats("Default", { project: "p", version }))).toBe(
    "nats:single@" + version,
  );
  expect(
    await declaration(Families.Nats("Single", { project: "p", version, mode: "NON_HA" })),
  ).toBe("nats:single@" + version);
  expect(await declaration(Families.Nats("HA", { project: "p", version, mode: "HA" }))).toBe(
    "nats:ha@" + version,
  );
  await expect(
    declaration(Families.Nats("Invalid", { project: "p", version: "latest" })),
  ).rejects.toThrow("numeric catalogue version");
});
test("Qdrant builds catalogue types and shares provider identity", async () => {
  const version = managedCatalogue["qdrant"].versions[0];
  expect(Families.Qdrant.Type).toBe("Zerops.ManagedService");
  expect(Families.Qdrant.Provider).toBe(ManagedService.Provider);
  expect(await declaration(Families.Qdrant("Default", { project: "p", version }))).toBe(
    "qdrant:single@" + version,
  );
  expect(
    await declaration(Families.Qdrant("Single", { project: "p", version, mode: "NON_HA" })),
  ).toBe("qdrant:single@" + version);
  expect(await declaration(Families.Qdrant("HA", { project: "p", version, mode: "HA" }))).toBe(
    "qdrant:ha@" + version,
  );
  await expect(
    declaration(Families.Qdrant("Invalid", { project: "p", version: "latest" })),
  ).rejects.toThrow("numeric catalogue version");
});
test("Typesense builds catalogue types and shares provider identity", async () => {
  const version = managedCatalogue["typesense"].versions[0];
  expect(Families.Typesense.Type).toBe("Zerops.ManagedService");
  expect(Families.Typesense.Provider).toBe(ManagedService.Provider);
  expect(await declaration(Families.Typesense("Default", { project: "p", version }))).toBe(
    "typesense:single@" + version,
  );
  expect(
    await declaration(Families.Typesense("Single", { project: "p", version, mode: "NON_HA" })),
  ).toBe("typesense:single@" + version);
  expect(await declaration(Families.Typesense("HA", { project: "p", version, mode: "HA" }))).toBe(
    "typesense:ha@" + version,
  );
  await expect(
    declaration(Families.Typesense("Invalid", { project: "p", version: "latest" })),
  ).rejects.toThrow("numeric catalogue version");
});
test("SeaweedFS builds catalogue types and shares provider identity", async () => {
  const version = managedCatalogue["seaweedfs"].versions[0];
  expect(Families.SeaweedFS.Type).toBe("Zerops.ManagedService");
  expect(Families.SeaweedFS.Provider).toBe(ManagedService.Provider);
  expect(await declaration(Families.SeaweedFS("Default", { project: "p", version }))).toBe(
    "seaweedfs:single@" + version,
  );
  expect(
    await declaration(Families.SeaweedFS("Single", { project: "p", version, mode: "NON_HA" })),
  ).toBe("seaweedfs:single@" + version);
  expect(await declaration(Families.SeaweedFS("HA", { project: "p", version, mode: "HA" }))).toBe(
    "seaweedfs:ha@" + version,
  );
  await expect(
    declaration(Families.SeaweedFS("Invalid", { project: "p", version: "latest" })),
  ).rejects.toThrow("numeric catalogue version");
});
test("Meilisearch builds catalogue types and shares provider identity", async () => {
  const version = managedCatalogue["meilisearch"].versions[0];
  expect(Families.Meilisearch.Type).toBe("Zerops.ManagedService");
  expect(Families.Meilisearch.Provider).toBe(ManagedService.Provider);
  expect(await declaration(Families.Meilisearch("Default", { project: "p", version }))).toBe(
    "meilisearch:single@" + version,
  );
  expect(
    await declaration(Families.Meilisearch("Single", { project: "p", version, mode: "NON_HA" })),
  ).toBe("meilisearch:single@" + version);
  expect(() => managedType("meilisearch@" + version, "HA")).toThrow("does not support ha");
  expect(() => managedType("meilisearch:ha@" + version)).toThrow("does not support ha");
  await expect(
    declaration(
      Families.Meilisearch("InvalidMode", { project: "p", version, mode: "HA" as "NON_HA" }),
    ),
  ).rejects.toThrow("does not support ha");
  await expect(
    declaration(Families.Meilisearch("Invalid", { project: "p", version: "latest" })),
  ).rejects.toThrow("numeric catalogue version");
});
test("LocalStorage builds catalogue types and shares provider identity", async () => {
  const version = managedCatalogue["local-storage"].versions[0];
  expect(Families.LocalStorage.Type).toBe("Zerops.ManagedService");
  expect(Families.LocalStorage.Provider).toBe(ManagedService.Provider);
  expect(await declaration(Families.LocalStorage("Default", { project: "p", version }))).toBe(
    "local-storage:single@" + version,
  );
  expect(
    await declaration(Families.LocalStorage("Single", { project: "p", version, mode: "NON_HA" })),
  ).toBe("local-storage:single@" + version);
  expect(() => managedType("local-storage@" + version, "HA")).toThrow("does not support ha");
  expect(() => managedType("local-storage:ha@" + version)).toThrow("does not support ha");
  await expect(
    declaration(
      Families.LocalStorage("InvalidMode", { project: "p", version, mode: "HA" as "NON_HA" }),
    ),
  ).rejects.toThrow("does not support ha");
  await expect(
    declaration(Families.LocalStorage("Invalid", { project: "p", version: "latest" })),
  ).rejects.toThrow("numeric catalogue version");
});
test("unknown managed families pass through", () => {
  expect(managedType("custom@1", "HA")).toBe("custom@1");
  expect(managedType("custom:ha@1")).toBe("custom:ha@1");
});
for (const [family, dimension, minimum] of [
  ["postgresql", "minDisk", 2],
  ["clickhouse", "minRam", 0.375],
  ["elasticsearch", "minRam", 2],
] as const) {
  test(family + " floors inject and reject both bounds", () => {
    for (const type of [family + "@1", family + ":single@1", "ubuntu/" + family + ":ha@1"]) {
      const props = { project: "p", type };
      expect(managedAutoscaling(props, defaultFamilyFloors).vertical?.[dimension]).toBe(minimum);
      for (const field of [dimension, dimension === "minDisk" ? "maxDisk" : "maxRam"] as const) {
        expect(() =>
          managedAutoscaling(
            { ...props, autoscaling: { vertical: { [field]: minimum / 2 } } },
            defaultFamilyFloors,
          ),
        ).toThrow(field);
        expect(() =>
          managedAutoscaling(
            { ...props, autoscaling: { vertical: { [field]: minimum / 2 } } },
            defaultFamilyFloors,
          ),
        ).toThrow(floorEnv(family, dimension));
      }
    }
  });
  test(family + " environment overrides are validated and applied", () => {
    const variable = floorEnv(family, dimension);
    const previous = process.env[variable];
    try {
      process.env[variable] = "7";
      expect(
        managedAutoscaling({ project: "p", type: family + "@1" }, readConfig().floors).vertical?.[
          dimension
        ],
      ).toBe(7);
      for (const value of ["NaN", "Infinity", "0", "-1"]) {
        process.env[variable] = value;
        expect(() => readConfig()).toThrow(variable);
      }
    } finally {
      if (previous === undefined) delete process.env[variable];
      else process.env[variable] = previous;
    }
  });
}
test("Valkey preserves scaling without adding a floor", () => {
  const autoscaling = { vertical: { minRam: 0.25 } };
  expect(
    managedAutoscaling({ project: "p", type: "valkey@7.2", autoscaling }, defaultFamilyFloors),
  ).toBe(autoscaling);
});
test("environment overrides may lower a floor to the catalogue minimum, not below", () => {
  for (const [family, dimension, catalogue, below] of [
    ["postgresql", "minDisk", "1", "0.5"],
    ["clickhouse", "minRam", "0.25", "0.125"],
    ["elasticsearch", "minRam", "0.75", "0.5"],
  ] as const) {
    const variable = floorEnv(family, dimension);
    const previous = process.env[variable];
    try {
      process.env[variable] = catalogue;
      expect(
        managedAutoscaling({ project: "p", type: family + "@1" }, readConfig().floors).vertical?.[
          dimension
        ],
      ).toBe(Number(catalogue));
      process.env[variable] = below;
      expect(() => readConfig()).toThrow(variable + " must be finite and at least " + catalogue);
    } finally {
      if (previous === undefined) delete process.env[variable];
      else process.env[variable] = previous;
    }
  }
});

// Compile-time contracts are intentionally not run as cloud declarations.
function typeContracts() {
  return Effect.gen(function* () {
    const postgres = yield* Families.Postgres("Postgres", { project: "p", version: "1" });
    ref(postgres, "dbName");
    // @ts-expect-error Family targets reject unobserved keys.
    ref(postgres, "notAKey");
    const mariadb = yield* Families.MariaDB("MariaDB", { project: "p", version: "1" });
    ref(mariadb, "user");
    // @ts-expect-error Family targets reject unobserved keys.
    ref(mariadb, "notAKey");
    const valkey = yield* Families.Valkey("Valkey", { project: "p", version: "1" });
    ref(valkey, "portTls");
    // @ts-expect-error Family targets reject unobserved keys.
    ref(valkey, "notAKey");
    const clickhouse = yield* Families.ClickHouse("ClickHouse", { project: "p", version: "1" });
    ref(clickhouse, "portNative");
    // @ts-expect-error Family targets reject unobserved keys.
    ref(clickhouse, "notAKey");
    const elasticsearch = yield* Families.Elasticsearch("Elasticsearch", {
      project: "p",
      version: "1",
    });
    ref(elasticsearch, "hostname");
    // @ts-expect-error Family targets reject unobserved keys.
    ref(elasticsearch, "notAKey");
    const kafka = yield* Families.Kafka("Kafka", { project: "p", version: "1" });
    ref(kafka, "KAFKA_HEAP_OPTS");
    // @ts-expect-error Family targets reject unobserved keys.
    ref(kafka, "notAKey");
    const nats = yield* Families.Nats("Nats", { project: "p", version: "1" });
    ref(nats, "JET_STREAM_ENABLED");
    // @ts-expect-error Family targets reject unobserved keys.
    ref(nats, "notAKey");
    const qdrant = yield* Families.Qdrant("Qdrant", { project: "p", version: "1" });
    ref(qdrant, "grpcConnectionString");
    // @ts-expect-error Family targets reject unobserved keys.
    ref(qdrant, "notAKey");
    const typesense = yield* Families.Typesense("Typesense", { project: "p", version: "1" });
    ref(typesense, "apiKey");
    // @ts-expect-error Family targets reject unobserved keys.
    ref(typesense, "notAKey");
    const seaweedfs = yield* Families.SeaweedFS("SeaweedFS", { project: "p", version: "1" });
    ref(seaweedfs, "BACKUP_PERIOD");
    // @ts-expect-error Family targets reject unobserved keys.
    ref(seaweedfs, "notAKey");
    const meilisearch = yield* Families.Meilisearch("Meilisearch", { project: "p", version: "1" });
    ref(meilisearch, "defaultSearchKey");
    // @ts-expect-error Family targets reject unobserved keys.
    ref(meilisearch, "notAKey");
    const localstorage = yield* Families.LocalStorage("LocalStorage", {
      project: "p",
      version: "1",
    });
    ref(localstorage, "projectId");
    // @ts-expect-error Family targets reject unobserved keys.
    ref(localstorage, "notAKey");
    // @ts-expect-error Single-only family does not support HA.
    Families.Meilisearch("Bad", { project: "p", version: "1", mode: "HA" });
    // @ts-expect-error Single-only family does not support HA.
    Families.LocalStorage("Bad", { project: "p", version: "1", mode: "HA" });
    // @ts-expect-error Single-only borrowed family does not support HA.
    Families.Meilisearch.ref<"HA">("Bad");
    // @ts-expect-error Single-only borrowed family does not support HA.
    Families.LocalStorage.ref<"HA">("Bad");
    const escape = yield* ManagedService("Custom", { project: "p", type: "postgresql@16" });
    ref(escape, "arbitraryKey");
  });
}
void typeContracts;
function modeContracts(uncertain: RefTarget<"postgresql", never, "NON_HA" | "HA">) {
  ref(uncertain, "hostname");
  // @ts-expect-error Unknown mode only permits common keys.
  ref(uncertain, "connectionStringReplicas");
  return Effect.gen(function* () {
    const defaultPostgres = yield* Families.Postgres("DefaultPostgres", {
      project: "p",
      version: "1",
    });
    // @ts-expect-error Default mode does not expose replica keys.
    ref(defaultPostgres, "connectionStringReplicas");
    const singlePostgres = yield* Families.Postgres("SinglePostgres", {
      project: "p",
      version: "1",
      mode: "NON_HA",
    });
    // @ts-expect-error NON_HA does not expose replica keys.
    ref(singlePostgres, "connectionStringReplicas");
    const haPostgres = yield* Families.Postgres("HAPostgres", {
      project: "p",
      version: "1",
      mode: "HA",
    });
    ref(haPostgres, "connectionStringReplicas");
    const borrowedPostgres = yield* Families.Postgres.ref("BorrowedPostgres");
    // @ts-expect-error Borrowed default mode does not expose replica keys.
    ref(borrowedPostgres, "connectionStringReplicas");
    const borrowedHaPostgres = yield* Families.Postgres.ref<"HA">("BorrowedHAPostgres");
    ref(borrowedHaPostgres, "connectionStringReplicas");
    const defaultValkey = yield* Families.Valkey("DefaultValkey", { project: "p", version: "1" });
    // @ts-expect-error Default mode does not expose replica keys.
    ref(defaultValkey, "portTlsReplicas");
    const singleValkey = yield* Families.Valkey("SingleValkey", {
      project: "p",
      version: "1",
      mode: "NON_HA",
    });
    // @ts-expect-error NON_HA does not expose replica keys.
    ref(singleValkey, "portTlsReplicas");
    const haValkey = yield* Families.Valkey("HAValkey", { project: "p", version: "1", mode: "HA" });
    ref(haValkey, "portTlsReplicas");
    const borrowedValkey = yield* Families.Valkey.ref("BorrowedValkey");
    // @ts-expect-error Borrowed default mode does not expose replica keys.
    ref(borrowedValkey, "portTlsReplicas");
    const borrowedHaValkey = yield* Families.Valkey.ref<"HA">("BorrowedHAValkey");
    ref(borrowedHaValkey, "portTlsReplicas");
    // Only a required literal HA mode yields the HA witness.
    const optionalMode: Families.PostgresProps = { project: "p", version: "1", mode: "HA" };
    const optionalPostgres = yield* Families.Postgres("OptionalPostgres", optionalMode);
    // @ts-expect-error Optional (possibly absent) mode does not expose replica keys.
    ref(optionalPostgres, "connectionStringReplicas");
    const wrappedHa = yield* Families.Postgres(
      "WrappedHA",
      Effect.succeed({ project: "p", version: "1", mode: "HA" as const }),
    );
    ref(wrappedHa, "connectionStringReplicas");
    const wrappedOptional = yield* Families.Postgres(
      "WrappedOptional",
      Effect.succeed(optionalMode),
    );
    // @ts-expect-error Effect-wrapped optional mode does not expose replica keys.
    ref(wrappedOptional, "connectionStringReplicas");
    const dynamicMode = Output.literal<"HA" | "NON_HA">("HA");
    const dynamicPostgres = yield* Families.Postgres("DynamicPostgres", {
      project: "p",
      version: "1",
      mode: dynamicMode,
    });
    // @ts-expect-error A mode chosen at deploy time does not expose replica keys.
    ref(dynamicPostgres, "connectionStringReplicas");
    const maybeHa = Output.literal<"HA" | undefined>(undefined);
    const maybeHaValkey = yield* Families.Valkey("MaybeHAValkey", {
      project: "p",
      version: "1",
      mode: maybeHa,
    });
    // @ts-expect-error An Output that may resolve to undefined does not expose replica keys.
    ref(maybeHaValkey, "portTlsReplicas");
  });
}
void modeContracts;
