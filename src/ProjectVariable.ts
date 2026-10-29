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

export interface ProjectVariableProps {
  /** Project resource or existing project ID. */
  project: string | { readonly projectId: string };
  /** Environment variable name. */
  key: string;
  /** Desired value; never included in resource attributes. */
  value: string | Redacted.Redacted<string>;
  sensitive?: boolean;
  /** Operation deadlines in milliseconds. */
  timeouts?: TimeoutOptions;
}
export interface ProjectVariableAttributes {
  variableId: string;
  projectId: string;
  key: string;
  sensitive: boolean;
  digest: string;
}
export type ProjectVariable = Resource<
  "Zerops.ProjectVariable",
  ProjectVariableProps,
  ProjectVariableAttributes,
  never,
  Providers
>;
export const ProjectVariable = Resource<ProjectVariable>("Zerops.ProjectVariable");
export const ProjectVariableProvider = () =>
  Provider.effect(
    ProjectVariable,
    Effect.gen(function* () {
      const http = yield* ZeropsClient;
      yield* ZeropsConfig;
      const claims = yield* EnvClaims;
      const ops = variableOperations(http, "project");
      return {
        stables: ["variableId", "projectId"],
        read: ({ output, olds }) =>
          Effect.gen(function* () {
            const projectId =
              output?.projectId ??
              (typeof olds?.project === "string" ? olds.project : olds?.project?.projectId);
            const key = output?.key ?? olds?.key;
            if (typeof projectId !== "string" || typeof key !== "string") return undefined;
            const row = yield* ops.read(projectId, key, output?.variableId);
            if (!row) return undefined;
            if (isMasked(row.content)) {
              yield* Effect.logWarning(
                "Masked environment value: external secret drift is unobservable",
              );
            }
            const attrs = {
              variableId: row.id,
              projectId,
              key: row.key,
              sensitive: row.sensitive,
              digest: observedDigest(row, output?.digest),
            };
            return output ? attrs : Unowned(attrs);
          }),
        diff: ({ olds, news, output }) =>
          Effect.gen(function* () {
            if (!isResolved(news)) return undefined;
            const oldId = typeof olds.project === "string" ? olds.project : olds.project.projectId;
            const newId = typeof news.project === "string" ? news.project : news.project.projectId;
            if (oldId !== newId || olds.key.toLowerCase() !== news.key.toLowerCase())
              return { action: "replace" as const };
            const row = output ? yield* ops.read(newId, news.key, output.variableId) : undefined;
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
            const projectId =
              typeof news.project === "string" ? news.project : news.project.projectId;
            yield* claims.claim("project", projectId, news.key, (yield* ResourceContext).fqn);
            const row = yield* ops.write(
              projectId,
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
              output?.variableId,
            );
            return {
              variableId: row.id,
              projectId,
              key: row.key,
              sensitive: row.sensitive,
              digest: desiredDigest(news.value),
            };
          }),
        delete: ({ output, olds, session }) =>
          ops.remove(output.variableId, {
            deadline: Date.now() + timeoutMs("delete", olds.timeouts),
            onStatus: (p) => session.note("environment: " + p.status),
          }),
      };
    }),
  );
