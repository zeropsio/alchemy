import { parse as parseYaml } from "yaml";
import type { ZeropsRequestGuard, ZeropsRequestInfo } from "../../src/client/RequestGuard.ts";
import { ZeropsGuardRefused } from "../../src/client/Errors.ts";
import {
  devLedgerPath,
  OWNED_NAME,
  alchemyProjects,
  alchemyProjectIntents,
  readLedger,
  recordProject,
  recordProjectIntent,
} from "./ledger.ts";

const PROD = "https://api.app-prg1.zerops.io";
const PREFIX = "/api/rest/public/";
type ObjectData = Record<string, unknown>;
const data = (value: unknown): ObjectData =>
  value !== null && typeof value === "object" && !Array.isArray(value) ? (value as ObjectData) : {};
const objectKinds: Record<string, true> = {
  "service-stack": true,
  "user-data": true,
  "project-env": true,
  "public-http-routing": true,
  "public-port-routing": true,
  "app-version": true,
  process: true,
};

// Shared by every guard in this process; the cross-process boundary is runLock.ts.
let buildQueue = Promise.resolve();
const submittedProcesses = new Set<string>();
async function lockBuild(): Promise<() => void> {
  const previous = buildQueue;
  let release!: () => void;
  buildQueue = new Promise<void>((resolve) => {
    release = resolve;
  });
  await previous;
  return release;
}
function lookupFailure(path: string, status: number): Error {
  const safePath = path.split("?")[0]!;
  return Object.assign(new Error(`ZEROPS_5XX GET ${safePath} status ${status}`), {
    method: "GET",
    path: safePath,
    status,
  });
}

function mutationRoute(method: string, p: string[]): boolean {
  const suffix = p.slice(2).join("/");
  const routes: Record<string, Record<string, string>> = {
    project: {
      "": "PUT DELETE",
      env: "POST",
      "service-stack": "POST",
      "service-stack/object_storage_v1": "POST",
      "public-http-routing": "POST",
      "mode-upgrade": "PUT",
      "public-ipv4-shared": "PUT",
      "sync-public-http-routing": "PUT",
      "sync-public-port-routing": "PUT",
      "remote-logging": "PUT",
      "l7httpbalancer-config": "PUT",
      "core-stack/prometheus-config": "PUT",
      vpn: "POST DELETE",
    },
    "service-stack": {
      "": "DELETE",
      "user-data": "POST",
      "public-port-routing": "POST",
      "app-version": "POST",
      autoscaling: "PUT",
      start: "PUT",
      stop: "PUT",
      reload: "PUT",
      "enable-subdomain-access": "PUT",
      "disable-subdomain-access": "PUT",
      "object-storage-size": "PUT",
      "trigger-pipeline": "PUT",
      "backup-config": "PUT",
      restart: "PUT",
      "external-repository-integration": "PUT",
      cdn: "PUT DELETE",
    },
    "project-env": { "": "PUT DELETE" },
    "user-data": { "": "PUT DELETE" },
    "public-port-routing": { "": "PUT DELETE", restore: "PUT" },
    "public-http-routing": {
      "": "PUT DELETE",
      restore: "PUT",
      location: "PUT",
      "trigger-domains-dns-check": "PUT",
    },
    "app-version": { deploy: "PUT", "build-and-deploy": "PUT" },
  };
  return (routes[p[0]!]?.[suffix]?.split(" ") ?? []).includes(method);
}

