import { createHash } from "node:crypto";
import { gzipSync, gunzipSync } from "node:zlib";
import { posix } from "node:path";

export interface Entry {
  path: string;
  type: "file" | "directory" | "symlink";
  mode: number;
  data: Buffer;
  target?: string;
}
export const sha256 = (data: Uint8Array): string => createHash("sha256").update(data).digest("hex");
const fail = (message: string): never => {
  throw new Error(message);
};
export function safePath(value: string): string {
  if (
    value.includes("\0") ||
    value.includes("\\") ||
    value.startsWith("/") ||
    /^[a-z]:/i.test(value)
  )
    fail("Unsafe archive path");
  const parts = value.split("/");
  if (parts.includes("..")) fail("Archive path traversal is not allowed");
  return parts.filter((p) => p !== "" && p !== ".").join("/");
}
export function safeLink(path: string, target: string): string {
  if (
    !target ||
    target.includes("\0") ||
    target.includes("\\") ||
    posix.isAbsolute(target) ||
    /^[a-z]:/i.test(target)
  )
    fail(`Unsafe symlink: ${path}`);
  // Do not collapse "..": its meaning depends on preceding symlink expansion.
  // canonicalEntries validates the complete chain in filesystem order.
  return target;
}
export function canonicalEntries(input: Entry[]): Entry[] {
  const entries = new Map<string, Entry>();
  for (const entry of input) {
    entry.path = safePath(entry.path);
    if (!entry.path) {
      if (entry.type === "directory") continue;
      fail("Empty file path");
    }
    if (entry.type === "symlink") entry.target = safeLink(entry.path, entry.target ?? "");
    if (entries.has(entry.path)) fail("Duplicate archive path");
    entries.set(entry.path, entry);
  }
  // Resolve chains component-by-component, including .. after a symlink.
  for (const entry of entries.values()) {
    if (entry.type !== "symlink") continue;
    const pending = [
      ...posix
        .dirname(entry.path)
        .split("/")
        .filter((p) => p !== "."),
      ...entry.target!.split("/"),
    ];
    const resolved: string[] = [];
    let expansions = 0;
    while (pending.length) {
      const part = pending.shift()!;
      if (!part || part === ".") continue;
      if (part === "..") {
        if (!resolved.length) fail(`Root-escaping symlink: ${entry.path}`);
        resolved.pop();
        continue;
      }
      const link = entries.get([...resolved, part].join("/"));
      if (link?.type === "symlink") {
        if (++expansions > 40) fail(`Cyclic symlink: ${entry.path}`);
        pending.unshift(...link.target!.split("/"));
      } else resolved.push(part);
    }
  }
  for (const entry of [...entries.values()]) {
    const parts = entry.path.split("/");
    parts.pop();
    while (parts.length) {
      const path = parts.join("/");
      const parent = entries.get(path);
      if (parent && parent.type !== "directory") fail("File used as archive directory");
      if (!parent)
        entries.set(path, { path, type: "directory", mode: 0o755, data: Buffer.alloc(0) });
      parts.pop();
    }
  }
  return [...entries.values()].sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
}
export const manifestDigest = (entries: Entry[]): string =>
  sha256(
    Buffer.from(
      JSON.stringify(
        entries.map((entry) => [
          entry.path,
          entry.type,
          entry.mode,
          entry.type === "file"
            ? sha256(entry.data)
            : entry.type === "symlink"
              ? entry.target
              : null,
        ]),
      ),
    ),
  );
