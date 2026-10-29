import * as Effect from "effect/Effect";
import * as Clock from "effect/Clock";
import type { Http } from "../client/Http.ts";
import { ZeropsDeployFailed } from "../client/Errors.ts";
import { appVersionOperations } from "../client/operations/AppVersion.ts";
import { serviceStackOperations } from "../client/operations/ServiceStack.ts";
import { waitProcessWith, type WaitOptions } from "../client/Process.ts";
import { inspectSource, snapshotSource, type ServiceSource } from "../source/Source.ts";
import { sourceHash } from "../source/Hash.ts";
import { renderZeropsYaml, zeropsYamlSetups, type ZeropsYamlDoc } from "../source/ZeropsYaml.ts";
import { ZeropsSourceError } from "../source/SourceError.ts";
import { settleService } from "./ServiceLifecycle.ts";
import { redactDeployLog } from "./DeployLog.ts";

export interface DeployProps {
  /** Directory, prebuilt archive or provider-fetched exact Git reference. */
  source?: ServiceSource;
  /** YAML override; otherwise select root zerops.yml or zerops.yaml from source. */
  zeropsYaml?: string | ZeropsYamlDoc;
  /** YAML setup name; defaults to the service hostname. */
  setup?: string;
  /** Run the builder before deploying; false deploys a prebuilt archive. */
  build?: boolean;
  /** Change this token to force deployment of otherwise identical source. */
  redeploy?: string;
}
export interface DeployIdentity {
  sourceHash: string;
  gitCommit?: string;
}
export interface DeployedVersion {
  sourceHash?: string;
  gitCommit?: string;
  appVersionId?: string;
  activeAppVersionId?: string;
}
export const deploymentIsCurrent = (identity: DeployIdentity, previous?: DeployedVersion) =>
  !!previous?.appVersionId &&
  previous.sourceHash === identity.sourceHash &&
  previous.gitCommit === identity.gitCommit &&
  previous.activeAppVersionId === previous.appVersionId;
// Embedded YAML is covered by content/commit identity; frame its selection separately.
export const deployIdentity = (
  props: DeployProps,
  hostname: string,
  identity: { contentDigest?: string; gitCommit?: string },
): DeployIdentity => ({
  sourceHash: sourceHash({
    contentDigest: identity.gitCommit ?? identity.contentDigest!,
    zeropsYaml:
      props.zeropsYaml === undefined
        ? JSON.stringify(["embedded"])
        : JSON.stringify(["explicit", renderZeropsYaml(props.zeropsYaml)]),
    setup: props.setup ?? hostname,
    build: props.build !== false,
    redeploy: props.redeploy,
  }),
  gitCommit: identity.gitCommit,
});
export const inspectDeployment = (props: DeployProps, hostname: string) =>
  props.source
    ? inspectSource(props.source).pipe(
        Effect.map((candidate) => deployIdentity(props, hostname, candidate)),
      )
    : Effect.succeed(undefined);

export const selectDeployYaml = (
  explicit: string | ZeropsYamlDoc | undefined,
  embedded: string | undefined,
  setup: string,
) =>
  Effect.gen(function* () {
    const yaml = explicit === undefined ? embedded : renderZeropsYaml(explicit);
    if (yaml === undefined)
      return yield* Effect.fail(
        new ZeropsSourceError({
          message: "Deployment requires zeropsYaml or a root zerops.yml/zerops.yaml",
        }),
      );
    if (!(yield* zeropsYamlSetups(yaml)).includes(setup))
      return yield* Effect.fail(
        new ZeropsSourceError({
          message: "Missing Zerops YAML setup: " + setup,
        }),
      );
    return yaml;
  });

const requireDeployTime = (deadline: number) =>
  Effect.gen(function* () {
    const remaining = deadline - (yield* Clock.currentTimeMillis);
    if (remaining <= 0)
      return yield* Effect.fail(
        new ZeropsDeployFailed({
          code: "deployTimeout",
          message: "Deployment deadline exceeded before the next operation",
        }),
      );
    return remaining;
  });

