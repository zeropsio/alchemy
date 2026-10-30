import * as Output from "alchemy/Output";

export const familyKeys = {
  postgresql: {
    common: [
      "BACKUP_PERIOD",
      "ZEROPS_PROMETHEUS_PORT",
      "connectionString",
      "connectionTlsString",
      "dbName",
      "hostname",
      "password",
      "port",
      "portTls",
      "projectId",
      "serviceId",
      "superUser",
      "superUserPassword",
      "user",
    ],
    ha: ["connectionStringReplicas", "portReplicas"],
  },
  mariadb: {
    common: [
      "BACKUP_PERIOD",
      "ZEROPS_PROMETHEUS_PORT",
      "connectionString",
      "dbName",
      "hostname",
      "password",
      "port",
      "projectId",
      "serviceId",
      "user",
    ],
    ha: [],
  },
  valkey: {
    common: [
      "BACKUP_PERIOD",
      "ZEROPS_PROMETHEUS_PORT",
      "connectionString",
      "connectionTlsString",
      "hostname",
      "password",
      "port",
      "portTls",
      "projectId",
      "serviceId",
    ],
    ha: [
      "connectionStringReplicas",
      "connectionTlsStringReplicas",
      "portReplicas",
      "portTlsReplicas",
    ],
  },
  clickhouse: {
    common: [
      "BACKUP_PERIOD",
      "ZEROPS_PROMETHEUS_PORT",
      "clusterName",
      "connectionString",
      "dbName",
      "hostname",
      "password",
      "port",
      "portHttp",
      "portMysql",
      "portNative",
      "portPostgresql",
      "projectId",
      "serviceId",
      "superUser",
      "superUserPassword",
      "user",
      "zeropsSubdomain",
    ],
    ha: [],
  },
  elasticsearch: {
    common: [
      "connectionString",
      "hostname",
      "password",
      "port",
      "projectId",
      "serviceId",
      "user",
      "zeropsSubdomain",
    ],
    ha: [],
  },
  kafka: {
    common: ["KAFKA_HEAP_OPTS", "hostname", "password", "port", "projectId", "serviceId", "user"],
    ha: [],
  },
  nats: {
    common: [
      "BACKUP_PERIOD",
      "JET_STREAM_ENABLED",
      "MAX_PAYLOAD",
      "connectionString",
      "hostname",
      "password",
      "port",
      "portManagement",
      "projectId",
      "serviceId",
      "user",
    ],
    ha: [],
  },
  qdrant: {
    common: [
      "BACKUP_PERIOD",
      "apiKey",
      "automaticClusterReplication",
      "connectionString",
      "grpcConnectionString",
      "grpcPort",
      "hostname",
      "logLevel",
      "port",
      "projectId",
      "readOnlyApiKey",
      "serviceId",
    ],
    ha: [],
  },
  typesense: {
    common: [
      "apiKey",
      "connectionString",
      "hostname",
      "port",
      "projectId",
      "serviceId",
      "zeropsSubdomain",
    ],
    ha: [],
  },
  meilisearch: {
    common: [
      "BACKUP_PERIOD",
      "connectionString",
      "defaultAdminKey",
      "defaultChatKey",
      "defaultReadOnlyKey",
      "defaultSearchKey",
      "environment",
      "hostname",
      "masterKey",
      "port",
      "projectId",
      "serviceId",
      "zeropsSubdomain",
    ],
    ha: [],
  },
  seaweedfs: {
    common: ["BACKUP_PERIOD", "hostname", "port", "projectId", "serviceId"],
    ha: [],
  },
  "local-storage": {
    common: ["BACKUP_PERIOD", "hostname", "projectId", "serviceId"],
    ha: [],
  },
} as const;
export type Mode = "NON_HA" | "HA";
export type ZeropsRef<Req = never> = Output.Output<string, Req>;
export type ManagedFamily = keyof typeof familyKeys | "unknown";
declare const managedFamily: unique symbol;
declare const managedMode: unique symbol;
export type RefTarget<F extends ManagedFamily, Req = never, M extends Mode = "NON_HA"> = {
  readonly hostname: Output.Output<string, Req>;
  readonly [managedFamily]: F;
  readonly [managedMode]: M;
};
export type RefKey<
  F extends ManagedFamily,
  M extends Mode = "NON_HA",
> = F extends keyof typeof familyKeys
  ? | (typeof familyKeys)[F]["common"][number]
    | ([M] extends ["HA"] ? (typeof familyKeys)[F]["ha"][number] : never)
  : string;

type UntypedTarget<Req> = {
  readonly hostname: Output.Output<string, Req> | string;
  readonly [managedFamily]?: never;
};

/** Render a Zerops environment reference without reading generated credentials. */
export function ref<F extends ManagedFamily, Req, M extends Mode>(
  target: RefTarget<F, Req, M>,
  key: RefKey<NoInfer<F>, NoInfer<M>>,
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
