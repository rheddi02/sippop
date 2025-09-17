import { useThemeColors } from "@/context/ThemeContext";
import { AppProviders } from "@/providers/AppProviders";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Updates from "expo-updates";
import { useEffect } from "react";

function AppContent() {
  const { isDark } = useThemeColors();

  useEffect(() => {
    async function checkForUpdates() {
      try {
        if (__DEV__) {
          return; // Skip updates in development
        }
        
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        console.log("Error checking for updates:", error);
      }
    }

    checkForUpdates();
  }, []);

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}
