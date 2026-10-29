import { Resource } from "alchemy";
import * as Provider from "alchemy/Provider";
import { Unowned } from "alchemy/AdoptPolicy";
import { isResolved } from "alchemy/Diff";
import { createPhysicalName } from "alchemy/PhysicalName";
import { ResourceContext } from "alchemy/ResourceContext";
import { Stack } from "alchemy/Stack";
import { Stage } from "alchemy/Stage";
import * as Effect from "effect/Effect";
import * as Clock from "effect/Clock";
import { ZeropsClient } from "./client/Http.ts";
import { ZeropsConfig, timeoutMs, type TimeoutOptions } from "./Config.ts";
import { projectOperations, type ProjectRecord } from "./client/operations/Project.ts";
import { organizationOperations } from "./client/operations/Organization.ts";
import { environmentOperations } from "./client/operations/Environment.ts";
import { isNotFound, ZeropsProcessTimeout, ZeropsValidation } from "./client/Errors.ts";
import { waitProcessWith, type WaitOptions } from "./client/Process.ts";
import { ownershipMarker, markedTags, userTags, markerPrefix } from "./internal/Names.ts";
import type { Providers } from "./Providers.ts";
export interface ProjectProps {
  name?: string;
  organizationId?: string;
  location?: string;
  mode?: "LIGHT" | "SERIOUS";
  description?: string;
  tags?: string[];
  envIsolation?: string;
  sshIsolation?: string;
  maxCreditLimit?: string;
  sharedIpv4?: boolean;
  timeouts?: TimeoutOptions;
}
export interface ProjectAttributes {
  projectId: string;
  name: string;
  organizationId: string;
  location: string;
  mode: "LIGHT" | "SERIOUS";
  description?: string;
  tags: string[];
  ipv6?: string;
  sharedIpv4?: boolean;
  maxCreditLimit?: string;
  envIsolation?: string;
  sshIsolation?: string;
  ownershipMarker: string;
}
export type Project = Resource<"Zerops.Project", ProjectProps, ProjectAttributes, never, Providers>;
export const Project = Resource<Project>("Zerops.Project");
export const projectNeedsReplace = (olds: ProjectProps, news: ProjectProps) =>
  olds.organizationId !== news.organizationId ||
  olds.location !== news.location ||
  (olds.mode === "SERIOUS" && (news.mode ?? "LIGHT") === "LIGHT");
