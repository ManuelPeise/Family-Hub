/** Per-request overrides of a StatelessApi client's defaults. */
export interface StatelessApiRequest<TRequest> {
  url?: string;
  params?: Record<string, unknown>;
  /** Sent as JSON; POST only. */
  body?: TRequest;
}
