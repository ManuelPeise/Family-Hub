# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this project. The repository-wide guidance is in `../../CLAUDE.md`.

- **`ui-styling` skill** (`../../.claude/skills/ui-styling/SKILL.md`): Material UI usage, theme, `sx` vs `styled()`, colors, spacing, typography, icons, breakpoints and CSS. Load it before creating or changing components, pages, layouts, the theme, styling or CSS. Its rules win over personal preference.
- **`check-ui-style` skill** (`/check-ui-style [files] [report]`): checks changed files against `ui-styling` and the mobile-first rules and fixes what it finds (`report` only lists findings). Run it after every UI change.

## Role

Work on this project as a senior frontend engineer specializing in React 19, TypeScript and Material UI. Write production-ready code that fits the existing architecture.

Prioritize correctness, maintainability, type safety, accessibility, responsive design, consistency with the project conventions, and small, focused changes. Prefer simple solutions over clever abstractions, and don't introduce patterns, dependencies or abstractions without a concrete need.

## Working style

For every task:

1. **Analyze** the existing implementation (see [Before changing code](#before-changing-code)). If the task involves backend data, authentication or API contracts, read `../Web.Api` and `../Shared.Models` too.
2. **Load skills**: for any UI change (components, pages, layouts, theme, styling, CSS, responsive behavior, MUI usage), load `ui-styling`.
3. **Explain** the intended approach briefly, in proportion to the task. A trivial change needs no plan.
4. **Implement** the smallest change that fully solves the problem (see [Scope](#scope)).
5. **Review** the result for TypeScript and React correctness, MUI conventions, accessibility, mobile-first responsiveness, loading/error/empty/success states, unnecessary complexity, duplicated logic and consistency with the architecture.
6. **Run checks**: `npm run format`, `npm run lint`, `npm run build`, and `/check-ui-style` for UI changes. Changes to documentation or other non-code files don't need the code checks.
   - If a check fails, find the actual cause, fix it if it relates to the change, and run the check again.
   - Never disable, weaken or bypass lint, TypeScript, formatting or UI-style rules to make a check pass.
   - If a check can't run because of the environment, say so.
7. **Report** in this format, concisely:
   - **Changed**: what was implemented and important decisions.
   - **Verification**: each check actually run and its result (e.g. `npm run lint — passed`).
   - **Notes**: only relevant limitations, follow-up work, environment issues and assumptions.

Never claim a check passed or that behavior works unless it was actually run or verified.

## Overview

`Web.App` is the StudyHub frontend: a React 19 + TypeScript single-page app built with Vite. It is part of the `1 Web` layer and is listed in `../StudyHub.slnx` through `Web.App.esproj`, which runs `npm run dev` as its startup command. The .NET build does not build it (`ShouldRunBuildScript` is false).

The app is at an early stage. `src/main.tsx` renders `AppStart` (`src/lib/appStart/AppStart.tsx`), which is still a placeholder.

## Commands

Run these from `sources/Web.App/`:

```sh
npm install
npm run dev            # http://localhost:56756 (port set in vite.config.ts)
npm run build          # tsc -b, then vite build into dist/
npm run lint           # eslint
npm run format         # prettier --write .
npm run format:check   # prettier --check .
npm run preview        # serve the production build
```

`npm run dev` first runs `predev`, which formats the project with Prettier and then runs ESLint. The dev server does not start while ESLint reports errors. Prettier uses its defaults (`.prettierrc.json` only sets `endOfLine: auto` for the Git line-ending setup), and `eslint-config-prettier` turns off ESLint rules that conflict with it.

There are no tests yet. The esproj names Vitest as the test framework, but Vitest is not installed. Don't add tests or a test framework unless the task requires it.

## Stack

- **React 19** with `react-dom` and `react-router-dom` 7. Routes are defined in `src/lib/appStart/AppRoutes.tsx`: `/`, `/login` and `/register` are public (`RedirectIfAuthenticated`), `/home` requires a login (`RequireAuthentication`) and renders inside `AuthenticatedLayout` (app bar and drawer).
- **i18next** with `react-i18next` and `i18next-browser-languagedetector` for localization (see [Localization](#localization)).
- **Material UI** (`@mui/material`, `@mui/icons-material`) with its Emotion peers (`@emotion/react`, `@emotion/styled`). It is the app's only UI framework, accessed through `src/components/` (see [UI components](#ui-components)). The theme with light and dark mode is in `src/lib/theme/` and provided by `AppThemeProvider` in `AppStart` (see the `ui-styling` skill). The font is Inter, self-hosted through `@fontsource-variable/inter`. `src/root.css` is the only global stylesheet (base rules only: box sizing, text size adjust, full-height `#root`, fluid images; no colors, fonts or spacing).
- **TypeScript** in strict bundler mode. `tsconfig.app.json` enables `strict`, `noUncheckedIndexedAccess`, `noImplicitReturns`, `noImplicitOverride`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` and `erasableSyntaxOnly`. `tsconfig.node.json` (for `vite.config.ts`) uses the same checks. In practice:
  - Import types with `import type { ... }` (`verbatimModuleSyntax`).
  - No enums or parameter properties (`erasableSyntaxOnly`).
  - Indexed and array access returns `T | undefined` (`noUncheckedIndexedAccess`), so handle the missing case.
- **ESLint** flat config (`eslint.config.js`): the recommended JS rules, typescript-eslint's type-aware `strictTypeChecked` and `stylisticTypeChecked` presets (type information from both tsconfigs), `eslint-plugin-react-x` (`recommended-typescript`), `eslint-plugin-react-dom`, and the react-hooks and react-refresh rules. Non-null assertions (`!`) are not allowed; narrow the value instead.

## Conventions

### Before changing code

- Read the existing implementation and understand the surrounding architecture.
- Search for existing components, hooks, utilities and shared types that solve the same or a similar problem, and check whether the behavior already exists elsewhere.
- Before changing an existing component's API, check how it is currently used.

### Scope

- Make the smallest reasonable change that solves the problem.
- Don't refactor, rename or rewrite unrelated code, and don't replace existing patterns without a concrete reason. Leave an imperfect but unrelated pattern alone unless correctness requires the change.
- Don't introduce speculative abstractions, add dependencies without justification, or change configuration unnecessarily.
- Don't disable lint rules, weaken TypeScript settings, bypass UI-style rules or remove accessibility behavior to simplify an implementation.
- Prefer explicit code, clear names, small components, predictable data flow and minimal coupling. Avoid clever one-liners, deep nesting and magic values.

### TypeScript

- Use strict, explicit types. Don't use `any` unless there is an unavoidable, documented reason.
- Prefer narrowing and validation over type assertions (`as`).
- Use discriminated unions, generics, utility types (`Pick`, `Omit`, `Partial`, ...) and type inference where they improve correctness and readability, not to show off.
- Define each type once, in its own file in the page folder that uses it (see [Files and components](#files-and-components)), instead of duplicating it. Keep types that represent API contracts in line with the backend DTOs.

### React

- Write function components. Keep each component focused on one responsibility.
- Keep business logic out of presentation components where practical: component → hook → service / API / utility. Put reusable logic in a `hooks/` folder or plain functions, but don't wrap trivial single-use logic in a hook.
- Don't add state for values that can be derived from props or existing state; compute them during render. Don't use `useEffect` for values that can be computed synchronously.
- Use `useMemo`, `useCallback` and `React.memo` only when they give a meaningful performance or referential-stability benefit, not by default.
- Avoid unnecessary renders, effects, state and API calls.
- State: prefer local state, then derived state, then page hooks, then existing app-wide mechanisms. Don't add a global state library without a demonstrated need, and keep server state and UI state separate.
- Routing: when routes are set up, keep the definitions centralized, use `react-router-dom` only, preserve the startup behavior, and don't build more routing than the app needs.

### Files and components

- Import project files by their path from `src/` (e.g. `import AppStart from "src/lib/appStart/AppStart";`), never with relative paths like `./AppStart` or `../../lib/...`. The `src/*` alias is set in `tsconfig.app.json` (`paths`) and `vite.config.ts` (`resolve.alias`), and ESLint's `no-restricted-imports` rejects relative imports.
- Layout:
  ```text
  src/
    components/          shared UI wrappers around MUI (the only MUI importers besides the theme)
      layout/            layout and general components (Stack, Typography, Button, Link, Alert, AppShell, AuthLayout, ...) and icons.ts
      form/              form components (Form, TextField, PasswordField, SubmitButton, ...)
    hooks/               app-wide hooks (useFormModel) with their types/
    lib/
      api/               apiClient (fetch wrapper, silent refresh on 401)
      authentication/    auth state, service, route guards, shared form hook
      appStart/          AppStart, AppRoutes, AuthenticatedLayout
      utils/             small pure helpers (isRecord)
      theme/             theme: palette, typography, shadows, shape, component defaults, AppThemeProvider, useThemeMode
      myPage/
        MyPage.tsx       the page component; one component per file, named after the component
        myPageService.ts services
        types/
          SomeType.ts    one type per file, named after the type
        hooks/
          useSomeHook.ts custom hooks, never next to the components
  ```
- Everything a page uses (components, types, hooks, services) lives in that page's folder under `src/lib/<page>/`: components and services directly in it, types in `types/`, hooks in `hooks/`.
- Put each type in its own file, named after the type, in the page's `types/` folder. The only exception is a component's own `Props` type, which stays in the component file.
- Naming of folders and files:
  - Folders start lower case: `components/layout/`, `lib/myPage/`, `types/`, `hooks/`.
  - Hooks and services start lower case and are named after what they export: `hooks/useSomeHook.ts`, `myPageService.ts`.
  - Components (`React.FC`) and types start upper case and are named after the component or type: `MyPage.tsx`, `types/SomeType.ts`.
- Declare components with a named `Props` interface (ESLint enforces `interface` over `type` for object types), `React.FC<Props>` (or plain `React.FC` without props) and a default export:

  ```tsx
  interface Props {
    title: string;
  }

  const Example: React.FC<Props> = ({ title }) => {
    return <div>{title}</div>;
  };

  export default Example;
  ```

- Use double quotes and semicolons (Prettier enforces the formatting).

### UI components

- **App code never imports Material UI directly.** Only `src/components/` and `src/lib/theme/` import from `@mui/material` or `@mui/icons-material`. Features, pages and hooks use the custom components from `src/components/`. This is a deliberate boundary; don't bypass it because a direct import looks simpler.
- If a needed component doesn't exist, create or extend a wrapper in `src/components/` first: wrap the MUI component (`Box`, `Stack`, `Grid`, `Typography`, `Button`, `TextField`, `Dialog`, `Drawer`, `Alert`, `Table`, ...), apply the StudyHub defaults, expose only the props the app needs, and follow `ui-styling`. A wrapper narrows and standardizes MUI; it doesn't rebuild what MUI already provides.
- Put each wrapper in the folder for its kind:
  - `src/components/layout/`: layout components that arrange content (`Stack`, `AppShell`, `AuthLayout`, ...) and all general-purpose wrappers that are not form controls (`Typography`, `Button`, `Link`, `Alert`, ...).
  - `src/components/form/`: form components that take user input (`TextField`, `Select`, `Checkbox`, `Switch`, ...) and the form itself.
- Icons are re-exported from `src/components/layout/icons.ts`. Add a missing icon there first.
- Wrappers translate nothing themselves: all text comes in through props, so the app passes `t(...)` values.

### Styling and responsive design

- Style with the theme and `sx`, using theme tokens for colors, spacing, typography and breakpoints instead of hard-coded values. The `ui-styling` skill has the details.
- The whole app is **mobile first**: every page, layout, component and wrapper is designed for phone width (`xs`) first, and larger breakpoints only add to it. Layouts must work on mobile, tablet and desktop. Don't build a desktop layout and squeeze it down.
- Consider narrow widths, wrapping, text overflow, touch targets, vertical stacking, dialog and navigation behavior, and tables or dense data (scroll them horizontally inside their own container).

### Accessibility

- Use semantic elements, accessible labels, visible focus states and sufficient color contrast. Dialogs, menus and form controls must be accessible.
- Keep the keyboard navigation and focus behavior MUI provides. Don't add ARIA attributes where native semantics already work.
- Make disabled, loading, error and empty states perceivable.

### Data, errors and forms

- Components that load data handle loading, success, empty and error states explicitly. For API-backed UI, distinguish validation, authentication, authorization, network and unexpected server errors.
- Don't swallow errors silently, and don't show implementation details or sensitive backend information to users. Present errors with the project's components.
- Forms have accessible labels, validate input, show useful validation feedback (including server-side validation errors), show a submitting state, prevent duplicate submission and keep the user's input where it makes sense. Don't add a form library unless the existing stack can't reasonably do the job.

### Localization

The app is localized with `i18next` and `react-i18next`, configured in `src/lib/localization/i18n.ts` and loaded once in `src/main.tsx`. It supports German (`de`) and English (`en`):

```text
src/lib/localization/
  i18n.ts              i18next setup, registers every resource file
  i18next.d.ts         types the translation keys from the English resources
  resources/
    de/<name>.de.json  German resource files
    en/<name>.en.json  English resource files
```

- **Language**: `i18next-browser-languagedetector` picks the language from localStorage (key `language`), then the browser language. Region variants map to the base language (`de-AT` → `de`), and unsupported languages fall back to `en`. The `<html lang>` attribute follows the current language.
- **Namespaces**: each resource file is one namespace named after the file (`common.de.json` / `common.en.json` → `common`). `common` is the default namespace.
- **Usage**: `const { t } = useTranslation();` for `common`, `useTranslation("<name>")` for another namespace. Keys are type-checked, so `t("unknownKey")` fails the build.
- Never hard-code user-visible text in components. Every label, button text, message and error shown to users comes from a resource file.
- A resource file is a flat JSON object of camelCase keys:
  ```json
  {
    "labelAppName": "AppName"
  }
  ```
- Keys are never nested or dotted. Never write `"subnamespace.labelAppName"` or `{ "subnamespace": { ... } }`. Text that belongs to its own group goes into a new resource file instead.
- **Ask the user before creating a new resource file.** A new file is always created for both languages, with the same name in `de/` and `en/`, and registered for both languages in `resources` in `i18n.ts`.
- Every key exists in both languages, with the same name. When adding, renaming or removing a key, change the `de` and `en` files together.

### Dependencies

- Before adding a dependency, check `package.json` and whether the existing stack already solves the problem. Add one only when it gives meaningful value.
- Don't add another UI framework, routing library or a library that is only a personal preference.

## Related projects

### Web.Api

The backend is `../Web.Api` (`D:\WorkBench\Study-Hub\sources\Web.Api`), an ASP.NET Core Web API described in `../../CLAUDE.md`. Read it when a task touches data the app loads or sends, and don't guess request or response shapes that the backend can confirm.

- **Addresses**: http://localhost:5069 and https://localhost:7150. In Development, the OpenAPI document is at `/openapi/v1.json` and Swagger UI at `/swagger`. Use them to check endpoints, methods, DTOs, route parameters and status codes.
- **Routes** follow `api/[controller]/[action]` (`ApiControllerBase`); the action is the C# method name. Auth routes: `POST api/Authentication/Login` (`{ userNameOrEmail, password }`, 400 on wrong credentials), `POST api/Authentication/Logout`, `POST api/Authentication/Refresh` (rotates the cookies, 401 when the session is over), `GET api/Authentication/Session` (current user) and `POST api/Registration/Register` (`{ firstName?, lastName?, userName, email }`; the server emails a one-time password, the user is not logged in). Verify against the controller or OpenAPI document; don't invent routes.
- **Authentication**: `Login` sets the JWT access and refresh tokens as HttpOnly cookies (`accessToken`, `refreshToken`, SameSite=Strict), and the API reads the access token from the cookie. The app never reads, parses, stores or manages tokens: not in localStorage, sessionStorage, React or other state, JavaScript-readable cookies or URLs. Authenticated requests are sent with credentials so the browser includes the cookies.
- **Dev proxy and CORS**: `vite.config.ts` proxies `/api` to http://localhost:5069, so API calls are same-origin and the cookies work. The app only uses relative `/api/...` paths. The API's CORS policy is still `AllowAnyOrigin`, which browsers don't allow together with credentials; a deployment where app and API are on different origins needs a CORS policy with the app's origin and `AllowCredentials`.
- **API client**: all requests go through `apiRequest` in `src/lib/api/apiClient.ts`. On a 401 it refreshes the session once (one shared refresh for parallel requests) and retries; if that fails it calls the session-expired handler, which logs the user out. It throws `ApiError` (status and parsed body) for error statuses. Validate response bodies with type guards instead of casting.
- **Auth state**: `AuthenticationStateProvider` restores the session on startup via `Session`; read it with `useAuthenticationState()` (`status`, `user`, `login`, `logout`). Login and registration forms share `useAuthenticationForm`, and API errors become translation keys through `parseAuthenticationError`.

### Shared.Models

The request and response DTOs are C# classes in `../Shared.Models` (e.g. `Auth/AuthenticationRequest`, `Auth/TokenResponse`). Keep the TypeScript types aligned with them and don't rename or reinterpret fields. When a DTO changes, update its TypeScript type and every consumer: request construction, response handling and affected UI states.
