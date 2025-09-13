import { AppProviders } from "@/providers/AppProviders";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <AppProviders>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }} />
    </AppProviders>
  );
}
