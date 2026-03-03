import { createContext } from "react";

export const ThemeModeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
});