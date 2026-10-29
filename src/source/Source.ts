import * as Effect from "effect/Effect";
import type * as Redacted from "effect/Redacted";
import { mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { decodeArchive, encodeArchive, manifestDigest, type Entry } from "./Archive.ts";
import { collectDirectory } from "./Directory.ts";
import { checkoutGit, resolveGit } from "./Git.ts";
import { ZeropsSourceError } from "./SourceError.ts";

/** .git and .alchemy are always excluded from directory/Git sources. .env and
 * node_modules/.cache are NOT implicitly excluded; use .deployignore or ignore.
 * Relative internal symlinks are preserved (mode 0755, verbatim target);
 * absolute, escaping, cyclic and dangling directory-source links are rejected.
 * Plan inspection is advisory: reconciliation captures fresh source contents. */
export type ServiceSource =
  | { readonly dir: string; readonly ignore?: ReadonlyArray<string> }
  | { readonly archive: string }
  | {
      readonly git: {
        readonly url: string;
        readonly ref: string;
        readonly auth?: Redacted.Redacted<string>;
      };
    };
export interface SourceCandidate {
  readonly kind: "dir" | "archive" | "git";
  readonly contentDigest?: string;
  readonly gitCommit?: string;
}
export interface SourceSnapshot {
  readonly kind: "dir" | "archive" | "git";
  readonly archive: Uint8Array;
  readonly contentDigest: string;
  readonly gitCommit?: string;
  readonly embeddedZeropsYaml?: string;
}
const attempt = <A>(
  operation: (signal: AbortSignal) => Promise<A>,
): Effect.Effect<A, ZeropsSourceError> =>
  Effect.tryPromise({
    try: operation,
    catch: (cause) =>
      new ZeropsSourceError({
        message: cause instanceof Error ? cause.message : "Source operation failed",
      }),
  });
function kind(source: ServiceSource): SourceSnapshot["kind"] {
  const keys = ["dir", "archive", "git"].filter((key) => key in source);
  if (keys.length !== 1) throw new Error("Exactly one source mode is required");
  return keys[0] as SourceSnapshot["kind"];
}
async function localEntries(
  source: Exclude<ServiceSource, { git: unknown }>,
  cwd: string,
): Promise<Entry[]> {
  return "dir" in source
    ? collectDirectory(resolve(cwd, source.dir), source.ignore)
    : decodeArchive(await readFile(resolve(cwd, source.archive)));
}
function snapshot(
  entries: Entry[],
  kind: SourceSnapshot["kind"],
  gitCommit?: string,
): SourceSnapshot {
  const yaml =
    entries.find((entry) => entry.path === "zerops.yml" && entry.type === "file") ??
    entries.find((entry) => entry.path === "zerops.yaml" && entry.type === "file");
  return {
    kind,
    archive: encodeArchive(entries),
    contentDigest: manifestDigest(entries),
    ...(gitCommit ? { gitCommit } : {}),
    ...(yaml ? { embeddedZeropsYaml: yaml.data.toString("utf8") } : {}),
  };
}
export const inspectSource = (
  source: ServiceSource,
  options?: { cwd?: string },
): Effect.Effect<SourceCandidate, ZeropsSourceError> =>
  attempt(async (signal) => {
    const sourceKind = kind(source);
    if ("git" in source)
      return { kind: sourceKind, gitCommit: await resolveGit(source.git, signal) };
    return {
      kind: sourceKind,
      contentDigest: manifestDigest(await localEntries(source, options?.cwd ?? process.cwd())),
    };
  });
export const snapshotSource = (
  source: ServiceSource,
  options?: { cwd?: string },
): Effect.Effect<SourceSnapshot, ZeropsSourceError> =>
  Effect.scoped(
    Effect.gen(function* () {
      const sourceKind = yield* attempt(async () => kind(source));
      if (!("git" in source))
        return yield* attempt(async () =>
          snapshot(await localEntries(source, options?.cwd ?? process.cwd()), sourceKind),
        );
      const commit = yield* attempt((signal) => resolveGit(source.git, signal));
      const directory = yield* Effect.acquireRelease(
        attempt(async () => {
          const cache = resolve(import.meta.dirname, "../../.cache");
          await mkdir(cache, { recursive: true });
          return mkdtemp(resolve(cache, "source-git-"));
        }),
        (path) => Effect.promise(() => rm(path, { recursive: true, force: true })),
      );
      return yield* attempt(async (signal) => {
        await checkoutGit(source.git, commit, directory, signal);
        return snapshot(await collectDirectory(directory), sourceKind, commit);
      });
    }),
  );
