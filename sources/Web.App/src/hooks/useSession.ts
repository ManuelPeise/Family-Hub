import { use } from "react";
import { SessionContext } from "src/lib/session/SessionContext";
import type { SessionContextValue } from "src/lib/session/types/Session.types";

export const useSession = (): SessionContextValue => {
  const context = use(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
