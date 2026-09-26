import { useColorScheme } from "@mui/material/styles";
import type { ThemeModeState } from "src/lib/theme/types/ThemeModeState";

const useThemeMode = (): ThemeModeState => {
  const { mode, systemMode, setMode } = useColorScheme();
  const currentMode = mode ?? "system";
  const resolvedMode = currentMode === "system" ? systemMode : currentMode;

  return {
    mode: currentMode,
    resolvedMode: resolvedMode ?? "light",
    setMode: (value) => {
      setMode(value);
    },
  };
};

export default useThemeMode;
