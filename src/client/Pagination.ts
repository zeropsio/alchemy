import * as Effect from "effect/Effect";
import { ZeropsDecodeError } from "./Errors.ts";
export interface Page<A> {
  readonly list: ReadonlyArray<A>;
  readonly total?: number;
  readonly totalCount?: number;
}
export const collectPages = <A, E, R>(
  fetchPage: (offset: number, limit: number) => Effect.Effect<Page<A>, E, R>,
  limit = 100,
): Effect.Effect<A[], E | ZeropsDecodeError, R> =>
  Effect.gen(function* () {
    if (!Number.isInteger(limit) || limit < 1)
      return yield* Effect.fail(
        new ZeropsDecodeError({
          code: "invalidPageLimit",
          message: "Page limit must be a positive integer",
        }),
      );
    const rows: A[] = [];
    let offset = 0;
    while (true) {
      const page = yield* fetchPage(offset, limit);
      if (!page || !Array.isArray(page.list))
        return yield* Effect.fail(
          new ZeropsDecodeError({
            code: "invalidPage",
            message: "List response is missing its list wrapper",
          }),
        );
      const total = page.total ?? page.totalCount;
      if (total !== undefined && (!Number.isFinite(total) || total < 0))
        return yield* Effect.fail(
          new ZeropsDecodeError({ code: "invalidPage", message: "Invalid list total" }),
        );
      if (page.list.length === 0 && total !== undefined && offset < total)
        return yield* Effect.fail(
          new ZeropsDecodeError({
            code: "paginationStalled",
            message: "Empty page before advertised total; refusing false absence",
          }),
        );
      rows.push(...page.list);
      offset += page.list.length;
      if (
        page.list.length === 0 ||
        (total !== undefined ? offset >= total : page.list.length < limit)
      )
        return rows;
    }
  });
export const filterLocal = <A>(rows: ReadonlyArray<A>, predicate: (row: A) => boolean): A[] =>
  rows.filter(predicate);
