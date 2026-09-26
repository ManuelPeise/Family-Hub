import type { AuthenticationStatus } from "src/lib/authentication/types/AuthenticationStatus";
import type { LoginRequest } from "src/lib/authentication/types/LoginRequest";
import type { SessionUser } from "src/lib/authentication/types/SessionUser";

export interface AuthenticationState {
  status: AuthenticationStatus;
  /** The signed-in user, or null while loading or anonymous. */
  user: SessionUser | null;
  login: (request: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}
