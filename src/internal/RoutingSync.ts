import * as Effect from "effect/Effect";
import * as Clock from "effect/Clock";
import type { Http } from "../client/Http.ts";
import {
  ZeropsForeignRoutingChanges,
  ZeropsProcessTimeout,
  ZeropsValidation,
} from "../client/Errors.ts";
import { waitProcessWith, type WaitOptions } from "../client/Process.ts";
import { routingOperations, type RoutingKind } from "../client/operations/Routing.ts";
import { RoutingLocks } from "./RoutingLocks.ts";

export const routingNeedsUpdate = (output: { synced: boolean; deleteOnSync?: boolean }) =>
  !output.synced || output.deleteOnSync === true;

export const guardForeignRouting = (
  rows: ReadonlyArray<{ id: string; isSynced: boolean; deleteOnSync: boolean }>,
  ownedId: string | undefined,
  force: boolean,
  note?: (message: string) => Effect.Effect<void>,
) =>
  Effect.gen(function* () {
    const ids = rows
      .filter((row) => row.id !== ownedId && (!row.isSynced || row.deleteOnSync))
      .map((row) => row.id)
      .sort();
    if (!ids.length) return;
    if (!force)
      return yield* Effect.fail(
        new ZeropsForeignRoutingChanges({
          code: "foreignRoutingChanges",
          routeIds: ids,
          message:
            "Refusing project-wide routing sync with foreign staged routes: " + ids.join(", "),
        }),
      );
    if (note) yield* note("forceSync commits foreign staged routing changes: " + ids.join(", "));
  });

/** Serialize inventory, staging, commit and final observation within one provider process. */
export const syncRouting = <A, E, R>(
  http: Http,
  args: {
    projectId: string;
    organizationId: string;
    kind: RoutingKind;
    ownedId?: string;
    force: boolean;
    options: WaitOptions;
    note?: (message: string) => Effect.Effect<void>;
    stage: Effect.Effect<A, E, R>;
    verify: (staged: A) => Effect.Effect<boolean, E, R>;
  },
) =>
  Effect.gen(function* () {
    const expired = () =>
      Effect.fail(
        new ZeropsProcessTimeout({
          code: "routingTimeout",
          processId: args.ownedId ?? args.projectId,
          message: "Routing lifecycle deadline exceeded",
        }),
      );
    const remaining = args.options.deadline - (yield* Clock.currentTimeMillis);
    if (remaining <= 0) return yield* expired();
    return yield* Effect.gen(function* () {
      const locks = yield* RoutingLocks;
      const endpoint = (yield* http.endpoint).origin;
      const ops = routingOperations(http);
      return yield* locks.withLock(
        {
          endpoint,
          organizationId: args.organizationId,
          projectId: args.projectId,
          kind: args.kind,
        },
        Effect.gen(function* () {
          const rows = yield* args.kind === "http"
            ? ops.httpList(args.projectId)
            : ops.portInventory(args.projectId);
          yield* guardForeignRouting(rows, args.ownedId, args.force, args.note);
          if ((yield* Clock.currentTimeMillis) >= args.options.deadline) return yield* expired();
          const staged = yield* args.stage;
          if ((yield* Clock.currentTimeMillis) >= args.options.deadline) return yield* expired();
          const process = yield* ops.sync(args.kind, args.projectId).pipe(
            Effect.catch((error) =>
              Effect.gen(function* () {
                if (error.code === "nothingToSync") return undefined;
                if (
                  (error._tag === "ZeropsTransportError" || error._tag === "ZeropsServerError") &&
                  (yield* args.verify(staged))
                )
                  return undefined;
                return yield* Effect.fail(error);
              }),
            ),
          );
          if (process) yield* waitProcessWith(http, process.id, args.options);
          if (!(yield* args.verify(staged)))
            return yield* Effect.fail(
              new ZeropsValidation({
                status: 400,
                operation: "syncRouting",
                code: "routingDidNotConverge",
                message: "Routing sync did not produce the intended state",
              }),
            );
          return staged;
        }),
      );
    }).pipe(Effect.timeoutOrElse({ duration: remaining, orElse: expired }));
  });
