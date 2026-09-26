import { use } from "react";
import { AuthenticationContext } from "src/lib/authentication/authenticationContext";
import type { AuthenticationState } from "src/lib/authentication/types/AuthenticationState";

const useAuthenticationState = (): AuthenticationState => {
  const context = use(AuthenticationContext);
  if (!context) {
    throw new Error(
      "useAuthenticationState must be used inside <AuthenticationStateProvider>.",
    );
  }

  return context;
};

export default useAuthenticationState;
