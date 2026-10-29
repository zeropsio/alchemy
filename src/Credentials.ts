import * as Context from "effect/Context";
import * as Layer from "effect/Layer";
import type * as Redacted from "effect/Redacted";
import { deferUntilFirstUse, resolveProviderConfig } from "alchemy/Auth/Resolve";
import * as Effect from "effect/Effect";
import { ZEROPS_AUTH_PROVIDER_NAME, type ZeropsResolvedCredentials } from "./AuthProvider.ts";
export interface CredentialValues {
  token: Redacted.Redacted<string>;
  endpoint?: string;
  organizationId?: string;
}
export class ZeropsCredentials extends Context.Service<
  ZeropsCredentials,
  import("effect/Effect").Effect<CredentialValues, unknown>
>()("Zerops/Credentials") {}
export const fromAuthProvider = () =>
  Layer.effect(
    ZeropsCredentials,
    deferUntilFirstUse(
      Effect.gen(function* () {
        const resolved = yield* resolveProviderConfig<
          import("./AuthProvider.ts").ZeropsAuthConfig,
          ZeropsResolvedCredentials
        >(ZEROPS_AUTH_PROVIDER_NAME);
        return yield* resolved.resolve;
      }),
    ),
  );
