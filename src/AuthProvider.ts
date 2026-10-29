import { getEnvRedactedRequired } from "alchemy/Auth/Env";
import {
  makeStoredAuthProvider,
  storedSecret,
  type StoredAuthConfig,
} from "alchemy/Auth/StoredAuthProvider";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
export const ZEROPS_AUTH_PROVIDER_NAME = "Zerops";
export type ZeropsAuthConfig = StoredAuthConfig;
export interface ZeropsResolvedCredentials {
  token: Redacted.Redacted<string>;
  endpoint?: string;
  organizationId?: string;
  source: { type: "stored" | "env" };
}
const auth = makeStoredAuthProvider<ZeropsResolvedCredentials>({
  provider: ZEROPS_AUTH_PROVIDER_NAME,
  fields: [
    { name: "token", label: "Zerops bearer token", secret: true },
    { name: "endpoint", label: "API origin", secret: false, optional: true },
    { name: "organizationId", label: "Organization ID", secret: false, optional: true },
  ],
  toResolved: (values) => ({
    token: storedSecret(values.token) ?? Redacted.make(""),
    endpoint: typeof values.endpoint === "string" ? values.endpoint : undefined,
    organizationId: typeof values.organizationId === "string" ? values.organizationId : undefined,
    source: { type: "stored" },
  }),
  readEnvironment: getEnvRedactedRequired("ZEROPS_TOKEN").pipe(
    Effect.map((token) => ({
      token,
      endpoint: process.env.ZEROPS_ENDPOINT,
      organizationId: process.env.ZEROPS_ORGANIZATION_ID,
      source: { type: "env" as const },
    })),
  ),
  environment: [
    { name: "ZEROPS_TOKEN", required: true, secret: true },
    { name: "ZEROPS_ENDPOINT", required: false, secret: false },
    { name: "ZEROPS_ORGANIZATION_ID", required: false, secret: false },
  ],
});
export const ZeropsAuth = auth.layer;