/** Test-only policy. Environment is captured once; membership is resolved lazily on first request. */
export function createGuardFromEnv(): ZeropsRequestGuard {
  const target = process.env.ZEROPS_TARGET || "dev";
  if (target !== "dev" && target !== "prod") throw new Error("ZEROPS_TARGET must be dev or prod");
  const prod = target === "prod";
  const endpoint = process.env.ZEROPS_ENDPOINT ?? "";
  const org = process.env.ZEROPS_ORGANIZATION_ID?.trim();
  const token = process.env.ZEROPS_TOKEN?.trim();
  if (!org || !token) throw new Error("ZEROPS_ORGANIZATION_ID and ZEROPS_TOKEN are required");
  const domain = (process.env.ZEROPS_DEV_DOMAIN ?? "").toLowerCase();
  const insideDev = (host: string) =>
    host !== "api.app-prg1.zerops.io" &&
    (host === domain || host.endsWith(`.${domain}`));
  if (
    !prod &&
    (domain.length > 253 ||
      domain.split(".").length < 2 ||
      domain === "api.app-prg1.zerops.io" ||
      !domain.split(".").every((x) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(x)))
  )
    throw new Error("invalid ZEROPS_DEV_DOMAIN");
  let origin: URL;
  try {
    origin = new URL(endpoint);
  } catch {
    throw new Error("invalid target endpoint");
  }
  if (
    !/^https:\/\/[^/?#]+$/.test(endpoint) ||
    origin.username ||
    origin.password ||
    (prod ? endpoint !== PROD : !insideDev(origin.hostname))
  )
    throw new Error("endpoint does not match target");
  const pinnedOrg = process.env.ZEROPS_CI_ORGANIZATION_ID?.trim();
  if (prod && (!pinnedOrg || org !== pinnedOrg))
    throw new Error("production organization is not the allowed pinned organization");
  const ledger = prod ? (process.env.ZEROPS_PROD_LEDGER ?? "") : devLedgerPath();
  // Production retains its established alchtest- ownership boundary.
  const ownedName = (name: unknown): name is string =>
    typeof name === "string" && (prod ? name.startsWith("alchtest-") : OWNED_NAME.test(name));
  if (prod) readLedger(ledger);
  const objects = new Map<string, ObjectData>();
  const uploadUrls = new Set<string>();
  const logUrls = new Map<string, string>();
  const ownedRequests = new WeakMap<ZeropsRequestInfo, string>();
  let membership: Promise<void> | undefined;
  const buildReleases = new WeakMap<ZeropsRequestInfo, () => void>();
  function releaseBuild(req: ZeropsRequestInfo): void {
    buildReleases.get(req)?.();
    buildReleases.delete(req);
  }

  async function get(path: string, deadline?: AbortSignal): Promise<ObjectData> {
    // Bound headers and body consumption, even if a transport fails to honor cancellation.
    const timeout = AbortSignal.timeout(30000);
    const signal = deadline ? AbortSignal.any([timeout, deadline]) : timeout;
    const { promise: aborted, reject } = Promise.withResolvers<never>();
    const onAbort = () => reject(lookupFailure(path, 0));
    if (signal.aborted) onAbort();
    else signal.addEventListener("abort", onAbort, { once: true });
    try {
      return await Promise.race([
        aborted,
        (async () => {
          if (signal.aborted) throw lookupFailure(path, 0);
          let response: Response;
          try {
            response = await fetch(`${endpoint}/api/rest/public${path}`, {
              method: "GET",
              redirect: "error",
              signal,
              headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            });
          } catch {
            throw lookupFailure(path, 0);
          }
          if (response.status >= 500) throw lookupFailure(path, response.status);
          if (!response.ok) throw new Error("guard ownership lookup failed");
          try {
            return data(await response.json());
          } catch {
            if (signal.aborted) throw lookupFailure(path, 0);
            throw new Error("invalid guard ownership response");
          }
        })(),
      ]);
    } finally {
      signal.removeEventListener("abort", onAbort);
    }
  }
  async function pinMembership(): Promise<void> {
    let offset = 0;
    for (;;) {
      const page = await get(`/user/client-list?offset=${offset}&limit=100`);
      if (!Array.isArray(page.list)) throw new Error("invalid organization membership response");
      if (
        page.list.some(
          (m: unknown) =>
            data(m).clientId === org && (!data(m).client || data(data(m).client).id === org),
        )
      )
        return;
      offset += page.list.length;
      if (
        !page.list.length ||
        typeof page.total !== "number" ||
        !Number.isFinite(page.total) ||
        offset >= page.total
      )
        break;
    }
    throw new Error("production token has no membership in the pinned organization");
  }
  async function lookup(kind: string, id: string, deadline?: AbortSignal): Promise<ObjectData> {
    if (!/^[a-zA-Z0-9_-]{1,128}$/.test(id)) throw new Error("invalid guard object id");
    const key = `${kind}/${id}`;
    if (!objects.has(key)) objects.set(key, await get(`/${key}`, deadline));
    return objects.get(key)!;
  }
  async function projectFor(
    kind: string,
    id: string,
    seen = new Set<string>(),
    deadline?: AbortSignal,
  ): Promise<string> {
    if (kind === "project") return id;
    const key = `${kind}/${id}`;
    if (seen.has(key) || seen.size > 8) throw new Error("cyclic guard ownership response");
    seen.add(key);
    const obj = await lookup(kind, id, deadline);
    if (obj.clientId && obj.clientId !== org) throw new Error("foreign organization refused");
    if (typeof obj.projectId === "string" && obj.projectId) return obj.projectId;
    if (typeof obj.serviceStackId === "string" && obj.serviceStackId)
      return projectFor("service-stack", obj.serviceStackId, seen, deadline);
    if (typeof obj.appVersionId === "string" && obj.appVersionId)
      return projectFor("app-version", obj.appVersionId, seen, deadline);
    throw new Error("object has no project ownership");
  }
  async function ownProject(id: string): Promise<void> {
    if (prod && !alchemyProjects(ledger).has(id))
      throw new Error("project is not recorded with source alchemy");
    const project = await lookup("project", id);
    if (project.clientId !== org) throw new Error("project belongs to foreign organization");
    if (!ownedName(project.name)) throw new Error("project requires alchtest- ownership");
  }
  async function list(path: string, deadline: AbortSignal): Promise<ObjectData[]> {
    const rows: ObjectData[] = [];
    for (let offset = 0; ;) {
      const page = await get(`${path}?offset=${offset}&limit=100`, deadline);
      if (
        !Array.isArray(page.list) ||
        typeof page.total !== "number" ||
        !Number.isInteger(page.total) ||
        page.total < offset + page.list.length ||
        (!page.list.length && offset < page.total)
      )
        throw new Error("invalid build admission inventory");
      for (const row of page.list) rows.push(data(row));
      offset += page.list.length;
      if (offset >= page.total) return rows;
    }
  }
  function activeBuild(row: ObjectData): boolean {
    if (typeof row.status !== "string" || typeof row.actionName !== "string")
      throw new Error("invalid build admission process");
    return /build|deploy/i.test(row.actionName) && ["PENDING", "RUNNING"].includes(row.status);
  }
  async function admitBuild(targetProject: string, deadline: AbortSignal): Promise<void> {
    // Project processes include service processes (research/findings/service.md).
    const owned = alchemyProjects(ledger);
    const projects = new Set([targetProject]);
    for (const row of await list(`/client/${org}/project`, deadline)) {
      if (
        row.clientId !== org ||
        typeof row.id !== "string" ||
        !/^[a-zA-Z0-9_-]{1,128}$/.test(row.id) ||
        typeof row.name !== "string"
      )
        throw new Error("invalid build admission project");
      if (ownedName(row.name) || owned.has(row.id)) projects.add(row.id);
    }
    for (const id of submittedProcesses) {
      const row = await get(`/process/${id}`, deadline);
      if (activeBuild(row))
        throw new Error("production single-build guard: build/deploy already PENDING/RUNNING");
      if (!["FINISHED", "FAILED", "CANCELED", "CANCELLED", "ERROR"].includes(String(row.status)))
        throw new Error(
          "production single-build guard: previous submission is not confirmed terminal",
        );
      submittedProcesses.delete(id);
    }
    for (const id of projects)
      for (const row of await list(`/project/${id}/process`, deadline))
        if (activeBuild(row))
          throw new Error("production single-build guard: build/deploy already PENDING/RUNNING");
  }
  function inspect(value: unknown): void {
    if (Array.isArray(value)) {
      for (const child of value) inspect(child);
      return;
    }
    for (const [key, child] of Object.entries(data(value))) {
      if ((key === "clientId" || key === "organizationId") && child !== org)
        throw new Error("foreign organization refused");
      if (
        prod &&
        (key === "mode" || key === "serviceMode" || key === "projectMode") &&
        (child === "SERIOUS" || child === "HA")
      )
        throw new Error("production expensive mode refused");
      if (prod && key === "serviceStackVersionName" && typeof child === "string") {
        const runtime =
          /^(?:nodejs|bun|deno|php|python|go|rust|java|dotnet)(?:@|$)/.test(child) ||
          /^(?:ubuntu|alpine)\//.test(child) ||
          /^(?:static|object_storage)(?:@|$)/.test(child);
        if (!runtime && !/^[a-z][a-z0-9_-]*:single@[^@]+$/.test(child))
          throw new Error(
            "production managed service requires explicit :single@ mode; HA/default refused",
          );
        if (/^postgresql(?:[:@]|$)/i.test(child) && child !== "postgresql:single@16")
          throw new Error("production PostgreSQL requires exactly postgresql:single@16");
      }
      if (
        prod &&
        (((key === "ipType" || key === "publicIpType") && child === "IP_V4") ||
          (key === "publicIpV4Shared" && child !== false && child !== undefined))
      )
        throw new Error("production IPv4 routing refused");
      inspect(child);
    }
  }
  function checkDisk(body: ObjectData): void {
    let found = false;
    function walk(value: unknown): void {
      for (const [key, child] of Object.entries(data(value))) {
        if (key === "verticalAutoscaling") {
          const disk = data(data(child).minResource).diskGBytes;
          if (typeof disk !== "number" || !Number.isFinite(disk) || disk < 2)
            throw new Error("production PostgreSQL requires minResource.diskGBytes >= 2");
          found = true;
        } else walk(child);
      }
    }
    walk(body);
    if (!found) throw new Error("production PostgreSQL requires explicit minimum disk >= 2 GB");
  }
  function parts(req: ZeropsRequestInfo): string[] {
    const path = req.url.pathname;
    if (!path.startsWith(PREFIX) || /[%\\]/.test(path) || path.includes("//") || path.endsWith("/"))
      throw new Error("noncanonical API path refused");
    const p = path.slice(PREFIX.length).split("/");
    if (p.some((x) => !x || x === "." || x === "..")) throw new Error("ambiguous API path refused");
    return p;
  }
  return {
    async before(req) {
      const url = req.url;
      if (url.protocol !== "https:" || url.username || url.password || url.hash)
        throw new Error("unsafe request URL refused");
      if (req.kind !== "api") {
        if (prod ? url.host !== "proxy.app-prg1.zerops.io" : !insideDev(url.hostname))
          throw new Error("upload/log host refused");
        if (
          (req.kind === "upload" && req.method !== "PUT") ||
          (req.kind === "log" && req.method !== "GET")
        )
          throw new Error("upload/log method refused");
        if (req.kind === "upload" && !uploadUrls.has(url.href))
          throw new Error("upload URL has no owned app-version grant");
        if (req.kind === "log") {
          let authorized = false;
          for (const [value, projectId] of logUrls) {
            const base = new URL(value);
            if (url.origin !== base.origin || url.pathname !== base.pathname) continue;
            if ([...base.searchParams].some(([key, value]) => url.searchParams.get(key) !== value))
              continue;
            if (
              [...url.searchParams.keys()].some(
                (key) =>
                  !base.searchParams.has(key) && !["limit", "tags", "serviceStackId"].includes(key),
              )
            )
              continue;
            const service = url.searchParams.get("serviceStackId");
            if (service && (await projectFor("service-stack", service)) !== projectId) continue;
            const tags = url.searchParams.get("tags");
            if (
              tags &&
              (!tags.startsWith("zbuilder@") ||
                (await projectFor("app-version", tags.slice(9))) !== projectId)
            )
              continue;
            authorized = true;
            break;
          }
          if (!authorized) throw new Error("log URL has no owned log-access grant");
        }
        return;
      }
      if (url.origin !== origin.origin) throw new Error("foreign API host refused");
      const p = parts(req);
      for (let i = 0; i < p.length; i++)
        if (p[i] === "client" && p[i + 1] !== org) throw new Error("foreign organization refused");
      inspect(req.body);
      if (prod) await (membership ??= pinMembership());
      const mutation = req.method !== "GET";
      // Preserve absent-object GETs: the transport must receive projectNotFound itself.
      // Client paths are pinned above; successful read response orgs are checked below.
      if (!mutation) {
        if (p.length === 3 && p[0] === "project" && p[2] === "log") {
          await ownProject(p[1]!);
          ownedRequests.set(req, p[1]!);
        }
        return;
      }
      if (mutation && url.href.includes("?")) throw new Error("query on mutation refused");
      if (prod && p[0] === "project" && p[2] === "public-ipv4-shared")
        throw new Error("production IPv4 allocation refused");
      const create =
        req.method === "POST" && p.length === 3 && p[0] === "client" && p[2] === "project";
      if (create) {
        const name = data(req.body).name;
        if (!ownedName(name) || /[\t\r\n]/.test(name))
          throw new Error("project creation requires alchtest- prefix");
        recordProjectIntent(ledger, name);
        return;
      }
      const serviceImport =
        !prod &&
        req.method === "POST" &&
        p.length === 4 &&
        p[0] === "project" &&
        p[2] === "service-stack" &&
        p[3] === "import";
      if (mutation && !serviceImport && !mutationRoute(req.method, p))
        throw new Error("mutation route is not allowlisted");
      if (p.length >= 2 && (p[0] === "project" || objectKinds[p[0]!])) {
        const projectId = await projectFor(p[0]!, p[1]!);
        if (mutation && prod && !alchemyProjects(ledger).has(projectId)) {
          const cleanup = req.method === "DELETE" && p[0] === "project" && p.length === 2;
          const candidate = await lookup("project", projectId);
          if (
            !cleanup ||
            typeof candidate.name !== "string" ||
            !alchemyProjectIntents(ledger).has(candidate.name)
          )
            throw new Error("project is not recorded with source alchemy");
        }
        const project = await lookup("project", projectId);
        if (project.clientId !== org) throw new Error("project belongs to foreign organization");
        if (mutation && !ownedName(project.name))
          throw new Error("project mutation requires alchtest- ownership");
      }
      if (
        mutation &&
        p[0] === "project" &&
        p[2] === "service-stack" &&
        req.method === "POST" &&
        (p.length === 3 || (p.length === 4 && p[3] === "object_storage_v1"))
      ) {
        const name = data(req.body).name;
        if (
          typeof name !== "string" ||
          ["", "core", "l7httpbalancer"].includes(name.trim().toLowerCase())
        )
          throw new Error("empty or reserved service hostname refused");
      }
      if (serviceImport) {
        const yaml = data(req.body).yaml;
        if (typeof yaml !== "string") throw new Error("service import requires YAML");
        let document: ObjectData;
        try {
          document = data(parseYaml(yaml));
        } catch {
          throw new Error("invalid service import YAML");
        }
        if ("project" in document)
          throw new Error("service import must not contain a project section");
        if (!Array.isArray(document.services) || !document.services.length)
          throw new Error("service import requires services");
        for (const service of document.services) {
          const hostname = data(service).hostname;
          if (
            typeof hostname !== "string" ||
            !/^[a-z][a-z0-9]{0,39}$/.test(hostname) ||
            ["core", "l7httpbalancer"].includes(hostname)
          )
            throw new Error("service import reserved or invalid hostname refused");
        }
      }
      if (mutation && prod) {
        const body = data(req.body);
        if (
          req.method === "POST" &&
          p[0] === "service-stack" &&
          p[2] === "public-port-routing" &&
          body.publicIpType !== "IP_V6"
        )
          throw new Error("production port routing requires explicit publicIpType IP_V6");
        let pg = /postgresql/i.test(String(body.serviceStackVersionName ?? ""));
        if (p[0] === "service-stack" && p[2] === "autoscaling") {
          const service = await lookup("service-stack", p[1]!);
          pg ||= /postgresql/i.test(
            JSON.stringify(
              service.serviceStackTypeInfo ??
                service.serviceStackVersionName ??
                service.serviceStackTypeId ??
                "",
            ),
          );
          // Unknown service catalogue identity cannot establish a safe disk exemption.
          if (!service.serviceStackTypeInfo && !service.serviceStackVersionName) pg = true;
        }
        if (pg) checkDisk(body);
      }
      if (
        p.length === 3 &&
        p[0] === "service-stack" &&
        p[2] === "app-version" &&
        req.method === "POST"
      ) {
        const projectId = await projectFor("service-stack", p[1]!);
        await ownProject(projectId);
        ownedRequests.set(req, projectId);
      }
      const build =
        prod &&
        ((p[0] === "app-version" && ["build-and-deploy", "deploy"].includes(p[2] ?? "")) ||
          (p[0] === "service-stack" && p[2] === "trigger-pipeline") ||
          (p[0] === "project" && p[2] === "service-stack" && !!data(req.body).buildFromGit));
      if (build) {
        const release = await lockBuild();
        try {
          // One deadline covers the entire inventory, not just each page in isolation.
          const deadline = AbortSignal.timeout(120000);
          await admitBuild(await projectFor(p[0]!, p[1]!, new Set(), deadline), deadline);
          buildReleases.set(req, release);
        } catch (error) {
          release();
          throw error;
        }
      }
    },
    failed(req) {
      // No response means no reliable process ID. Next admission must re-inventory.
      releaseBuild(req);
    },
    after(req, res) {
      if (buildReleases.has(req)) {
        const process = data(data(res.body).process ?? res.body);
        if (
          res.status >= 200 &&
          res.status < 300 &&
          typeof process.id === "string" &&
          /^[a-zA-Z0-9_-]{1,128}$/.test(process.id)
        )
          submittedProcesses.add(process.id);
        releaseBuild(req);
      }
      // Caller GET 5xx remains transport-owned, preserving Http.ts retry behavior.
      if (res.status >= 300 && res.status < 400) throw new Error("redirects are disabled");
      if (res.status < 200 || res.status >= 300 || req.kind !== "api") return;
      const p = parts(req);
      if (!(p[0] === "user" && p[1] === "client-list")) {
        const checkReadOrg = (value: unknown): void => {
          const row = data(value);
          for (const scoped of [row, data(row.project)]) {
            for (const key of ["clientId", "organizationId"]) {
              if (typeof scoped[key] === "string" && scoped[key] !== org)
                throw new Error("foreign organization read refused");
            }
          }
        };
        checkReadOrg(res.body);
        const list = data(res.body).list;
        if (Array.isArray(list)) for (const row of list) checkReadOrg(row);
      }
      const ownedProject = ownedRequests.get(req);
      if (
        ownedProject &&
        req.method === "POST" &&
        p[0] === "service-stack" &&
        p[2] === "app-version"
      ) {
        const uploadUrl = data(res.body).uploadUrl;
        if (typeof uploadUrl === "string") {
          try {
            uploadUrls.add(new URL(uploadUrl).href);
          } catch {
            throw new Error("invalid owned upload URL");
          }
        }
      }
      if (ownedProject && req.method === "GET" && p[0] === "project" && p[2] === "log") {
        const logUrl = data(res.body).urlPlain;
        if (typeof logUrl === "string" && logUrl) {
          try {
            logUrls.set(new URL(logUrl).href, ownedProject);
          } catch {
            throw new Error("invalid owned log URL");
          }
        }
      }
      if (
        req.method === "POST" &&
        p.length === 3 &&
        p[0] === "client" &&
        p[1] === org &&
        p[2] === "project"
      ) {
        const id = data(res.body).id;
        if (typeof id !== "string" || !/^[a-zA-Z0-9_-]{1,128}$/.test(id))
          throw new Error(
            "created project response has no safe project ID; manual cleanup required",
          );
        try {
          const name = data(req.body).name;
          if (typeof name !== "string") throw new Error("missing project name");
          recordProject(ledger, id, name);
        } catch {
          throw new ZeropsGuardRefused({
            code: "guardRefused",
            message:
              "Created project " + id + " but ledger recording failed; manual cleanup required",
          });
        }
      }
    },
  };
}
