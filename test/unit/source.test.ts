import { afterEach, beforeEach, expect, test } from "bun:test";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import { chmod, mkdir, mkdtemp, readFile, rm, symlink, utimes, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { gzipSync, gunzipSync } from "node:zlib";
import { inspectSource, snapshotSource } from "../../src/source/Source.ts";
import { gitEnvironment } from "../../src/source/Git.ts";
import {
  canonicalEntries,
  decodeArchive,
  encodeArchive,
  type Entry,
} from "../../src/source/Archive.ts";
import { sourceHash } from "../../src/source/Hash.ts";
import {
  renderZeropsYaml,
  zeropsYamlSetups,
  type ZeropsYamlDoc,
} from "../../src/source/ZeropsYaml.ts";

let root: string;
beforeEach(async () => {
  await mkdir(resolve(import.meta.dirname, "../../.cache"), { recursive: true });
  root = await mkdtemp(resolve(import.meta.dirname, "../../.cache/source-test-"));
});
afterEach(async () => {
  await rm(root, { recursive: true, force: true });
});
const run = Effect.runPromise;
const file = (path: string, data = "hello", mode = 0o644): Entry => ({
  path,
  type: "file",
  mode,
  data: Buffer.from(data),
});
function git(cwd: string, ...args: string[]): string {
  const result = spawnSync("git", args, {
    cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      GIT_CONFIG_GLOBAL: "/dev/null",
      GIT_CONFIG_NOSYSTEM: "1",
      GIT_AUTHOR_NAME: "Source Test",
      GIT_AUTHOR_EMAIL: "source@example.invalid",
      GIT_COMMITTER_NAME: "Source Test",
      GIT_COMMITTER_EMAIL: "source@example.invalid",
    },
  });
  if (result.status !== 0) throw new Error(`Git fixture command failed: ${result.stderr}`);
  return result.stdout.trim();
}

test("directory inspection and deterministic snapshots normalize timestamps and permissions", async () => {
  await mkdir(resolve(root, "app"));
  await writeFile(resolve(root, "app/z.txt"), "last");
  await writeFile(resolve(root, "app/a.sh"), "first", { mode: 0o700 });
  await writeFile(resolve(root, "app/zerops.yml"), "zerops: []\n");
  const first = await run(snapshotSource({ dir: "app" }, { cwd: root }));
  await utimes(resolve(root, "app/z.txt"), 111, 222);
  await chmod(resolve(root, "app/z.txt"), 0o600);
  await chmod(resolve(root, "app/a.sh"), 0o755);
  const second = await run(snapshotSource({ dir: resolve(root, "app") }));
  expect(first.archive).toEqual(second.archive);
  expect(first.contentDigest).toBe(second.contentDigest);
  expect((await run(inspectSource({ dir: "app" }, { cwd: root }))).contentDigest).toBe(
    first.contentDigest,
  );
  expect(decodeArchive(first.archive).map((entry) => [entry.path, entry.mode])).toEqual([
    ["a.sh", 0o755],
    ["z.txt", 0o644],
    ["zerops.yml", 0o644],
  ]);
  expect(first.embeddedZeropsYaml).toBe("zerops: []\n");
  expect([...first.archive.slice(4, 8)]).toEqual([0, 0, 0, 0]);
});

test("entry order does not affect canonical manifest or upload bytes; executable bit does", async () => {
  const a = encodeArchive(canonicalEntries([file("z"), file("a")]));
  const b = encodeArchive(canonicalEntries([file("a"), file("z")]));
  expect(a).toEqual(b);
  await writeFile(resolve(root, "x"), "data");
  const before = await run(inspectSource({ dir: root }));
  await chmod(resolve(root, "x"), 0o755);
  expect((await run(inspectSource({ dir: root }))).contentDigest).not.toBe(before.contentDigest);
});

test("deployignore and option patterns support negation; hard excludes cannot be undone", async () => {
  for (const dir of [".git", ".alchemy", "nested/.git", "node_modules/.cache"])
    await mkdir(resolve(root, dir), { recursive: true });
  for (const path of [
    ".git/config",
    ".alchemy/state",
    "nested/.git/config",
    "node_modules/.cache/keep",
    ".env",
    "a.log",
    "keep.log",
    "option.txt",
    "normal",
  ])
    await writeFile(resolve(root, path), "x");
  await writeFile(resolve(root, ".deployignore"), "*.log\n!keep.log\n");
  const snapshot = await run(
    snapshotSource({ dir: root, ignore: ["option.txt", "!.git/config", "!.alchemy/state"] }),
  );
  const paths = decodeArchive(snapshot.archive).map((entry) => entry.path);
  expect(paths).toContain("keep.log");
  expect(paths).toContain(".env");
  expect(paths).toContain("node_modules/.cache/keep");
  expect(paths).not.toContain("a.log");
  expect(paths).not.toContain("option.txt");
  expect(
    paths.some((path) => path.split("/").includes(".git") || path.split("/").includes(".alchemy")),
  ).toBe(false);
});

