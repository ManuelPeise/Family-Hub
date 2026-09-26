import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "src/lib/appStart/AppRoutes";
import AuthenticationStateProvider from "src/lib/authentication/AuthenticationStateProvider";
import AppThemeProvider from "src/lib/theme/AppThemeProvider";

const AppStart: React.FC = () => {
  return (
    <AppThemeProvider>
      <BrowserRouter>
        <AuthenticationStateProvider>
          <AppRoutes />
        </AuthenticationStateProvider>
      </BrowserRouter>
    </AppThemeProvider>
  );
};

export default AppStart;
