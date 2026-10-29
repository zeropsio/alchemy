import * as Effect from "effect/Effect";
import * as Context from "effect/Context";
import * as Redacted from "effect/Redacted";
import type { ZeropsRequestGuard, ZeropsRequestInfo } from "./RequestGuard.ts";
import {
  apiError,
  ZeropsDecodeError,
  ZeropsGuardRefused,
  ZeropsTransportError,
  type ZeropsError,
} from "./Errors.ts";
export function normalizeEndpoint(input: string): URL {
  const url = new URL(input);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.hash ||
    url.search ||
    !["/", "/api/rest/public", "/api/rest/public/"].includes(url.pathname)
  )
    throw new Error("Zerops endpoint must be an HTTPS origin (or /api/rest/public)");
  return new URL(url.origin);
}
export interface HttpOptions {
  endpoint: string;
  token: Redacted.Redacted<string>;
  organizationId?: string;
  requestGuard?: ZeropsRequestGuard;
  fetch?: typeof fetch;
}
export function makeHttp(options: HttpOptions) {
  const origin = normalizeEndpoint(options.endpoint);
  const retryAfter = new WeakMap<object, number>();
  const guardFailure = (error: unknown) => {
    if (error instanceof ZeropsGuardRefused) return error;
    return new ZeropsGuardRefused({
      code: "guardRefused",
      message: "Request guard refused request/response",
    });
  };
  const requestOnce = <A>(
    method: string,
    url: URL,
    kind: ZeropsRequestInfo["kind"],
    body?: unknown,
    logAccessToken?: Redacted.Redacted<string>,
  ): Effect.Effect<A, ZeropsError> =>
    Effect.tryPromise({
      try: async (signal) => {
        const info: ZeropsRequestInfo = {
          method,
          url,
          kind,
          ...(body === undefined ? {} : { body }),
        };
        try {
          await options.requestGuard?.before(info);
        } catch (error) {
          throw guardFailure(error);
        }
        const headers: Record<string, string> = { "User-Agent": "zerops-alchemy/0.1.0" };
        if (kind === "api") {
          if (url.origin !== origin.origin)
            throw new ZeropsGuardRefused({
              code: "originMismatch",
              message: "Refusing bearer token outside API origin",
            });
          headers.Authorization = "Bearer " + Redacted.value(options.token);
          if (body !== undefined) headers["Content-Type"] = "application/json";
        }
        if (kind === "log" && logAccessToken !== undefined) {
          headers.Authorization = "Bearer " + Redacted.value(logAccessToken);
        }
        let response: Response;
        try {
          response = await (options.fetch ?? fetch)(url, {
            method,
            headers,
            redirect: "error",
            signal,
            body:
              body === undefined
                ? undefined
                : kind === "upload"
                  ? (body as Uint8Array<ArrayBuffer>)
                  : JSON.stringify(body),
          });
        } catch {
          try {
            await options.requestGuard?.failed?.(info);
          } catch {
            // The transport failure below is the meaningful error.
          }
          throw new ZeropsTransportError({
            code: "network",
            message: "Zerops network request failed; mutation completion may be unknown",
          });
        }
        let text = "",
          data: unknown;
        try {
          text = await response.text();
          data = text;
          if (kind === "api" && text) {
            try {
              data = JSON.parse(text);
            } catch {
              data = undefined;
            }
          }
        } finally {
          try {
            await options.requestGuard?.after?.(info, { status: response.status, body: data });
          } catch (error) {
            throw guardFailure(error);
          }
        }
        if (!response.ok) {
          const error = apiError(
            response.status,
            data,
            method + " " + (kind === "api" ? url.pathname : kind),
          );
          const header = response.headers.get("Retry-After");
          if (header) {
            const seconds = Number(header);
            const ms = Number.isFinite(seconds) ? seconds * 1000 : Date.parse(header) - Date.now();
            if (Number.isFinite(ms) && ms >= 0) retryAfter.set(error, ms);
          }
          throw error;
        }
        if (kind === "api" && text && data === undefined)
          throw new ZeropsDecodeError({ code: "decode", message: "Invalid JSON response" });
        return data as A;
      },
      catch: (error) =>
        error instanceof ZeropsGuardRefused ||
        error instanceof ZeropsTransportError ||
        error instanceof ZeropsDecodeError ||
        (error && typeof error === "object" && "status" in error)
          ? (error as ZeropsError)
          : new ZeropsTransportError({
              code: "network",
              message: "Zerops response could not be read",
            }),
    });
  const request = <A>(
    method: string,
    path: string,
    body?: unknown,
  ): Effect.Effect<A, ZeropsError> => {
    if (!path.startsWith("/") || path.startsWith("//") || path.includes("#"))
      return Effect.fail(
        new ZeropsGuardRefused({ code: "invalidPath", message: "Invalid API request path" }),
      );
    const url = new URL(origin.origin + "/api/rest/public" + path);
    return Effect.suspend(() => {
      let lastError: ZeropsError = new ZeropsTransportError({
        code: "transientTimeout",
        message: "Zerops GET exceeded 60-second transient window",
      });
      const loop = (delay: number): Effect.Effect<A, ZeropsError> =>
        requestOnce<A>(method, url, "api", body).pipe(
          Effect.catch((error) => {
            lastError = error;
            const transient =
              method === "GET" &&
              (error._tag === "ZeropsTransportError" ||
                error._tag === "ZeropsServerError" ||
                error._tag === "ZeropsRateLimited");
            return transient
              ? Effect.sleep(Math.max(delay, retryAfter.get(error) ?? 0)).pipe(
                  Effect.flatMap(() => loop(Math.min(delay * 2, 5000))),
                )
              : Effect.fail(error);
          }),
        );
      return method === "GET"
        ? loop(1000).pipe(
            Effect.timeoutOrElse({ duration: 60000, orElse: () => Effect.fail(lastError) }),
          )
        : loop(1000).pipe(
            Effect.timeoutOrElse({
              duration: 60000,
              orElse: () =>
                Effect.fail(
                  new ZeropsTransportError({
                    code: "requestTimeout",
                    message:
                      "Zerops mutation exceeded 60-second request timeout; remote work may continue",
                  }),
                ),
            }),
          );
    });
  };
  const external = <A>(
    kind: "upload" | "log",
    url: string,
    bytes?: Uint8Array,
    logAccessToken?: Redacted.Redacted<string>,
  ) =>
    Effect.suspend(() => {
      let parsed: URL;
      try {
        parsed = new URL(url);
        if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.hash)
          throw 0;
      } catch {
        return Effect.fail(
          new ZeropsGuardRefused({
            code: "invalidUrl",
            message: "External URL must be HTTPS without userinfo or fragment",
          }),
        );
      }
      return requestOnce<A>(kind === "upload" ? "PUT" : "GET", parsed, kind, bytes, logAccessToken);
    });
  return {
    endpoint: Effect.succeed(origin),
    defaultOrganizationId: Effect.succeed(options.organizationId),
    request,
    upload: (url: string, bytes: Uint8Array) => external<void>("upload", url, bytes),
    fetchLog: (url: string, accessToken?: Redacted.Redacted<string>) =>
      external<string>("log", url, undefined, accessToken),
  };
}
export type Http = ReturnType<typeof makeHttp>;
export class ZeropsClient extends Context.Service<ZeropsClient, Http>()("Zerops/Client") {}
