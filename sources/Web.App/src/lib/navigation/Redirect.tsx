import React from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Outlet } from "react-router-dom";
import FullPageLoader from "src/components/loading/LoadingOverlay";
import useAuthenticationState from "src/hooks/useAuthenticationState";

/** Guard for the public pages: signed-in users go straight to /home. */
const Redirect: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, isSessionRestored } = useAuthenticationState();

  // Wait for the startup session restore, so a signed-in user doesn't see the public page flash first.
  if (!isSessionRestored) {
    return <FullPageLoader label={t("labelLoading")} />;
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default Redirect;
