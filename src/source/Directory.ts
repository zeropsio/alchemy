import { lstat, readdir, readFile, readlink, realpath } from "node:fs/promises";
import { resolve, relative, sep } from "node:path";
import ignore from "ignore";
import { canonicalEntries, safeLink, type Entry } from "./Archive.ts";

/** Always excludes .git and .alchemy at any depth. .env and caches are included
 * unless explicitly ignored: silently dropping application inputs is unsafe. */
export async function collectDirectory(
  root: string,
  patterns: ReadonlyArray<string> = [],
): Promise<Entry[]> {
  root = await realpath(root);
  const matcher = ignore();
  try {
    matcher.add(await readFile(resolve(root, ".deployignore"), "utf8"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  matcher.add([...patterns]);
  const entries: Entry[] = [];
  async function walk(dir: string, prefix: string): Promise<void> {
    const names = (await readdir(dir)).sort();
    for (const name of names) {
      if (name === ".git" || name === ".alchemy") continue;
      const path = prefix ? `${prefix}/${name}` : name;
      const absolute = resolve(dir, name);
      const stat = await lstat(absolute);
      const directory = stat.isDirectory();
      if (matcher.ignores(path + (directory ? "/" : ""))) continue;
      if (directory) {
        entries.push({ path, type: "directory", mode: 0o755, data: Buffer.alloc(0) });
        await walk(absolute, path);
      } else if (stat.isSymbolicLink()) {
        const target = safeLink(path, await readlink(absolute));
        // realpath also catches escapes through links outside the collected tree.
        const actual = await realpath(absolute);
        const rel = relative(root, actual);
        if (rel === ".." || rel.startsWith(`..${sep}`))
          throw new Error(`Root-escaping symlink: ${path}`);
        entries.push({ path, type: "symlink", mode: 0o755, data: Buffer.alloc(0), target });
      } else if (stat.isFile()) {
        entries.push({
          path,
          type: "file",
          mode: stat.mode & 0o111 ? 0o755 : 0o644,
          data: await readFile(absolute),
        });
      } else throw new Error(`Unsupported source file type: ${path}`);
    }
  }
  await walk(root, "");
  return canonicalEntries(entries);
}
