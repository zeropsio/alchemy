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
export interface ConfigValues {
  endpoint: string;
  organizationId?: string;
  routingForceSync: boolean;
  postgresqlMinDiskGb: number;
}
export function readConfig(
  options: { endpoint?: string; organizationId?: string } = {},
): ConfigValues {
  const minimum = Number(process.env.ZEROPS_POSTGRESQL_MIN_DISK_GB ?? 2);
  if (!Number.isFinite(minimum) || minimum < 1)
    throw new Error("ZEROPS_POSTGRESQL_MIN_DISK_GB must be finite and at least 1");
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
    postgresqlMinDiskGb: minimum,
  };
}
export class ZeropsConfig extends Context.Service<ZeropsConfig, ConfigValues>()("Zerops/Config") {}
