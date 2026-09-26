import type { ResolvedThemeMode } from "src/lib/theme/types/ResolvedThemeMode";
import type { ThemeMode } from "src/lib/theme/types/ThemeMode";

export interface ThemeModeState {
  /** The chosen mode, including "system". */
  mode: ThemeMode;
  /** The mode actually shown, with "system" resolved to light or dark. */
  resolvedMode: ResolvedThemeMode;
  setMode: (mode: ThemeMode) => void;
}
