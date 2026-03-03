import { Button } from "@mui/material";
import { useThemeMode } from "../../hooks/useThemeMode";

export function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useThemeMode();

  return (
    <Button color="inherit" onClick={toggleDarkMode}>
      {darkMode ? "Светлая тема" : "Тёмная тема"}
    </Button>
  );
}