function octal(header: Buffer, offset: number, length: number, value: number): void {
  const text = value.toString(8);
  if (text.length >= length) fail("Archive numeric field exceeds supported size");
  header.write(text.padStart(length - 1, "0") + "\0", offset, length, "ascii");
}
function header(path: string, type: string, mode: number, size: number, target?: string): Buffer {
  const bytes = Buffer.alloc(512);
  bytes.write(path, 0, 100, "utf8");
  if (target) bytes.write(target, 157, 100, "utf8");
  octal(bytes, 100, 8, mode);
  octal(bytes, 108, 8, 0);
  octal(bytes, 116, 8, 0);
  octal(bytes, 124, 12, size);
  octal(bytes, 136, 12, 0);
  bytes.fill(32, 148, 156);
  bytes.write(type, 156, 1);
  bytes.write("ustar\0", 257, 6);
  bytes.write("00", 263, 2);
  const checksum = bytes.reduce((sum, byte) => sum + byte, 0);
  bytes.write(checksum.toString(8).padStart(6, "0") + "\0 ", 148, 8);
  return bytes;
}
function paxRecord(key: string, value: string): Buffer {
  const body = `${key}=${value}\n`;
  let length = Buffer.byteLength(body) + 2;
  while (Buffer.byteLength(body) + String(length).length + 1 !== length)
    length = Buffer.byteLength(body) + String(length).length + 1;
  return Buffer.from(`${length} ${body}`);
}
export function encodeArchive(entries: Entry[]): Buffer {
  const chunks: Buffer[] = [];
  const append = (h: Buffer, data: Buffer) => {
    chunks.push(h, data);
    if (data.length % 512) chunks.push(Buffer.alloc(512 - (data.length % 512)));
  };
  for (const entry of entries) {
    const path = entry.path + (entry.type === "directory" ? "/" : "");
    const needsPax = Buffer.byteLength(path) > 100 || /[^\x20-\x7e]/.test(path);
    const longTarget =
      entry.target !== undefined &&
      (Buffer.byteLength(entry.target) > 100 || /[^\x20-\x7e]/.test(entry.target));
    if (needsPax || longTarget) {
      const pax = Buffer.concat([
        ...(needsPax ? [paxRecord("path", path)] : []),
        ...(longTarget ? [paxRecord("linkpath", entry.target!)] : []),
      ]);
      append(header("PaxHeader", "x", 0o644, pax.length), pax);
    }
    append(
      header(
        needsPax ? "PaxEntry" : path,
        entry.type === "directory" ? "5" : entry.type === "symlink" ? "2" : "0",
        entry.mode,
        entry.data.length,
        longTarget ? undefined : entry.target,
      ),
      entry.data,
    );
  }
  chunks.push(Buffer.alloc(1024));
  // Node zlib emits mtime=0, no name/comment, and a fixed OS byte.
  return gzipSync(Buffer.concat(chunks), { level: 9 });
}
function text(bytes: Buffer): string {
  const end = bytes.indexOf(0);
  return bytes.subarray(0, end < 0 ? bytes.length : end).toString("utf8");
}
function number(bytes: Buffer): number {
  if (bytes[0]! & 0x80) fail("Unsupported binary tar number");
  const value = text(bytes).trim();
  if (!/^[0-7]*$/.test(value)) fail("Invalid tar numeric field");
  const result = value ? parseInt(value, 8) : 0;
  if (!Number.isSafeInteger(result)) fail("Tar number exceeds safe integer range");
  return result;
}
function parsePax(data: Buffer): Record<string, string> {
  const values: Record<string, string> = Object.create(null);
  let offset = 0;
  while (offset < data.length) {
    const space = data.indexOf(32, offset);
    if (space < 0) fail("Invalid PAX record");
    const digits = data.subarray(offset, space).toString();
    const length = Number(digits);
    if (
      !/^\d+$/.test(digits) ||
      !Number.isSafeInteger(length) ||
      length <= space - offset + 1 ||
      offset + length > data.length ||
      data[offset + length - 1] !== 10
    )
      fail("Invalid PAX record length");
    const body = data.subarray(space + 1, offset + length - 1).toString("utf8");
    const equal = body.indexOf("=");
    if (equal < 1) fail("Invalid PAX field");
    values[body.slice(0, equal)] = body.slice(equal + 1);
    offset += length;
  }
  if (Object.keys(values).some((key) => /sparse/i.test(key)))
    fail("Sparse tar files are not supported");
  return values;
}
export function decodeArchive(archive: Uint8Array): Entry[] {
  const tar = gunzipSync(archive);
  const entries: Entry[] = [];
  let local: Record<string, string> = {};
  let global: Record<string, string> = {};
  let longName: string | undefined;
  let offset = 0;
  let ended = false;
  while (offset + 512 <= tar.length) {
    const h = tar.subarray(offset, offset + 512);
    offset += 512;
    if (h.every((byte) => byte === 0)) {
      ended = true;
      break;
    }
    const expected = number(h.subarray(148, 156));
    const sum = h.reduce((n, byte, index) => n + (index >= 148 && index < 156 ? 32 : byte), 0);
    if (expected !== sum) fail("Invalid tar header checksum");
    const type = String.fromCharCode(h[156]!);
    const extended = type === "x" || type === "g" || type === "L";
    const attrs = { ...global, ...local };
    let size = number(h.subarray(124, 136));
    if (!extended && attrs.size !== undefined) {
      if (!/^\d+$/.test(attrs.size)) fail("Invalid PAX size");
      size = Number(attrs.size);
    }
    if (!Number.isSafeInteger(size) || size < 0 || offset + size > tar.length)
      fail("Truncated tar entry");
    const data = tar.subarray(offset, offset + size);
    offset += Math.ceil(size / 512) * 512;
    if (type === "x") {
      local = parsePax(data);
      continue;
    }
    if (type === "g") {
      global = { ...global, ...parsePax(data) };
      continue;
    }
    if (type === "L") {
      longName = text(data);
      continue;
    }
    if (type !== "0" && type !== "\0" && type !== "5" && type !== "2")
      fail(
        "Only regular files, directories and safe symlinks are supported; devices and hard links are rejected",
      );
    const prefix = text(h.subarray(345, 500));
    const path = safePath(
      attrs.path ?? longName ?? (prefix ? prefix + "/" : "") + text(h.subarray(0, 100)),
    );
    const directory = type === "5";
    if ((directory || type === "2") && size !== 0) fail("Non-file entry contains tar data");
    entries.push({
      path,
      type: directory ? "directory" : type === "2" ? "symlink" : "file",
      mode:
        directory || type === "2" ? 0o755 : number(h.subarray(100, 108)) & 0o111 ? 0o755 : 0o644,
      data,
      ...(type === "2" ? { target: attrs.linkpath ?? text(h.subarray(157, 257)) } : {}),
    });
    local = {};
    longName = undefined;
  }
  if (!ended || tar.subarray(offset).some((byte) => byte !== 0))
    fail("Truncated tar or nonzero data after tar terminator");
  return canonicalEntries(entries);
}
