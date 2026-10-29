/**
 * Optional policy hook that can veto or observe outbound requests, for example
 * to pin an endpoint or organization, or record created object IDs.
 *
 * Throwing (or rejecting) refuses the operation. The transport preserves a
 * `ZeropsGuardRefused` failure and otherwise supplies a generic refusal message.
 */
export interface ZeropsRequestInfo {
  /** Upper-case HTTP method. */
  readonly method: string;
  /** Absolute request URL (API URL, signed upload URL, or log-service URL). */
  readonly url: URL;
  /**
   * `api`: authenticated Zerops public API call.
   * `upload`: unauthenticated PUT of a deploy archive to a signed URL.
   * `log`: unauthenticated GET of a build/runtime log tail from the log service.
   */
  readonly kind: "api" | "upload" | "log";
  /** Parsed JSON request body for `api` requests, if any. Upload bodies are never passed. */
  readonly body?: unknown;
}

export interface ZeropsResponseInfo {
  readonly status: number;
  /** Parsed JSON response body (or `undefined` when empty / not JSON). */
  readonly body: unknown;
}

export interface ZeropsRequestGuard {
  /** Called before the request is sent. Throw to refuse it. */
  readonly before: (request: ZeropsRequestInfo) => void | Promise<void>;
  /**
   * Called after a response is received (any status), for example to record created
   * object IDs. Throwing fails the operation after the fact.
   */
  readonly after?: (
    request: ZeropsRequestInfo,
    response: ZeropsResponseInfo,
  ) => void | Promise<void>;
  /**
   * Called when a request passed `before` but no response arrived (network failure,
   * timeout or interruption), so a mutation's outcome is unknown. Errors are ignored.
   */
  readonly failed?: (request: ZeropsRequestInfo) => void | Promise<void>;
}
