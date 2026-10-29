import { expect, test } from "bun:test";
import { redactDeployLog, redactLog } from "../../src/internal/DeployLog.ts";

test("resolved server-side connection credentials are redacted without a known-secret match", () => {
  for (const scheme of [
    "postgresql",
    "postgres",
    "mysql",
    "mariadb",
    "redis",
    "rediss",
    "valkey",
    "mongodb",
    "mongodb+srv",
    "amqp",
    "amqps",
    "custom+transport",
  ]) {
    const password = "generated-not-in-props%40private";
    const log = `DATABASE_URL=${scheme}://app:${password}@database.internal:5432/app?ssl=true`;
    const safe = redactDeployLog(log, ["${db_connectionString}"]);
    expect(safe).toBe("DATABASE_URL=[URL REDACTED]");
    expect(safe).not.toContain(password);
    expect(safe).not.toContain("database.internal");
  }
});

test("all URI userinfo is removed, including username-only credentials and multiple URIs", () => {
  expect(redactLog("custom://credential@host/a redis://user:pass@cache/0")).toBe(
    "[URL REDACTED] [URL REDACTED]",
  );
});

test("password assignments and authorization diagnostics are case-insensitively redacted", () => {
  const safe = redactDeployLog(
    "password=generated-one PASSWORD: generated-two db_password = generated-three",
  );
  expect(safe).toBe("password=[REDACTED] PASSWORD=[REDACTED] db_password=[REDACTED]");
  expect(redactLog("Bearer synthetic-token https://host/path?token=synthetic")).toBe(
    "Bearer [REDACTED] [URL REDACTED]",
  );
});

test("connection URI redaction precedes character-tail truncation across its credential boundary", () => {
  const password = "generated-password-that-must-not-survive";
  const connection = `postgresql://app:${password}@database.internal/app`;
  const suffix = "x".repeat(7940);
  const log = `prefix ${connection}${suffix}`;
  // Taking the raw tail first loses the scheme and exposes the credential suffix.
  expect(log.slice(-8000)).not.toContain("postgresql://");
  expect(log.slice(-8000)).toContain("must-not-survive");
  const safe = redactDeployLog(log);
  expect(safe).toBe("prefix [URL REDACTED]");
  expect(safe).not.toContain(password);
  expect(safe).not.toContain("database.internal");
});

test("complete multiline known secrets are removed before the line-tail boundary", () => {
  const secret = `private-start\n${"private-middle\n".repeat(90)}private-end`;
  const safe = redactDeployLog(`before\n${secret}\nafter`, [secret]);
  expect(safe).toBe("before\n[REDACTED]\nafter");
});
