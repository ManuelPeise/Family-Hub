---
name: check-ui-style
description: Check FamilyHub frontend UI code against the ui-styling skill and make sure the layout is responsive and mobile first, then fix what breaks the rules. Use when asked to check, review or verify UI style, styling or responsiveness in sources/Web.App, and after finishing a UI change there.
argument-hint: "[files or folders] [report]"
---

# Check UI style

Check UI code in `sources/Web.App` against the FamilyHub styling rules and the mobile-first rules below, then fix what you find.

## Arguments

- **Files or folders** (optional): check only these. Without them, check the changed UI files: everything under `sources/Web.App/src` that `git status --porcelain` lists as modified, added or untracked. If nothing has changed, check all of `sources/Web.App/src`.
- **`report`** (optional): only report findings and change nothing.

## Steps

1. Load the `ui-styling` skill with the Skill tool. Its rules are the first half of the checklist.
2. Work out which files to check (see Arguments). Check `.tsx` and `.ts` files that render UI or define `sx`, `styled()` or the theme, and any `.css` file.
3. Read each file completely and check it against the `ui-styling` rules and the custom-component and mobile-first rules below. Also check the components it renders if they are in the same file.
4. Unless `report` was passed, fix every finding in place. Follow the `ui-styling` skill while fixing, and don't change behavior or restructure code beyond what the fix needs.
5. From `sources/Web.App`, run `npm run format`, `npm run lint` and `npm run build`. Fix any errors your changes caused.
6. Report the result (see Report).

## Custom-component rule

Flag any import from `@mui/material` or `@mui/icons-material` outside `src/components/` and `src/lib/theme/`. Fix it by using the matching custom component from `src/components/`, and create that wrapper first if it doesn't exist.

## Mobile-first rules

The whole app is mobile first, including the custom components in `src/components/`. The base style is the phone layout. Larger screens are additions on top of it.

- **Base values are for `xs`.** A plain `sx` value or the `xs` key describes the phone. Larger breakpoints override it upward:
  ```tsx
  // Good: column on phones, row from md upward
  <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 1, md: 2 }}>
  ```
- **Only go upward.** Use responsive objects or `theme.breakpoints.up(...)`. Flag `theme.breakpoints.down(...)`, `only(...)` and `between(...)` in styles, because they style the desktop first and patch the phone afterward. `useMediaQuery` is fine for behavior (for example a full-screen `Dialog` on small screens), but not as a replacement for responsive `sx` values.
- **No fixed widths.** Don't set `width` or `minWidth` in pixels on layout elements. Use `width: "100%"` with a `maxWidth`, `Container`, `Grid` sizes or flex. Fixed sizes are fine for icons, avatars and images with `maxWidth: "100%"`.
- **Grids start full width.** Give `Grid` items an `xs` size of `12` (or omit it) and narrow them at larger breakpoints: `size={{ xs: 12, sm: 6, md: 4 }}`.
- **Rows stack on phones.** A horizontal `Stack` or flex row with more than two items, or with text that can be long, must be a column on `xs` or must wrap (`flexWrap: "wrap"`, `useFlexGap`).
- **No horizontal scrolling of the page.** Wide content (tables, code, long words) sits in its own scroll container (`TableContainer`, `overflowX: "auto"`) or wraps (`overflowWrap: "anywhere"`).
- **Touch targets.** Buttons and icon buttons that users tap on phones keep at least the default MUI size. Flag `size="small"` on primary actions and custom heights below 40px on tappable elements.
- **Spacing grows with the screen.** Page padding and gaps start small on `xs` (about `1`–`2`) and may grow at larger breakpoints. Flag large fixed padding such as `p: 6` without an `xs` value.
- **Text fits.** Headings use `Typography` variants (turn on `responsiveFontSizes` in the theme rather than setting sizes per breakpoint). Flag `noWrap` on text that can be long unless it has a tooltip or the full text is shown elsewhere.
- **Hidden content is deliberate.** Hiding with `display: { xs: "none", md: "block" }` is fine when the same action or information is reachable on phones some other way, such as a menu. Flag content that is simply unavailable on phones.
- **Dialogs and drawers fit.** A `Dialog` with a form is `fullScreen` on `xs`. A permanent `Drawer` becomes `temporary` (behind a menu button) on `xs`.

## Report

Answer in this format:

- One line saying which files were checked and whether anything was found.
- A list of findings, grouped by file, each with a clickable `path:line` link, the rule it breaks (`ui-styling` or mobile first), and what was changed. With `report`, say what should change instead.
- The result of `format`, `lint` and `build`. If you couldn't fix something, say so and why.

If nothing breaks the rules, say that in one line and don't list the rules you checked.
