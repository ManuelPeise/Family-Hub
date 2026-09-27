/** Thrown by apiRequest for every response with a non-success status code. */
export class ApiError extends Error {
  readonly status: number;
  /** Parsed response body, e.g. ASP.NET ValidationProblemDetails or { message }. */
  readonly body: unknown;

  constructor(status: number, body: unknown) {
    super(`API request failed with status ${String(status)}.`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}
