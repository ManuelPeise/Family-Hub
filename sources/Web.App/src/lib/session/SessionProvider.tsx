import React, { useState } from "react";
import type {
  Session,
  SessionContextValue,
} from "src/lib/session/types/Session.types";
import { SessionContext } from "src/lib/session/SessionContext";

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);

  // setSession from useState is already stable; memoizing the value keeps consumers from
  // re-rendering when the provider's parent does.
  const contextValue: SessionContextValue = React.useMemo(
    () => ({ session, setSession }),
    [session],
  );

  return <SessionContext value={contextValue}>{children}</SessionContext>;
};
