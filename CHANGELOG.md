# Changelog

## Unreleased

- Treat HTTP 404 with an entity's not-found code (for example `projectNotFound`) as a missing resource, like HTTP 400. Zerops is moving these answers from 400 to 404, and reads, deletes and the sweeper would otherwise fail.
- Add an approval-gated, SHA-pinned production-small live workflow for project and PostgreSQL/service lifecycle tests plus basic E2E smoke.
- Pin the production test organization through `ZEROPS_CI_ORGANIZATION_ID`, retain existing `alchtest-` ownership naming, and refuse shared IPv4 allocation.
- Add explicit CI-org/prefix cleanup discovery through the ownership ledger and a final zero-leftovers assertion; keep generic mutation ownership checks unchanged.
- Give production E2E PostgreSQL and Node services explicit minimum NON_HA resources and PostgreSQL disk of 2 GB.

## [0.2.0] - 2026-10-30

### Added

- Typed managed family helpers for ClickHouse, Elasticsearch, Kafka, Nats, Qdrant, Typesense, SeaweedFS shared storage, Meilisearch and LocalStorage, alongside Postgres, MariaDB and Valkey.
- Observed per-family reference keys, with HA-only PostgreSQL and Valkey replica keys unlocked by `mode: "HA"`.
- Protective ClickHouse RAM (0.375 GB) and Elasticsearch RAM (2 GB) floors with environment overrides.
- Production-sourced catalogue generation with `managedCatalogue` metadata.

### Changed

- **Breaking (types):** PostgreSQL `connectionStringReplicas` is accepted by `Zerops.ref` only for targets declared with `mode: "HA"` (the key does not exist on single services). PostgreSQL and Valkey gain their other observed keys.
- `ZEROPS_POSTGRESQL_MIN_DISK_GB` now replaces the 2 GB floor (minimum 1 GB, the catalogue minimum) instead of only raising it.
- Family floors and single-only mode checks also apply to the untyped `ManagedService({ type })` escape hatch.
- Unset scaling minima default to the family floor; explicit minima or maxima below it are rejected before any API call.
- The service catalogue (`KnownServiceType`) is generated from the production catalogue.

## [0.1.0] - 2026-10-29

- Add Alchemy v2 Effect resources for projects, runtime services, managed services (PostgreSQL, MariaDB and Valkey), object storage, project/service variables, and HTTP/IPv6 port routing.
- Deploy service sources from local directories, gzip tar archives, or exact Git refs with typed Zerops YAML configuration.
- Support drift observation, missing-resource recovery, explicit adoption, and project ownership markers.
- Resolve environment references server-side with `Zerops.ref`; keep generated secrets out of resource attributes.
- Synchronize routing with canonical verification and explicit consent for foreign staged changes.
- Provide environment/profile authentication and offline generation from committed OpenAPI and service catalogue snapshots.
