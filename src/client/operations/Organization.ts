import * as Effect from "effect/Effect";
import type { Http } from "../Http.ts";
import { ZeropsValidation } from "../Errors.ts";
import { collectPages } from "../Pagination.ts";
export const organizationOperations = (http: Http) => {
  const list = () =>
    collectPages((offset, limit) =>
      http.request<{ list: Array<{ clientId: string }>; total: number }>(
        "GET",
        "/user/client-list?offset=" + offset + "&limit=" + limit,
      ),
    );
  return {
    list,
    resolve: (explicit?: string) =>
      Effect.gen(function* () {
        const selected = explicit ?? (yield* http.defaultOrganizationId);
        if (selected !== undefined) {
          if (!selected.trim())
            return yield* Effect.fail(
              new ZeropsValidation({
                status: 400,
                code: "invalidOrganization",
                operation: "resolveOrganization",
                message: "Organization ID must not be empty",
              }),
            );
          return selected;
        }
        const rows = yield* list();
        if (rows.length === 1 && typeof rows[0]?.clientId === "string") return rows[0].clientId;
        return yield* Effect.fail(
          new ZeropsValidation({
            status: 400,
            code: "ambiguousOrganization",
            operation: "resolveOrganization",
            message: "Set organizationId or ZEROPS_ORGANIZATION_ID; membership is not unambiguous",
          }),
        );
      }),
  };
};
