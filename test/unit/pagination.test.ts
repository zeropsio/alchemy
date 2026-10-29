import { test, expect } from "bun:test";
import * as Effect from "effect/Effect";
import { collectPages } from "../../src/client/Pagination.ts";
test("pagination traverses offsets through final short page", async () => {
  const offsets: number[] = [];
  const result = await Effect.runPromise(
    collectPages((offset, limit) => {
      offsets.push(offset);
      return Effect.succeed({ list: [1, 2, 3, 4, 5].slice(offset, offset + limit) });
    }, 2),
  );
  expect(offsets).toEqual([0, 2, 4]);
  expect(result).toEqual([1, 2, 3, 4, 5]);
});
