---
name: ui-styling
description: StudyHub UI styling rules for the React frontend (Material UI components, theme, sx vs styled, colors, spacing, responsive layout, icons, dark mode). Use before creating or changing any component, page, layout, theme or CSS in sources/Web.App.
---

# StudyHub UI styling

Follow these rules when building or changing UI in `sources/Web.App`. The app uses Material UI (`@mui/material`, `@mui/icons-material`) with Emotion. If existing code breaks a rule, match the rule, not the exception.

## Custom components wrap MUI

- App code never imports `@mui/material` or `@mui/icons-material`. It uses the custom components in `src/components/`, which wrap MUI. Only `src/components/` and the theme (`src/lib/theme/`) import MUI.
- If the app needs a component that doesn't exist in `src/components/` yet, create the wrapper there first, then use it. The wrapper sets StudyHub defaults, is mobile first, and exposes only the props the app needs.
- The rules below apply to the wrappers in `src/components/` and to how app code uses them (for example, `sx` on a custom component).

## Components first

- Build the UI from MUI components, through the custom wrappers. Don't write raw HTML elements with custom styling when an MUI component exists:
  - Layout: `Box`, `Stack`, `Grid`, `Container`, `Paper`.
  - Text: `Typography` with a `variant` (`h1`–`h6`, `body1`, `body2`, `caption`, ...). Don't use bare `<h1>` or `<p>`.
  - Inputs and actions: `TextField`, `Button`, `IconButton`, `Checkbox`, `Select`, ...
- Use `Stack` with `spacing` for one-dimensional lists of elements instead of margins on each child.
- Use component props before styles: `variant`, `color`, `size`, `fullWidth`, `disabled`.

## How to style

Use these in order of preference:

1. **Theme**: when every instance of a component should look the same, set it once in the theme (`components.<MuiName>.defaultProps` / `styleOverrides`) instead of repeating styles.
2. **`sx` prop**: for one-off styles on a single element.
   ```tsx
   <Box sx={{ p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
   ```
3. **`styled()`**: for a styled component that is reused. Keep it in the component's file if only that file uses it, otherwise give it its own file.
   ```tsx
   const Card = styled(Paper)(({ theme }) => ({
     padding: theme.spacing(2),
   }));
   ```

Don't use:

- the `style` prop (inline styles),
- new `.css` files, CSS modules or `className`-based styling,
- `!important`.

`src/root.css` is the only global stylesheet and holds base rules only (box sizing, full-height `#root`, fluid images, a font import). Colors, fonts and spacing come from the theme, and component styles never go there.

Background photos live in `src/assets/`, are imported by the page (`import backgroundImage from "src/assets/<name>.jpg"`) and passed to the layout component as a `backgroundImage` prop. Layout components apply them with `imageBackground(image, "hero" | "uniform")` from `src/components/layout/imageBackground.ts`, which lays an overlay in the page background color over the photo so text stays readable in light and dark mode. Never put text directly on a photo without that overlay.

## Theme values, not hard-coded values

- **Colors**: use palette tokens (`"primary.main"`, `"text.secondary"`, `"error.main"`, `"divider"`, `"background.default"`). Never write hex, `rgb()` or named colors in components. A new color belongs in the theme palette.
- **Spacing**: use spacing units (`p: 2`, `mt: 1`, `gap: 3`, `theme.spacing(2)`). One unit is 8px. Don't write pixel values for margin, padding or gap.
- **Typography**: use `Typography` variants. Don't set `fontSize`, `fontWeight` or `fontFamily` directly. Change the theme's `typography` instead.
- **Shape and depth**: use `borderRadius: 1` (theme `shape.borderRadius`) and `elevation` / `boxShadow: 1..24`. Don't write your own shadows.
- **Breakpoints**: use responsive values in `sx` (`{ xs: 1, md: 3 }`) or `theme.breakpoints.up("md")`. Don't write media queries with pixel widths.

## Theme

- The theme lives in `src/lib/theme/`:
  - `theme.ts` creates it with `createTheme`, CSS variables (`colorSchemeSelector: "data"`) and `colorSchemes` for light and dark, then applies `responsiveFontSizes`.
  - `palette.ts` (light and dark palettes with the same roles), `typography.ts`, `shadows.ts`, `shape.ts` (radius scale) and `components.ts` (component defaults).
  - `AppThemeProvider.tsx` provides the theme and `CssBaseline` once, in `AppStart`.
  - `hooks/useThemeMode.ts` reads and switches the mode (`light`, `dark`, `system`; default `system`, stored in localStorage under `themeMode`). App code uses this hook, never MUI's `useColorScheme` directly.
- Both modes share everything except the palette. Colors must always come from the palette so both modes work.
- Extra palette tokens: `background.elevated` for surfaces above the page (menus, popovers, dialogs) and `border` for control boundaries (3:1 contrast). Dark mode separates surfaces by background color (`background.default` → `paper` → `elevated`), not by shadows or MUI's white overlay.
- Radius scale (`shape.ts`): `sm` 6px (chips, menu items, tooltips), `md` 8px (buttons, inputs, `shape.borderRadius`), `lg` 12px (cards, alerts, popovers), `xl` 16px (dialogs).
- Typography roles: `h1` display, `h2` page title, `h3`/`h4` section headings, `h5`/`h6` card and dialog titles, `subtitle1`/`subtitle2` labels, `body1` reading text, `body2` UI text, `caption`/`overline` meta text.
- In theme code, read colors from `theme.vars` (`(theme.vars ?? theme).palette...`) so overrides follow the active mode.
- Keep all brand values (palette, typography, shape, component defaults) in the theme, not spread across components. A design decision that repeats goes into `components.ts`, not into repeated `sx`.

## Icons

- Icons are re-exported from `src/components/`, and app code imports them from there. Inside `src/components/`, import each icon by its path, as a default import with an `Icon` suffix. Don't import from the `@mui/icons-material` barrel, which slows down the dev server:
  ```tsx
  import DeleteIcon from "@mui/icons-material/Delete";
  ```
- Size and color icons with props (`fontSize="small"`, `color="action"`), not with styles.
- An `IconButton` without visible text needs an `aria-label`.

## Layout and accessibility

- Design mobile first: the base (`xs`) style is the phone layout, and larger breakpoints override it upward (`{ xs: "column", md: "row" }`, `theme.breakpoints.up("md")`). Never style the desktop first and patch the phone with `breakpoints.down`. The `check-ui-style` skill has the full list of mobile-first rules.
- Every page must work from phone width (`xs`) upward. Wrap page content in `Container` or give it a responsive `maxWidth`.
- Give every form field a `label`. Don't use a placeholder as the only label.
- Show loading with `CircularProgress` / `Skeleton` and errors with `Alert`, not with custom-styled text.
