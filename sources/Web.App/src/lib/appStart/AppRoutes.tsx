import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Redirect from "src/lib/navigation/Redirect";
import AuthenticatedLayout from "src/lib/appStart/AuthenticatedLayout";
import HomePage from "src/pages/home/HomePage";
import LandingPage from "src/pages/landing/LandingPage";
import LoginPage from "src/pages/Authentication/login/LoginPage";
import RegisterPage from "src/pages/Authentication/requestAccount/RequestAccountPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public, without app bar */}
      <Route element={<Redirect />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Signed in, with app bar and drawer */}
      <Route element={<Redirect />}>
        <Route element={<AuthenticatedLayout />}>
          <Route path="/home" element={<HomePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
