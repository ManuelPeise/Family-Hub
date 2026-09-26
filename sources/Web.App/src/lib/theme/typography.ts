import type { TypographyVariantsOptions } from "@mui/material/styles";

/*
 * Variant roles:
 * - h1: display, h2: page title, h3/h4: section headings, h5/h6: card and dialog titles
 * - subtitle1/subtitle2: labels and emphasized text
 * - body1: reading text (16px, generous line height for long study sessions), body2: UI text
 * - caption/overline: meta information
 * Sizes are in rem so they follow the user's browser font size, and theme.ts scales the
 * headings down on small screens with responsiveFontSizes.
 */

export const typography: TypographyVariantsOptions = {
  fontFamily: [
    '"Inter Variable"',
    "Inter",
    "system-ui",
    "-apple-system",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
  ].join(","),
  fontSize: 14,
  htmlFontSize: 16,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h1: {
    fontSize: "2.5rem",
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
  },
  h2: {
    fontSize: "2rem",
    fontWeight: 700,
    lineHeight: 1.25,
    letterSpacing: "-0.015em",
  },
  h3: {
    fontSize: "1.75rem",
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: "-0.01em",
  },
  h4: {
    fontSize: "1.5rem",
    fontWeight: 600,
    lineHeight: 1.35,
    letterSpacing: "-0.01em",
  },
  h5: {
    fontSize: "1.25rem",
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: "-0.005em",
  },
  h6: {
    fontSize: "1.125rem",
    fontWeight: 600,
    lineHeight: 1.45,
    letterSpacing: 0,
  },
  subtitle1: {
    fontSize: "1rem",
    fontWeight: 600,
    lineHeight: 1.5,
  },
  subtitle2: {
    fontSize: "0.875rem",
    fontWeight: 600,
    lineHeight: 1.5,
  },
  body1: {
    fontSize: "1rem",
    lineHeight: 1.6,
  },
  body2: {
    fontSize: "0.875rem",
    lineHeight: 1.57,
  },
  button: {
    fontSize: "0.875rem",
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: "0.01em",
    textTransform: "none",
  },
  caption: {
    fontSize: "0.75rem",
    lineHeight: 1.5,
    letterSpacing: "0.02em",
  },
  overline: {
    fontSize: "0.75rem",
    fontWeight: 600,
    lineHeight: 2,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
};
