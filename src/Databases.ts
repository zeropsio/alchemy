import type { InputProps } from "alchemy/Input";
import * as Output from "alchemy/Output";
import * as Effect from "effect/Effect";
import { ManagedService, type ManagedServiceProps } from "./ManagedService.ts";
import type { Providers } from "./Providers.ts";
import type { ManagedFamily, RefTarget } from "./ref.ts";

export interface DatabaseProps extends Omit<ManagedServiceProps, "type"> {
  /** Catalogue version, for example 16, 10.6 or 7.2. */
  version: string;
}
export type PostgresProps = DatabaseProps;
export type MariaDBProps = DatabaseProps;
export type ValkeyProps = DatabaseProps;
export type Postgres = ManagedService & RefTarget<"postgresql">;
export type MariaDB = ManagedService & RefTarget<"mariadb">;
export type Valkey = ManagedService & RefTarget<"valkey">;

type DatabaseFactory<F extends ManagedFamily> = Omit<typeof ManagedService, "ref"> & {
  <Req = never>(
    id: string,
    props: InputProps<DatabaseProps> | Effect.Effect<InputProps<DatabaseProps>, never, Req>,
  ): Effect.Effect<ManagedService & RefTarget<F>, never, Providers | Req>;
  ref(
    id: string,
    options?: { stack?: string; stage?: string },
  ): Effect.Effect<ManagedService & RefTarget<F>>;
};
function database<F extends "postgresql" | "mariadb" | "valkey">(family: F): DatabaseFactory<F> {
  const factory = (
    id: string,
    input: InputProps<DatabaseProps> | Effect.Effect<InputProps<DatabaseProps>, never, unknown>,
  ) => {
    return ManagedService(
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
              throw new Error("Database version must be a numeric catalogue version");
            }
            return family + (availability === "HA" ? ":ha@" : ":single@") + value;
          }),
        };
      }),
    );
  };
  return Object.assign(factory, ManagedService, {
    ref: (id: string, options?: { stack?: string; stage?: string }) =>
      ManagedService.ref(id, options),
  }) as unknown as DatabaseFactory<F>;
}
export const Postgres = database("postgresql");
export const MariaDB = database("mariadb");
export const Valkey = database("valkey");
