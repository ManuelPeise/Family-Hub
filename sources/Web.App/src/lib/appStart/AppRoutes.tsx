import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthenticatedLayout from "src/lib/appStart/AuthenticatedLayout";
import RedirectIfAuthenticated from "src/lib/authentication/RedirectIfAuthenticated";
import RequireAuthentication from "src/lib/authentication/RequireAuthentication";
import HomePage from "src/lib/home/HomePage";
import LandingPage from "src/lib/landing/LandingPage";
import LoginPage from "src/lib/login/LoginPage";
import RegisterPage from "src/lib/register/RegisterPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public, without app bar */}
      <Route element={<RedirectIfAuthenticated />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Signed in, with app bar and drawer */}
      <Route element={<RequireAuthentication />}>
        <Route element={<AuthenticatedLayout />}>
          <Route path="/home" element={<HomePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
