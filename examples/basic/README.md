# Basic Zerops app

This Alchemy v2 example creates a LIGHT project, a NON_HA PostgreSQL 16 database
(with the provider's minimum disk default), a Node.js 22 API, and an HTTP route.
The API uses a Zerops environment reference, not a generated database secret in
Alchemy state. Its JSON response reports the greeting and whether the reference
resolved; it never returns the database URL. It does not connect to the database.

From this repository (run `npm ci` at the repository root first), configure credentials in
your shell, then run from `examples/basic`:

```sh
export ZEROPS_TOKEN='your-token'
export ZEROPS_ORGANIZATION_ID='your-organization-id'
export ZEROPS_ENDPOINT='https://api.app-prg1.zerops.io'
export ZEROPS_PROJECT_NAME='my-alchemy-app' # optional; otherwise generated
export ZEROPS_DOMAIN='api.example.com'    # defaults to alchemy-basic.example.com
export GREETING='Hello from my app!'
cd examples/basic
npx alchemy deploy
# Or, with Bun:
bun alchemy deploy
```

The local checkout is imported directly; nothing needs to be published. Keep
`.alchemy` state between commands. Use `npx alchemy destroy` (or `bun alchemy
destroy`) to remove the stack. The custom domain needs DNS configuration before
it is reachable; this example deliberately uses `ssl: false`. Generated
`subdomainUrls` provide API smoke-test URLs independently of the custom domain.

`stack.ts` exports `basic(options)` for reuse, including an optional absolute
`sourceDir` override. Outputs include project/service/route IDs, database hostname,
generated API URLs, and the deployed app version ID.
