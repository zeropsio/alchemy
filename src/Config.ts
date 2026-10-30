import * as Context from "effect/Context";
import * as Duration from "effect/Duration";
export interface TimeoutOptions {
  create?: Duration.Input;
  update?: Duration.Input;
  delete?: Duration.Input;
  deploy?: Duration.Input;
}
export const defaultTimeouts = {
  create: 1800000,
  update: 1200000,
  delete: 1200000,
  deploy: 1800000,
} as const;
export const timeoutMs = (kind: keyof typeof defaultTimeouts, options?: TimeoutOptions) =>
  options?.[kind] === undefined
    ? defaultTimeouts[kind]
    : Duration.toMillis(Duration.fromInputUnsafe(options[kind]!));
export type FamilyFloor = { minDisk?: number; minRam?: number };
export type FamilyFloors = Partial<Record<string, FamilyFloor>>;
/** Floors discovered above the catalogue minimum: the catalogue minimum failed, these sizes worked. */
export const defaultFamilyFloors: FamilyFloors = {
  postgresql: { minDisk: 2 },
  clickhouse: { minRam: 0.375 },
  elasticsearch: { minRam: 2 },
};
/** Catalogue minimums: the lowest value an env override may set a floor to. */
const catalogueMinimums: FamilyFloors = {
  postgresql: { minDisk: 1 },
  clickhouse: { minRam: 0.25 },
  elasticsearch: { minRam: 0.75 },
};
export const floorEnv = (family: string, dimension: keyof FamilyFloor) =>
  "ZEROPS_" +
  family.toUpperCase().replaceAll("-", "_") +
  (dimension === "minDisk" ? "_MIN_DISK_GB" : "_MIN_RAM_GB");
export interface ConfigValues {
  endpoint: string;
  organizationId?: string;
  routingForceSync: boolean;
  floors: FamilyFloors;
}
export function readConfig(
  options: { endpoint?: string; organizationId?: string } = {},
): ConfigValues {
  const floors: FamilyFloors = {};
  for (const [family, defaults] of Object.entries(defaultFamilyFloors)) {
    const floor: FamilyFloor = {};
    for (const dimension of ["minDisk", "minRam"] as const) {
      const safe = defaults?.[dimension];
      if (safe === undefined) continue;
      const variable = floorEnv(family, dimension);
      const value = Number(process.env[variable] ?? safe);
      const minimum = catalogueMinimums[family]![dimension]!;
      if (!Number.isFinite(value) || value < minimum)
        throw new Error(variable + " must be finite and at least " + minimum);
      floor[dimension] = value;
    }
    floors[family] = floor;
  }
  const organizationId = options.organizationId ?? process.env.ZEROPS_ORGANIZATION_ID;
  if (organizationId !== undefined && !organizationId.trim())
    throw new Error("Organization ID cannot be empty");
  const force = process.env.ZEROPS_ROUTING_FORCE_SYNC ?? "false";
  if (!["true", "false"].includes(force))
    throw new Error("ZEROPS_ROUTING_FORCE_SYNC must be true or false");
  return {
    endpoint: options.endpoint ?? process.env.ZEROPS_ENDPOINT ?? "https://api.app-prg1.zerops.io",
    organizationId,
    routingForceSync: force === "true",
    floors,
  };
}
export class ZeropsConfig extends Context.Service<ZeropsConfig, ConfigValues>()("Zerops/Config") {}
