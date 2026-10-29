import { Resource } from "alchemy";
import * as Provider from "alchemy/Provider";
import { Unowned } from "alchemy/AdoptPolicy";
import { isResolved } from "alchemy/Diff";
import { ResourceContext } from "alchemy/ResourceContext";
import * as Clock from "effect/Clock";
import * as Effect from "effect/Effect";
import type * as Redacted from "effect/Redacted";
import { ZeropsClient } from "./client/Http.ts";
import { ZeropsConfig, timeoutMs, type TimeoutOptions } from "./Config.ts";
import type { Providers } from "./Providers.ts";
import { EnvClaims } from "./internal/EnvClaims.ts";
import {
  desiredDigest,
  observedDigest,
  isMasked,
  variableOperations,
} from "./internal/Variable.ts";

export interface ServiceVariableProps {
  /** Service resource or existing service ID. */
  service: string | { readonly serviceId: string };
  /** Environment variable name. */
  key: string;
  /** Desired value; never included in resource attributes. */
  value: string | Redacted.Redacted<string>;
  /** Mask the value in Zerops. */
  sensitive?: boolean;
  /** Operation deadlines in milliseconds. */
  timeouts?: TimeoutOptions;
}
export interface ServiceVariableAttributes {
  userDataId: string;
  serviceId: string;
  key: string;
  sensitive: boolean;
  digest: string;
}
export type ServiceVariable = Resource<
  "Zerops.ServiceVariable",
  ServiceVariableProps,
  ServiceVariableAttributes,
  never,
  Providers
>;
export const ServiceVariable = Resource<ServiceVariable>("Zerops.ServiceVariable");
export const ServiceVariableProvider = () =>
  Provider.effect(
    ServiceVariable,
    Effect.gen(function* () {
      const http = yield* ZeropsClient;
      yield* ZeropsConfig;
      const claims = yield* EnvClaims;
      const ops = variableOperations(http, "service");
      return {
        stables: ["userDataId", "serviceId"],
        read: ({ output, olds }) =>
          Effect.gen(function* () {
            const serviceId =
              output?.serviceId ??
              (typeof olds?.service === "string" ? olds.service : olds?.service?.serviceId);
            const key = output?.key ?? olds?.key;
            if (typeof serviceId !== "string" || typeof key !== "string") return undefined;
            const row = yield* ops.read(serviceId, key, output?.userDataId);
            if (!row) return undefined;
            if (isMasked(row.content)) {
              yield* Effect.logWarning(
                "Masked environment value: external secret drift is unobservable",
              );
            }
            const attrs = {
              userDataId: row.id,
              serviceId,
              key: row.key,
              sensitive: row.sensitive,
              digest: observedDigest(row, output?.digest),
            };
            return output ? attrs : Unowned(attrs);
          }),
        diff: ({ olds, news, output }) =>
          Effect.gen(function* () {
            if (!isResolved(news)) return undefined;
            const oldId = typeof olds.service === "string" ? olds.service : olds.service.serviceId;
            const newId = typeof news.service === "string" ? news.service : news.service.serviceId;
            if (oldId !== newId || olds.key.toLowerCase() !== news.key.toLowerCase())
              return { action: "replace" as const };
            const row = output ? yield* ops.read(newId, news.key, output.userDataId) : undefined;
            if (
              output &&
              (!row ||
                row.key !== news.key ||
                observedDigest(row, output.digest) !== desiredDigest(news.value) ||
                row.sensitive !== (news.sensitive ?? false))
            )
              return { action: "update" as const };
            return undefined;
          }),
        reconcile: ({ news, output, session }) =>
          Effect.gen(function* () {
            const serviceId =
              typeof news.service === "string" ? news.service : news.service.serviceId;
            yield* claims.claim("service", serviceId, news.key, (yield* ResourceContext).fqn);
            const row = yield* ops.write(
              serviceId,
              news.key,
              news.value,
              news.sensitive ?? false,
              output?.digest,
              {
                deadline:
                  (yield* Clock.currentTimeMillis) +
                  timeoutMs(output ? "update" : "create", news.timeouts),
                onStatus: (p) => session.note("environment: " + p.status),
              },
              output?.userDataId,
            );
            return {
              userDataId: row.id,
              serviceId,
              key: row.key,
              sensitive: row.sensitive,
              digest: desiredDigest(news.value),
            };
          }),
        delete: ({ output, olds, session }) =>
          ops.remove(output.userDataId, {
            deadline: Date.now() + timeoutMs("delete", olds.timeouts),
            onStatus: (p) => session.note("environment: " + p.status),
          }),
      };
    }),
  );
