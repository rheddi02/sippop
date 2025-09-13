import { darkColors, lightColors } from "@/theme/colors";
import Constants from "expo-constants";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface ThemeContextType {
  theme: typeof darkColors | typeof lightColors;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const appTheme = Constants.expoConfig?.userInterfaceStyle || "light";
  const [isDark, setIsDark] = useState(appTheme === "dark");

  const toggleTheme = () => setIsDark((prev) => !prev);
  const theme = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeColors = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeColors must be used within ThemeProvider");
  return ctx;
};