test("relative internal symlinks roundtrip and escaping or absolute symlinks fail", async () => {
  await mkdir(resolve(root, "dir"));
  await writeFile(resolve(root, "target"), "hello");
  await symlink("../target", resolve(root, "dir/link"));
  const snapshot = await run(snapshotSource({ dir: root }));
  expect(decodeArchive(snapshot.archive).find((entry) => entry.path === "dir/link")).toMatchObject({
    type: "symlink",
    target: "../target",
    mode: 0o755,
  });
  await symlink("../../outside", resolve(root, "escape"));
  await expect(run(snapshotSource({ dir: root }))).rejects.toThrow("escape");
  await rm(resolve(root, "escape"));
  await symlink("/etc/passwd", resolve(root, "absolute"));
  await expect(run(inspectSource({ dir: root }))).rejects.toThrow("absolute");
});

test("symlink targets retain filesystem-order resolution through an intermediate link and ..", async () => {
  await mkdir(resolve(root, "real/sub"), { recursive: true });
  await writeFile(resolve(root, "real/file"), "correct target");
  await writeFile(resolve(root, "file"), "wrong lexical target");
  await symlink("real/sub", resolve(root, "alias"));
  await symlink("alias/../file", resolve(root, "x"));
  const snapshot = await run(snapshotSource({ dir: root }));
  const entries = decodeArchive(snapshot.archive);
  expect(entries.find((entry) => entry.path === "x")?.target).toBe("alias/../file");
  const extracted = resolve(root, "extracted");
  await mkdir(extracted);
  for (const entry of entries) {
    const destination = resolve(extracted, entry.path);
    if (entry.type === "directory") await mkdir(destination, { recursive: true });
    else if (entry.type === "file") await writeFile(destination, entry.data);
    else await symlink(entry.target!, destination);
  }
  expect(await readFile(resolve(extracted, "x"), "utf8")).toBe("correct target");
  expect(decodeArchive(encodeArchive(entries))).toEqual(entries);
  // This target looks lexically safe, but expansion of alias escapes the root.
  expect(() =>
    canonicalEntries([
      { path: "alias", type: "symlink", mode: 0o755, data: Buffer.alloc(0), target: "." },
      {
        path: "x",
        type: "symlink",
        mode: 0o755,
        data: Buffer.alloc(0),
        target: "alias/../outside",
      },
    ]),
  ).toThrow("Root-escaping symlink: x");
});

test("PAX long and Unicode paths and symlink targets preserve content", () => {
  const path = `parent/${"x".repeat(150)}/é.txt`;
  const entries = canonicalEntries([
    file(path),
    { path: "link", type: "symlink", mode: 0o755, data: Buffer.alloc(0), target: path },
  ]);
  expect(decodeArchive(encodeArchive(entries))).toEqual(entries);
});

// Edit a tar header and recalculate its checksum to exercise hostile input paths/types.
function alteredArchive(path: string, type = "0"): Buffer {
  const tar = gunzipSync(encodeArchive([file("safe")]));
  tar.fill(0, 0, 100);
  tar.write(path, 0, 100);
  tar.write(type, 156, 1);
  tar.fill(32, 148, 156);
  tar.write(
    tar
      .subarray(0, 512)
      .reduce((sum, byte) => sum + byte, 0)
      .toString(8)
      .padStart(6, "0") + "\0 ",
    148,
    8,
  );
  return gzipSync(tar);
}
test("archive rejects traversal, absolute paths, devices, hard links, corrupt and truncated data", () => {
  for (const path of ["/absolute", "../escape", "a/../../escape", "C:/escape", "a\\b"])
    expect(() => decodeArchive(alteredArchive(path))).toThrow();
  for (const type of ["3", "4", "6", "1"])
    expect(() => decodeArchive(alteredArchive("safe", type))).toThrow();
  expect(() => decodeArchive(Buffer.from("not gzip"))).toThrow();
  expect(() => decodeArchive(gzipSync(Buffer.alloc(511)))).toThrow();
  expect(() =>
    encodeArchive(
      canonicalEntries([
        { path: "link", type: "symlink", mode: 0o755, data: Buffer.alloc(0), target: "../outside" },
      ]),
    ),
  ).toThrow("link");
});

