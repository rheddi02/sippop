import { useThemeColors } from "@/context/ThemeContext";
import { AppProviders } from "@/providers/AppProviders";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Updates from "expo-updates";
import { useEffect } from "react";
import { Alert } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
          Alert.alert(
          "Update Available",
          "App will restart to apply updates.",
          [
            {
              text: "Update",
              onPress: () => Updates.reloadAsync(),
            },
          ]
        );
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
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="item/[id]"
          options={{ animation: "fade_from_bottom", animationDuration: 220 }}
        />
        <Stack.Screen
          name="category/[id]"
          options={{ animation: "fade_from_bottom", animationDuration: 220 }}
        />
        <Stack.Screen
          name="notifications"
          options={{ animation: "fade_from_bottom", animationDuration: 220 }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProviders>
        <AppContent />
      </AppProviders>
    </GestureHandlerRootView>
  );
}
