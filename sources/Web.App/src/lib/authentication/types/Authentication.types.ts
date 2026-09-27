import type { Session } from "src/lib/session/types/Session.types";
import type { RequestAccountModel } from "src/pages/Authentication/requestAccount/types/RequestAccountModel";
export type AuthenticationRequest = {
  userNameOrEmail: string;
  password: string;
};

export type RequestAccountRequest = RequestAccountModel & {};

export type AuthenticationCallback = (
  request: AuthenticationRequest,
) => Promise<void>;

export type RequestAccountCallback = (
  request: RequestAccountRequest,
) => Promise<void>;

export type LogoutCallback = () => Promise<void>;

export type AuthenticationContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  /** False until the startup session restore has finished, successfully or not. */
  isSessionRestored: boolean;
  session: Session | null;
  error: Error | null;
  handleLogin: AuthenticationCallback;
  handleRequestAccount: RequestAccountCallback;
  handleLogout: LogoutCallback;
};
