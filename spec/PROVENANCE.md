# Zerops public API generation input

`zerops-public-api.yml` captures the production public API (201 paths).
SHA-256: `f0e4f507851562705db1b4c43de545046d0042e8b256f4d1c2153c03efd73770`.

Run `npm run gen:types` to normalize the committed YAML and generate `src/client/api.gen.ts` using pinned openapi-typescript. No network is required. Normalization renames the project environment list operation to `ListProjectEnvs`, auth `getUserInfo` to `GetAuthUserInfo`, and regex `{path:.*}` parameters to `{path}`. This last rewrite is for generation only: it does not establish slash-preserving CDN encoding; no CDN operations are implemented. The API prefix remains in the specification; the transport accepts relative operation paths and appends it once. No server origin is embedded in generated types.

Unit-test error envelopes mirror observed API responses: nested `error.code`, top-level `code`, HTTP 400 `projectNotFound`, HTTP 403 `processNotFound`, and HTTP 503 `notAvailable`. Server message text is intentionally never emitted as a diagnostic because it may contain secrets.

## Service catalogue

The snapshot was captured on 2026-10-27 using GET `/api/rest/public/settings`.
`service-types.json` retains only service name, version name, version status and
category: no credentials, organization identifiers, environment values or access
details. It contains 145 versions across 36 families, including 118 ACTIVE version
identifiers. `bun scripts/gen-service-types.ts` regenerates
`src/client/serviceTypes.gen.ts` offline; `--fetch` explicitly replaces the sanitized
snapshot using `ZEROPS_ENDPOINT` (default `https://api.app-prg1.zerops.io`) and
`ZEROPS_TOKEN`.

## Autoscaling update schema correction

The published `RequestAutoscaling.customAutoscaling` references `BaseCustomAutoscaling`, whose properties are `verticalAutoscalingNullable` and `horizontalAutoscalingNullable`. Observed successful PUT bodies instead use `verticalAutoscaling` and `horizontalAutoscaling`, identical to the generated create DTO `InDtoBodyCustomAutoscaling`. The handwritten update operation substitutes that generated field type while preserving the remaining generated request fields; the committed specification is otherwise unchanged. Observed `{process:null}` responses are explicitly represented by the operation's return type.

## MariaDB reference key evidence

A 2026-10-27 API observation of `mariadb:single@10.6` listed only keys from
GET `/api/rest/public/service-stack/{id}/env`: `BACKUP_PERIOD`,
`ZEROPS_PROMETHEUS_PORT`, `connectionString`, `dbName`, `hostname`, `password`,
`port`, `projectId`, `serviceId`, `user`. These observed keys define
`RefKey<"mariadb">`; no MariaDB environment values were printed or stored.
