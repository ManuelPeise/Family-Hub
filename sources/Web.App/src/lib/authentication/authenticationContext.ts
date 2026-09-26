import { createContext } from "react";
import type { AuthenticationState } from "src/lib/authentication/types/AuthenticationState";

export const AuthenticationContext = createContext<AuthenticationState | null>(
  null,
);