test("archive recompression and metadata normalize to directory identity without stripping wrappers", async () => {
  const dir = resolve(root, "app");
  await mkdir(resolve(dir, "wrapper"), { recursive: true });
  await writeFile(resolve(dir, "wrapper/file"), "data");
  const original = await run(snapshotSource({ dir }));
  const tar = gunzipSync(original.archive);
  for (let offset = 0; offset < tar.length - 1024;) {
    const h = tar.subarray(offset, offset + 512);
    const size = parseInt(h.subarray(124, 136).toString().replace(/\0/g, ""), 8);
    h.write("00000123456\0", 136, 12);
    h.write("0000123\0", 108, 8);
    h.fill(32, 148, 156);
    h.write(
      h
        .reduce((sum, byte) => sum + byte, 0)
        .toString(8)
        .padStart(6, "0") + "\0 ",
      148,
      8,
    );
    offset += 512 + Math.ceil(size / 512) * 512;
  }
  await writeFile(resolve(root, "input.tgz"), gzipSync(tar, { level: 1 }));
  const candidate = await run(inspectSource({ archive: "input.tgz" }, { cwd: root }));
  const normalized = await run(snapshotSource({ archive: resolve(root, "input.tgz") }));
  expect(candidate.contentDigest).toBe(original.contentDigest);
  expect(normalized.contentDigest).toBe(original.contentDigest);
  expect(normalized.archive).toEqual(original.archive);
  expect(decodeArchive(normalized.archive).map((entry) => entry.path)).toEqual([
    "wrapper",
    "wrapper/file",
  ]);
});

test("git resolves branch, peeled annotated tag and SHA; snapshots tag's exact old commit", async () => {
  const working = resolve(root, "working");
  const bare = resolve(root, "remote.git");
  await mkdir(working);
  git(working, "init", "-b", "main");
  await writeFile(resolve(working, "code"), "old");
  await writeFile(resolve(working, "zerops.yaml"), "zerops: []\n");
  git(working, "add", ".");
  git(working, "commit", "-m", "old");
  const old = git(working, "rev-parse", "HEAD");
  git(working, "tag", "-a", "release", "-m", "release");
  await writeFile(resolve(working, "code"), "new");
  git(working, "commit", "-am", "new");
  const latest = git(working, "rev-parse", "HEAD");
  git(root, "clone", "--bare", working, bare);
  expect((await run(inspectSource({ git: { url: bare, ref: "main" } }))).gitCommit).toBe(latest);
  expect((await run(inspectSource({ git: { url: bare, ref: "release" } }))).gitCommit).toBe(old);
  expect(
    (await run(inspectSource({ git: { url: "nonexistent-no-network", ref: old.toUpperCase() } })))
      .gitCommit,
  ).toBe(old);
  await expect(run(inspectSource({ git: { url: bare, ref: "missing" } }))).rejects.toThrow(
    "not found",
  );
  const snapshot = await run(snapshotSource({ git: { url: bare, ref: "release" } }));
  expect(snapshot.gitCommit).toBe(old);
  expect(snapshot.embeddedZeropsYaml).toBe("zerops: []\n");
  expect(
    decodeArchive(snapshot.archive)
      .find((entry) => entry.path === "code")
      ?.data.toString(),
  ).toBe("old");
  expect(decodeArchive(snapshot.archive).some((entry) => entry.path.includes(".git"))).toBe(false);
});

test("private Git auth is only in origin-bound environment, never argv or errors", async () => {
  const bin = resolve(root, "bin");
  await mkdir(bin);
  const log = resolve(root, "git-log.json");
  const secret = "test-only-secret-never-real";
  const sha = "a".repeat(40);
  await writeFile(
    resolve(bin, "git"),
    `#!${process.execPath}\nconst args=process.argv.slice(2); await Bun.write(${JSON.stringify(log)},JSON.stringify({args, prompt:process.env.GIT_TERMINAL_PROMPT,key:process.env.GIT_CONFIG_KEY_1,hasAuth:process.env.GIT_CONFIG_VALUE_1?.startsWith('Authorization: Basic ')})); console.log('${sha}\\trefs/heads/main');\n`,
    { mode: 0o755 },
  );
  const path = process.env.PATH;
  process.env.PATH = `${bin}:${path}`;
  try {
    expect(
      (
        await run(
          inspectSource({
            git: {
              url: "https://git.example.invalid/repo",
              ref: "main",
              auth: Redacted.make(secret),
            },
          }),
        )
      ).gitCommit,
    ).toBe(sha);
    const text = await readFile(log, "utf8");
    const recorded = JSON.parse(text);
    expect(text).not.toContain(secret);
    expect(text).not.toContain(Buffer.from(`x-access-token:${secret}`).toString("base64"));
    expect(recorded.key).toBe("http.https://git.example.invalid/.extraHeader");
    expect(recorded.hasAuth).toBe(true);
    expect(recorded.prompt).toBe("0");
    await expect(
      run(
        inspectSource({
          git: { url: `https://user:${secret}@git.example.invalid/repo`, ref: "main" },
        }),
      ),
    ).rejects.toThrow("credentials are forbidden");
  } finally {
    process.env.PATH = path;
  }
});

