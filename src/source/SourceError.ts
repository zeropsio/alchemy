import * as Data from "effect/Data";

export class ZeropsSourceError extends Data.TaggedError("ZeropsSourceError")<{
  readonly message: string;
  readonly cause?: unknown;
}> {}
