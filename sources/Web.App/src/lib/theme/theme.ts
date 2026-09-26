import "@fontsource-variable/inter";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { components } from "src/lib/theme/components";
import { darkPalette, lightPalette } from "src/lib/theme/palette";
import { radius } from "src/lib/theme/shape";
import { shadows } from "src/lib/theme/shadows";
import { typography } from "src/lib/theme/typography";

/*
 * One theme with a light and a dark color scheme. Everything except the palette is shared.
 * CSS variables with the "data" selector let the app switch modes at runtime
 * (see hooks/useThemeMode) without re-creating the theme.
 */
const baseTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data",
  },
  colorSchemes: {
    light: {
      palette: lightPalette,
    },
    dark: {
      palette: darkPalette,
    },
  },
  spacing: 8,
  shape: {
    borderRadius: radius.md,
  },
  typography,
  shadows,
  components,
});

export const theme = responsiveFontSizes(baseTheme);
