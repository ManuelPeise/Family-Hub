import { apiRequest } from "src/lib/api/apiClient";
import type { LoginRequest } from "src/lib/authentication/types/LoginRequest";
import type { RegistrationRequest } from "src/lib/authentication/types/RegistrationRequest";
import type { SessionUser } from "src/lib/authentication/types/SessionUser";
import isRecord from "src/lib/utils/isRecord";

/** Web.Api routes follow api/[controller]/[action]. */
const endpoints = {
  login: "/api/Authentication/Login",
  logout: "/api/Authentication/Logout",
  session: "/api/Authentication/Session",
  register: "/api/Registration/Register",
} as const;

const isSessionUser = (value: unknown): value is SessionUser => {
  return (
    isRecord(value) &&
    typeof value.userName === "string" &&
    typeof value.email === "string" &&
    Array.isArray(value.roles) &&
    value.roles.every((role) => typeof role === "string")
  );
};

/** Sets the auth cookies. Throws ApiError 400 for wrong credentials. */
export const login = async (request: LoginRequest): Promise<void> => {
  await apiRequest(endpoints.login, {
    method: "POST",
    body: request,
    refreshOnUnauthorized: false,
  });
};

/** Clears the auth cookies. */
export const logout = async (): Promise<void> => {
  await apiRequest(endpoints.logout, {
    method: "POST",
    refreshOnUnauthorized: false,
  });
};

/** Creates the account. The server emails a one-time password; the user is not logged in. */
export const register = async (request: RegistrationRequest): Promise<void> => {
  await apiRequest(endpoints.register, {
    method: "POST",
    body: request,
    refreshOnUnauthorized: false,
  });
};

/** Returns the signed-in user. Refreshes the session once on a 401. */
export const getSession = async (): Promise<SessionUser> => {
  const body = await apiRequest(endpoints.session, { method: "GET" });

  if (!isSessionUser(body)) {
    throw new Error("Unexpected session response.");
  }

  return body;
};
