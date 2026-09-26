import type { Components, CSSObject, Theme } from "@mui/material/styles";
import { radius } from "src/lib/theme/shape";

/*
 * Component defaults that establish FamilyHub behavior. Colors come from the CSS theme
 * variables (theme.vars), so every override works in light and dark mode.
 */

const tokens = (theme: Theme) => theme.vars ?? theme;

const focusRing = (theme: Theme, offset = 2): CSSObject => ({
  outline: `2px solid ${tokens(theme).palette.primary.main}`,
  outlineOffset: offset,
});

export const components: Components<Omit<Theme, "components">> = {
  MuiCssBaseline: {
    defaultProps: {
      enableColorScheme: true,
    },
  },

  // Visible keyboard focus for every clickable MUI element (buttons, tabs, menu items,
  // checkboxes, radios, switches, chips, list items).
  MuiButtonBase: {
    styleOverrides: {
      root: ({ theme }) => ({
        "&.Mui-focusVisible": focusRing(theme),
      }),
    },
  },

  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: radius.md,
        minHeight: theme.spacing(5),
        paddingInline: theme.spacing(2),
      }),
      sizeSmall: ({ theme }) => ({
        minHeight: theme.spacing(4),
        paddingInline: theme.spacing(1.5),
      }),
      sizeLarge: ({ theme }) => ({
        minHeight: theme.spacing(6),
        paddingInline: theme.spacing(3),
      }),
    },
  },

  MuiTextField: {
    defaultProps: {
      fullWidth: true,
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: radius.md,
        backgroundColor: tokens(theme).palette.background.paper,
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: tokens(theme).palette.border,
        },
        "&:hover:not(.Mui-disabled, .Mui-focused, .Mui-error) .MuiOutlinedInput-notchedOutline":
          {
            borderColor: tokens(theme).palette.text.primary,
          },
        "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
          borderColor: tokens(theme).palette.action.disabledBackground,
        },
      }),
    },
  },

  MuiPaper: {
    styleOverrides: {
      // Dark mode uses the palette surface steps instead of MUI's white elevation overlay.
      root: {
        backgroundImage: "none",
      },
    },
  },

  MuiCard: {
    defaultProps: {
      variant: "outlined",
    },
    styleOverrides: {
      root: {
        borderRadius: radius.lg,
      },
    },
  },

  MuiPopover: {
    styleOverrides: {
      paper: ({ theme }) => ({
        backgroundColor: tokens(theme).palette.background.elevated,
        border: `1px solid ${tokens(theme).palette.divider}`,
        borderRadius: radius.lg,
      }),
    },
  },

  MuiMenu: {
    styleOverrides: {
      list: ({ theme }) => ({
        padding: theme.spacing(0.5),
      }),
    },
  },

  MuiMenuItem: {
    styleOverrides: {
      root: {
        borderRadius: radius.sm,
        "&.Mui-focusVisible": {
          outlineOffset: -2,
        },
      },
    },
  },

  MuiDialog: {
    styleOverrides: {
      // Mobile first: small outer margin on phones, the MUI default from sm upward.
      paper: ({ theme }) => ({
        backgroundColor: tokens(theme).palette.background.elevated,
        borderRadius: radius.xl,
        margin: theme.spacing(2),
        maxHeight: `calc(100% - ${theme.spacing(4)})`,
        [theme.breakpoints.up("sm")]: {
          margin: theme.spacing(4),
          maxHeight: `calc(100% - ${theme.spacing(8)})`,
        },
      }),
      paperFullWidth: ({ theme }) => ({
        width: `calc(100% - ${theme.spacing(4)})`,
        [theme.breakpoints.up("sm")]: {
          width: `calc(100% - ${theme.spacing(8)})`,
        },
      }),
      paperFullScreen: {
        margin: 0,
        width: "100%",
        maxHeight: "none",
        borderRadius: 0,
      },
    },
  },

  MuiAppBar: {
    defaultProps: {
      elevation: 0,
      color: "default",
    },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: tokens(theme).palette.background.paper,
        color: tokens(theme).palette.text.primary,
        borderBottom: `1px solid ${tokens(theme).palette.divider}`,
      }),
    },
  },

  MuiChip: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: radius.sm,
        fontWeight: theme.typography.fontWeightMedium,
      }),
    },
  },

  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: radius.lg,
      },
    },
  },

  // Inverted surface: dark tooltip in light mode, light tooltip in dark mode.
  MuiTooltip: {
    styleOverrides: {
      tooltip: ({ theme }) => ({
        ...theme.typography.caption,
        backgroundColor: tokens(theme).palette.text.primary,
        color: tokens(theme).palette.background.paper,
        borderRadius: radius.sm,
        padding: theme.spacing(0.75, 1.25),
      }),
      arrow: ({ theme }) => ({
        color: tokens(theme).palette.text.primary,
      }),
    },
  },

  MuiTabs: {
    styleOverrides: {
      indicator: {
        height: 3,
        borderRadius: "3px 3px 0 0",
      },
    },
  },

  MuiTab: {
    styleOverrides: {
      root: ({ theme }) => ({
        minHeight: theme.spacing(6),
        "&.Mui-focusVisible": {
          outlineOffset: -2,
        },
      }),
    },
  },

  // Links are underlined so they are not recognizable by color alone.
  MuiLink: {
    defaultProps: {
      underline: "always",
    },
    styleOverrides: {
      root: ({ theme }) => ({
        fontWeight: theme.typography.fontWeightMedium,
        textUnderlineOffset: "0.2em",
        borderRadius: 2,
        "&:focus-visible": focusRing(theme),
      }),
    },
  },

  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: radius.md,
        "&.Mui-focusVisible": {
          outlineOffset: -2,
        },
      },
    },
  },

  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderBottomColor: tokens(theme).palette.divider,
      }),
      head: ({ theme }) => ({
        ...theme.typography.subtitle2,
        color: tokens(theme).palette.text.secondary,
      }),
    },
  },
};
