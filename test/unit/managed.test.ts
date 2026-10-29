import { test, expect } from "bun:test";
import {
  ManagedService,
  managedAutoscaling,
  managedNeedsReplace,
  managedType,
  type ManagedServiceProps,
} from "../../src/ManagedService.ts";
import { Postgres, MariaDB, Valkey } from "../../src/Databases.ts";
import { readConfig } from "../../src/Config.ts";
const props: ManagedServiceProps = { project: "p", type: "postgresql@16" };

test("database factories share the one managed provider identity", () => {
  for (const factory of [Postgres, MariaDB, Valkey]) {
    expect(factory.Type).toBe("Zerops.ManagedService");
    expect(factory.Provider).toBe(ManagedService.Provider);
    expect(typeof factory.ref).toBe("function");
  }
});
test("managed families send explicit availability qualifiers", () => {
  expect(managedType("postgresql@16")).toBe("postgresql:single@16");
  expect(managedType("valkey@7.2", "HA")).toBe("valkey:ha@7.2");
  expect(managedType("mariadb:single@10.6")).toBe("mariadb:single@10.6");
  expect(() => managedType("postgresql:ha@16", "NON_HA")).toThrow("conflicts");
});
test("PostgreSQL disk minimum is explicit and respects the configured floor", () => {
  for (const type of ["postgresql@16", "postgresql:single@16", "postgresql:ha@16"]) {
    expect(managedAutoscaling({ ...props, type }, 2).vertical?.minDisk).toBe(2);
    expect(managedAutoscaling({ ...props, type }, 5).vertical?.minDisk).toBe(5);
    expect(() =>
      managedAutoscaling({ ...props, type, autoscaling: { vertical: { minDisk: 1 } } }, 2),
    ).toThrow("minDisk");
  }
  expect(managedAutoscaling(props, 1).vertical?.minDisk).toBe(2);
  expect(managedAutoscaling({ ...props, type: "valkey@7.2" }, 2)).toEqual({});
});
test("configured environment floor is applied", () => {
  const previous = process.env.ZEROPS_POSTGRESQL_MIN_DISK_GB;
  try {
    process.env.ZEROPS_POSTGRESQL_MIN_DISK_GB = "7";
    expect(managedAutoscaling(props, readConfig().postgresqlMinDiskGb).vertical?.minDisk).toBe(7);
  } finally {
    if (previous === undefined) delete process.env.ZEROPS_POSTGRESQL_MIN_DISK_GB;
    else process.env.ZEROPS_POSTGRESQL_MIN_DISK_GB = previous;
  }
});
test("managed replacements follow identity and isolation, not scaling/env/state", () => {
  for (const change of [
    { project: "other" },
    { hostname: "other" },
    { type: "postgresql@17" },
    { mode: "HA" as const },
    { envIsolation: "none" },
    { sshIsolation: "vpn" },
  ]) {
    expect(managedNeedsReplace(props, { ...props, ...change })).toBe(true);
  }
  expect(managedNeedsReplace(props, { ...props, type: "postgresql:single@16" })).toBe(false);
  expect(
    managedNeedsReplace(props, {
      ...props,
      state: "stopped",
      env: { FOO: "bar" },
      autoscaling: { vertical: { maxRam: 2 } },
    }),
  ).toBe(false);
});
