import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Semaphore from "effect/Semaphore";
export interface LockKey {
  endpoint: string;
  organizationId: string;
  projectId: string;
  kind: string;
}
export function makeRoutingLocks() {
  const locks = new Map<string, Semaphore.Semaphore>();
  return {
    withLock: <A, E, R>(key: LockKey, effect: Effect.Effect<A, E, R>): Effect.Effect<A, E, R> =>
      Effect.suspend(() => {
        const id = JSON.stringify([key.endpoint, key.organizationId, key.projectId, key.kind]);
        let lock = locks.get(id);
        if (!lock) {
          lock = Semaphore.makeUnsafe(1);
          locks.set(id, lock);
        }
        return lock.withPermits(1)(effect);
      }),
  };
}
export class RoutingLocks extends Context.Service<
  RoutingLocks,
  ReturnType<typeof makeRoutingLocks>
>()("Zerops/RoutingLocks") {}
