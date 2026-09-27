import { sendRequest } from "src/lib/api/apiClient";
import type { StatelessApi } from "src/lib/api/types/StatelessApi";
import type { StatelessApiOptions } from "src/lib/api/types/StatelessApiOptions";
import type { StatelessApiRequest } from "src/lib/api/types/StatelessApiRequest";

/**
 * Creates a small typed client for one API resource. Each request can override the default URL and
 * query parameters; the response body is validated with isResponse before it is returned.
 */
const create = <TRequest, TResponse>({
  url,
  params,
  isResponse,
}: StatelessApiOptions<TResponse>): StatelessApi<TRequest, TResponse> => {
  const send = async (
    method: "GET" | "POST",
    request: StatelessApiRequest<TRequest> = {},
  ): Promise<TResponse> => {
    const requestUrl = request.url ?? url;

    const response = await sendRequest(requestUrl, {
      method,
      body: request.body,
      params: request.params ?? params,
    });

    if (!isResponse(response.data)) {
      throw new Error(`Unexpected response from ${method} ${requestUrl}.`);
    }

    return response.data;
  };

  return {
    sendGet: (request) => send("GET", request),
    sendPost: (request) => send("POST", request),
  };
};

export const StatelessApiClient = { create };
