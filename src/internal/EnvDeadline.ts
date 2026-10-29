import * as Clock from "effect/Clock";
import * as Effect from "effect/Effect";
import { ZeropsProcessTimeout } from "../client/Errors.ts";

/** Bound discovery, mutation, process waits and verification by one absolute deadline. */
export const withinEnvDeadline =
  (id: string, deadline: number) =>
  <A, E, R>(operation: Effect.Effect<A, E, R>) =>
    Effect.gen(function* () {
      const expired = () =>
        Effect.fail(
          new ZeropsProcessTimeout({
            code: "environmentOperationTimeout",
            processId: id,
            message: "Environment operation deadline exceeded; remote work may continue",
          }),
        );
      const remaining = deadline - (yield* Clock.currentTimeMillis);
      if (remaining <= 0) return yield* expired();
      const result = yield* operation.pipe(
        Effect.timeoutOrElse({
          duration: remaining,
          orElse: expired,
        }),
      );
      if ((yield* Clock.currentTimeMillis) >= deadline) return yield* expired();
      return result;
    });
