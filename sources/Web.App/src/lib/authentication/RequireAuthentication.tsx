import React from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import FullPageLoader from "src/components/layout/FullPageLoader";
import useAuthenticationState from "src/lib/authentication/hooks/useAuthenticationState";

/** Only for signed-in users. Remembers the requested page so login can return to it. */
const RequireAuthentication: React.FC = () => {
  const { t } = useTranslation();
  const { status } = useAuthenticationState();
  const location = useLocation();

  if (status === "loading") {
    return <FullPageLoader label={t("labelLoading")} />;
  }

  if (status === "anonymous") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default RequireAuthentication;
