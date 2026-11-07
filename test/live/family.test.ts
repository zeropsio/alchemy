import { test, expect } from "bun:test";
import { createLiveHarness, liveApi, rawProjectAbsent } from "./harness.ts";
import { FAMILIES } from "./families.ts";
import type { ServiceStackRecord } from "../../src/client/operations/ServiceStack.ts";

interface FamilyEnv {
  items?: Array<{ key: string }>;
  list?: Array<{ key: string }>;
}

interface FamilyOutputs {
  projectId: string;
  managedId: string;
  appId: string;
  subdomainUrls: string[];
  refExpr: string;
}

async function waitForReference(subdomainUrls: string[]) {
  expect(subdomainUrls.length).toBeGreaterThan(0);
  const url = new URL(subdomainUrls[0]!);
  url.protocol = "https:";
  const deadline = Date.now() + 600000;
  do {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(Math.min(10000, Math.max(1, deadline - Date.now()))),
        redirect: "error",
      });
      const body = await response.text();
      if (response.status === 200 && body === "ref=set") return;
    } catch {
      // A generated subdomain can take time to become reachable after deployment.
    }
    // Real remote DNS and deployment readiness cannot be advanced with fake timers.
    await Bun.sleep(Math.min(5000, Math.max(0, deadline - Date.now())));
  } while (Date.now() < deadline);
  throw new Error("Family app did not confirm a resolved reference within 10 minutes");
}

const family = process.env.ALCHTEST_FAMILY;
test.skipIf(!["dev", "prod"].includes(process.env.ZEROPS_TARGET ?? "") || !family)(
  "one managed family: lifecycle, reference, convergence and absence",
  async () => {
    const familyId = family!;
    const familyCase = Object.hasOwn(FAMILIES, familyId) ? FAMILIES[familyId] : undefined;
    if (!familyCase) throw new Error("ALCHTEST_FAMILY must name a managed family");
    const step = async <T>(name: string, action: () => Promise<T>): Promise<T> => {
      let ok = false;
      try {
        const result = await action();
        ok = true;
        return result;
      } finally {
        console.log(`FAMILY_RESULT family=${familyId} step=${name} ok=${ok}`);
      }
    };
    const h = await createLiveHarness("family", { ALCHTEST_FAMILY: familyId });
    let projectId: string | undefined;
    const raw = (id: string) => liveApi<ServiceStackRecord>("GET", "/service-stack/" + id);
    try {
      const output = await step("deploy", async () => {
        const deployed = await h.run("deploy");
        const stored = await h.outputs().catch(() => undefined);
        const out: FamilyOutputs | undefined = stored?.outputs ?? stored;
        projectId = out?.projectId;
        expect(deployed.code).toBe(0);
        expect(typeof projectId).toBe("string");
        expect(out).toBeDefined();
        return out!;
      });
      await step("active", async () => {
        expect((await raw(output.managedId)).status).toBe("ACTIVE");
      });
      await step("reference-expression", async () => {
        expect(output.refExpr).toBe("${fam_" + familyCase.refKey + "}");
      });
      await step("env-keys", async () => {
        const env = await liveApi<FamilyEnv>("GET", "/service-stack/" + output.managedId + "/env");
        const rows = env.items ?? env.list;
        expect(rows).toBeArray();
        console.log("FAMILY ENV KEYS " + JSON.stringify(rows!.map((row) => row.key).sort()));
      });
      await step("reference-resolved", () => waitForReference(output.subdomainUrls));
      await step("identical-deploy", async () => {
        expect((await h.run("deploy")).code).toBe(0);
      });
      await step("no-change-plan", async () => {
        const plan = await h.run("plan");
        expect(plan.code).toBe(0);
        expect(plan.output.includes("Plan: no changes")).toBe(true);
      });
      await step("clean-drift", async () => {
        const drift = await h.run("drift");
        expect(drift.code).toBe(0);
        expect(drift.output.includes("Plan: no changes")).toBe(true);
      });
      if (familyCase.update === "scale") {
        await step("scale", async () => {
          const maxRam =
            process.env.ZEROPS_TARGET === "prod"
              ? familyCase.minRam + 0.125
              : familyCase.minRam * 2;
          const updated = await h.run("deploy", { props: { ALCHTEST_MAX_RAM: String(maxRam) } });
          expect(updated.code).toBe(0);
          const managed = await raw(output.managedId);
          expect(managed.customAutoscaling?.verticalAutoscaling?.maxResource?.memoryGBytes).toBe(
            maxRam,
          );
        });
      } else {
        await step("stop", async () => {
          const stopped = await h.run("deploy", { props: { ALCHTEST_STOP: "true" } });
          expect(stopped.code).toBe(0);
          expect((await raw(output.managedId)).status).toBe("STOPPED");
        });
        await step("start", async () => {
          expect((await h.run("deploy")).code).toBe(0);
          expect((await raw(output.managedId)).status).toBe("ACTIVE");
        });
      }
    } finally {
      try {
        await step("destroy", async () => {
          expect((await h.run("destroy")).code).toBe(0);
        });
        if (projectId) {
          await step("absence", async () => {
            expect(await rawProjectAbsent(projectId!)).toBe(true);
            console.log("ABSENCE CONFIRMED project " + projectId);
          });
        }
      } finally {
        // The harness also emits the standard LIVE_RESULT summary and checks its ledger.
        await h.remove();
      }
    }
  },
  3600000,
);
