import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type React from "react";
import { theme } from "src/lib/theme/theme";

interface Props {
  children: React.ReactNode;
}

const AppThemeProvider: React.FC<Props> = ({ children }) => {
  return (
    <ThemeProvider
      theme={theme}
      defaultMode="system"
      modeStorageKey="themeMode"
      disableTransitionOnChange
    >
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default AppThemeProvider;
