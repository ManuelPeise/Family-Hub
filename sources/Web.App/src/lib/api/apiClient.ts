import type { AxiosResponse } from "axios";
import { axiosClient } from "src/lib/api/axiosClient";
import { ApiError } from "src/lib/api/types/ApiError";
import type { ApiRequestOptions } from "src/lib/api/types/ApiRequestOptions";

/*
 * Small wrapper around the axios client for the FamilyHub API. Authentication is carried by
 * HttpOnly cookies that the browser sends itself; this module never sees a token.
 */

const refreshEndpoint = "/Authentication/Refresh";

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

const request = (
  url: string,
  { method, body, params }: ApiRequestOptions,
): Promise<AxiosResponse<unknown>> =>
  axiosClient.request<unknown>({ url, method, data: body, params });

/**
 * Sends a request and returns the response for a success status. On a 401 it refreshes the session
 * once and retries; if the refresh fails, the session-expired handler runs. Throws ApiError for
 * every non-success status.
 */
export const sendRequest = async (
  url: string,
  options: ApiRequestOptions,
): Promise<AxiosResponse<unknown>> => {
  const { refreshOnUnauthorized = true } = options;

  let response = await request(url, options);

  if (response.status === 401 && refreshOnUnauthorized) {
    if (await refreshSession()) {
      response = await request(url, options);
    } else {
      sessionExpiredHandler?.();
    }
  }

  // axios returns an empty string for an empty body.
  if (response.data === "") {
    response.data = undefined;
  }

  if (!isSuccessStatus(response.status)) {
    throw new ApiError(response.status, response.data);
  }

  return response;
};
