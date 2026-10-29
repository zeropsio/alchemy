import { createHash } from "node:crypto";

/** SHA-256 with byte-length-prefixed fields; missing redeploy differs from an empty trigger. */
export const sourceHash = (parts: {
  contentDigest: string;
  zeropsYaml: string;
  setup: string;
  build: boolean;
  redeploy?: string;
}): string => {
  const hash = createHash("sha256");
  for (const value of [
    "zerops-source-v1",
    parts.contentDigest,
    parts.zeropsYaml,
    parts.setup,
    parts.build ? "true" : "false",
    parts.redeploy === undefined ? "absent" : "present",
    parts.redeploy ?? "",
  ]) {
    const bytes = Buffer.from(value);
    hash.update(`${bytes.length}:`).update(bytes);
  }
  return hash.digest("hex");
};
