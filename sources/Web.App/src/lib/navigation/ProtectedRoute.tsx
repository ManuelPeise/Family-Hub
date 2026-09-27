import React from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Outlet } from "react-router-dom";
import FullPageLoader from "src/components/layout/FullPageLoader";
import useAuthenticationState from "src/hooks/useAuthenticationState";

/** Guard for the signed-in pages: signed-out users go to the login page. */
const ProtectedRoute: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, isSessionRestored } = useAuthenticationState();

  // Without this wait, reloading a signed-in page would redirect before the session is restored.
  if (!isSessionRestored) {
    return <FullPageLoader label={t("labelLoading")} />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
