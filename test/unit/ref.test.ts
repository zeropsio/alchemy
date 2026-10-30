import { test, expect } from "bun:test";
import * as Output from "alchemy/Output";
import { ref, type RefTarget, type ZeropsRef } from "../../src/ref.ts";
import { Postgres, MariaDB, Valkey } from "../../src/Families.ts";
import * as Effect from "effect/Effect";

function render(output: ZeropsRef): string {
  if (!Output.isApplyExpr(output)) throw new Error("Expected Output.map expression");
  if (!Output.isLiteralExpr(output.expr)) throw new Error("Expected hostname literal");
  return output.f(output.expr.value) as string;
}
test("ref maps hostname Output and keeps literal Zerops syntax", () => {
  const hostname = Output.literal("db");
  const target = { hostname } as unknown as RefTarget<"postgresql">;
  const output = ref(target, "connectionString");
  expect(Output.isApplyExpr(output)).toBe(true);
  expect((output as Output.ApplyExpr<string, string>).expr).toBe(hostname);
  expect(render(output)).toBe("${db_connectionString}");
  expect(render(ref("db", "password"))).toBe("${db_password}");
  expect(render(ref({ hostname: "cache" }, "customKey"))).toBe("${cache_customKey}");
});
test("references reject syntax injection", () => {
  expect(() => ref("db", "password}")).toThrow("identifier");
  expect(() => render(ref("bad-host", "password"))).toThrow("hostname");
});

// Compile-time contracts are intentionally not run as cloud declarations.
function typeContracts(pg: RefTarget<"postgresql">, cache: RefTarget<"valkey">) {
  ref(pg, "superUserPassword");
  ref(cache, "connectionTlsString");
  // @ts-expect-error PostgreSQL does not expose arbitrary catalogue keys.
  ref(pg, "notAKey");
  // @ts-expect-error Valkey does not have a database user.
  ref(cache, "user");
  ref({ hostname: Output.literal("custom") }, "explicitUnknownKey");
  const upstream = Effect.gen(function* () {
    const borrowed = yield* Postgres.ref("Database", { stack: "Shared", stage: "live" });
    ref(borrowed, "dbName");
    // @ts-expect-error Factory refs retain the family witness.
    ref(borrowed, "invalid");
    const valkey = yield* Valkey("Cache", { project: "p", version: "7.2" });
    // @ts-expect-error Factory declarations retain the family witness.
    ref(valkey, "superUser");
    const maria = yield* MariaDB("Maria", { project: "p", version: "10.6" });
    ref(maria, "port");
    ref(maria, "dbName");
    // @ts-expect-error MariaDB has no observed TLS connection string key.
    ref(maria, "connectionTlsString");
    // @ts-expect-error MariaDB has no PostgreSQL superuser key.
    ref(maria, "superUser");
  });
  return upstream;
}
void typeContracts;
