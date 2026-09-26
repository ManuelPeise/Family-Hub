import { ApiError } from "src/lib/api/types/ApiError";
import type { ApiRequestOptions } from "src/lib/api/types/ApiRequestOptions";

/*
 * Small fetch wrapper for the StudyHub API. Authentication is carried by HttpOnly cookies
 * that the browser sends itself; this module never sees a token.
 */

const refreshEndpoint = "/api/Authentication/Refresh";

let refreshPromise: Promise<boolean> | null = null;
let sessionExpiredHandler: (() => void) | null = null;

/** Called once a refresh fails, i.e. the session is over. Set by the AuthenticationStateProvider. */
export const setSessionExpiredHandler = (
  handler: (() => void) | null,
): void => {
  sessionExpiredHandler = handler;
};

/**
 * Renews the access token cookie through the refresh token cookie. Parallel callers share one
 * request, because the refresh token is rotated and a second refresh with the old cookie would fail.
 */
const refreshSession = (): Promise<boolean> => {
  refreshPromise ??= fetch(refreshEndpoint, {
    method: "POST",
    credentials: "same-origin",
  })
    .then((response) => response.ok)
    .catch(() => false)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

const readBody = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
};

/** Sends a request and returns the parsed body. Throws ApiError for error statuses. */
export const apiRequest = async (
  url: string,
  options: ApiRequestOptions,
): Promise<unknown> => {
  const { method, body, refreshOnUnauthorized = true } = options;

  const response = await fetch(url, {
    method,
    credentials: "same-origin",
    headers:
      body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 401 && refreshOnUnauthorized) {
    if (await refreshSession()) {
      return apiRequest(url, { ...options, refreshOnUnauthorized: false });
    }

    sessionExpiredHandler?.();
  }

  const responseBody = await readBody(response);

  if (!response.ok) {
    throw new ApiError(response.status, responseBody);
  }

  return responseBody;
};
