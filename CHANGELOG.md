# Changelog

## [0.1.0] - 2026-10-29

- Add Alchemy v2 Effect resources for projects, runtime services, managed services (PostgreSQL, MariaDB and Valkey), object storage, project/service variables, and HTTP/IPv6 port routing.
- Deploy service sources from local directories, gzip tar archives, or exact Git refs with typed Zerops YAML configuration.
- Support drift observation, missing-resource recovery, explicit adoption, and project ownership markers.
- Resolve environment references server-side with `Zerops.ref`; keep generated secrets out of resource attributes.
- Synchronize routing with canonical verification and explicit consent for foreign staged changes.
- Provide environment/profile authentication and offline generation from committed OpenAPI and service catalogue snapshots.
