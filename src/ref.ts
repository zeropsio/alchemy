import * as Output from "alchemy/Output";

export type ZeropsRef<Req = never> = Output.Output<string, Req>;
export type ManagedFamily = "postgresql" | "mariadb" | "valkey" | "unknown";
declare const managedFamily: unique symbol;
export type RefTarget<F extends ManagedFamily, Req = never> = {
  readonly hostname: Output.Output<string, Req>;
  readonly [managedFamily]: F;
};
export type RefKey<F extends ManagedFamily> = F extends "postgresql"
  ? | "connectionString"
    | "connectionStringReplicas"
    | "connectionTlsString"
    | "dbName"
    | "hostname"
    | "password"
    | "superUser"
    | "superUserPassword"
    | "user"
  : F extends "valkey"
    ? "connectionString" | "connectionTlsString" | "hostname" | "password"
    : F extends "mariadb"
      ? | "connectionString"
        | "dbName"
        | "hostname"
        | "password"
        | "port"
        | "projectId"
        | "serviceId"
        | "user"
        | "BACKUP_PERIOD"
        | "ZEROPS_PROMETHEUS_PORT"
      : F extends "unknown"
        ? string
        : never;

type UntypedTarget<Req> = {
  readonly hostname: Output.Output<string, Req> | string;
  readonly [managedFamily]?: never;
};

/** Render a Zerops environment reference without reading generated credentials. */
export function ref<F extends ManagedFamily, Req>(
  target: RefTarget<F, Req>,
  key: RefKey<NoInfer<F>>,
): ZeropsRef<Req>;
export function ref<Req = never>(target: UntypedTarget<Req> | string, key: string): ZeropsRef<Req>;
export function ref<Req>(
  target: { readonly hostname: Output.Output<string, Req> | string } | string,
  key: string,
): ZeropsRef<Req> {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
    throw new Error("Zerops reference keys must be environment identifiers");
  }
  const hostname = typeof target === "string" ? target : target.hostname;
  const output = typeof hostname === "string" ? Output.literal(hostname) : hostname;
  return Output.map(output, (name) => {
    if (!/^[a-z][a-z0-9]{0,39}$/.test(name)) {
      throw new Error("Zerops reference hostname must be a valid service hostname");
    }
    return "${" + name + "_" + key + "}";
  });
}
