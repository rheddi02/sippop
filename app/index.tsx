import ThemedLoader from "@/components/ThemedLoader";
import { ThemedView } from "@/components/ThemedView";
import { useUser } from "@/hooks/useUser";
import { Redirect } from "expo-router";
import "react-native-url-polyfill/auto";

export default function IndexScreen() {
  const { user, isAuthChecked } = useUser();

  // Show loading while checking authentication
  if (!isAuthChecked) {
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ThemedLoader />
      </ThemedView>
    );
  }

  // Redirect based on authentication status
  if (user) {
    return <Redirect href="/(tabs)/menu" />;
  } else {
    return <Redirect href="/login" />;
  }
}
