# LernApp – UI-Auth-Flow (React + TypeScript + MUI)

Diese Datei enthält den kompletten Auth-Flow der React-App. Jeder Abschnitt entspricht einer Datei im Projekt, der Pfad steht in der Überschrift.

## Einrichtung

### Abhängigkeiten

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled react-router-dom axios lodash
npm install -D @types/lodash
```

Getestet gegen MUI v7 und React Router v7. Bei MUI v5 ersetzt du `slotProps` in `PasswordField.tsx` (`input` → `InputProps`) und `AppShell.tsx` (`paper` → `PaperProps`).

### Einbinden

1. Den Ordner `src/` in dein Projekt übernehmen (bestehende `main.tsx`/`App.tsx` ersetzen oder zusammenführen).
2. Schriften in `index.html` im `<head>` ergänzen:

   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com" />
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
   <link
     href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&family=Fredoka:wght@600&display=swap"
     rel="stylesheet"
   />
   ```

3. Hintergrundbild unter `public/images/landing-bg.jpg` ablegen (Querformat, mind. 2400 px breit, Motiv eher in der rechten Bildhälfte, da links der Text liegt).
4. `.env` anlegen:

   ```
   VITE_API_BASE_URL=https://localhost:5001
   ```

### Erwartete Backend-Endpunkte

Anpassbar in `src/api/endpoints.ts`.

| Methode | Route                | Request                                      | Response                                       |
| ------- | -------------------- | -------------------------------------------- | ---------------------------------------------- |
| POST    | `/api/auth/login`    | `{ login, password }`                        | `{ accessToken, user }` + setzt Refresh-Cookie |
| POST    | `/api/auth/register` | `{ displayName, userName, email, password }` | `{ accessToken, user }` + setzt Refresh-Cookie |
| POST    | `/api/auth/refresh`  | – (Cookie)                                   | `{ accessToken }` + rotiert Refresh-Cookie     |
| POST    | `/api/auth/logout`   | – (Cookie)                                   | 204, löscht Refresh-Cookie                     |
| GET     | `/api/auth/me`       | Bearer Token                                 | `user`                                         |

`user` = `{ id, userName, displayName, email, roles }`

Fehlercodes, die das Frontend auswertet: `400` (ValidationProblemDetails), `401` (falsche Zugangsdaten), `409` (Benutzername/E-Mail vergeben), `423` (Konto gesperrt).

### Wichtig im Backend

- **CORS** mit `AllowCredentials()` und explizitem Origin (kein `*`), sonst sendet der Browser den Cookie nicht.
- **Refresh-Cookie**: `HttpOnly`, `Secure`, `SameSite=Strict` bei gleicher Site, `SameSite=None` bei Frontend und API auf verschiedenen Domains. Pfad am besten auf `/api/auth` einschränken.

## Dateistruktur

```
src/main.tsx
src/App.tsx
src/theme/theme.ts
src/api/endpoints.ts
src/api/httpClient.ts
src/api/authApi.ts
src/api/apiError.ts
src/auth/tokenStore.ts
src/auth/AuthenticationStateProvider.tsx
src/auth/routeGuards.tsx
src/hooks/useFormModel.ts
src/components/layout/AppShell.tsx
src/components/layout/AuthLayout.tsx
src/components/layout/FullPageLoader.tsx
src/components/auth/PasswordField.tsx
src/components/auth/LoginForm.tsx
src/components/auth/RegisterForm.tsx
src/pages/LandingPage.tsx
src/pages/LoginPage.tsx
src/pages/RegisterPage.tsx
src/pages/HomePage.tsx
```

## Quellcode

### `src/main.tsx`

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme/theme";
import { AuthenticationStateProvider } from "./auth/AuthenticationStateProvider";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthenticationStateProvider>
          <App />
        </AuthenticationStateProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
```

### `src/App.tsx`

```tsx
import { Navigate, Route, Routes } from "react-router-dom";
import { RedirectIfAuthenticated, RequireAuth } from "./auth/routeGuards";
import { AppShell } from "./components/layout/AppShell";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";

