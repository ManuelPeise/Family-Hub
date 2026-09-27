import { createContext } from "react";
import type { AuthenticationContextValue } from "src/lib/authentication/types/Authentication.types";

export const AuthenticationStateContext =
  createContext<AuthenticationContextValue | null>(null);
