import type { components } from "../client/api.gen.ts";
export interface VerticalScaling {
  cpuMode?: "SHARED" | "DEDICATED";
  minCpu?: number;
  maxCpu?: number;
  minRam?: number;
  maxRam?: number;
  minDisk?: number;
  maxDisk?: number;
  startCpuCoreCount?: number;
  minFreeCpuCores?: number;
  minFreeCpuPercent?: number;
  minFreeRamGb?: number;
  minFreeRamPercent?: number;
  swapEnabled?: boolean;
}
export interface Autoscaling {
  vertical?: VerticalScaling;
  horizontal?: { minContainers?: number; maxContainers?: number };
}
export function autoscalingDto(
  input: Autoscaling,
): components["schemas"]["InDtoBodyCustomAutoscaling"] {
  const v = input.vertical,
    h = input.horizontal;
  for (const section of [v, h])
    for (const [key, value] of Object.entries(section ?? {})) {
      if (typeof value === "number" && (!Number.isFinite(value) || value < 0))
        throw new Error("Autoscaling " + key + " must be finite and nonnegative");
    }
  for (const [min, max] of [
    [v?.minCpu, v?.maxCpu],
    [v?.minRam, v?.maxRam],
    [v?.minDisk, v?.maxDisk],
    [h?.minContainers, h?.maxContainers],
  ])
    if (min !== undefined && max !== undefined && min > max)
      throw new Error("Autoscaling minimum exceeds maximum");
  for (const n of [v?.minFreeCpuPercent, v?.minFreeRamPercent])
    if (n !== undefined && n > 100) throw new Error("Autoscaling percentages cannot exceed 100");
  return {
    verticalAutoscaling: v
      ? {
          cpuMode: v.cpuMode,
          startCpuCoreCount: v.startCpuCoreCount,
          swapEnabled: v.swapEnabled,
          minResource: { cpuCoreCount: v.minCpu, memoryGBytes: v.minRam, diskGBytes: v.minDisk },
          maxResource: { cpuCoreCount: v.maxCpu, memoryGBytes: v.maxRam, diskGBytes: v.maxDisk },
          minFreeResource: {
            cpuCoreCount: v.minFreeCpuCores,
            cpuCorePercent: v.minFreeCpuPercent,
            memoryGBytes: v.minFreeRamGb,
            memoryPercent: v.minFreeRamPercent,
          },
        }
      : undefined,
    horizontalAutoscaling: h
      ? { minContainerCount: h.minContainers, maxContainerCount: h.maxContainers }
      : undefined,
  };
}
