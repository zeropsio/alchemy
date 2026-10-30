import type { InputProps } from "alchemy/Input";
import * as Output from "alchemy/Output";
import * as Effect from "effect/Effect";
import { ManagedService, managedType, type ManagedServiceProps } from "./ManagedService.ts";
import type { Providers } from "./Providers.ts";
import { managedCatalogue, type CatalogueFamily } from "./client/serviceTypes.gen.ts";
import type { Mode, RefTarget } from "./ref.ts";

export type CatalogueVersion<F extends CatalogueFamily> =
  (typeof managedCatalogue)[F]["versions"][number];
export type FamilyMode<F extends CatalogueFamily> = (typeof managedCatalogue)[F]["ha"] extends true
  ? Mode
  : "NON_HA";
export type FamilyProps<F extends CatalogueFamily, M extends FamilyMode<F> = FamilyMode<F>> = Omit<
  ManagedServiceProps,
  "type" | "mode"
> & {
  /** Numeric catalogue version; known versions are suggested by the editor. */
  version: CatalogueVersion<F> | (string & {});
  /** Availability mode, default NON_HA. */
  mode?: M;
};
type FamilyCall<
  F extends CatalogueFamily,
  P extends Omit<ManagedServiceProps, "type" | "mode">,
  M extends Mode,
> = <Req = never>(
  id: string,
  props: InputProps<P> | Effect.Effect<InputProps<P>, never, Req>,
) => Effect.Effect<ManagedService & RefTarget<F, never, M>, never, Providers | Req>;
/**
 * Only a required, literal `mode: "HA"` yields the HA witness (and HA-only reference keys).
 * Omitted, optional or dynamically chosen modes resolve to the NON_HA witness: common keys only.
 */
type FamilyFactory<F extends CatalogueFamily> = ((typeof managedCatalogue)[F]["ha"] extends true
  ? FamilyCall<F, Omit<FamilyProps<F>, "mode"> & { mode: "HA" }, "HA">
  : unknown) &
  FamilyCall<F, FamilyProps<F>, "NON_HA"> &
  Omit<typeof ManagedService, "ref"> & {
    /** `M` is the caller's assertion about the referenced service's mode; it is not verified. */
    ref<M extends FamilyMode<F> = "NON_HA">(
      id: string,
      options?: { stack?: string; stage?: string },
    ): Effect.Effect<ManagedService & RefTarget<F, never, M>>;
  };
type FactoryProps = Omit<ManagedServiceProps, "type"> & { version: string };
function family<F extends CatalogueFamily>(name: F): FamilyFactory<F> {
  const factory = (
    id: string,
    input: InputProps<FactoryProps> | Effect.Effect<InputProps<FactoryProps>, never, unknown>,
  ) =>
    ManagedService(
      id,
      Effect.gen(function* () {
        const props = Effect.isEffect(input) ? yield* input : input;
        const { version, ...managedProps } = props;
        const versionOutput = Output.isOutput(version)
          ? version
          : typeof version === "string"
            ? Output.literal(version)
            : Output.fromEffect(Effect.orDie(version));
        const mode = props.mode;
        const modeOutput = Output.isOutput(mode)
          ? mode
          : typeof mode === "string" || mode === undefined
            ? Output.literal(mode ?? "NON_HA")
            : Output.fromEffect(Effect.orDie(mode));
        return {
          ...managedProps,
          type: Output.map(Output.all(versionOutput, modeOutput), ([value, availability]) => {
            if (!/^[0-9]+(?:\.[0-9]+)*$/.test(value)) {
              throw new Error("Managed family version must be a numeric catalogue version");
            }
            return managedType(name + "@" + value, availability);
          }),
        };
      }),
    );
  return Object.assign(factory, ManagedService, {
    ref: (id: string, options?: { stack?: string; stage?: string }) =>
      ManagedService.ref(id, options),
  }) as unknown as FamilyFactory<F>;
}
export type PostgresProps = FamilyProps<"postgresql">;
export type Postgres<M extends FamilyMode<"postgresql"> = "NON_HA"> = ManagedService &
  RefTarget<"postgresql", never, M>;
export const Postgres = family("postgresql");
export type MariaDBProps = FamilyProps<"mariadb">;
export type MariaDB<M extends FamilyMode<"mariadb"> = "NON_HA"> = ManagedService &
  RefTarget<"mariadb", never, M>;
export const MariaDB = family("mariadb");
export type ValkeyProps = FamilyProps<"valkey">;
export type Valkey<M extends FamilyMode<"valkey"> = "NON_HA"> = ManagedService &
  RefTarget<"valkey", never, M>;
export const Valkey = family("valkey");
export type ClickHouseProps = FamilyProps<"clickhouse">;
export type ClickHouse<M extends FamilyMode<"clickhouse"> = "NON_HA"> = ManagedService &
  RefTarget<"clickhouse", never, M>;
export const ClickHouse = family("clickhouse");
export type ElasticsearchProps = FamilyProps<"elasticsearch">;
export type Elasticsearch<M extends FamilyMode<"elasticsearch"> = "NON_HA"> = ManagedService &
  RefTarget<"elasticsearch", never, M>;
export const Elasticsearch = family("elasticsearch");
export type KafkaProps = FamilyProps<"kafka">;
export type Kafka<M extends FamilyMode<"kafka"> = "NON_HA"> = ManagedService &
  RefTarget<"kafka", never, M>;
export const Kafka = family("kafka");
export type NatsProps = FamilyProps<"nats">;
export type Nats<M extends FamilyMode<"nats"> = "NON_HA"> = ManagedService &
  RefTarget<"nats", never, M>;
export const Nats = family("nats");
export type QdrantProps = FamilyProps<"qdrant">;
export type Qdrant<M extends FamilyMode<"qdrant"> = "NON_HA"> = ManagedService &
  RefTarget<"qdrant", never, M>;
export const Qdrant = family("qdrant");
export type TypesenseProps = FamilyProps<"typesense">;
export type Typesense<M extends FamilyMode<"typesense"> = "NON_HA"> = ManagedService &
  RefTarget<"typesense", never, M>;
export const Typesense = family("typesense");
export type SeaweedFSProps = FamilyProps<"seaweedfs">;
export type SeaweedFS<M extends FamilyMode<"seaweedfs"> = "NON_HA"> = ManagedService &
  RefTarget<"seaweedfs", never, M>;
export const SeaweedFS = family("seaweedfs");
export type MeilisearchProps = FamilyProps<"meilisearch">;
export type Meilisearch<M extends FamilyMode<"meilisearch"> = "NON_HA"> = ManagedService &
  RefTarget<"meilisearch", never, M>;
export const Meilisearch = family("meilisearch");
export type LocalStorageProps = FamilyProps<"local-storage">;
export type LocalStorage<M extends FamilyMode<"local-storage"> = "NON_HA"> = ManagedService &
  RefTarget<"local-storage", never, M>;
export const LocalStorage = family("local-storage");
