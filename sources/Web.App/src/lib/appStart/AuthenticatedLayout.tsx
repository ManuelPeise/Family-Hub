import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";
import AppShell from "src/components/layout/AppShell";
import { HomeIcon } from "src/components/layout/icons";
import useAuthenticationState from "src/lib/authentication/hooks/useAuthenticationState";

/** Connects the authentication state to the app shell for all pages after login. */
const AuthenticatedLayout: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuthenticationState();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    await navigate("/", { replace: true });
  };

  return (
    <AppShell
      appName={t("labelAppName")}
      userName={user?.userName ?? ""}
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
    </AppShell>
  );
};

export default AuthenticatedLayout;