const marker = Effect.gen(function* () {
  return ownershipMarker((yield* Stack).name, yield* Stage, (yield* ResourceContext).fqn);
});
const attrs = (
  p: ProjectRecord,
  mark: string,
  previous?: Partial<ProjectAttributes>,
): ProjectAttributes => ({
  projectId: p.id,
  name: p.name,
  organizationId: p.clientId,
  location: p.primaryInstanceLocation.id,
  mode: p.mode,
  description: p.description ?? undefined,
  tags: userTags(p.tagList),
  ipv6: p.publicIpV6 ?? undefined,
  sharedIpv4: p.publicIpV4Shared,
  maxCreditLimit: previous?.maxCreditLimit,
  envIsolation: previous?.envIsolation,
  sshIsolation: previous?.sshIsolation,
  ownershipMarker: p.tagList.includes(mark)
    ? mark
    : (p.tagList.find((tag) => tag.startsWith(markerPrefix)) ?? ""),
});
export const ProjectProvider = () =>
  Provider.effect(
    Project,
    Effect.gen(function* () {
      const http = yield* ZeropsClient;
      const config = yield* ZeropsConfig;
      const ops = projectOperations(http);
      const env = environmentOperations(http);
      const get = (id: string) =>
        ops
          .get(id)
          .pipe(
            Effect.catch((error) =>
              isNotFound(error, "projectNotFound") ? Effect.succeed(undefined) : Effect.fail(error),
            ),
          );
      const observedAttrs = (
        p: ProjectRecord,
        mark: string,
        previous?: Partial<ProjectAttributes>,
      ) =>
        Effect.gen(function* () {
          const rows = (yield* env.projectList(p.id)).items;
          return attrs(p, mark, {
            ...previous,
            envIsolation: rows.find((row) => row.type === "SYSTEM" && row.key === "envIsolation")
              ?.content,
            sshIsolation: rows.find((row) => row.type === "SYSTEM" && row.key === "sshIsolation")
              ?.content,
          });
        });
      const name = (props: ProjectProps) =>
        props.name !== undefined
          ? Effect.sync(() => {
              if (!props.name?.trim()) throw new Error("Project name must not be empty");
              return props.name;
            })
          : Effect.gen(function* () {
              return yield* createPhysicalName({
                id: (yield* ResourceContext).logicalId,
                maxLength: 64,
              });
            });
      const ready = (id: string, options: WaitOptions) =>
        Effect.gen(function* () {
          let sawCreate = false;
          while (true) {
            if ((yield* Clock.currentTimeMillis) >= options.deadline)
              return yield* Effect.fail(
                new ZeropsProcessTimeout({
                  code: "projectReadyTimeout",
                  processId: id,
                  message: "Project creation/readiness deadline exceeded",
                }),
              );
            for (const p of yield* ops.processes(id))
              if (p.actionName === "project.create") {
                sawCreate = true;
                yield* waitProcessWith(http, p.id, options);
              }
            const p = yield* ops.get(id);
            if (sawCreate && p.status === "ACTIVE") return p;
            if (p.status === "FAILED")
              return yield* Effect.fail(
                new ZeropsValidation({
                  status: 400,
                  code: "projectFailed",
                  operation: "createProject",
                  message: "Project entered FAILED",
                }),
              );
            yield* Effect.sleep(1000);
          }
        });
      return {
        stables: ["projectId"],
        read: ({ output, olds }) =>
          Effect.gen(function* () {
            const mark = yield* marker;
            let p: ProjectRecord | undefined;
            if (output) p = yield* get(output.projectId);
            else {
              const organization = yield* organizationOperations(http).resolve(
                olds.organizationId ?? config.organizationId,
              );
              const n = yield* name(olds);
              const result = yield* ops.byName(organization, n);
              const candidates = result.projects.filter(
                (p) => p.name === n && p.clientId === organization,
              );
              const owned = candidates.filter((p) => p.tagList.includes(mark));
              if (owned.length > 1 || (!owned.length && candidates.length > 1))
                return yield* Effect.fail(
                  new ZeropsValidation({
                    status: 400,
                    code: "ambiguousProject",
                    operation: "readProject",
                    message: "Multiple exact project-name candidates; refusing ambiguous adoption",
                  }),
                );
              p = owned[0] ?? candidates[0];
            }
            if (!p) return undefined;
            const a = yield* observedAttrs(p, mark, output);
            return p.tagList.includes(mark) ? a : Unowned(a);
          }),
        diff: ({ olds, news }) =>
          Effect.succeed(
            isResolved(news) && projectNeedsReplace(olds, news)
              ? { action: "replace" as const }
              : undefined,
          ),
        reconcile: ({ news, output, session }) =>
          Effect.gen(function* () {
            const mark = yield* marker;
            const n = yield* name(news);
            const organization = yield* organizationOperations(http).resolve(
              news.organizationId ?? config.organizationId,
            );
            const tags = markedTags(news.tags ?? [], mark);
            const options: WaitOptions = {
              deadline:
                (yield* Clock.currentTimeMillis) +
                timeoutMs(output ? "update" : "create", news.timeouts),
              onStatus: (p) =>
                session.note((p.actionName ?? "process") + ": " + p.status + " (" + p.id + ")"),
            };
            let p = output ? yield* get(output.projectId) : undefined;
            const credit = news.maxCreditLimit ?? output?.maxCreditLimit;
            if (!p) {
              p = yield* ops
                .create(organization, {
                  name: n,
                  description: news.description ?? null,
                  tagList: tags,
                  mode: news.mode ?? "LIGHT",
                  location: news.location,
                  maxCreditLimit: credit,
                  publicIpV4Shared: news.sharedIpv4 ?? false,
                  envIsolation: news.envIsolation,
                  sshIsolation: news.sshIsolation,
                  userRoles: [],
                  envSecrets: [],
                  envVariables: [],
                })
                .pipe(
                  Effect.catch((error) =>
                    Effect.gen(function* () {
                      if (
                        error._tag !== "ZeropsTransportError" &&
                        error._tag !== "ZeropsServerError"
                      )
                        return yield* Effect.fail(error);
                      // An uncertain create is never replayed. Recover only a uniquely marked object.
                      const candidates = (yield* ops.byName(organization, n)).projects.filter(
                        (candidate) =>
                          candidate.clientId === organization &&
                          candidate.name === n &&
                          candidate.tagList.includes(mark),
                      );
                      if (candidates.length === 1) return candidates[0]!;
                      return yield* Effect.fail(error);
                    }),
                  ),
                );
              p = yield* ready(p.id, options);
            }
            for (const process of yield* ops.processes(p.id))
              if (!["FINISHED", "FAILED", "CANCELED"].includes(process.status))
                yield* waitProcessWith(http, process.id, options);
            if (p.mode === "LIGHT" && news.mode === "SERIOUS") {
              const upgrade = yield* ops.upgrade(p.id);
              if (upgrade.process) yield* waitProcessWith(http, upgrade.process.id, options);
              while ((yield* ops.get(p.id)).mode !== "SERIOUS") {
                if ((yield* Clock.currentTimeMillis) >= options.deadline)
                  return yield* Effect.fail(
                    new ZeropsProcessTimeout({
                      code: "projectModeTimeout",
                      processId: p.id,
                      message: "Project mode upgrade did not converge",
                    }),
                  );
                yield* Effect.sleep(1000);
              }
            }
            if (p.publicIpV4Shared !== (news.sharedIpv4 ?? false))
              p = yield* ops.sharedIpv4(p.id, news.sharedIpv4 ?? false);
            if (news.maxCreditLimit === undefined && output?.maxCreditLimit !== undefined)
              yield* session.note(
                "Removing maxCreditLimit does not clear the remote cap; retaining last-sent value",
              );
            p = yield* ops.update(p.id, {
              name: n,
              description: news.description ?? null,
              tagList: tags,
              publicIpV4Shared: news.sharedIpv4 ?? false,
              maxCreditLimit: credit,
            });
            if (news.envIsolation !== undefined || news.sshIsolation !== undefined) {
              const rows = yield* env.projectList(p.id);
              for (const [key, value] of [
                ["envIsolation", news.envIsolation],
                ["sshIsolation", news.sshIsolation],
              ] as const) {
                if (value === undefined) continue;
                const row = rows.items.find((r) => r.key === key && r.type === "SYSTEM");
                if (!row)
                  return yield* Effect.fail(
                    new ZeropsValidation({
                      status: 400,
                      code: "isolationRowMissing",
                      operation: "updateProject",
                      message: "Required SYSTEM isolation row is missing",
                    }),
                  );
                if (row.content !== value) {
                  const process = yield* env.projectUpdate(row.id, {
                    key,
                    content: value,
                    sensitive: false,
                  });
                  yield* waitProcessWith(http, process.id, options);
                  const actual = yield* env.projectGet(row.id);
                  if (actual.content !== value)
                    return yield* Effect.fail(
                      new ZeropsValidation({
                        status: 400,
                        code: "isolationNotConverged",
                        operation: "updateProject",
                        message: "SYSTEM isolation row did not converge",
                      }),
                    );
                }
              }
            }
            p = yield* ops.get(p.id);
            return yield* observedAttrs(p, mark, { maxCreditLimit: credit });
          }).pipe(
            Effect.timeoutOrElse({
              duration: timeoutMs(output ? "update" : "create", news.timeouts),
              orElse: () =>
                Effect.fail(
                  new ZeropsProcessTimeout({
                    code: "projectOperationTimeout",
                    processId: output?.projectId ?? "creating",
                    message: "Project operation deadline exceeded; remote work may continue",
                  }),
                ),
            }),
          ),
        delete: ({ output, olds, session }) =>
          Effect.gen(function* () {
            const options: WaitOptions = {
              deadline: (yield* Clock.currentTimeMillis) + timeoutMs("delete", olds.timeouts),
              onStatus: (p) => session.note((p.actionName ?? "process") + ": " + p.status),
            };
            if (!(yield* get(output.projectId))) return;
            for (const process of yield* ops.processes(output.projectId))
              if (!["FINISHED", "FAILED", "CANCELED"].includes(process.status))
                yield* waitProcessWith(http, process.id, options);
            const process = yield* ops
              .delete(output.projectId)
              .pipe(
                Effect.catch((error) =>
                  isNotFound(error, "projectNotFound")
                    ? Effect.succeed(undefined)
                    : Effect.fail(error),
                ),
              );
            if (process) yield* waitProcessWith(http, process.id, options);
            while (yield* get(output.projectId)) {
              if ((yield* Clock.currentTimeMillis) >= options.deadline)
                return yield* Effect.fail(
                  new ZeropsProcessTimeout({
                    code: "projectDeleteTimeout",
                    processId: output.projectId,
                    message: "Deleted project remains visible",
                  }),
                );
              yield* Effect.sleep(1000);
            }
          }).pipe(
            Effect.timeoutOrElse({
              duration: timeoutMs("delete", olds.timeouts),
              orElse: () =>
                Effect.fail(
                  new ZeropsProcessTimeout({
                    code: "projectDeleteTimeout",
                    processId: output.projectId,
                    message: "Project deletion deadline exceeded; remote work may continue",
                  }),
                ),
            }),
          ),
        list: () =>
          Effect.gen(function* () {
            const organization = yield* organizationOperations(http).resolve(config.organizationId);
            return (yield* ops.list(organization))
              .filter((p) => p.tagList.some((t) => t.startsWith(markerPrefix)))
              .map((p) =>
                attrs(
                  p,
                  p.tagList.find((t) => t.startsWith(markerPrefix))!,
                ),
              );
          }),
      };
    }),
  );
