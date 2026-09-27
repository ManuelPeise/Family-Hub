import axios from "axios";

/*
 * The one axios instance for the FamilyHub API. The default base URL is the relative /api path, so
 * requests stay same-origin (Vite proxy in dev) and the browser sends the HttpOnly auth cookies itself.
 * VITE_API_URL overrides it for a deployment where the API is served under another path.
 * Every status resolves; apiClient decides what counts as an error.
 */
const defaultBaseUrl = "/api";

const getBaseUrl = (): string => {
  return import.meta.env.VITE_API_URL ?? defaultBaseUrl;
};

export const axiosClient = axios.create({
  validateStatus: () => true,
  baseURL: getBaseUrl(),
});
