# @zerops/alchemy

Zerops projects, applications, managed services, environment variables, object storage, and routing as [Alchemy v2](https://alchemy.run/) Effect resources.

**Status:** 0.2.0. Alchemy v2 is beta; this provider requires exactly **`alchemy@2.0.0-beta.84`** and Effect 4. It does not support the legacy async/v0 provider API.

## Install

```sh
npm i @zerops/alchemy alchemy@2.0.0-beta.84 effect
# Or:
bun add @zerops/alchemy alchemy@2.0.0-beta.84 effect
```

Each GitHub release also attaches the packed package (`zerops-alchemy-<version>.tgz`) as a fallback.

`alchemy` and `effect` are peer dependencies. Install the optional `@effect/platform-bun` or `@effect/platform-node` adapter for your runtime. The CLI/example workflow uses Bun. Development requires Node ≥22 and Bun pinned by `.tool-versions`.

## Authentication

Provide `ZEROPS_TOKEN` through your environment or secret manager. Optionally set `ZEROPS_ENDPOINT` to an API **origin** (default `https://api.app-prg1.zerops.io`; the transport appends `/api/rest/public`) and `ZEROPS_ORGANIZATION_ID` to your organization's API **`clientId`**, not a project or user ID. Select an organization explicitly when multiple memberships exist; otherwise Project can choose the sole available organization.

Alternatively, use Alchemy's stored profiles from a project that depends on this package:

```sh
bunx alchemy profile create zerops-local
bunx alchemy profile edit --profile zerops-local --add Zerops
bunx alchemy deploy --profile zerops-local
```

The package contributes a lazy `Zerops` auth provider. Profiles store `token`, optional `endpoint`, and optional `organizationId`. Endpoint and organization overrides resolve as `providers()` options → environment → stored credentials → endpoint default; `Project.organizationId` overrides the project organization. No sudo token is required. Do not commit credentials or state files.

## Minimal example

This mirrors [examples/basic](examples/basic/README.md): a LIGHT project, PostgreSQL 16, a Node 22 HTTP application, a generated subdomain, and a custom HTTP route. Copy [the example app directory](examples/basic/api) to `./api`; it includes `index.js`, `package.json`, and a root `zerops.yml` with setup `api` and HTTP port 3000.

```ts
// alchemy.run.ts
import * as Alchemy from "alchemy";
import * as Effect from "effect/Effect";
import * as Zerops from "@zerops/alchemy";

export default Alchemy.Stack("ZeropsBasic", {
  providers: Zerops.providers(),
  state: Alchemy.localState(), // Demonstration only: plaintext JSON.
}, Effect.gen(function* () {
  const project = yield* Zerops.Project("Project", { mode: "LIGHT" });
  const db = yield* Zerops.Postgres("Database", {
    project, hostname: "db", version: "16",
  });
  const api = yield* Zerops.Service("Api", {
    project, hostname: "api", type: "nodejs@22",
    source: { dir: "./api" },
    env: {
      DATABASE_URL: Zerops.ref(db, "connectionString"),
      GREETING: "Hello from Alchemy and Zerops!",
    },
    subdomain: true,
  });
  const route = yield* Zerops.HttpRoute("ApiRoute", {
    project, domains: ["alchemy-basic.example.com"], ssl: false,
    locations: [{ path: "/", service: api, port: 3000 }],
  });
  return {
    projectId: project.projectId, serviceId: api.serviceId,
    subdomainUrls: api.subdomainUrls, routeId: route.routeId,
    dbHostname: db.hostname, appVersionId: api.appVersionId,
  };
}));
```

```sh
bunx alchemy plan
bunx alchemy deploy
bunx alchemy drift --no-input
# When intentionally accepting repair against persisted desired props:
bunx alchemy drift --repair --no-input
# Removes the managed resources, including database/storage data:
bunx alchemy destroy
```

Configure your domain's DNS separately. Route sync does not wait for certificate issuance. `plan` and `drift` do **not** accept `--yes` in beta.84; deploy/destroy can use their own `--yes` approval flag for automation. `--no-input` suppresses interactive prompts for drift.

## Resources

| Resource/helper | Zerops object |
|---|---|
| `Project` | Project boundary, settings and ownership marker. |
| `Service` | Runtime service with integrated source deployment and optional generated subdomain. |
| `ManagedService` | Code-free managed service stack. |
| `Postgres`, `MariaDB`, `Valkey`, and more | [Managed family helpers](#managed-families). |
| `ObjectStorage` | Object storage with quota and access policy. |
| `ProjectVariable` | One editable project USER environment row. |
| `ServiceVariable` | One editable service USER environment row. |
| `HttpRoute` | HTTP domain/location routing rule. |
| `PortRoute` | IPv6 TCP/UDP port routing rule. |
| `Zerops.ref` | Server-resolved environment reference, not a remote lookup or resource. |

Use `Zerops.providers()` to install the shared providers. Props, attributes, errors, timeouts, autoscaling and typed YAML interfaces are exported from [src/index.ts](src/index.ts).

## Managed families

Helpers take `project`, optional `hostname`, required catalogue `version`, and the remaining `ManagedService` props. Default mode is `"NON_HA"` (single); `mode: "HA"` unlocks the marked HA-only ref keys. `Meilisearch` and `LocalStorage` are single-only. `SeaweedFS` is shared storage; deprecated Zerops `shared-storage` import aliases map to this family.

| Helper | Catalogue family | Versions | Single/HA | Floor (+ env override) | Ref keys (common; **HA-only** marked) |
|---|---|---|---|---|---|
| `Postgres` | `postgresql` | 14, 16, 17, 18 | Both | Disk 2 GB (`ZEROPS_POSTGRESQL_MIN_DISK_GB`) | BACKUP_PERIOD ZEROPS_PROMETHEUS_PORT connectionString connectionTlsString dbName hostname password port portTls projectId serviceId superUser superUserPassword user; **HA-only: connectionStringReplicas portReplicas** |
| `MariaDB` | `mariadb` | 10.6 | Both | Catalogue minimum | BACKUP_PERIOD ZEROPS_PROMETHEUS_PORT connectionString dbName hostname password port projectId serviceId user |
| `Valkey` | `valkey` | 7.2 | Both | Catalogue minimum | BACKUP_PERIOD ZEROPS_PROMETHEUS_PORT connectionString connectionTlsString hostname password port portTls projectId serviceId; **HA-only: connectionStringReplicas connectionTlsStringReplicas portReplicas portTlsReplicas** |
| `ClickHouse` | `clickhouse` | 25.3 | Both | RAM 0.375 GB (`ZEROPS_CLICKHOUSE_MIN_RAM_GB`) | BACKUP_PERIOD ZEROPS_PROMETHEUS_PORT clusterName connectionString dbName hostname password port portHttp portMysql portNative portPostgresql projectId serviceId superUser superUserPassword user zeropsSubdomain |
| `Elasticsearch` | `elasticsearch` | 8.16, 9.2 | Both | RAM 2 GB (`ZEROPS_ELASTICSEARCH_MIN_RAM_GB`) | connectionString hostname password port projectId serviceId user zeropsSubdomain |
| `Kafka` | `kafka` | 3.9 | Both | Catalogue minimum | KAFKA_HEAP_OPTS hostname password port projectId serviceId user |
| `Nats` | `nats` | 2.10, 2.12 | Both | Catalogue minimum | BACKUP_PERIOD JET_STREAM_ENABLED MAX_PAYLOAD connectionString hostname password port portManagement projectId serviceId user |
| `Qdrant` | `qdrant` | 1.10, 1.12 | Both | Catalogue minimum | BACKUP_PERIOD apiKey automaticClusterReplication connectionString grpcConnectionString grpcPort hostname logLevel port projectId readOnlyApiKey serviceId |
| `Typesense` | `typesense` | 27.1, 30.2 | Both | Catalogue minimum | apiKey connectionString hostname port projectId serviceId zeropsSubdomain |
| `SeaweedFS` | `seaweedfs` | 3.85 | Both | Catalogue minimum | BACKUP_PERIOD hostname port projectId serviceId |
| `Meilisearch` | `meilisearch` | 1.10, 1.20, 1.44 | Single | Catalogue minimum | BACKUP_PERIOD connectionString defaultAdminKey defaultChatKey defaultReadOnlyKey defaultSearchKey environment hostname masterKey port projectId serviceId zeropsSubdomain |
| `LocalStorage` | `local-storage` | 1 | Single | Catalogue minimum | BACKUP_PERIOD hostname projectId serviceId |

Within a stack:

```ts
const search = yield* Zerops.Typesense("Search", {
  project, hostname: "search", version: "30.2",
});
const api = yield* Zerops.Service("Api", {
  project, hostname: "api", type: "nodejs@22",
  source: { dir: "./api" },
  env: { SEARCH_API_KEY: Zerops.ref(search, "apiKey") },
});
```

`ManagedService({ type })` remains the untyped escape hatch; family floors and mode availability still apply. An unset scaling minimum defaults to the family floor; explicit minimum or maximum bounds below it are rejected. Environment overrides replace floors, bounded below by catalogue minima: PostgreSQL disk 1 GB, ClickHouse RAM 0.25 GB, Elasticsearch RAM 0.75 GB. Lowering a protective floor may expose upstream provisioning failures.

### Environment overrides

| Variable | Default |
|---|---|
| `ZEROPS_ROUTING_FORCE_SYNC` | `false`; explicit consent to commit foreign staged routes. |
| `ZEROPS_POSTGRESQL_MIN_DISK_GB` | 2 GB; catalogue minimum 1 GB. |
| `ZEROPS_CLICKHOUSE_MIN_RAM_GB` | 0.375 GB; catalogue minimum 0.25 GB. |
| `ZEROPS_ELASTICSEARCH_MIN_RAM_GB` | 2 GB; catalogue minimum 0.75 GB. |


## Deploy sources

`Service.source` accepts exactly one of:

- `{ dir: "./api", ignore?: [...] }`: local source directory, relative to the CLI working directory.
- `{ archive: "./api.tgz" }`: existing gzip tar, validated and normalized.
- `{ git: { url, ref, auth? } }`: exact branch/tag/full-SHA resolution and fetch; requires Git on PATH. Use a Redacted auth value, not credentials embedded in the URL.

Configuration comes from root `zerops.yml`/`zerops.yaml` or the `zeropsYaml` override. `setup` defaults to the resolved hostname. `build` defaults true; false deploys prebuilt content rather than skipping deployment. Change `redeploy` to force deployment of identical source.

Directory/Git sources honor `.deployignore` and directory `ignore` patterns; `.git` and `.alchemy` are always excluded. **Add your own exclusions for `.env`, `node_modules`, and caches.** Plans are advisory: reconciliation takes a fresh source snapshot. Use immutable archives or full commit SHAs for approval-pinned releases.

## Drift and adoption

Use `alchemy drift --no-input` to compare live and persisted attributes, and `alchemy drift --repair --no-input` to reconcile persisted desired props. Repair does not deploy uncommitted stack edits. Missing resources can be recreated; masked values retain last-known witnesses.

Keep logical IDs, stack and stage stable for state-loss recovery. Matching project ownership markers auto-admit; unowned explicit-name objects require intentional `alchemy deploy --adopt`. Adoption transfers responsibility for subsequent updates **and deletion**. Resource `.ref` methods refer to Alchemy state, not API import.

## Known limitations

- Alchemy v2 is beta; keep the exact peer pin rather than upgrading independently.
- **Alchemy state includes resolved props in plaintext.** Redacted values protect display, not persisted-state encryption. Secure state storage and backups; user-supplied environment values and Git auth can enter state. Generated secrets read from Zerops are not exported in resource attributes; environment attributes use digests. Masked secret-content drift is unobservable.
- Drift observations cover managed fields, not every remote attribute. Unowned extra environment keys are neither claimed nor removed; environment ownership checks are provider-scoped and best-effort.
- Routing sync commits all staged edits for a project/kind. Foreign edits are refused unless `forceSync: true` or `ZEROPS_ROUTING_FORCE_SYNC=true` explicitly consents. **Use one routing writer per project/kind** across stacks, processes and GUI; in-process locks do not eliminate cross-process races.
- Managed family floors protect against observed provisioning failures; lowering them through environment overrides is explicit opt-in. Service availability depends on the endpoint catalogue.
- Source plans are advisory and interrupted app-version creates/builds are not exactly-once. Deployment deadlines do not cancel already-started remote work.
- No CDN resource, certificate-issuance wait, dedicated IPv4/IPv4 port routing, API import flow, inline `main` deployment, typed runtime bindings, VPN, general lookup API, or Zerops state backend.
- Project credit caps are write-only/last-sent; removing `maxCreditLimit` does not clear an existing cap.

## Development

Use npm for dependency installation and the committed lockfile; Bun runs the unit tests.

```sh
npm ci
npm run typecheck
npm test
npm run build
npm run gen:types
bun scripts/gen-service-types.ts # Offline catalogue regeneration
```

Type generation uses committed production OpenAPI with documented normalization. Catalogue generation uses the sanitized committed snapshot; `bun scripts/gen-service-types.ts --fetch` replaces it using `ZEROPS_ENDPOINT` and `ZEROPS_TOKEN`. See [spec provenance](spec/PROVENANCE.md) and [changelog](CHANGELOG.md).

Live and E2E harnesses run from this public checkout after `npm ci`; no private
workspace files are required. They require **Linux with glibc (`libc.so.6`)** for
Bun FFI file locks, Node ≥22, and the Bun version in `.tool-versions`.
The committed npm dependencies include the Alchemy CLI and Effect/platform adapters.

The public checkout includes only project lifecycle and the single-family live
harness, plus the basic E2E smoke and their shared support. `npm run test:live`
discovers that project/family test pair; set `ALCHTEST_FAMILY=postgresql` for the
small production family lifecycle below. It does not run the E2E entry point;
invoke `bun test/e2e/smoke.ts` separately.
`npm run sweep -- ...` preserves the sweeper CLI (dry-run by default).
For an authorized development target, explicitly provide `ZEROPS_TARGET=dev`,
`ZEROPS_ENDPOINT` (HTTPS origin), `ZEROPS_TOKEN`, `ZEROPS_ORGANIZATION_ID`,
`ZEROPS_DEV_DOMAIN` (the exact development DNS boundary), and an absolute
`ZEROPS_DEV_LEDGER` path in an existing directory. Development API/upload/log
hosts must equal that domain or be its subdomains; the production API is always
refused in development mode. Ledgers must be user-owned regular mode 0600 files;
the harness creates the file if absent. `ZEROPS_RUN_LOCK`, when supplied for
development, must also be absolute. Environment values are operator-provided;
there are no personal organization, development hostname, or ledger-path defaults.

### Production live tests (small)

`.github/workflows/live.yml` runs weekly, on manual dispatch, and on `v*` tags;
never on pull requests. A secret-free GitHub-hosted job accepts only
`zeropsio/alchemy` main or `v*` refs whose commit is an ancestor of `origin/main`.
The approved `prod-live` environment releases credentials only to the verified
SHA on `[self-hosted, Linux, X64, zerops-prod]`. Repository concurrency does not
cancel running jobs; host job hooks serialize production work across repositories.

The scope is deliberately not the managed/service matrix: project lifecycle and
the single PostgreSQL family lifecycle, deployment, reference resolution, drift,
scaling and teardown, followed by the basic E2E deploy/update/adoption/HTTP smoke.
Each family/E2E stack has one PostgreSQL 16 `:single` service and one Node 22
service. Projects are LIGHT; services are NON_HA with minimum shared resources,
PostgreSQL disk is at least 2 GB, and no IPv4 is allocated. The family scaling
check raises only the PostgreSQL RAM ceiling by 0.125 GB. Existing `alchtest-`
project names and service names (`fam`, `app`, `db`, `api`) remain unchanged.

Configure **environment secrets**, not runner files or repository defaults:
`ZEROPS_ENDPOINT` (exactly `https://api.app-prg1.zerops.io`), `ZEROPS_TOKEN`,
and `ZEROPS_ORGANIZATION_ID` for the dedicated CI organization. Missing secrets
fail clearly before deployment. The workflow passes the organization as the
`ZEROPS_CI_ORGANIZATION_ID` guard pin and provides absolute runner-temporary
`ZEROPS_PROD_LEDGER` and `ZEROPS_RUN_LOCK` paths. Direct production invocations
must set `ZEROPS_TARGET=prod` and provide these variables too; their parent
directories must exist, and the ledger must be user-owned mode 0600.

Exact selected commands (after `npm ci`, with the production environment set):

```sh
ALCHTEST_FAMILY=postgresql bun test --timeout 3600000 \
  --test-name-pattern '^(Project lifecycle, marker recovery, adoption and absence|one managed family: lifecycle, reference, convergence and absence)$' \
  ./test/live/project.test.ts ./test/live/family.test.ts
bun test/e2e/smoke.ts
ZEROPS_CI_CLEANUP=1 bun scripts/sweep.ts --all --prefix alchtest- --yes --assert-empty
```

The final workflow step uses `always()`, including after test failures. In explicit
CI cleanup mode the sweeper inventories every project page in the pinned CI
organization, selects **only `alchtest-` projects**, records their exact IDs and
names in the existing ownership ledger, then uses the ordinary guarded project
DELETE route. This also recovers leftovers from earlier runs without relaxing
the generic mutation guard. Services are deleted with their project, never by
hostname. A fresh inventory must show zero `alchtest-` projects or cleanup fails.
Do not point CI cleanup at an organization shared with personal test projects.


## License

Apache-2.0 © 2026 Zerops s.r.o. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