test("hash framing keeps ambiguous component boundaries and explicit trigger presence distinct", () => {
  const parts = { contentDigest: "ab", zeropsYaml: "c", setup: "app", build: true };
  const hash = sourceHash(parts);
  expect(hash).toMatch(/^[a-f0-9]{64}$/);
  expect(sourceHash({ ...parts, contentDigest: "a", zeropsYaml: "bc" })).not.toBe(hash);
  expect(sourceHash({ ...parts, build: false })).not.toBe(hash);
  expect(sourceHash({ ...parts, redeploy: "" })).not.toBe(hash);
  expect(sourceHash({ ...parts, redeploy: "again" })).not.toBe(hash);
});

test("typed YAML rendering and setup listing, including invalid YAML diagnostics", async () => {
  const doc: ZeropsYamlDoc = {
    zerops: [
      {
        setup: "app",
        build: { base: "alpine/nodejs@22", deployFiles: ["dist"] },
        run: {
          base: "alpine/nodejs@22",
          ports: [{ port: 3000, httpSupport: true }],
          start: "node dist/main.js",
        },
      },
      { setup: "worker" },
    ],
  };
  const text = renderZeropsYaml(doc);
  expect(renderZeropsYaml(text)).toBe(text);
  expect(await run(zeropsYamlSetups(text))).toEqual(["app", "worker"]);
  await expect(run(zeropsYamlSetups("zerops: ["))).rejects.toThrow("Invalid Zerops YAML syntax");
  await expect(run(zeropsYamlSetups("zerops: [{ setup: 2 }]"))).rejects.toThrow(
    "setup must be a nonempty string",
  );
});

test("Git SHA-fetch fallback verifies identity and scoped checkout is removed on success and failure", async () => {
  const bin = resolve(root, "bin");
  await mkdir(bin);
  const log = resolve(root, "commands.jsonl");
  const sha = "b".repeat(40);
  await writeFile(
    resolve(bin, "git"),
    `#!${process.execPath}
const args=process.argv.slice(2);
import * as fs from "node:fs/promises";
await fs.appendFile(${JSON.stringify(log)}, JSON.stringify({args,cwd:process.cwd()})+"\\n");
if(args[0]==="ls-remote") console.log("${sha}\\trefs/heads/main");
if(args[0]==="fetch" && args.at(-1)==="${sha}") process.exit(1);
if(args[0]==="rev-parse") console.log(process.env.SOURCE_TEST_MOVED ? "${"c".repeat(40)}" : "${sha}");
if(args.includes("checkout")) await fs.writeFile("app.txt","exact");
`,
    { mode: 0o755 },
  );
  const path = process.env.PATH;
  process.env.PATH = `${bin}:${path}`;
  try {
    const result = await run(
      snapshotSource({ git: { url: "https://git.example.invalid/repo", ref: "main" } }),
    );
    expect(result.gitCommit).toBe(sha);
    expect(
      decodeArchive(result.archive)
        .find((entry) => entry.path === "app.txt")
        ?.data.toString(),
    ).toBe("exact");
    const commands = (await readFile(log, "utf8"))
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line) as { args: string[]; cwd: string });
    expect(
      commands.filter((entry) => entry.args[0] === "fetch").map((entry) => entry.args.at(-1)),
    ).toEqual([sha, "main"]);
    const checkout = commands.find((entry) => entry.args.includes("checkout"))!;
    await expect(readFile(resolve(checkout.cwd, "app.txt"))).rejects.toThrow("ENOENT");
    await writeFile(log, "");
    process.env.SOURCE_TEST_MOVED = "1";
    await expect(
      run(snapshotSource({ git: { url: "https://git.example.invalid/repo", ref: "main" } })),
    ).rejects.toThrow("does not match");
    const failed = (await readFile(log, "utf8"))
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line) as { args: string[]; cwd: string });
    expect(failed.some((entry) => entry.args.includes("checkout"))).toBe(false);
    await expect(
      readFile(resolve(failed.find((entry) => entry.args[0] === "init")!.cwd, "anything")),
    ).rejects.toThrow("ENOENT");
  } finally {
    process.env.PATH = path;
    delete process.env.SOURCE_TEST_MOVED;
  }
});

