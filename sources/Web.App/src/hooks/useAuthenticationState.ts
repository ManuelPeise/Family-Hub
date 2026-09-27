import { use } from "react";
import { AuthenticationStateContext } from "src/lib/authentication/AuthenticationStateContext";

const useAuthenticationState = () => {
  const context = use(AuthenticationStateContext);
  if (!context) {
    throw new Error(
      "useAuthenticationState must be used inside <AuthenticationStateProvider>.",
    );
  }

  return context;
};

export default useAuthenticationState;
