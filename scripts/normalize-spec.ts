import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { parse } from "yaml";
export async function normalizeSpec() {
  const raw = await readFile(new URL("../spec/zerops-public-api.yml", import.meta.url), "utf8");
  const spec = parse(raw);
  for (const [path, item] of Object.entries(spec.paths) as [string, Record<string, any>][]) {
    const normalized = path.replace(/\{path:\.\*\}/g, "{path}");
    if (normalized !== path) {
      spec.paths[normalized] = item;
      delete spec.paths[path];
    }
    for (const op of Object.values(item)) {
      if (!op || typeof op !== "object") continue;
      if (path.endsWith("/project/{id}/env") && op.operationId === "GetProjectEnv")
        op.operationId = "ListProjectEnvs";
      if (op.operationId === "getUserInfo") op.operationId = "GetAuthUserInfo";
      for (const p of op.parameters ?? []) if (p.name === "path:.*") p.name = "path";
    }
  }
  await mkdir(new URL("../spec/", import.meta.url), { recursive: true });
  await writeFile(
    new URL("../spec/zerops-public-api.normalized.json", import.meta.url),
    JSON.stringify(spec, null, 2) + "\n",
  );
  return createHash("sha256").update(raw).digest("hex");
}
if (import.meta.main) console.log(await normalizeSpec());
