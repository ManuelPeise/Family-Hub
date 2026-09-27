import { createContext } from "react";
import type { SessionContextValue } from "src/lib/session/types/Session.types";

export const SessionContext = createContext<SessionContextValue | null>(null);
