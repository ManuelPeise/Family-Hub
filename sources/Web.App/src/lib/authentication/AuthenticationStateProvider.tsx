import type React from "react";
import { useEffect, useState } from "react";
import { setSessionExpiredHandler } from "src/lib/api/apiClient";
import { AuthenticationContext } from "src/lib/authentication/authenticationContext";
import * as authenticationService from "src/lib/authentication/authenticationService";
import type { AuthenticationState } from "src/lib/authentication/types/AuthenticationState";
import type { AuthenticationStatus } from "src/lib/authentication/types/AuthenticationStatus";
import type { LoginRequest } from "src/lib/authentication/types/LoginRequest";
import type { SessionUser } from "src/lib/authentication/types/SessionUser";

interface Props {
  children: React.ReactNode;
}

const AuthenticationStateProvider: React.FC<Props> = ({ children }) => {
  const [status, setStatus] = useState<AuthenticationStatus>("loading");
  const [user, setUser] = useState<SessionUser | null>(null);

  const startSession = (sessionUser: SessionUser) => {
    setUser(sessionUser);
    setStatus("authenticated");
  };

  const clearSession = () => {
    setUser(null);
    setStatus("anonymous");
  };

  // Restore the session from the auth cookies on startup, and log out once a refresh fails.
  useEffect(() => {
    let active = true;

    setSessionExpiredHandler(() => {
      setUser(null);
      setStatus("anonymous");
    });

    authenticationService
      .getSession()
      .then((sessionUser) => {
        if (active) {
          setUser(sessionUser);
          setStatus("authenticated");
        }
      })
      .catch(() => {
        if (active) {
          setUser(null);
          setStatus("anonymous");
        }
      });

    return () => {
      active = false;
      setSessionExpiredHandler(null);
    };
  }, []);

  const login = async (request: LoginRequest) => {
    await authenticationService.login(request);
    startSession(await authenticationService.getSession());
  };

  const logout = async () => {
    try {
      await authenticationService.logout();
    } finally {
      clearSession();
    }
  };

  const value: AuthenticationState = { status, user, login, logout };

  return (
    <AuthenticationContext value={value}>{children}</AuthenticationContext>
  );
};

export default AuthenticationStateProvider;
