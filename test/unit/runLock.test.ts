import { afterEach, beforeEach, expect, test } from "bun:test";
import { mkdtempSync, rmSync, symlinkSync, statSync } from "node:fs";
import { join } from "node:path";
import { acquireRunLock } from "../support/runLock.ts";

let dir: string;
let saved: NodeJS.ProcessEnv;
beforeEach(() => {
  saved = { ...process.env };
  dir = mkdtempSync("/tmp/alchemy-run-lock-");
  delete process.env.ZEROPS_RUN_LOCK;
});
afterEach(() => {
  for (const key of Object.keys(process.env)) if (!(key in saved)) delete process.env[key];
  Object.assign(process.env, saved);
  rmSync(dir, { recursive: true, force: true });
});
const modulePath = new URL("../support/runLock.ts", import.meta.url).href;
const script = `import { acquireRunLock } from ${JSON.stringify(modulePath)}; acquireRunLock();`;
function childEnv(path: string) {
  return { ZEROPS_TARGET: "prod", ZEROPS_RUN_LOCK: path };
}

test("production requires an absolute shared lock, development may omit it", () => {
  process.env.ZEROPS_TARGET = "dev";
  expect(acquireRunLock).not.toThrow();
  process.env.ZEROPS_TARGET = "prod";
  expect(acquireRunLock).toThrow("absolute ZEROPS_RUN_LOCK");
  process.env.ZEROPS_RUN_LOCK = "relative.lock";
  expect(acquireRunLock).toThrow("absolute");
});

test("run lock rejects symlinks and non-regular files", () => {
  process.env.ZEROPS_RUN_LOCK = join(dir, "link");
  symlinkSync(join(dir, "missing"), process.env.ZEROPS_RUN_LOCK);
  expect(acquireRunLock).toThrow("Cannot open");
  process.env.ZEROPS_RUN_LOCK = dir;
  expect(acquireRunLock).toThrow();
});

test("lock is private, idempotent in-process, and refuses other processes non-blockingly", () => {
  const path = join(dir, "run.lock");
  process.env.ZEROPS_RUN_LOCK = path;
  acquireRunLock();
  expect(statSync(path).mode & 0o777).toBe(0o600);
  expect(acquireRunLock).not.toThrow();
  const loser = Bun.spawnSync([process.execPath, "--eval", script], { env: childEnv(path) });
  expect(loser.exitCode).not.toBe(0);
  expect(loser.stderr.toString()).toContain(
    "Another acceptance, smoke, or sweep run holds the run lock; refusing overlap",
  );
});

test("process-lifetime lock releases only when the owning process exits", async () => {
  const path = join(dir, "lifetime.lock");
  const owner = Bun.spawn(
    [process.execPath, "--eval", script + `console.log("locked"); await Bun.stdin.text();`],
    {
      env: childEnv(path),
      stdin: "pipe",
      stdout: "pipe",
      stderr: "pipe",
    },
  );
  try {
    const reader = owner.stdout.getReader();
    const ready = await reader.read();
    expect(new TextDecoder().decode(ready.value)).toContain("locked");
    reader.releaseLock();
    const loser = Bun.spawnSync([process.execPath, "--eval", script], { env: childEnv(path) });
    expect(loser.exitCode).not.toBe(0);
    owner.stdin.end();
    expect(await owner.exited).toBe(0);
    const next = Bun.spawnSync([process.execPath, "--eval", script], { env: childEnv(path) });
    expect(next.exitCode).toBe(0);
  } finally {
    owner.kill();
    await owner.exited;
  }
});
