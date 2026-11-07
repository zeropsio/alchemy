export interface FamilyCase {
  helper:
    | "Postgres"
    | "MariaDB"
    | "Valkey"
    | "ClickHouse"
    | "Elasticsearch"
    | "Kafka"
    | "Meilisearch"
    | "Nats"
    | "Qdrant"
    | "Typesense"
    | "SeaweedFS"
    | "LocalStorage";
  version: string;
  minRam: number;
  minDisk: number;
  refKey: string;
  update: "scale" | "stop";
  prod: boolean;
}

// Sizes use catalogue minima or the provider's encoded floors; see README.md.
// `prod: false` marks families skipped on production.
export const FAMILIES: Record<string, FamilyCase> = {
  postgresql: {
    helper: "Postgres",
    version: "16",
    minRam: 0.25,
    minDisk: 2,
    refKey: "connectionString",
    update: "scale",
    prod: true,
  },
  mariadb: {
    helper: "MariaDB",
    version: "10.6",
    minRam: 0.25,
    minDisk: 1,
    refKey: "connectionString",
    update: "scale",
    prod: true,
  },
  valkey: {
    helper: "Valkey",
    version: "7.2",
    minRam: 0.125,
    minDisk: 1,
    refKey: "connectionString",
    update: "scale",
    prod: true,
  },
  clickhouse: {
    helper: "ClickHouse",
    version: "25.3",
    minRam: 0.375,
    minDisk: 1,
    refKey: "connectionString",
    update: "scale",
    prod: true,
  },
  elasticsearch: {
    helper: "Elasticsearch",
    version: "9.2",
    minRam: 2,
    minDisk: 2,
    refKey: "password",
    update: "scale",
    prod: false,
  },
  kafka: {
    helper: "Kafka",
    version: "3.9",
    minRam: 0.5,
    minDisk: 1,
    refKey: "password",
    update: "scale",
    prod: true,
  },
  meilisearch: {
    helper: "Meilisearch",
    version: "1.44",
    minRam: 0.25,
    minDisk: 1,
    refKey: "masterKey",
    update: "scale",
    prod: true,
  },
  nats: {
    helper: "Nats",
    version: "2.12",
    minRam: 0.25,
    minDisk: 1,
    refKey: "connectionString",
    update: "scale",
    prod: true,
  },
  qdrant: {
    helper: "Qdrant",
    version: "1.12",
    minRam: 0.25,
    minDisk: 1,
    refKey: "apiKey",
    update: "scale",
    prod: true,
  },
  typesense: {
    helper: "Typesense",
    version: "30.2",
    minRam: 0.25,
    minDisk: 1,
    refKey: "apiKey",
    update: "scale",
    prod: true,
  },
  seaweedfs: {
    helper: "SeaweedFS",
    version: "3.85",
    minRam: 0.5,
    minDisk: 5,
    refKey: "port",
    update: "scale",
    prod: true,
  },
  "local-storage": {
    helper: "LocalStorage",
    version: "1",
    minRam: 0.125,
    minDisk: 5,
    refKey: "serviceId",
    update: "stop",
    prod: true,
  },
};
