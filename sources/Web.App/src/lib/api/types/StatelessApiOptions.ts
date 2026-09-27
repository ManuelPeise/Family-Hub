/** Defaults for all requests of one StatelessApi client. */
export interface StatelessApiOptions<TResponse> {
  /** Relative /api path, used when a request doesn't set its own. */
  url: string;
  /** Appended to the URL as query string. */
  params?: Record<string, unknown>;
  /** Validates the response body, so callers get a typed value instead of a cast. */
  isResponse: (data: unknown) => data is TResponse;
}
