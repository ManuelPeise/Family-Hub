import type { PaletteOptions } from "@mui/material/styles";

/*
 * Light and dark palettes share the same semantic roles. The dark palette is designed
 * separately (lighter accents, layered navy surfaces), not an inversion of the light one.
 * Text and accent colors meet WCAG AA (4.5:1) on their backgrounds, and control borders
 * meet 3:1.
 */

export const lightPalette: PaletteOptions = {
  primary: {
    main: "#4F46E5",
    light: "#6366F1",
    dark: "#4338CA",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#0F766E",
    light: "#14B8A6",
    dark: "#115E59",
    contrastText: "#FFFFFF",
  },
  success: {
    main: "#15803D",
    light: "#22C55E",
    dark: "#166534",
    contrastText: "#FFFFFF",
  },
  warning: {
    main: "#B45309",
    light: "#F59E0B",
    dark: "#92400E",
    contrastText: "#FFFFFF",
  },
  error: {
    main: "#DC2626",
    light: "#EF4444",
    dark: "#B91C1C",
    contrastText: "#FFFFFF",
  },
  info: {
    main: "#0369A1",
    light: "#0EA5E9",
    dark: "#075985",
    contrastText: "#FFFFFF",
  },
  background: {
    default: "#F6F7FB",
    paper: "#FFFFFF",
    elevated: "#FFFFFF",
  },
  text: {
    primary: "#0F172A",
    secondary: "#475569",
    disabled: "#94A3B8",
  },
  divider: "#E2E8F0",
  border: "#8B95A7",
  action: {
    active: "#475569",
    hover: "rgba(15, 23, 42, 0.04)",
    hoverOpacity: 0.04,
    selected: "rgba(79, 70, 229, 0.08)",
    selectedOpacity: 0.08,
    focus: "rgba(79, 70, 229, 0.12)",
    focusOpacity: 0.12,
    activatedOpacity: 0.12,
    disabled: "#94A3B8",
    disabledBackground: "#E2E8F0",
  },
};

export const darkPalette: PaletteOptions = {
  primary: {
    main: "#818CF8",
    light: "#A5B4FC",
    dark: "#6366F1",
    contrastText: "#0B1020",
  },
  secondary: {
    main: "#2DD4BF",
    light: "#5EEAD4",
    dark: "#14B8A6",
    contrastText: "#042F2E",
  },
  success: {
    main: "#4ADE80",
    light: "#86EFAC",
    dark: "#22C55E",
    contrastText: "#052E16",
  },
  warning: {
    main: "#FBBF24",
    light: "#FCD34D",
    dark: "#F59E0B",
    contrastText: "#451A03",
  },
  error: {
    main: "#F87171",
    light: "#FCA5A5",
    dark: "#EF4444",
    contrastText: "#450A0A",
  },
  info: {
    main: "#38BDF8",
    light: "#7DD3FC",
    dark: "#0EA5E9",
    contrastText: "#082F49",
  },
  background: {
    default: "#0F1320",
    paper: "#161B2B",
    elevated: "#1E2436",
  },
  text: {
    primary: "#E6E9F0",
    secondary: "#A3ACBF",
    disabled: "#6B7385",
  },
  divider: "#283043",
  border: "#5E6A82",
  action: {
    active: "#A3ACBF",
    hover: "rgba(148, 163, 184, 0.08)",
    hoverOpacity: 0.08,
    selected: "rgba(129, 140, 248, 0.16)",
    selectedOpacity: 0.16,
    focus: "rgba(129, 140, 248, 0.2)",
    focusOpacity: 0.2,
    activatedOpacity: 0.2,
    disabled: "#6B7385",
    disabledBackground: "#262D40",
  },
};
