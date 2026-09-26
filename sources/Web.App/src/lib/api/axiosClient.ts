import axios from "axios";

/*
 * The one axios instance for the FamilyHub API. Requests use relative /api paths, so they stay
 * same-origin and the browser sends the HttpOnly auth cookies itself.
 * Every status resolves; apiClient decides what counts as an error.
 */
export const axiosClient = axios.create({
  validateStatus: () => true,
});
