import * as Effect from "effect/Effect";
import * as Clock from "effect/Clock";
import { Unowned } from "alchemy/AdoptPolicy";
import type { Http } from "../client/Http.ts";
import { isNotFound, ZeropsProcessTimeout, ZeropsProcessFailed } from "../client/Errors.ts";
import { waitProcessWith, type WaitOptions } from "../client/Process.ts";
import {
  serviceStackOperations,
  type ServiceStackCreate,
} from "../client/operations/ServiceStack.ts";
const terminal = new Set(["FINISHED", "FAILED", "CANCELED"]);

const withinDeadline =
  (id: string, options: WaitOptions) =>
  <A, E, R>(operation: Effect.Effect<A, E, R>): Effect.Effect<A, E | ZeropsProcessTimeout, R> =>
    Effect.gen(function* () {
      const expired = () =>
        Effect.fail(
          new ZeropsProcessTimeout({
            code: "serviceOperationTimeout",
            processId: id,
            message: "Service operation deadline exceeded; remote work may continue",
          }),
        );
      const remaining = options.deadline - (yield* Clock.currentTimeMillis);
      if (remaining <= 0) return yield* expired();
      const result = yield* operation.pipe(
        Effect.timeoutOrElse({
          duration: remaining,
          orElse: expired,
        }),
      );
      // Also reject a response that wins the scheduling race at the deadline.
      if ((yield* Clock.currentTimeMillis) >= options.deadline) return yield* expired();
      return result;
    });
export const settleService = (
  http: Http,
  id: string,
  expected: ReadonlyArray<string>,
  options: WaitOptions,
) =>
  Effect.gen(function* () {
    const ops = serviceStackOperations(http);
    let stableSince: number | undefined;
    let stableStatus: string | undefined;
    while (true) {
      const now = yield* Clock.currentTimeMillis;
      if (now >= options.deadline)
        return yield* Effect.fail(
          new ZeropsProcessTimeout({
            code: "serviceSettleTimeout",
            processId: id,
            message: "Service did not reach a stable expected status",
          }),
        );
      const processes = yield* ops.processes(id);
      const pending = processes.filter((p) => !terminal.has(p.status));
      for (const p of pending) yield* waitProcessWith(http, p.id, options);
      const service = yield* ops.get(id);
      if (service.status === "FAILED")
        return yield* Effect.fail(
          new ZeropsProcessFailed({
            code: "serviceFailed",
            processId: id,
            status: service.status,
            message: "Service entered FAILED",
          }),
        );
      const observedAt = yield* Clock.currentTimeMillis;
      if (pending.length === 0 && expected.includes(service.status)) {
        if (stableStatus !== service.status) {
          stableSince = observedAt;
          stableStatus = service.status;
        }
        if (stableSince !== undefined && observedAt - stableSince >= 2000) return service;
      } else {
        stableSince = undefined;
        stableStatus = undefined;
      }
      yield* Effect.sleep(
        Math.min(1000, Math.max(0, options.deadline - (yield* Clock.currentTimeMillis))),
      );
    }
  }).pipe(withinDeadline(id, options));
const runningStatuses = ["ACTIVE"];
const codeFreeRunningStatuses = ["ACTIVE", "READY_TO_DEPLOY"];
const stoppedStatuses = ["STOPPED"];
const serviceStateStatuses = (state: "running" | "stopped", allowNoCode: boolean) =>
  state === "stopped" ? stoppedStatuses : allowNoCode ? codeFreeRunningStatuses : runningStatuses;
export const serviceStateMatches = (
  status: string,
  state: "running" | "stopped",
  allowNoCode = false,
) => serviceStateStatuses(state, allowNoCode).includes(status);

export const convergeServiceState = (
  http: Http,
  id: string,
  state: "running" | "stopped",
  options: WaitOptions,
  allowNoCode = false,
) =>
  Effect.gen(function* () {
    const ops = serviceStackOperations(http);
    for (const process of yield* ops.processes(id))
      if (!terminal.has(process.status)) yield* waitProcessWith(http, process.id, options);
    const service = yield* ops.get(id);
    const desired = serviceStateStatuses(state, allowNoCode);
    if (!serviceStateMatches(service.status, state, allowNoCode)) {
      const response = yield* state === "stopped" ? ops.stop(id) : ops.start(id);
      yield* waitProcessWith(http, response.id, options);
    }
    return yield* settleService(http, id, desired, options);
  }).pipe(withinDeadline(id, options));
export const createService = (
  http: Http,
  project: string,
  body: ServiceStackCreate,
  options: WaitOptions,
  allowNoCode = false,
) =>
  Effect.gen(function* () {
    const service = yield* serviceStackOperations(http).create(project, body);
    if (service.process) yield* waitProcessWith(http, service.process.id, options);
    return yield* settleService(
      http,
      service.id,
      allowNoCode ? ["ACTIVE", "READY_TO_DEPLOY"] : ["ACTIVE"],
      options,
    );
  }).pipe(withinDeadline(project, options));
export const deleteService = (http: Http, id: string, options: WaitOptions) =>
  Effect.gen(function* () {
    const ops = serviceStackOperations(http);
    const response = yield* ops
      .delete(id)
      .pipe(
        Effect.catch((error) =>
          isNotFound(error, "serviceStackNotFound")
            ? Effect.succeed(undefined)
            : Effect.fail(error),
        ),
      );
    if (response) yield* waitProcessWith(http, response.id, options);
    while (true) {
      const service = yield* ops
        .get(id)
        .pipe(
          Effect.catch((error) =>
            isNotFound(error, "serviceStackNotFound")
              ? Effect.succeed(undefined)
              : Effect.fail(error),
          ),
        );
      if (!service) return;
      if ((yield* Clock.currentTimeMillis) >= options.deadline)
        return yield* Effect.fail(
          new ZeropsProcessTimeout({
            code: "serviceDeleteTimeout",
            processId: id,
            message: "Service remains visible after deletion",
          }),
        );
      yield* Effect.sleep(1000);
    }
  }).pipe(withinDeadline(id, options));
export const readService = (
  http: Http,
  options: { id?: string; projectId: string; hostname: string; owned: boolean },
) =>
  Effect.gen(function* () {
    const ops = serviceStackOperations(http);
    const service = yield* (
      options.id ? ops.get(options.id) : ops.byName(options.projectId, options.hostname)
    ).pipe(
      Effect.catch((error) =>
        isNotFound(error, "serviceStackNotFound") ? Effect.succeed(undefined) : Effect.fail(error),
      ),
    );
    return service === undefined ? undefined : options.owned ? service : Unowned(service);
  });
