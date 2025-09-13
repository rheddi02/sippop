import React, { createContext, useContext, useState, ReactNode } from "react";
import { useColorScheme } from "react-native";
import { lightColors, darkColors } from "./colors";

const ThemeContext = createContext<any>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme(); // auto detect
  const [isDark, setIsDark] = useState(scheme === "dark");

  const toggleTheme = () => setIsDark((prev) => !prev);

  const theme = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeColors = () => useContext(ThemeContext);
