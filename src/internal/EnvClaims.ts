import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { ZeropsEnvKeyConflict } from "../client/Errors.ts";
import type { Http } from "../client/Http.ts";

export { ZeropsEnvKeyConflict } from "../client/Errors.ts";

export interface EnvClaimRegistry {
  claim(
    scope: "service" | "project",
    targetId: string,
    key: string,
    owner: string,
  ): Effect.Effect<void, ZeropsEnvKeyConflict>;
}
export function makeEnvClaims() {
  const owners = new Map<string, string>();
  return {
    claim: (scope: "service" | "project", targetId: string, key: string, owner: string) =>
      Effect.gen(function* () {
        const identity = JSON.stringify([scope, targetId, key.toLowerCase()]);
        const previous = owners.get(identity);
        if (previous !== undefined && previous !== owner) {
          return yield* Effect.fail(
            new ZeropsEnvKeyConflict({
              status: 409,
              code: "envKeyConflict",
              operation: "claimEnvironmentKey",
              message: `Environment key ${key} is claimed by both ${previous} and ${owner}`,
            }),
          );
        }
        owners.set(identity, owner);
      }),
  };
}

export class EnvClaims extends Context.Service<EnvClaims, EnvClaimRegistry>()("Zerops/EnvClaims") {}

// The frozen helper has no Context requirement; share its claims with providers by client identity.
const clients = new WeakMap<Http, EnvClaimRegistry>();
export function envClaimsFor(http: Http) {
  let claims = clients.get(http);
  if (!claims) {
    claims = makeEnvClaims();
    clients.set(http, claims);
  }
  return claims;
}
