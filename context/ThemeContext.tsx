import { darkColors, lightColors } from "@/theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Appearance, Platform } from "react-native";

interface ThemeContextType {
  theme: typeof darkColors | typeof lightColors;
  isDark: boolean;
  toggleTheme: () => void;
  isSystemTheme: boolean;
  resetToSystemTheme: () => void;
  forceSystemThemeDetection: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const THEME_STORAGE_KEY = "@sippop_theme_preference";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [isSystemTheme, setIsSystemTheme] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme on app start
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        const appTheme = Constants.expoConfig?.userInterfaceStyle;
        const systemColorScheme = Appearance.getColorScheme();
        
        // Check if user has manually set a preference
        const savedPreference = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        
        if (savedPreference) {
          // User has manually set a preference
          const { isDark: savedIsDark, isSystemTheme: savedIsSystemTheme } = JSON.parse(savedPreference);
          setIsDark(savedIsDark);
          setIsSystemTheme(savedIsSystemTheme);
        } else {
          // No saved preference, use system theme if app is set to automatic
          if (appTheme === "automatic") {
            // For Android, we need to be more careful about theme detection
            let shouldUseDark = false;
            
            if (Platform.OS === "android") {
              // Android-specific theme detection
              if (systemColorScheme === "dark") {
                shouldUseDark = true;
              } else if (systemColorScheme === "light") {
                shouldUseDark = false;
              } else {
                // Fallback: check if we're in a dark environment
                // This is a workaround for Android devices that don't report theme properly
                shouldUseDark = false; // Default to light theme
              }
            } else {
              // iOS theme detection
              shouldUseDark = systemColorScheme === "dark";
            }
            
            setIsDark(shouldUseDark);
            setIsSystemTheme(true);
          } else {
            setIsDark(appTheme === "dark");
            setIsSystemTheme(false);
          }
        }
      } catch (error) {
        console.error("Error initializing theme:", error);
        // Fallback to system theme
        const systemColorScheme = Appearance.getColorScheme();
        setIsDark(systemColorScheme === "dark");
        setIsSystemTheme(true);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeTheme();
  }, []);

  // Listen for system theme changes (only when using system theme)
  useEffect(() => {
    if (!isInitialized) return;

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (isSystemTheme) {
        let shouldUseDark = false;
        
        if (Platform.OS === "android") {
          // Android-specific handling
          if (colorScheme === "dark") {
            shouldUseDark = true;
          } else if (colorScheme === "light") {
            shouldUseDark = false;
          } else {
            return;
          }
        } else {
          // iOS handling
          shouldUseDark = colorScheme === "dark";
        }
        
        setIsDark(shouldUseDark);
      }
    });

    return () => subscription?.remove();
  }, [isSystemTheme, isInitialized]);

  const toggleTheme = async () => {
    const newIsDark = !isDark;
    const newIsSystemTheme = false; // Manual toggle means no longer following system
    
    setIsDark(newIsDark);
    setIsSystemTheme(newIsSystemTheme);
    
    // Save preference
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({
        isDark: newIsDark,
        isSystemTheme: newIsSystemTheme
      }));
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  const resetToSystemTheme = async () => {
    const systemColorScheme = Appearance.getColorScheme();
    
    let newIsDark = false;
    
    if (Platform.OS === "android") {
      // Android-specific theme detection
      if (systemColorScheme === "dark") {
        newIsDark = true;
      } else if (systemColorScheme === "light") {
        newIsDark = false;
      } else {
        // Fallback for unclear Android theme detection
        newIsDark = false;
      }
    } else {
      // iOS theme detection
      newIsDark = systemColorScheme === "dark";
    }
    
    const newIsSystemTheme = true;
    
    setIsDark(newIsDark);
    setIsSystemTheme(newIsSystemTheme);
    
    // Save preference
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({
        isDark: newIsDark,
        isSystemTheme: newIsSystemTheme
      }));
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  const forceSystemThemeDetection = async () => {
    
    // Clear any saved preferences to force system detection
    try {
      await AsyncStorage.removeItem(THEME_STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing theme preferences:", error);
    }
    
    // Re-initialize theme detection
    const systemColorScheme = Appearance.getColorScheme();
    
    let newIsDark = false;
    
    if (Platform.OS === "android") {
      // Android-specific theme detection
      if (systemColorScheme === "dark") {
        newIsDark = true;
      } else if (systemColorScheme === "light") {
        newIsDark = false;
      } else {
        // For Android, if we can't detect, let's try a different approach
        // We'll default to light but log the issue
        newIsDark = false;
      }
    } else {
      // iOS theme detection
      newIsDark = systemColorScheme === "dark";
    }
    
    setIsDark(newIsDark);
    setIsSystemTheme(true);
  };

  const theme = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, isSystemTheme, resetToSystemTheme, forceSystemThemeDetection }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeColors = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeColors must be used within ThemeProvider");
  return ctx;
};
