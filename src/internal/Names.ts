import { createHash } from "node:crypto";
export function validateHostname(hostname: string): string {
  if (!/^[a-z][a-z0-9]{0,39}$/.test(hostname) || ["core", "l7httpbalancer"].includes(hostname))
    throw new Error(
      "Hostname must be 1–40 lowercase alphanumeric characters, begin with a letter, and not be reserved core/l7httpbalancer",
    );
  return hostname;
}
export function generatedHostname(logicalId: string, instanceId: string): string {
  const stem = logicalId.toLowerCase().replace(/[^a-z0-9]/g, "");
  const prefix = /^[a-z]/.test(stem) ? stem : "s" + stem;
  return validateHostname(
    prefix.slice(0, 23) +
      createHash("sha256")
        .update(JSON.stringify([logicalId, instanceId]))
        .digest("hex")
        .slice(0, 16),
  );
}
export function canonicalServiceType(type: string): string {
  return type
    .toLowerCase()
    .replace(/^(?:ubuntu|alpine)\//, "")
    .replace(/:single(?=@)/, "");
}
export const sameServiceType = (a: string, b: string) =>
  canonicalServiceType(a) === canonicalServiceType(b);
export const markerPrefix = "alchemy:";
export const ownershipMarker = (stack: string, stage: string, fqn: string) =>
  markerPrefix +
  createHash("sha256")
    .update(JSON.stringify([stack, stage, fqn]))
    .digest("hex")
    .slice(0, 48);
export function userTags(tags: ReadonlyArray<string>): string[] {
  return tags.filter((tag) => !tag.startsWith(markerPrefix)).sort();
}
export function markedTags(tags: ReadonlyArray<string>, marker: string): string[] {
  if (tags.some((tag) => tag.startsWith(markerPrefix)))
    throw new Error("Tags beginning alchemy: are reserved for ownership");
  return [...new Set(tags), marker].sort();
}