export default function App() {
  return (
    <Routes>
      {/* Öffentlich, ohne AppBar */}
      <Route element={<RedirectIfAuthenticated />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Geschützt, mit AppBar und Drawer */}
      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route path="/home" element={<HomePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
```

### `src/theme/theme.ts`

```ts
import { createTheme } from "@mui/material/styles";

/**
 * Farben
 *  ink   #1D2B4F  Text, Primärflächen
 *  sun   #FFC845  Hauptaktion (Registrieren)
 *  leaf  #2E9E6B  Erfolg
 *  sky   #EEF4FB  Seitenhintergrund
 *  chalk #FFFFFF  Karten
 */
export const palette = {
  ink: "#1D2B4F",
  sun: "#FFC845",
  leaf: "#2E9E6B",
  sky: "#EEF4FB",
  chalk: "#FFFFFF",
};

const displayFont = '"Fredoka", "Trebuchet MS", system-ui, sans-serif';
const bodyFont = '"Figtree", "Segoe UI", system-ui, sans-serif';

export const theme = createTheme({
  palette: {
    primary: { main: palette.ink, contrastText: palette.chalk },
    secondary: { main: palette.sun, contrastText: palette.ink },
    success: { main: palette.leaf },
    background: { default: palette.sky, paper: palette.chalk },
    text: { primary: palette.ink },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: bodyFont,
    h1: {
      fontFamily: displayFont,
      fontWeight: 600,
      lineHeight: 1.05,
      letterSpacing: "-0.01em",
    },
    h2: { fontFamily: displayFont, fontWeight: 600, lineHeight: 1.1 },
    h3: { fontFamily: displayFont, fontWeight: 600 },
    h4: { fontFamily: displayFont, fontWeight: 600 },
    button: { fontWeight: 600, textTransform: "none", fontSize: "1rem" },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 28 },
        sizeLarge: { minHeight: 56, fontSize: "1.1rem", paddingInline: 36 },
      },
    },
    MuiTextField: {
      defaultProps: { fullWidth: true },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 12, backgroundColor: palette.chalk },
      },
    },
  },
});
```

### `src/api/endpoints.ts`

```ts
/** Alle Auth-Routen an einer Stelle – bei Abweichungen zum Backend nur hier anpassen. */
export const AUTH_ENDPOINTS = {
  login: "/api/auth/login",
  register: "/api/auth/register",
  refresh: "/api/auth/refresh",
  logout: "/api/auth/logout",
  me: "/api/auth/me",
} as const;

export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "";
```

### `src/api/httpClient.ts`

```ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { tokenStore } from "../auth/tokenStore";
import { API_BASE_URL, AUTH_ENDPOINTS } from "./endpoints";

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // nötig, damit der httpOnly-Refresh-Cookie mitgeschickt wird
});

httpClient.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------- Refresh ----------

let refreshPromise: Promise<string | null> | null = null;
let sessionExpiredHandler: (() => void) | null = null;

/** Wird vom AuthenticationStateProvider gesetzt, um bei endgültig abgelaufener Session auszuloggen. */
export function setSessionExpiredHandler(handler: (() => void) | null) {
  sessionExpiredHandler = handler;
}

/**
 * Holt einen neuen Access Token über den Refresh-Cookie.
 * Parallele Aufrufe teilen sich denselben Request. Das ist wichtig bei
 * Token-Rotation: Ein zweiter Refresh mit demselben Cookie würde sonst scheitern.
 */
