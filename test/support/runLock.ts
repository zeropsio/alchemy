import { constants, openSync, closeSync, fstatSync } from "node:fs";
import { isAbsolute } from "node:path";
import { dlopen, FFIType } from "bun:ffi";

const libc = dlopen("libc.so.6", {
  flock: { args: [FFIType.i32, FFIType.i32], returns: FFIType.i32 },
});
const held = new Map<string, number>();

/** Hold the shared Terraform acceptance lock until this process exits. */
export function acquireRunLock(): void {
  const path = process.env.ZEROPS_RUN_LOCK;
  if (!path) {
    if (process.env.ZEROPS_TARGET === "prod")
      throw new Error("Production requires an absolute ZEROPS_RUN_LOCK");
    return;
  }
  if (!isAbsolute(path)) throw new Error("ZEROPS_RUN_LOCK must be absolute");
  if (held.has(path)) return;
  let fd: number;
  try {
    fd = openSync(
      path,
      constants.O_WRONLY |
        constants.O_APPEND |
        constants.O_CREAT |
        constants.O_NOFOLLOW |
        constants.O_NONBLOCK,
      0o600,
    );
  } catch {
    throw new Error("Cannot open ZEROPS_RUN_LOCK");
  }
  try {
    if (!fstatSync(fd).isFile()) throw new Error("ZEROPS_RUN_LOCK must be a regular file");
    if (libc.symbols.flock(fd, 2 | 4) !== 0)
      throw new Error(
        "Another acceptance, smoke, or sweep run holds the run lock; refusing overlap",
      );
    held.set(path, fd);
  } catch (error) {
    closeSync(fd);
    throw error;
  }
}
