import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AppShellContainer from "src/components/layout/AppShell";
import { HomeIcon } from "src/components/layout/icons";
import useAuthenticationState from "src/hooks/useAuthenticationState";
import { useLocalization } from "src/hooks/useLocalization";

/** Connects the authentication state to the app shell for all pages after login. */
const AuthenticatedLayout: React.FC = () => {
  const localization = useLocalization();
  const authenticationState = useAuthenticationState();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await authenticationState.handleLogout();
    await navigate("/", { replace: true });
  };

  return (
    <AppShellContainer
      appName={localization.getResource("common:labelAppName")}
      userName={authenticationState.session?.userName ?? ""}
      navItems={[
        {
          label: localization.getResource("common:navHome"),
          to: "/home",
          icon: <HomeIcon />,
        },
      ]}
      menuLabel={localization.getResource("common:labelOpenMenu")}
      navigationLabel={localization.getResource("common:labelNavigation")}
      logoutLabel={localization.getResource("common:labelLogout")}
      loggingOut={loggingOut}
      onLogout={() => {
        void handleLogout();
      }}
    >
      <Outlet />
    </AppShellContainer>
  );
};

export default AuthenticatedLayout;
