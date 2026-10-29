import openapiTS, { astToString } from "openapi-typescript";
import { writeFile, mkdir } from "node:fs/promises";
import { normalizeSpec } from "./normalize-spec.ts";
await normalizeSpec();
await mkdir(new URL("../src/client/", import.meta.url), { recursive: true });
const ast = await openapiTS(new URL("../spec/zerops-public-api.normalized.json", import.meta.url));
await writeFile(new URL("../src/client/api.gen.ts", import.meta.url), astToString(ast));
