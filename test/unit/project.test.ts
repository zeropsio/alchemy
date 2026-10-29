import { test, expect } from "bun:test";
import { projectNeedsReplace } from "../../src/Project.ts";
test("project replacement is directional for mode", () => {
  expect(projectNeedsReplace({ mode: "LIGHT" }, { mode: "SERIOUS" })).toBe(false);
  expect(projectNeedsReplace({ mode: "SERIOUS" }, { mode: "LIGHT" })).toBe(true);
  expect(projectNeedsReplace({ organizationId: "a" }, { organizationId: "b" })).toBe(true);
  expect(projectNeedsReplace({ description: "a" }, { description: "b" })).toBe(false);
});
