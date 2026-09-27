import React from "react";
import { Navigate } from "react-router-dom";
import useAuthenticationState from "src/hooks/useAuthenticationState";

const Redirect: React.FC = () => {
  const { isAuthenticated, session } = useAuthenticationState();

  if (isAuthenticated && session) {
    return <Navigate to="/home" replace />;
  }

  return null;
};

export default Redirect;