export function refreshAccessToken(): Promise<string | null> {
  refreshPromise ??= axios
    .post<{ accessToken: string }>(
      `${API_BASE_URL}${AUTH_ENDPOINTS.refresh}`,
      null,
      {
        withCredentials: true,
      },
    )
    .then((response) => {
      tokenStore.set(response.data.accessToken);
      return response.data.accessToken;
    })
    .catch(() => {
      tokenStore.clear();
      return null;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const NO_REFRESH_URLS: string[] = [
  AUTH_ENDPOINTS.login,
  AUTH_ENDPOINTS.register,
  AUTH_ENDPOINTS.refresh,
  AUTH_ENDPOINTS.logout,
];

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableConfig | undefined;
    const isAuthCall = NO_REFRESH_URLS.some((url) =>
      original?.url?.includes(url),
    );

    if (
      error.response?.status !== 401 ||
      !original ||
      original._retry ||
      isAuthCall
    ) {
      return Promise.reject(error);
    }

    original._retry = true;
    const newToken = await refreshAccessToken();

    if (!newToken) {
      sessionExpiredHandler?.();
      return Promise.reject(error);
    }

    original.headers.Authorization = `Bearer ${newToken}`;
    return httpClient(original);
  },
);
```

### `src/api/authApi.ts`

```ts
import { httpClient } from "./httpClient";
import { AUTH_ENDPOINTS } from "./endpoints";

export interface AuthUser {
  id: number;
  userName: string;
  displayName: string;
  email: string | null;
  roles: string[];
}

export interface LoginRequest {
  /** Benutzername oder E-Mail */
  login: string;
  /** Passwort oder PIN */
  password: string;
}

export interface RegisterRequest {
  displayName: string;
  userName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export const authApi = {
  login: (request: LoginRequest) =>
    httpClient
      .post<AuthResponse>(AUTH_ENDPOINTS.login, request)
      .then((r) => r.data),

  register: (request: RegisterRequest) =>
    httpClient
      .post<AuthResponse>(AUTH_ENDPOINTS.register, request)
      .then((r) => r.data),

  logout: () => httpClient.post<void>(AUTH_ENDPOINTS.logout),

  me: () => httpClient.get<AuthUser>(AUTH_ENDPOINTS.me).then((r) => r.data),
};
```

### `src/api/apiError.ts`

```ts
import axios from "axios";

export interface ParsedApiError {
  /** Meldung für den Kopf des Formulars */
  message: string;
  /** Feldfehler aus ASP.NET ValidationProblemDetails, Schlüssel in camelCase */
  fieldErrors: Record<string, string>;
}

type Context = "login" | "register";

const MESSAGES = {
  network:
    "Keine Verbindung zum Server. Prüfe deine Internetverbindung und versuche es erneut.",
  invalidCredentials: "Benutzername oder Passwort ist falsch.",
  locked: "Zu viele Fehlversuche. Das Konto ist für ein paar Minuten gesperrt.",
  conflict: "Benutzername oder E-Mail-Adresse ist bereits vergeben.",
  validation: "Bitte prüfe die markierten Felder.",
  unknown: "Das hat nicht geklappt. Versuche es in einem Moment noch einmal.",
};

function toCamelCase(key: string) {
  return key.charAt(0).toLowerCase() + key.slice(1);
}

export function parseApiError(
  error: unknown,
  context: Context,
): ParsedApiError {
  if (!axios.isAxiosError(error)) {
    return { message: MESSAGES.unknown, fieldErrors: {} };
  }

  if (!error.response) {
    return { message: MESSAGES.network, fieldErrors: {} };
  }

  const { status, data } = error.response;

  if (status === 400 && data?.errors && typeof data.errors === "object") {
    const fieldErrors: Record<string, string> = {};
    for (const [key, value] of Object.entries(
      data.errors as Record<string, string[]>,
    )) {
      fieldErrors[toCamelCase(key)] = Array.isArray(value)
        ? value[0]
        : String(value);
    }
    return { message: MESSAGES.validation, fieldErrors };
  }

  if (status === 401 && context === "login") {
    return { message: MESSAGES.invalidCredentials, fieldErrors: {} };
  }
  if (status === 423) {
    return { message: MESSAGES.locked, fieldErrors: {} };
  }
  if (status === 409 && context === "register") {
    return { message: MESSAGES.conflict, fieldErrors: {} };
  }

  return { message: MESSAGES.unknown, fieldErrors: {} };
}
```

### `src/auth/tokenStore.ts`

```ts
/**
 * Access Token liegt bewusst nur im Arbeitsspeicher (nicht in localStorage),
 * damit er per XSS nicht dauerhaft abgegriffen werden kann.
 * Nach einem Reload wird er über den Refresh-Token-Cookie neu geholt.
 */
let accessToken: string | null = null;

export const tokenStore = {
  get: () => accessToken,
  set: (token: string) => {
    accessToken = token;
  },
  clear: () => {
    accessToken = null;
  },
};
```

### `src/auth/AuthenticationStateProvider.tsx`

```tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  authApi,
  type AuthUser,
  type LoginRequest,
  type RegisterRequest,
} from "../api/authApi";
import {
  refreshAccessToken,
  setSessionExpiredHandler,
} from "../api/httpClient";
import { tokenStore } from "./tokenStore";

export type AuthStatus = "loading" | "authenticated" | "anonymous";

export interface AuthenticationState {
  /** "loading", solange beim Start die Session wiederhergestellt wird */
  status: AuthStatus;
  isAuthenticated: boolean;
  /** Der angemeldete Benutzer oder null */
  user: AuthUser | null;
  login: (request: LoginRequest) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthenticationStateContext = createContext<AuthenticationState | null>(
  null,
);

export function AuthenticationStateProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const restoreStarted = useRef(false);

  const startSession = useCallback(
    (accessToken: string, sessionUser: AuthUser) => {
      tokenStore.set(accessToken);
      setUser(sessionUser);
      setStatus("authenticated");
    },
    [],
  );

  const clearSession = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    setStatus("anonymous");
  }, []);

  // Beim Start: Session über den Refresh-Cookie wiederherstellen.
  // Der Ref verhindert einen doppelten Aufruf durch React StrictMode.
  useEffect(() => {
    if (restoreStarted.current) return;
    restoreStarted.current = true;

    (async () => {
      const token = await refreshAccessToken();
      if (!token) {
        clearSession();
        return;
      }
      try {
        startSession(token, await authApi.me());
      } catch {
        clearSession();
      }
    })();
  }, [startSession, clearSession]);

  // Scheitert ein Token-Refresh während der Nutzung, wird hier abgemeldet.
  useEffect(() => {
    setSessionExpiredHandler(clearSession);
    return () => setSessionExpiredHandler(null);
  }, [clearSession]);

  const login = useCallback(
    async (request: LoginRequest) => {
      const response = await authApi.login(request);
      startSession(response.accessToken, response.user);
    },
    [startSession],
  );

  const register = useCallback(
    async (request: RegisterRequest) => {
      const response = await authApi.register(request);
      startSession(response.accessToken, response.user);
    },
    [startSession],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout(); // löscht den Refresh-Cookie serverseitig
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo<AuthenticationState>(
    () => ({
      status,
      isAuthenticated: status === "authenticated",
      user,
      login,
      register,
      logout,
    }),
    [status, user, login, register, logout],
  );

  return (
    <AuthenticationStateContext.Provider value={value}>
      {children}
    </AuthenticationStateContext.Provider>
  );
}

