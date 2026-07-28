import { AppTheme, DEFAULT_THEME_ID, THEMES, ThemeColors } from "@/theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  theme: ThemeColors;
  themeId: string;
  isDark: boolean;
  themes: AppTheme[];
  setThemeId: (id: string) => void;
  backgroundGradient: [string, string];
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const THEME_STORAGE_KEY = "@sippop_theme_id";

function resolveTheme(id: string): AppTheme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState(DEFAULT_THEME_ID);

  useEffect(() => {
    const loadThemeId = async () => {
      try {
        const savedId = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedId && THEMES.some((t) => t.id === savedId)) {
          setThemeIdState(savedId);
        }
      } catch (error) {
        console.error("Error loading theme preference:", error);
      }
    };

    loadThemeId();
  }, []);

  const setThemeId = (id: string) => {
    setThemeIdState(id);
    AsyncStorage.setItem(THEME_STORAGE_KEY, id).catch((error) => {
      console.error("Error saving theme preference:", error);
    });
  };

  const activeTheme = resolveTheme(themeId);

  return (
    <ThemeContext.Provider
      value={{
        theme: activeTheme.colors,
        themeId: activeTheme.id,
        isDark: activeTheme.isDark,
        themes: THEMES,
        setThemeId,
        backgroundGradient: activeTheme.backgroundGradient,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeColors = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeColors must be used within ThemeProvider");
  return ctx;
};
