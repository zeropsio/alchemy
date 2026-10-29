import { test, expect } from "bun:test";
import {
  validateHostname,
  generatedHostname,
  sameServiceType,
  ownershipMarker,
  markedTags,
  userTags,
} from "../../src/internal/Names.ts";
import { envDigest } from "../../src/internal/Environment.ts";
test("hostname grammar and reserved infrastructure", () => {
  for (const h of ["core", "l7httpbalancer", "a-b", "1abc", "A", "a".repeat(41)])
    expect(() => validateHostname(h)).toThrow();
  expect(validateHostname("db1")).toBe("db1");
  expect(generatedHostname("123 / Huge name".repeat(20), "abc")).toMatch(/^[a-z][a-z0-9]{0,39}$/);
});
test("canonical type aliases", () => {
  expect(sameServiceType("nodejs@22", "ubuntu/nodejs@22")).toBe(true);
  expect(sameServiceType("nodejs@22", "alpine/nodejs@22")).toBe(true);
  expect(sameServiceType("alpine/nodejs@22", "ubuntu/nodejs@22")).toBe(true);
  expect(sameServiceType("nodejs@20", "alpine/nodejs@22")).toBe(false);
  expect(sameServiceType("postgresql@16", "postgresql:single@16")).toBe(true);
  expect(sameServiceType("nodejs@20", "nodejs@22")).toBe(false);
});
test("marker stable bounded and excluded from user tags", () => {
  const marker = ownershipMarker("stack", "stage", "Api");
  expect(marker.length).toBeLessThanOrEqual(65);
  expect(userTags(markedTags(["team"], marker))).toEqual(["team"]);
  expect(() => markedTags([marker], marker)).toThrow();
  expect(marker).not.toBe(ownershipMarker("stack", "other", "Api"));
});
test("mask markers never become content digests", () => {
  expect(envDigest("REDACTED")).toBeUndefined();
  expect(envDigest("*****", "prior")).toBe("prior");
  expect(envDigest("hello")).toHaveLength(64);
});
import { autoscalingDto } from "../../src/internal/Autoscaling.ts";
test("autoscaling maps every public leaf to wire resources", () => {
  const dto = autoscalingDto({
    vertical: {
      cpuMode: "DEDICATED",
      minCpu: 1,
      maxCpu: 2,
      minRam: 3,
      maxRam: 4,
      minDisk: 5,
      maxDisk: 6,
      startCpuCoreCount: 1,
      minFreeCpuCores: 0.5,
      minFreeCpuPercent: 10,
      minFreeRamGb: 1,
      minFreeRamPercent: 20,
      swapEnabled: true,
    },
    horizontal: { minContainers: 1, maxContainers: 3 },
  });
  expect(dto).toEqual({
    verticalAutoscaling: {
      cpuMode: "DEDICATED",
      minResource: { cpuCoreCount: 1, memoryGBytes: 3, diskGBytes: 5 },
      maxResource: { cpuCoreCount: 2, memoryGBytes: 4, diskGBytes: 6 },
      startCpuCoreCount: 1,
      minFreeResource: {
        cpuCoreCount: 0.5,
        cpuCorePercent: 10,
        memoryGBytes: 1,
        memoryPercent: 20,
      },
      swapEnabled: true,
    },
    horizontalAutoscaling: { minContainerCount: 1, maxContainerCount: 3 },
  });
  expect(() => autoscalingDto({ vertical: { minCpu: 3, maxCpu: 2 } })).toThrow();
  expect(() => autoscalingDto({ vertical: { minRam: NaN } })).toThrow();
});
test("truncated logical hostnames retain identity", () => {
  expect(generatedHostname("a".repeat(50) + "x", "instance")).not.toBe(
    generatedHostname("a".repeat(50) + "y", "instance"),
  );
});