export function useAuthenticationState(): AuthenticationState {
  const context = useContext(AuthenticationStateContext);
  if (!context) {
    throw new Error(
      "useAuthenticationState muss innerhalb von <AuthenticationStateProvider> verwendet werden.",
    );
  }
  return context;
}
```

### `src/auth/routeGuards.tsx`

```tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthenticationState } from "./AuthenticationStateProvider";
import { FullPageLoader } from "../components/layout/FullPageLoader";

/** Nur für angemeldete Benutzer. Merkt sich die Zielseite für die Rückkehr nach dem Login. */
export function RequireAuth() {
  const { status } = useAuthenticationState();
  const location = useLocation();

  if (status === "loading") return <FullPageLoader />;
  if (status === "anonymous") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

/** Landing, Login und Registrierung: Angemeldete werden direkt zur Startseite geleitet. */
export function RedirectIfAuthenticated() {
  const { status } = useAuthenticationState();

  if (status === "loading") return <FullPageLoader />;
  if (status === "authenticated") return <Navigate to="/home" replace />;
  return <Outlet />;
}
```

### `src/hooks/useFormModel.ts`

```ts
import { useCallback, useMemo, useRef, useState } from "react";
import isEqual from "lodash/isEqual";

/** Fehlermeldungen pro Feld. Ein fehlender Eintrag bedeutet: Feld ist gültig. */
export type ValidationErrors<TModel> = Partial<Record<keyof TModel, string>>;

export type ValidationCallback<TModel> = (
  model: TModel,
) => ValidationErrors<TModel>;

export interface FormModel<TModel> {
  /** Aktueller Stand des Formulars */
  model: TModel;
  /** Übernimmt die übergebenen Felder in das Model */
  onChange: (changes: Partial<TModel>) => void;
  /** Setzt auf das Ausgangsmodel zurück, optional auf ein neues */
  resetForm: (nextInitialModel?: TModel) => void;
  /** true, sobald sich das Model vom Ausgangsmodel unterscheidet (tiefer Vergleich) */
  isModified: boolean;
  /** true, wenn der Validierungs-Callback keine Fehler liefert (ohne Callback immer true) */
  isValid: boolean;
  /** Ergebnis des Validierungs-Callbacks für den aktuellen Stand */
  errors: ValidationErrors<TModel>;
}

export function useFormModel<TModel extends object>(
  initialModel: TModel,
  validationCallback?: ValidationCallback<TModel>,
): FormModel<TModel> {
  // Das Ausgangsmodel wird beim ersten Render festgehalten. Ein neues Objekt
  // bei jedem Render des Aufrufers würde sonst isModified dauerhaft verfälschen.
  const initialRef = useRef<TModel>(initialModel);
  const [model, setModel] = useState<TModel>(initialModel);

  const onChange = useCallback((changes: Partial<TModel>) => {
    setModel((current) => ({ ...current, ...changes }));
  }, []);

  const resetForm = useCallback((nextInitialModel?: TModel) => {
    if (nextInitialModel) {
      initialRef.current = nextInitialModel;
    }
    setModel(initialRef.current);
  }, []);

  const isModified = useMemo(
    () => !isEqual(model, initialRef.current),
    [model],
  );

  const errors = useMemo<ValidationErrors<TModel>>(
    () => validationCallback?.(model) ?? {},
    [model, validationCallback],
  );

  const isValid = useMemo(
    () => Object.values(errors).every((message) => !message),
    [errors],
  );

  return { model, onChange, resetForm, isModified, isValid, errors };
}
```

### `src/components/layout/AppShell.tsx`

```tsx
import { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuRounded from "@mui/icons-material/MenuRounded";
import LogoutRounded from "@mui/icons-material/LogoutRounded";
import HomeRounded from "@mui/icons-material/HomeRounded";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthenticationState } from "../../auth/AuthenticationStateProvider";

const DRAWER_WIDTH = 280;

/** Navigationseinträge im Drawer – hier erweitern, sobald weitere Seiten dazukommen. */
const NAV_ITEMS = [{ label: "Startseite", to: "/home", icon: <HomeRounded /> }];

/** Rahmen für alle Seiten nach dem Login: AppBar oben, Drawer links. */
export function AppShell() {
  const { user, logout } = useAuthenticationState();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "background.default" }}>
      <AppBar position="sticky" elevation={0} color="primary">
        <Toolbar sx={{ gap: 1 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(true)}
            aria-label="Menü öffnen"
            aria-controls="main-navigation"
            aria-expanded={drawerOpen}
          >
            <MenuRounded />
          </IconButton>

          <Typography
            component="span"
            sx={{
              fontFamily: '"Fredoka", system-ui, sans-serif',
              fontWeight: 600,
              fontSize: "1.35rem",
            }}
          >
            LernApp
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Stack
            direction="row"
            spacing={1.5}
            sx={{ alignItems: "center", minWidth: 0 }}
          >
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: "secondary.main",
                color: "secondary.contrastText",
              }}
            >
              {user?.displayName?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography
              noWrap
              sx={{ fontWeight: 600, maxWidth: { xs: 120, sm: 240 } }}
            >
              {user?.displayName ?? user?.userName}
            </Typography>
            <Tooltip title="Abmelden">
              <span>
                <IconButton
                  color="inherit"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  aria-label="Abmelden"
                >
                  <LogoutRounded />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        id="main-navigation"
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{ paper: { sx: { width: DRAWER_WIDTH } } }}
      >
        <Toolbar>
          <Typography
            sx={{
              fontFamily: '"Fredoka", system-ui, sans-serif',
              fontWeight: 600,
              fontSize: "1.35rem",
            }}
          >
            LernApp
          </Typography>
        </Toolbar>
        <List component="nav" aria-label="Hauptnavigation" sx={{ px: 1 }}>
          {NAV_ITEMS.map((item) => (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              onClick={() => setDrawerOpen(false)}
              sx={{
                borderRadius: 3,
                "&.active": { bgcolor: "action.selected", fontWeight: 600 },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ px: { xs: 2, sm: 4 }, py: { xs: 3, sm: 5 } }}>
        <Outlet />
      </Box>
    </Box>
  );
}
```

### `src/components/layout/AuthLayout.tsx`

```tsx
import type { ReactNode } from "react";
import { Box, Link, Paper, Stack, Typography } from "@mui/material";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import { Link as RouterLink } from "react-router-dom";

interface AuthLayoutProps {
  title: string;
  intro?: string;
  children: ReactNode;
  footer: ReactNode;
}

/** Rahmen für Login und Registrierung: keine AppBar, Formular horizontal und vertikal zentriert. */
export function AuthLayout({
  title,
  intro,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100dvh",
        bgcolor: "background.default",
        display: "grid",
        placeItems: "center",
        px: 2,
        py: { xs: 3, sm: 5 },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 460 }}>
        <Link
          component={RouterLink}
          to="/"
          underline="hover"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            fontWeight: 600,
            mb: 2,
          }}
        >
          <ArrowBackRounded fontSize="small" />
          Zur Startseite
        </Link>

        <Paper elevation={0} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 6 }}>
          <Stack
            spacing={1}
            sx={{ mb: 4, textAlign: "center", alignItems: "center" }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontSize: { xs: "2rem", sm: "2.4rem" } }}
            >
              {title}
            </Typography>
            {intro && (
              <Typography color="text.secondary" sx={{ maxWidth: "36ch" }}>
                {intro}
              </Typography>
            )}
          </Stack>
          {children}
        </Paper>

        <Box sx={{ textAlign: "center", mt: 3 }}>{footer}</Box>
      </Box>
    </Box>
  );
}
```

### `src/components/layout/FullPageLoader.tsx`

```tsx
import { Box, CircularProgress } from "@mui/material";

