import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "src/lib/appStart/AppRoutes";
import AuthenticationStateProvider from "src/lib/authentication/AuthenticationStateProvider";
import { SessionProvider } from "src/lib/session/SessionProvider";
import AppThemeProvider from "src/lib/theme/AppThemeProvider";

const AppStart: React.FC = () => {
  return (
    <AppThemeProvider>
      <BrowserRouter>
        <SessionProvider>
          <AuthenticationStateProvider>
            <AppRoutes />
          </AuthenticationStateProvider>
        </SessionProvider>
      </BrowserRouter>
    </AppThemeProvider>
  );
};

export default AppStart;
