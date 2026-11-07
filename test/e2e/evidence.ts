import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { components } from "../../src/client/api.gen.ts";
import { createAuditedGuard } from "./audit.ts";

type ProcessTiming = {
  id: string;
  actionName: string;
  created?: string;
  started?: string | null;
  finished?: string | null;
  status: string;
};
interface Snapshot {
  phase: string;
  capturedAt: string;
  project: { mode: string; ipv4: Record<string, unknown> };
  services: Array<{
    id: string;
    name: string;
    base: string;
    typeVersionName: string;
    mode: string | null;
    versionId: string;
    minDisk: number | null;
    maxDisk: number | null;
    cpuMode: string | null;
  }>;
  appVersion: {
    id: string;
    created: string;
    activationDate: string | null;
    lastUpdate: string;
    build: {
      startDate: string | null;
      endDate: string | null;
      pipelineStart: string | null;
      pipelineFinish: string | null;
    };
  };
  processes: ProcessTiming[];
}
/** Select only limits and process timing metadata; raw API bodies never reach disk/logs. */
export function createEvidence(dir: string, log: (message: string) => Promise<void>) {
  const auditPath = join(dir, "requests.log");
  const guard = createAuditedGuard(auditPath);
  const snapshots: Snapshot[] = [];
  async function get<T>(path: string): Promise<T> {
    const request = {
      method: "GET",
      kind: "api" as const,
      url: new URL("/api/rest/public" + path, process.env.ZEROPS_ENDPOINT!),
    };
    await guard.before(request);
    const response = await fetch(request.url, {
      redirect: "error",
      headers: { Authorization: "Bearer " + process.env.ZEROPS_TOKEN },
    });
    const body: unknown = await response.json();
    await guard.after(request, { status: response.status, body });
    if (!response.ok)
      throw new Error(`Evidence GET ${request.url.pathname} failed (${response.status})`);
    return body as T;
  }
  async function captureLimits(phase: string, out: { projectId: string; appVersionId: string }) {
    const project = await get<components["schemas"]["ResponseProject"]>(
      "/project/" + out.projectId,
    );
    const services: Snapshot["services"] = [];
    const processes: ProcessTiming[] = [];
    let offset = 0;
    for (;;) {
      const page = await get<{
        list: components["schemas"]["ResponseServiceStack"][];
        total?: number;
      }>(`/project/${out.projectId}/service-stack?offset=${offset}&limit=100`);
      for (const item of page.list) {
        const service = await get<components["schemas"]["ResponseServiceStack"]>(
          "/service-stack/" + item.id,
        );
        const scaling = service.customAutoscaling?.verticalAutoscaling;
        services.push({
          id: service.id,
          name: service.name,
          base: service.base,
          mode: service.mode ?? null,
          typeVersionName: service.serviceStackTypeInfo.serviceStackTypeVersionName,
          versionId: service.serviceStackTypeVersionId,
          minDisk: scaling?.minResource?.diskGBytes ?? null,
          maxDisk: scaling?.maxResource?.diskGBytes ?? null,
          cpuMode: scaling?.cpuMode ?? null,
        });
        let processOffset = 0;
        for (;;) {
          const processPage = await get<{ list: ProcessTiming[]; total?: number }>(
            `/service-stack/${service.id}/process?offset=${processOffset}&limit=100`,
          );
          for (const row of processPage.list)
            processes.push({
              id: row.id,
              actionName: row.actionName,
              created: row.created,
              started: row.started,
              finished: row.finished,
              status: row.status,
            });
          processOffset += processPage.list.length;
          if (
            !processPage.list.length ||
            processPage.list.length < 100 ||
            (processPage.total !== undefined && processOffset >= processPage.total)
          )
            break;
        }
      }
      offset += page.list.length;
      if (
        !page.list.length ||
        page.list.length < 100 ||
        (page.total !== undefined && offset >= page.total)
      )
        break;
    }
    const app = await get<components["schemas"]["OutDtoGetAppVersion"]>(
      "/app-version/" + out.appVersionId,
    );
    const ipv4 = Object.fromEntries(
      Object.entries(project).filter(
        ([key, value]) =>
          /(?:ipv4|ip_v4)/i.test(key) &&
          (value === null || ["string", "boolean", "number"].includes(typeof value)),
      ),
    );
    snapshots.push({
      phase,
      capturedAt: new Date().toISOString(),
      project: { mode: project.mode, ipv4 },
      services,
      appVersion: {
        id: app.id,
        created: app.created,
        activationDate: app.activationDate ?? null,
        lastUpdate: app.lastUpdate,
        build: {
          startDate: app.build?.startDate ?? null,
          endDate: app.build?.endDate ?? null,
          pipelineStart: app.build?.pipelineStart ?? null,
          pipelineFinish: app.build?.pipelineFinish ?? null,
        },
      },
      processes,
    });
    await writeFile(join(dir, "limits.json"), JSON.stringify(snapshots, null, 2) + "\n");
    await log("Limits snapshot: " + JSON.stringify(snapshots.at(-1)));
  }
  async function limitsSummary() {
    const latest = snapshots.at(-1);
    const audit = (await readFile(auditPath, "utf8").catch(() => ""))
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as { phase: string; method: string; path: string });
    const buildRequests = audit.filter(
      (row) =>
        row.phase === "before" &&
        row.method === "PUT" &&
        /\/app-version\/[^/]+\/build-and-deploy$/.test(row.path),
    ).length;
    const buildProcesses = [
      ...new Map(
        snapshots
          .flatMap((snapshot) => snapshot.processes)
          .filter((row) => /build/i.test(row.actionName))
          .map((row) => [row.id, row]),
      ).values(),
    ];
    const intervals = buildProcesses
      .map((row) => ({
        start: Date.parse(row.started ?? row.created ?? ""),
        end: Date.parse(row.finished ?? ""),
      }))
      .filter((row) => Number.isFinite(row.start) && Number.isFinite(row.end))
      .sort((a, b) => a.start - b.start);
    let overlapping = false;
    let latestEnd = -Infinity;
    for (const interval of intervals) {
      if (interval.start < latestEnd) overlapping = true;
      latestEnd = Math.max(latestEnd, interval.end);
    }
    const completeTiming = intervals.length >= buildRequests && buildRequests > 0;
    const ipv4Present = latest
      ? Object.values(latest.project.ipv4).some(
          (value) => value !== false && value !== null && value !== "" && value !== 0,
        )
      : "unknown";
    await log(
      "limits | " +
        JSON.stringify({
          projectMode: latest?.project.mode ?? "unknown",
          serviceModes: latest?.services.map((service) => ({
            name: service.name,
            mode: service.mode,
            identifier: service.base,
          })),
          postgres: latest?.services
            .filter((service) => /postgres/i.test(service.base))
            .map((service) => ({ identifier: service.base, minDisk: service.minDisk })),
          ipv4Present,
          buildAndDeployRequests: buildRequests,
          buildOverlap: overlapping
            ? true
            : completeTiming
              ? false
              : "unknown (missing build process timings)",
          timedBuildProcesses: intervals.length,
          evidence: "requests.log + limits.json process started/finished timestamps",
        }),
    );
  }
  return { captureLimits, limitsSummary };
}
