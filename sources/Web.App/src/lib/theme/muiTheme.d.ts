import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypeBackground {
    /** Surfaces that float above the page: menus, popovers, dialogs. */
    elevated: string;
  }

  interface Palette {
    /** Boundary of interactive controls (inputs); meets the 3:1 non-text contrast ratio. */
    border: string;
  }

  interface PaletteOptions {
    border?: string;
  }
}
