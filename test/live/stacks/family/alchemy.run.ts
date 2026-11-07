import * as Alchemy from "alchemy";
import * as Effect from "effect/Effect";
import { resolve } from "node:path";
import * as Zerops from "../../../../src/index.ts";
import { createGuardFromEnv } from "../../../support/guard.ts";
import { FAMILIES } from "../../families.ts";

const family = process.env.ALCHTEST_FAMILY;
const familyCase = family && Object.hasOwn(FAMILIES, family) ? FAMILIES[family] : undefined;
if (!familyCase) throw new Error("ALCHTEST_FAMILY must name a managed family");
const { minRam, minDisk } = familyCase;
const helper = (Zerops as unknown as Record<string, typeof Zerops.Postgres>)[familyCase.helper]!;

export default Alchemy.Stack(
  "ZeropsProjectLive",
  {
    providers: Zerops.providers({ requestGuard: createGuardFromEnv() }),
    state: Alchemy.localState(),
  },
  Effect.gen(function* () {
    const project = yield* Zerops.Project("Project", {
      name: process.env.ALCHTEST_NAME!,
      organizationId: process.env.ZEROPS_ORGANIZATION_ID!,
      mode: "LIGHT",
    });
    const managed = yield* helper("Managed", {
      project,
      hostname: "fam",
      version: familyCase.version,
      mode: "NON_HA",
      autoscaling: {
        vertical: {
          cpuMode: "SHARED",
          minCpu: 1,
          maxCpu: 1,
          minRam,
          maxRam: Number(process.env.ALCHTEST_MAX_RAM ?? minRam),
          minDisk,
          maxDisk: minDisk,
        },
      },
      ...(familyCase.update === "stop"
        ? {
            state:
              process.env.ALCHTEST_STOP === "true" ? ("stopped" as const) : ("running" as const),
          }
        : {}),
    });
    // The selected helper and key belong to the same table row, across family-specific types.
    const renderRef = Zerops.ref as unknown as (target: typeof managed, key: string) => string;
    const refExpr = renderRef(managed, familyCase.refKey);
    const app = yield* Zerops.Service("App", {
      project,
      hostname: "app",
      type: "nodejs@22",
      mode: "NON_HA",
      autoscaling: {
        vertical: {
          cpuMode: "SHARED",
          minCpu: 1,
          maxCpu: 1,
          minRam: 0.125,
          maxRam: 0.125,
          minDisk: 1,
          maxDisk: 1,
        },
        horizontal: { minContainers: 1, maxContainers: 1 },
      },
      source: { dir: resolve(import.meta.dirname, "../../../fixtures/apps/ref-echo") },
      subdomain: true,
      env: { FAMILY_REF: refExpr },
    });
    return {
      projectId: project.projectId,
      managedId: managed.serviceId,
      appId: app.serviceId,
      subdomainUrls: app.subdomainUrls,
      refExpr,
    };
  }),
);
