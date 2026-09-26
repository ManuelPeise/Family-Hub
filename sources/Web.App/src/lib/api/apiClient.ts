import { axiosClient } from "src/lib/api/axiosClient";
import { ApiError } from "src/lib/api/types/ApiError";
import type { ApiRequestOptions } from "src/lib/api/types/ApiRequestOptions";

/*
 * Small wrapper around the axios client for the FamilyHub API. Authentication is carried by
 * HttpOnly cookies that the browser sends itself; this module never sees a token.
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

const isSuccessStatus = (status: number): boolean =>
  status >= 200 && status < 300;

/**
 * Renews the access token cookie through the refresh token cookie. Parallel callers share one
 * request, because the refresh token is rotated and a second refresh with the old cookie would fail.
 */
const refreshSession = (): Promise<boolean> => {
  refreshPromise ??= axiosClient
    .post(refreshEndpoint)
    .then((response) => isSuccessStatus(response.status))
    .catch(() => false)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

/** Sends a request and returns the parsed body. Throws ApiError for error statuses. */
export const apiRequest = async (
  url: string,
  options: ApiRequestOptions,
): Promise<unknown> => {
  const { method, body, params, refreshOnUnauthorized = true } = options;

  const response = await axiosClient.request<unknown>({
    url,
    method,
    data: body,
    params,
  });

  if (response.status === 401 && refreshOnUnauthorized) {
    if (await refreshSession()) {
      return apiRequest(url, { ...options, refreshOnUnauthorized: false });
    }

    sessionExpiredHandler?.();
  }

  // axios returns an empty string for an empty body.
  const responseBody = response.data === "" ? undefined : response.data;

  if (!isSuccessStatus(response.status)) {
    throw new ApiError(response.status, responseBody);
  }

  return responseBody;
};
