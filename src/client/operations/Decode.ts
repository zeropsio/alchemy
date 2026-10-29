import * as Effect from "effect/Effect";
import { ZeropsDecodeError } from "../Errors.ts";
export function identity<A extends { id: string; status: string }>(
  value: A,
): Effect.Effect<A, ZeropsDecodeError> {
  return value &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.status === "string" &&
    /^[a-zA-Z0-9_.:-]{1,128}$/.test(value.status)
    ? Effect.succeed(value)
    : Effect.fail(
        new ZeropsDecodeError({
          code: "decode",
          message: "Response missing required identity/status",
        }),
      );
}
export const segment = encodeURIComponent;
