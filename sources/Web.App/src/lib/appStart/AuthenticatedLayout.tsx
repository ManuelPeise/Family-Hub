import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";
import AppShellContainer from "src/components/layout/AppShell";
import { HomeIcon } from "src/components/layout/icons";
import useAuthenticationState from "src/hooks/useAuthenticationState";

/** Connects the authentication state to the app shell for all pages after login. */
const AuthenticatedLayout: React.FC = () => {
  const { t } = useTranslation();
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
      appName={t("labelAppName")}
      userName={authenticationState.session?.userName ?? ""}
      navItems={[{ label: t("navHome"), to: "/home", icon: <HomeIcon /> }]}
      menuLabel={t("labelOpenMenu")}
      navigationLabel={t("labelNavigation")}
      logoutLabel={t("labelLogout")}
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