/** Interrupt snapshot subprocesses and transport fetches using one absolute deadline. */
export const withinDeployDeadline =
  (deadline: number) =>
  <A, E, R>(effect: Effect.Effect<A, E, R>) =>
    Effect.gen(function* () {
      const remaining = yield* requireDeployTime(deadline);
      return yield* effect.pipe(
        Effect.timeoutOrElse({
          duration: remaining,
          orElse: () =>
            Effect.fail(
              new ZeropsDeployFailed({
                code: "deployTimeout",
                message: "Deployment exceeded its absolute deadline",
              }),
            ),
        }),
      );
    });

export const deployService = (
  http: Http,
  args: {
    serviceId: string;
    projectId: string;
    hostname: string;
    props: DeployProps;
    previous?: DeployedVersion;
    secrets?: ReadonlyArray<string>;
    options: WaitOptions;
  },
) => {
  if (!args.props.source) return Effect.succeed(args.previous ?? {});
  const source = args.props.source;
  return Effect.gen(function* () {
    const snapshot = yield* snapshotSource(source);
    const identity = deployIdentity(args.props, args.hostname, snapshot);
    if (deploymentIsCurrent(identity, args.previous)) return args.previous!;
    const setup = args.props.setup ?? args.hostname;
    const yaml = yield* selectDeployYaml(args.props.zeropsYaml, snapshot.embeddedZeropsYaml, setup);
    const ops = appVersionOperations(http);
    yield* requireDeployTime(args.options.deadline);
    const version = yield* ops.create(
      args.serviceId,
      "alchemy-" + identity.sourceHash.slice(0, 12),
    );
    let processId: string | undefined;
    return yield* Effect.gen(function* () {
      yield* requireDeployTime(args.options.deadline);
      yield* http.upload(version.uploadUrl, snapshot.archive);
      yield* requireDeployTime(args.options.deadline);
      const process = yield* ops.deploy(version.id, yaml, setup, args.props.build !== false);
      processId = process.id;
      yield* waitProcessWith(http, process.id, args.options);
      while (true) {
        const app = yield* ops.get(version.id);
        if (
          [
            "BUILD_FAILED",
            "DEPLOY_FAILED",
            "PREPARING_RUNTIME_FAILED",
            "BUILD_VALIDATION_FAILED",
            "CANCELLED",
          ].includes(app.status)
        )
          return yield* Effect.fail(
            new ZeropsDeployFailed({
              code: "appVersionFailed",
              serviceId: args.serviceId,
              status: app.status,
              message: "App version entered " + app.status,
            }),
          );
        const service = yield* serviceStackOperations(http).get(args.serviceId);
        if (app.status === "ACTIVE" && service.activeAppVersion?.id === version.id) {
          const settled = yield* settleService(http, args.serviceId, ["ACTIVE"], args.options);
          if (settled.activeAppVersion?.id === version.id)
            return { ...identity, appVersionId: version.id };
        }
        if ((yield* Clock.currentTimeMillis) >= args.options.deadline)
          return yield* Effect.fail(
            new ZeropsDeployFailed({
              code: "deployTimeout",
              serviceId: args.serviceId,
              message: "Deployment did not reach active app-version and stable service readiness",
            }),
          );
        yield* Effect.sleep(1000);
      }
    }).pipe(
      Effect.catch((error) =>
        Effect.gen(function* () {
          const log = yield* ops
            .logTail(args.projectId, args.serviceId, version.id, args.secrets)
            .pipe(
              Effect.timeoutOrElse({ duration: 15000, orElse: () => Effect.succeed("") }),
              Effect.catch(() => Effect.succeed("")),
            );
          const logTail = redactDeployLog(log, args.secrets);
          return yield* Effect.fail(
            new ZeropsDeployFailed({
              code: "deployFailed",
              serviceId: args.serviceId,
              processId,
              status: "status" in error ? String(error.status) : undefined,
              message:
                "Zerops deployment failed (" +
                error._tag +
                ")" +
                (logTail.trim() ? "\nSanitized log tail:\n" + logTail : "\nLog tail unavailable."),
              logTail,
            }),
          );
        }),
      ),
    );
  }).pipe(withinDeployDeadline(args.options.deadline));
};
