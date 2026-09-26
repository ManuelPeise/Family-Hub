import React from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Outlet } from "react-router-dom";
import FullPageLoader from "src/components/layout/FullPageLoader";
import useAuthenticationState from "src/lib/authentication/hooks/useAuthenticationState";

/** Landing, login and registration: signed-in users go straight to the home page. */
const RedirectIfAuthenticated: React.FC = () => {
  const { t } = useTranslation();
  const { status } = useAuthenticationState();

  if (status === "loading") {
    return <FullPageLoader label={t("labelLoading")} />;
  }

  if (status === "authenticated") {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default RedirectIfAuthenticated;
