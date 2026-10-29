import { spawn } from "node:child_process";
import * as Redacted from "effect/Redacted";

export interface GitSource {
  readonly url: string;
  readonly ref: string;
  readonly auth?: Redacted.Redacted<string>;
}

export function gitEnvironment(source: GitSource): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {};
  // No inherited repository selection, config injection, transport helpers or tracing.
  for (const [key, value] of Object.entries(process.env))
    if (!key.startsWith("GIT_") && key !== "SSH_ASKPASS") env[key] = value;
  Object.assign(env, {
    GIT_TERMINAL_PROMPT: "0",
    GIT_CONFIG_NOSYSTEM: "1",
    GIT_CONFIG_GLOBAL: "/dev/null",
    // HTTP(S) remotes and local path/file fixtures are supported; no helper protocols.
    GIT_ALLOW_PROTOCOL: "https:http:file",
    GIT_CONFIG_COUNT: "1",
    GIT_CONFIG_KEY_0: "core.hooksPath",
    GIT_CONFIG_VALUE_0: "/dev/null",
  });
  // Never allow credentials embedded in URL arguments; auth must be Redacted.
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(source.url)) {
    const url = new URL(source.url);
    if (url.username || url.password)
      throw new Error("Git URL credentials are forbidden; use git.auth");
  }
  if (source.auth) {
    const url = new URL(source.url);
    if (url.protocol !== "https:" && url.protocol !== "http:")
      throw new Error("Git token authentication requires an HTTP(S) remote");
    Object.assign(env, {
      GIT_CONFIG_COUNT: "3",
      GIT_CONFIG_KEY_1: `http.${url.origin}/.extraHeader`,
      GIT_CONFIG_VALUE_1: `Authorization: Basic ${Buffer.from(`x-access-token:${Redacted.value(source.auth)}`).toString("base64")}`,
      GIT_CONFIG_KEY_2: "http.followRedirects",
      GIT_CONFIG_VALUE_2: "false",
    });
  }
  return env;
}
/** No shell and no raw git stderr/cause: git may echo credentials supplied by a remote. */
export function runGit(
  args: string[],
  env: NodeJS.ProcessEnv,
  cwd?: string,
  signal?: AbortSignal,
): Promise<string> {
  const { promise, resolve, reject } = Promise.withResolvers<string>();
  const child = spawn("git", args, { cwd, env, signal, stdio: ["ignore", "pipe", "ignore"] });
  const chunks: Buffer[] = [];
  child.stdout.on("data", (chunk: Buffer) => chunks.push(chunk));
  child.once("error", () => reject(new Error("Git command could not run")));
  child.once("close", (code) =>
    code === 0
      ? resolve(Buffer.concat(chunks).toString("utf8"))
      : reject(new Error("Git command failed")),
  );
  return promise;
}
export async function resolveGit(source: GitSource, signal?: AbortSignal): Promise<string> {
  if (/^[a-f0-9]{40}$/i.test(source.ref)) return source.ref.toLowerCase();
  if (
    !source.ref ||
    source.ref.startsWith("-") ||
    /[\x00-\x20~^:?*\[\\]/.test(source.ref) ||
    source.ref.includes("..")
  )
    throw new Error("Invalid Git ref");
  const refs = source.ref.startsWith("refs/")
    ? [source.ref]
    : [`refs/heads/${source.ref}`, `refs/tags/${source.ref}`];
  const output = await runGit(
    ["ls-remote", "--", source.url, ...refs.flatMap((ref) => [ref, `${ref}^{}`])],
    gitEnvironment(source),
    undefined,
    signal,
  );
  const found = new Map(
    output
      .trim()
      .split("\n")
      .map((line) => line.split(/\s+/))
      .filter((pair) => /^[a-f0-9]{40}$/i.test(pair[0] ?? ""))
      .map(([sha, ref]) => [ref!, sha!.toLowerCase()]),
  );
  for (const ref of refs) {
    const commit = found.get(`${ref}^{}`) ?? found.get(ref);
    if (commit) return commit;
  }
  throw new Error("Git ref was not found on the remote");
}
export async function checkoutGit(
  source: GitSource,
  commit: string,
  cwd: string,
  signal?: AbortSignal,
): Promise<void> {
  const env = gitEnvironment(source);
  await runGit(["init", "--quiet", "."], env, cwd, signal);
  try {
    await runGit(["fetch", "--quiet", "--depth", "1", "--", source.url, commit], env, cwd, signal);
  } catch {
    if (/^[a-f0-9]{40}$/i.test(source.ref))
      throw new Error("Git remote refused the exact commit fetch");
    await runGit(
      ["fetch", "--quiet", "--depth", "1", "--", source.url, source.ref],
      env,
      cwd,
      signal,
    );
  }
  const fetched = (await runGit(["rev-parse", "FETCH_HEAD^{commit}"], env, cwd, signal)).trim();
  if (fetched !== commit)
    throw new Error("Git ref moved while fetching; fetched commit does not match resolved commit");
  await runGit(["checkout", "--quiet", "--detach", commit], env, cwd, signal);
}