export function FullPageLoader() {
  return (
    <Box
      role="status"
      aria-label="Wird geladen"
      sx={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        bgcolor: "background.default",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
```

### `src/components/auth/PasswordField.tsx`

```tsx
import { useState } from "react";
import {
  IconButton,
  InputAdornment,
  TextField,
  type TextFieldProps,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export function PasswordField(props: TextFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      {...props}
      type={visible ? "text" : "password"}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setVisible((v) => !v)}
                edge="end"
                aria-label={
                  visible ? "Passwort verbergen" : "Passwort anzeigen"
                }
              >
                {visible ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
```

### `src/components/auth/LoginForm.tsx`

```tsx
import { useState, type FormEvent } from "react";
import { Alert, Button, Stack, TextField } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthenticationState } from "../../auth/AuthenticationStateProvider";
import { parseApiError } from "../../api/apiError";
import { useFormModel, type ValidationErrors } from "../../hooks/useFormModel";
import { PasswordField } from "./PasswordField";

interface LoginModel {
  login: string;
  password: string;
}

const INITIAL_MODEL: LoginModel = { login: "", password: "" };

// Außerhalb der Komponente, damit die Referenz stabil bleibt.
function validateLogin(model: LoginModel): ValidationErrors<LoginModel> {
  return {
    login: model.login.trim()
      ? undefined
      : "Gib deinen Benutzernamen oder deine E-Mail-Adresse ein.",
    password: model.password
      ? undefined
      : "Gib dein Passwort oder deine PIN ein.",
  };
}

export function LoginForm() {
  const { login } = useAuthenticationState();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo =
    (location.state as { from?: string } | null)?.from ?? "/home";

  const { model, onChange, isValid, errors } = useFormModel(
    INITIAL_MODEL,
    validateLogin,
  );

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<
    ValidationErrors<LoginModel>
  >({});

  // Clientfehler erst nach dem ersten Absenden zeigen, Serverfehler sofort.
  const fieldError = (field: keyof LoginModel) =>
    serverErrors[field] ?? (submitted ? errors[field] : undefined);

  const change = (changes: Partial<LoginModel>) => {
    onChange(changes);
    setServerErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(changes) as (keyof LoginModel)[])
        delete next[key];
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    setFormError(null);
    if (!isValid) return;

    setSubmitting(true);
    try {
      await login({ login: model.login.trim(), password: model.password });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const parsed = parseApiError(error, "login");
      setFormError(parsed.message);
      setServerErrors(parsed.fieldErrors as ValidationErrors<LoginModel>);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack component="form" spacing={2.5} onSubmit={handleSubmit} noValidate>
      {formError && <Alert severity="error">{formError}</Alert>}

      <TextField
        label="Benutzername oder E-Mail"
        autoComplete="username"
        autoFocus
        value={model.login}
        onChange={(e) => change({ login: e.target.value })}
        error={!!fieldError("login")}
        helperText={fieldError("login")}
      />

      <PasswordField
        label="Passwort oder PIN"
        autoComplete="current-password"
        value={model.password}
        onChange={(e) => change({ password: e.target.value })}
        error={!!fieldError("password")}
        helperText={
          fieldError("password") ?? "Kinder melden sich mit ihrer PIN an."
        }
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={submitting}
      >
        {submitting ? "Wird angemeldet …" : "Anmelden"}
      </Button>
    </Stack>
  );
}
```

### `src/components/auth/RegisterForm.tsx`

```tsx
import { useState, type FormEvent } from "react";
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Stack,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthenticationState } from "../../auth/AuthenticationStateProvider";
import { parseApiError } from "../../api/apiError";
import { useFormModel, type ValidationErrors } from "../../hooks/useFormModel";
import { PasswordField } from "./PasswordField";

interface RegisterModel {
  displayName: string;
  userName: string;
  email: string;
  password: string;
  passwordConfirm: string;
  privacyAccepted: boolean;
}

const INITIAL_MODEL: RegisterModel = {
  displayName: "",
  userName: "",
  email: "",
  password: "",
  passwordConfirm: "",
  privacyAccepted: false,
};

const USERNAME_PATTERN = /^[a-zA-Z0-9._-]{3,64}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

// Außerhalb der Komponente, damit die Referenz stabil bleibt.
function validateRegister(
  model: RegisterModel,
): ValidationErrors<RegisterModel> {
  return {
    displayName: model.displayName.trim()
      ? undefined
      : "Gib an, wie wir dich ansprechen sollen.",
    userName: USERNAME_PATTERN.test(model.userName)
      ? undefined
      : "3 bis 64 Zeichen: Buchstaben, Zahlen, Punkt, Binde- oder Unterstrich.",
    email: EMAIL_PATTERN.test(model.email.trim())
      ? undefined
      : "Gib eine gültige E-Mail-Adresse ein.",
    password:
      model.password.length >= MIN_PASSWORD_LENGTH
        ? undefined
        : `Das Passwort braucht mindestens ${MIN_PASSWORD_LENGTH} Zeichen.`,
    passwordConfirm:
      model.passwordConfirm === model.password
        ? undefined
        : "Die Passwörter stimmen nicht überein.",
    privacyAccepted: model.privacyAccepted
      ? undefined
      : "Bitte stimme der Datenschutzerklärung zu.",
  };
}

export function RegisterForm() {
  const { register } = useAuthenticationState();
  const navigate = useNavigate();

  const { model, onChange, isValid, errors } = useFormModel(
    INITIAL_MODEL,
    validateRegister,
  );

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<
    ValidationErrors<RegisterModel>
  >({});

  // Clientfehler erst nach dem ersten Absenden zeigen, Serverfehler sofort.
  const fieldError = (field: keyof RegisterModel) =>
    serverErrors[field] ?? (submitted ? errors[field] : undefined);

  const change = (changes: Partial<RegisterModel>) => {
    onChange(changes);
    setServerErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(changes) as (keyof RegisterModel)[])
        delete next[key];
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    setFormError(null);
    if (!isValid) return;

    setSubmitting(true);
    try {
      await register({
        displayName: model.displayName.trim(),
        userName: model.userName.trim(),
        email: model.email.trim(),
        password: model.password,
      });
      navigate("/home", { replace: true });
    } catch (error) {
      const parsed = parseApiError(error, "register");
      setFormError(parsed.message);
      setServerErrors(parsed.fieldErrors as ValidationErrors<RegisterModel>);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack component="form" spacing={2.5} onSubmit={handleSubmit} noValidate>
      {formError && <Alert severity="error">{formError}</Alert>}

      <TextField
        label="Anzeigename"
        autoComplete="nickname"
        autoFocus
        value={model.displayName}
        onChange={(e) => change({ displayName: e.target.value })}
        error={!!fieldError("displayName")}
        helperText={
          fieldError("displayName") ??
          "So sehen dich deine Kinder, z. B. „Mama“."
        }
      />

      <TextField
        label="Benutzername"
        autoComplete="username"
        value={model.userName}
        onChange={(e) => change({ userName: e.target.value })}
        error={!!fieldError("userName")}
        helperText={fieldError("userName")}
      />

      <TextField
        label="E-Mail-Adresse"
        type="email"
        autoComplete="email"
        value={model.email}
        onChange={(e) => change({ email: e.target.value })}
        error={!!fieldError("email")}
        helperText={fieldError("email")}
      />

      <PasswordField
        label="Passwort"
        autoComplete="new-password"
        value={model.password}
        onChange={(e) => change({ password: e.target.value })}
        error={!!fieldError("password")}
        helperText={
          fieldError("password") ?? `Mindestens ${MIN_PASSWORD_LENGTH} Zeichen.`
        }
      />

      <PasswordField
        label="Passwort wiederholen"
        autoComplete="new-password"
        value={model.passwordConfirm}
        onChange={(e) => change({ passwordConfirm: e.target.value })}
        error={!!fieldError("passwordConfirm")}
        helperText={fieldError("passwordConfirm")}
      />

      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={model.privacyAccepted}
              onChange={(e) => change({ privacyAccepted: e.target.checked })}
            />
          }
          label="Ich habe die Datenschutzerklärung gelesen und stimme ihr zu."
        />
        {fieldError("privacyAccepted") && (
          <FormHelperText error>{fieldError("privacyAccepted")}</FormHelperText>
        )}
      </div>

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={submitting}
      >
        {submitting ? "Konto wird erstellt …" : "Konto erstellen"}
      </Button>
    </Stack>
  );
}
```

### `src/pages/LandingPage.tsx`

```tsx
import { Box, Button, Stack, Typography } from "@mui/material";
import { keyframes } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import { palette } from "../theme/theme";

/** Bild in public/images/ ablegen. Querformat, mind. 2400 px breit. */
const BACKGROUND_IMAGE = "/images/landing-bg.jpg";

const slowZoom = keyframes`
  from { transform: scale(1); }
  to   { transform: scale(1.08); }
`;

export function LandingPage() {
  return (
    <Box
      component="main"
      sx={{
        position: "relative",
        minHeight: "100dvh",
        overflow: "hidden",
        color: palette.chalk,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Hintergrund: eigene Ebene, damit nur das Bild zoomt und nicht der Inhalt */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${BACKGROUND_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: palette.ink, // sichtbar, solange das Bild lädt
          transformOrigin: "center",
          willChange: "transform",
          animation: `${slowZoom} 20s ease-in-out infinite alternate`,
          "@media (prefers-reduced-motion: reduce)": { animation: "none" },
        }}
      />

      {/* Verlauf für lesbaren Text, unabhängig vom Motiv */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(20deg, ${palette.ink}F2 0%, ${palette.ink}B3 35%, ${palette.ink}00 75%)`,
        }}
      />

      <Box
        sx={{
          position: "relative",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          px: { xs: 3, sm: 6, md: 10 },
          pt: { xs: 3, sm: 5 },
          pb: { xs: 5, sm: 8, md: 10 },
        }}
      >
        <Typography
          component="p"
          sx={{
            fontFamily: '"Fredoka", system-ui, sans-serif',
            fontWeight: 600,
            fontSize: "1.5rem",
          }}
        >
          LernApp
        </Typography>

        <Stack spacing={{ xs: 3, sm: 4 }} sx={{ maxWidth: 720 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.75rem", sm: "4rem", md: "5rem" },
              textWrap: "balance",
            }}
          >
            Lernen, wie es zu eurer Familie passt.
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "1.1rem", sm: "1.3rem" },
              maxWidth: "36ch",
              opacity: 0.9,
            }}
          >
            Ihr erstellt die Aufgaben, eure Kinder üben in ihrem eigenen Tempo.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ pt: 1 }}
          >
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              color="secondary"
              size="large"
              sx={{ minWidth: 200 }}
            >
              Registrieren
            </Button>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              size="large"
              sx={{
                minWidth: 200,
                color: palette.chalk,
                borderColor: `${palette.chalk}B3`,
                borderWidth: 2,
                "&:hover": {
                  borderColor: palette.chalk,
                  borderWidth: 2,
                  bgcolor: `${palette.chalk}1A`,
                },
              }}
            >
              Anmelden
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
```

### `src/pages/LoginPage.tsx`

```tsx
import { Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { AuthLayout } from "../components/layout/AuthLayout";
import { LoginForm } from "../components/auth/LoginForm";

export function LoginPage() {
  return (
    <AuthLayout
      title="Anmelden"
      footer={
        <Typography>
          Noch kein Konto?{" "}
          <Link component={RouterLink} to="/register" fontWeight={600}>
            Jetzt registrieren
          </Link>
        </Typography>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
```

### `src/pages/RegisterPage.tsx`

```tsx
import { Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { AuthLayout } from "../components/layout/AuthLayout";
import { RegisterForm } from "../components/auth/RegisterForm";

export function RegisterPage() {
  return (
    <AuthLayout
      title="Konto erstellen"
      intro="Für Eltern. Die Zugänge für eure Kinder legt ihr danach selbst an, ganz ohne E-Mail-Adresse."
      footer={
        <Typography>
          Schon registriert?{" "}
          <Link component={RouterLink} to="/login" fontWeight={600}>
            Anmelden
          </Link>
        </Typography>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}
```

### `src/pages/HomePage.tsx`

```tsx
import { Box, Typography } from "@mui/material";
import { useAuthenticationState } from "../auth/AuthenticationStateProvider";

/** Startseite nach dem Login. AppBar und Drawer kommen aus dem AppShell. */
export function HomePage() {
  const { user } = useAuthenticationState();

  return (
    <Box sx={{ maxWidth: 960, mx: "auto" }}>
      <Typography variant="h4" component="h1">
        Hallo, {user?.displayName}!
      </Typography>
    </Box>
  );
}
```
