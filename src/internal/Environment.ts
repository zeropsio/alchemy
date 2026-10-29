import { createHash } from "node:crypto";
export const isMasked = (content: string) => content === "REDACTED" || /^\*+$/.test(content);
export function envDigest(content: string, previous?: string): string | undefined {
  return isMasked(content) ? previous : createHash("sha256").update(content).digest("hex");
}
