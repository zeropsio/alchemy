import * as Data from "effect/Data";
export interface ApiFailure {
  readonly status: number;
  readonly code: string;
  readonly message: string;
  readonly operation: string;
}
export class ZeropsApiError extends Data.TaggedError("ZeropsApiError")<ApiFailure> {}
export class ZeropsNotFound extends Data.TaggedError("ZeropsNotFound")<ApiFailure> {}
export class ZeropsUnauthorized extends Data.TaggedError("ZeropsUnauthorized")<ApiFailure> {}
export class ZeropsForbidden extends Data.TaggedError("ZeropsForbidden")<ApiFailure> {}
export class ZeropsValidation extends Data.TaggedError("ZeropsValidation")<ApiFailure> {}
export class ZeropsConflict extends Data.TaggedError("ZeropsConflict")<ApiFailure> {}
export class ZeropsEnvKeyConflict extends Data.TaggedError("ZeropsEnvKeyConflict")<ApiFailure> {}
export class ZeropsRateLimited extends Data.TaggedError("ZeropsRateLimited")<ApiFailure> {}
export class ZeropsServerError extends Data.TaggedError("ZeropsServerError")<ApiFailure> {}
export class ZeropsNotAvailable extends Data.TaggedError("ZeropsNotAvailable")<ApiFailure> {}
export class ZeropsGuardRefused extends Data.TaggedError("ZeropsGuardRefused")<{
  readonly code: string;
  readonly message: string;
}> {}
export class ZeropsTransportError extends Data.TaggedError("ZeropsTransportError")<{
  readonly code: string;
  readonly message: string;
}> {}
export class ZeropsDecodeError extends Data.TaggedError("ZeropsDecodeError")<{
  readonly code: string;
  readonly message: string;
}> {}
export class ZeropsProcessFailed extends Data.TaggedError("ZeropsProcessFailed")<{
  readonly code: string;
  readonly processId: string;
  readonly status: string;
  readonly action?: string;
  readonly failReason?: string;
  readonly message: string;
}> {}
export class ZeropsProcessTimeout extends Data.TaggedError("ZeropsProcessTimeout")<{
  readonly code: string;
  readonly processId: string;
  readonly status?: string;
  readonly message: string;
}> {}
export class ZeropsDeployFailed extends Data.TaggedError("ZeropsDeployFailed")<{
  readonly code: string;
  readonly message: string;
  readonly serviceId?: string;
  readonly processId?: string;
  readonly status?: string;
  readonly logTail?: string;
}> {}
export class ZeropsForeignRoutingChanges extends Data.TaggedError("ZeropsForeignRoutingChanges")<{
  readonly code: string;
  readonly message: string;
  readonly routeIds: ReadonlyArray<string>;
}> {}
export const safeCode = (value: unknown): string =>
  typeof value === "string" && /^[a-zA-Z0-9_.:-]{1,128}$/.test(value) ? value : "unknown";
// Keep original server envelopes out of enumerable Error fields and user diagnostics.
const originalErrorBodies = new WeakMap<object, unknown>();
export function apiError(status: number, body: unknown, operation: string) {
  const b = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const nested = b.error && typeof b.error === "object" ? (b.error as Record<string, unknown>) : b;
  const rawCode = nested.code ?? b.code;
  const code = typeof rawCode === "string" ? rawCode : "unknown";
  // Server messages can contain credentials, environment content and signed URLs. Never echo them.
  const fields = {
    status,
    code,
    operation,
    message: operation + " failed (" + status + ", " + safeCode(code) + ")",
  };
  const C =
    status === 401
      ? ZeropsUnauthorized
      : code === "notAvailable" && status === 503
        ? ZeropsNotAvailable
        : isAbsenceStatus(status) && /NotFound$/.test(code)
          ? ZeropsNotFound
          : status === 403 || code === "notInSudoMode"
            ? ZeropsForbidden
            : /Duplicate|Unavailable$/.test(code)
              ? ZeropsConflict
              : status === 429
                ? ZeropsRateLimited
                : status >= 500
                  ? ZeropsServerError
                  : status === 400
                    ? ZeropsValidation
                    : ZeropsApiError;
  const error = new C(fields);
  originalErrorBodies.set(error, body);
  return error;
}
// Zerops answers a missing entity with HTTP 400 or 404, depending on the backend version.
const isAbsenceStatus = (status: unknown) => status === 400 || status === 404;
// Entity absence is the endpoint-specific code, never a route-level 404 alone.
export const isNotFound = (error: unknown, ...codes: string[]): boolean =>
  !!error &&
  typeof error === "object" &&
  "status" in error &&
  isAbsenceStatus(error.status) &&
  "code" in error &&
  typeof error.code === "string" &&
  codes.includes(error.code);
export type ZeropsError =
  | ReturnType<typeof apiError>
  | ZeropsTransportError
  | ZeropsDecodeError
  | ZeropsGuardRefused
  | ZeropsProcessFailed
  | ZeropsProcessTimeout
  | ZeropsEnvKeyConflict;
