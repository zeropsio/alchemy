import { test, expect } from "bun:test";
import { createLiveHarness, rawProjectAbsent, liveApi } from "./harness.ts";
import type { ProjectRecord } from "../../src/client/operations/Project.ts";

const rawProject = async (
  method: "GET" | "PUT",
  id: string,
  body?: unknown,
): Promise<ProjectRecord> => {
  return liveApi<ProjectRecord>(method, "/project/" + encodeURIComponent(id), body);
};
test.skipIf(!["dev", "prod"].includes(process.env.ZEROPS_TARGET ?? ""))(
  "Project lifecycle, marker recovery, adoption and absence",
  async () => {
    const h = await createLiveHarness("project");
    let id: string | undefined;
    try {
      const created = await h.run("deploy");
      console.log(created.output);
      expect(created.code).toBe(0);
      const output = await h.outputs();
      id = output.projectId ?? output.outputs?.projectId;
      expect(typeof id).toBe("string");
      const noop = await h.run("plan");
      console.log(noop.output);
      expect(noop.code).toBe(0);
      expect(noop.output).toContain("Plan: no changes");
      const props = { ALCHTEST_DESCRIPTION: "updated", ALCHTEST_TAGS: '["live","updated"]' };
      const updated = await h.run("deploy", { props });
      console.log(updated.output);
      expect(updated.code).toBe(0);
      const unchanged = await h.run("drift", { props });
      console.log(unchanged.output);
      expect(unchanged.code).toBe(0);
      expect(unchanged.output).toContain("Plan: no changes");
      const liveProject = await rawProject("GET", id!);
      await rawProject("PUT", id!, {
        name: liveProject.name,
        description: "out-of-band description",
        tagList: liveProject.tagList,
        publicIpV4Shared: liveProject.publicIpV4Shared,
      });
      const drifted = await h.run("drift", { props });
      console.log(drifted.output);
      expect(drifted.code).toBe(0);
      expect(drifted.output).toContain("Plan: 1 to update");
      const repaired = await h.run("drift", { repair: true, props });
      console.log(repaired.output);
      expect(repaired.code).toBe(0);
      expect((await rawProject("GET", id!)).description).toBe("updated");
      const stable = await h.run("drift", { props });
      console.log(stable.output);
      expect(stable.code).toBe(0);
      expect(stable.output).toContain("Plan: no changes");
      await h.loseState();
      // Matching stack/stage/FQN marker proves ownership, so state loss auto-admits.
      const recovered = await h.run("deploy", { props });
      console.log(recovered.output);
      expect(recovered.code).toBe(0);
      const adopted = await h.run("deploy", { adopt: true, props });
      console.log(adopted.output);
      expect(adopted.code).toBe(0);
    } finally {
      try {
        const destroyed = await h.run("destroy");
        console.log(destroyed.output);
        expect(destroyed.code).toBe(0);
        if (id) {
          expect(await rawProjectAbsent(id)).toBe(true);
          console.log("ABSENCE CONFIRMED project " + id);
        }
      } finally {
        await h.remove();
      }
    }
  },
  3600000,
);
