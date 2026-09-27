import type { StatelessApiRequest } from "src/lib/api/types/StatelessApiRequest";

/** Resolves with the validated response body, or throws ApiError / Error. */
export interface StatelessApi<TRequest, TResponse> {
  sendGet: (
    request?: Omit<StatelessApiRequest<TRequest>, "body">,
  ) => Promise<TResponse>;
  sendPost: (request?: StatelessApiRequest<TRequest>) => Promise<TResponse>;
}
