import { apiRequest } from "src/lib/api/apiClient";

interface IStatelessApiOptions<TRequest> {
  baseUrl?: string;
  parameters?: Record<string, unknown>;
  body?: TRequest;
}

interface IStatelessApiResult<TRequest, TResponse> {
  sendGet: (options?: IStatelessApiOptions<TRequest>) => Promise<TResponse>;
  sendPost: (options?: IStatelessApiOptions<TRequest>) => Promise<TResponse>;
}

/*
 * Typed GET/POST helpers on top of apiRequest, so they share the silent refresh on 401 and
 * throw ApiError for error statuses. Each create() call keeps its own options.
 */
class StatelessApi {
  public create<TRequest, TResponse>(
    options: IStatelessApiOptions<TRequest>,
  ): IStatelessApiResult<TRequest, TResponse> {
    const send = async (
      method: "GET" | "POST",
      opts?: IStatelessApiOptions<TRequest>,
    ): Promise<TResponse> => {
      const requestOptions: IStatelessApiOptions<TRequest> = {
        ...options,
        ...opts,
      };
      if (!requestOptions.baseUrl) {
        throw new Error(`Base URL is required for ${method} request`);
      }

      const body = await apiRequest(requestOptions.baseUrl, {
        method,
        body: method === "POST" ? requestOptions.body : undefined,
        params: requestOptions.parameters,
      });

      // The response shape is not validated here; callers trust the backend DTO.
      return body as TResponse;
    };

    return {
      sendGet: (opts) => send("GET", opts),
      sendPost: (opts) => send("POST", opts),
    };
  }
}

export const StatelessApiClient = new StatelessApi();
