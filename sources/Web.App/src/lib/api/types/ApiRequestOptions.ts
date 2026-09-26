export interface ApiRequestOptions {
  method: "GET" | "POST";
  /** Sent as JSON. */
  body?: unknown;
  /**
   * On a 401, refresh the session once and retry the request (default true).
   * Auth endpoints turn this off, because a 401 there is the actual answer.
   */
  refreshOnUnauthorized?: boolean;
}