test("Git environment drops all inherited overrides and installs provider-owned config", () => {
  const overrides = {
    GIT_DIR: "/untrusted/repo",
    GIT_WORK_TREE: "/untrusted/tree",
    GIT_INDEX_FILE: "/untrusted/index",
    GIT_CONFIG_COUNT: "99",
    GIT_CONFIG_KEY_99: "core.hooksPath",
    GIT_CONFIG_VALUE_99: "/untrusted/hooks",
    GIT_CONFIG_PARAMETERS: "'protocol.ext.allow=always'",
    GIT_SSH_COMMAND: "untrusted-helper",
    GIT_TRACE: "/untrusted/trace",
    GIT_FUTURE_OVERRIDE: "must-not-survive",
    SSH_ASKPASS: "untrusted-askpass",
  };
  const previous = Object.fromEntries(Object.keys(overrides).map((key) => [key, process.env[key]]));
  Object.assign(process.env, overrides);
  try {
    const env = gitEnvironment({ url: "https://example.invalid/repo", ref: "main" });
    for (const key of Object.keys(overrides)) {
      if (key === "GIT_CONFIG_COUNT") expect(env[key]).toBe("1");
      else expect(env[key]).toBeUndefined();
    }
    expect(env.GIT_CONFIG_KEY_0).toBe("core.hooksPath");
    expect(env.GIT_CONFIG_VALUE_0).toBe("/dev/null");
    expect(env.GIT_CONFIG_NOSYSTEM).toBe("1");
    expect(env.GIT_CONFIG_GLOBAL).toBe("/dev/null");
    expect(env.GIT_TERMINAL_PROMPT).toBe("0");
    expect(env.GIT_ALLOW_PROTOCOL).toBe("https:http:file");
    expect(env.PATH).toBe(process.env.PATH);
    expect(env.HOME).toBe(process.env.HOME);
  } finally {
    for (const [key, value] of Object.entries(previous))
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
  }
});

test("Git snapshots cannot modify an inherited checkout or run its hooks", async () => {
  const working = resolve(root, "working");
  const bare = resolve(root, "remote.git");
  await mkdir(working);
  git(working, "init", "-b", "main");
  await writeFile(resolve(working, "code"), "remote snapshot");
  git(working, "add", ".");
  git(working, "commit", "-m", "remote");
  const remoteCommit = git(working, "rev-parse", "HEAD");
  git(root, "clone", "--bare", working, bare);
  await writeFile(resolve(working, "code"), "keep this checkout");
  git(working, "commit", "-am", "local only");
  const head = git(working, "rev-parse", "HEAD");
  const index = await readFile(resolve(working, ".git/index"));
  const config = await readFile(resolve(working, ".git/config"));
  const hookMarker = resolve(root, "hook-ran");
  await writeFile(
    resolve(working, ".git/hooks/post-checkout"),
    `#!/bin/sh\nprintf ran > '${hookMarker}'\n`,
    { mode: 0o755 },
  );
  const overrides = {
    GIT_DIR: resolve(working, ".git"),
    GIT_WORK_TREE: working,
    GIT_INDEX_FILE: resolve(working, ".git/index"),
  };
  const previous = Object.fromEntries(Object.keys(overrides).map((key) => [key, process.env[key]]));
  Object.assign(process.env, overrides);
  try {
    const snapshot = await run(snapshotSource({ git: { url: bare, ref: "main" } }));
    expect(snapshot.gitCommit).toBe(remoteCommit);
    expect(
      decodeArchive(snapshot.archive)
        .find((entry) => entry.path === "code")
        ?.data.toString(),
    ).toBe("remote snapshot");
  } finally {
    for (const [key, value] of Object.entries(previous))
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
  }
  expect(git(working, "rev-parse", "HEAD")).toBe(head);
  expect(await readFile(resolve(working, "code"), "utf8")).toBe("keep this checkout");
  expect(await readFile(resolve(working, ".git/index"))).toEqual(index);
  expect(await readFile(resolve(working, ".git/config"))).toEqual(config);
  await expect(readFile(hookMarker)).rejects.toThrow("ENOENT");
});
