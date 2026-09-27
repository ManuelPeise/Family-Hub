import React, { useState, type PropsWithChildren } from "react";
import type {
  AuthenticationCallback,
  AuthenticationContextValue,
  AuthenticationRequest,
  LogoutCallback,
  RequestAccountCallback,
  RequestAccountRequest,
} from "src/lib/authentication/types/Authentication.types";
import { useLoadingState } from "src/hooks/useLoadingState";
import { sendRequest, setSessionExpiredHandler } from "src/lib/api/apiClient";
import { useSession } from "src/hooks/useSession";
import { AuthenticationStateContext } from "src/lib/authentication/AuthenticationStateContext";
import isSession from "src/lib/session/isSession";

type Props = PropsWithChildren;

const urls = {
  authentication: "/Authentication/Login",
  requestAccount: "/FamilyRequest/RequestFamilyAccess",
  logout: "/Authentication/Logout",
  session: "/Authentication/Session",
};

const toError = (error: unknown): Error =>
  error instanceof Error ? error : new Error(String(error));

/** Must be rendered inside a SessionProvider, which holds the session it fills. */
const AuthenticationStateProvider: React.FC<Props> = ({ children }) => {
  const { session, setSession } = useSession();
  const { isLoading, handleIsLoadingChanged } = useLoadingState();
  const [error, setError] = useState<Error | null>(null);
  const [isSessionRestored, setIsSessionRestored] = useState(false);

  /** Loads the signed-in user; throws ApiError if there is no valid session. */
  const loadSession = React.useCallback(async (): Promise<void> => {
    const response = await sendRequest(urls.session, { method: "GET" });

    if (!isSession(response.data)) {
      throw new Error("Unexpected session response.");
    }

    setSession(response.data);
  }, [setSession]);

  /** Runs a user action with a shared loading and error state. */
  const runAction = React.useCallback(
    async (action: () => Promise<void>): Promise<void> => {
      setError(null);
      handleIsLoadingChanged(true);

      try {
        await action();
      } catch (actionError) {
        setError(toError(actionError));
      } finally {
        handleIsLoadingChanged(false);
      }
    },
    [handleIsLoadingChanged],
  );

  // Restores the session from the auth cookies on startup and clears it once a refresh fails.
  React.useEffect(() => {
    setSessionExpiredHandler(() => {
      setSession(null);
    });

    loadSession()
      .catch(() => {
        // No valid session: the user is simply not signed in.
        setSession(null);
      })
      .finally(() => {
        setIsSessionRestored(true);
      });

    return () => {
      setSessionExpiredHandler(null);
    };
  }, [loadSession, setSession]);

  const handleLogin: AuthenticationCallback = React.useCallback(
    (request: AuthenticationRequest) =>
      runAction(async () => {
        await sendRequest(urls.authentication, {
          method: "POST",
          body: request,
          refreshOnUnauthorized: false,
        });
        await loadSession();
      }),
    [runAction, loadSession],
  );

  const handleRequestAccount: RequestAccountCallback = React.useCallback(
    (request: RequestAccountRequest) =>
      runAction(async () => {
        await sendRequest(urls.requestAccount, {
          method: "POST",
          body: request,
        });
      }),
    [runAction],
  );

  const handleLogout: LogoutCallback = React.useCallback(
    () =>
      runAction(async () => {
        // Clears the cookies.
        await sendRequest(urls.logout, {
          method: "POST",
          refreshOnUnauthorized: false,
        });
        setSession(null);
      }),
    [runAction, setSession],
  );

  const contextValue: AuthenticationContextValue = React.useMemo(
    () => ({
      isAuthenticated: session !== null,
      isLoading,
      isSessionRestored,
      session,
      error,
      handleLogin,
      handleRequestAccount,
      handleLogout,
    }),
    [
      session,
      isLoading,
      isSessionRestored,
      error,
      handleLogin,
      handleRequestAccount,
      handleLogout,
    ],
  );

  return (
    <AuthenticationStateContext value={contextValue}>
      {children}
    </AuthenticationStateContext>
  );
};

export default AuthenticationStateProvider;
