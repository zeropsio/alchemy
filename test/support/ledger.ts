import {
  constants,
  openSync,
  closeSync,
  fstatSync,
  readFileSync,
  writeSync,
  fsyncSync,
} from "node:fs";
import { isAbsolute } from "node:path";
import { dlopen, FFIType } from "bun:ffi";

export function devLedgerPath(): string {
  const path = process.env.ZEROPS_DEV_LEDGER ?? "";
  if (!isAbsolute(path)) throw new Error("ZEROPS_DEV_LEDGER must be absolute");
  return path;
}
export interface LedgerRecord {
  readonly time: string;
  readonly kind: string;
  readonly id: string;
  readonly name: string;
  readonly source: string;
}
const libc = dlopen("libc.so.6", {
  flock: { args: [FFIType.i32, FFIType.i32], returns: FFIType.i32 },
});

// The same advisory lock as Go's ledger_unix.go, held only across synchronous I/O.
function withLedger<T>(path: string, use: (fd: number) => T): T {
  if (!isAbsolute(path)) throw new Error("ledger path must be absolute");
  let fd: number;
  try {
    fd = openSync(
      path,
      constants.O_RDWR |
        constants.O_CREAT |
        constants.O_APPEND |
        constants.O_NOFOLLOW |
        constants.O_NONBLOCK,
      0o600,
    );
  } catch {
    throw new Error("cannot open ledger");
  }
  try {
    const st = fstatSync(fd);
    if (!st.isFile() || st.uid !== process.geteuid!() || (st.mode & 0o7777) !== 0o600)
      throw new Error("ledger must be a regular, user-owned mode 0600 file");
    if (libc.symbols.flock(fd, 2) !== 0) throw new Error("cannot lock ledger");
    return use(fd);
  } finally {
    closeSync(fd);
  }
}

function parseLedger(fd: number): LedgerRecord[] {
  const records: LedgerRecord[] = [];
  for (const line of readFileSync(fd, "utf8").split("\n")) {
    if (!line) continue;
    const f = line.split("\t");
    if (
      f.length !== 5 ||
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(f[0]!) ||
      !Number.isFinite(Date.parse(f[0]!)) ||
      !["project", "ipv4", "note", "token", "dns", "repo"].includes(f[1]!)
    )
      throw new Error("invalid ledger record");
    records.push({ time: f[0]!, kind: f[1]!, id: f[2]!, name: f[3]!, source: f[4]! });
  }
  return records;
}

export function readLedger(path: string): ReadonlyArray<LedgerRecord> {
  return withLedger(path, parseLedger);
}

/** Recordable names: `alchtest-`, plus `alchfam-` for development family runs (refused on production). */
export const OWNED_NAME = /^alch(?:test|fam)-/;

// Ownership selectors feed production-only checks (guard, sweep), so they stay `alchtest-` only.
/** Intent names authorize cleanup by exact name, never arbitrary project mutations. */
export function alchemyProjectIntents(path: string): ReadonlySet<string> {
  return new Set(
    readLedger(path)
      .filter(
        (row) =>
          row.kind === "note" &&
          row.source === "alchemy" &&
          row.name === "project-create-intent" &&
          row.id.startsWith("alchtest-"),
      )
      .map((row) => row.id),
  );
}

export function recordProjectIntent(path: string, name: string): void {
  if (!OWNED_NAME.test(name) || /[\t\r\n]/.test(name)) throw new Error("invalid project intent");
  withLedger(path, (fd) => {
    parseLedger(fd);
    const row = `${new Date().toISOString()}\tnote\t${name}\tproject-create-intent\talchemy\n`;
    if (writeSync(fd, row) !== Buffer.byteLength(row)) throw new Error("cannot append ledger");
    fsyncSync(fd);
  });
}

export function alchemyProjects(path: string): ReadonlyMap<string, LedgerRecord> {
  const projects = new Map<string, LedgerRecord>();
  for (const row of readLedger(path))
    if (row.kind === "project") {
      // Last record wins, including a later record from another source.
      projects.delete(row.id);
      if (row.source === "alchemy" && row.name.startsWith("alchtest-")) projects.set(row.id, row);
    }
  return projects;
}

export function recordProject(path: string, id: string, name: string): void {
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(id) || !OWNED_NAME.test(name) || /[\t\r\n]/.test(name))
    throw new Error("invalid project ledger record");
  withLedger(path, (fd) => {
    const row = `${new Date().toISOString()}\tproject\t${id}\t${name}\talchemy\n`;
    if (writeSync(fd, row) !== Buffer.byteLength(row)) throw new Error("cannot append ledger");
    fsyncSync(fd);
  });
}
