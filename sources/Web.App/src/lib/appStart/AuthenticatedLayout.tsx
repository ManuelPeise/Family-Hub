import React from "react";
import { Outlet } from "react-router-dom";
import AppShellContainer from "src/components/layout/AppShell";
import { HomeIcon } from "src/components/layout/icons";

import { useLocalization } from "src/hooks/useLocalization";

/** Connects the authentication state to the app shell for all pages after login. */
const AuthenticatedLayout: React.FC = () => {
  const localization = useLocalization();

  return (
    <AppShellContainer
      appName={localization.getResource("common:labelAppName")}
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
    >
      <Outlet />
    </AppShellContainer>
  );
};

export default AuthenticatedLayout;
