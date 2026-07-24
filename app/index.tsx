import ThemedLoader from "@/components/ThemedLoader";
import { ThemedView } from "@/components/ThemedView";
import { useUser } from "@/hooks/useUser";
import { Redirect } from "expo-router";
import "react-native-url-polyfill/auto";

export default function IndexScreen() {
  const { user, pendingEmail, isAuthChecked } = useUser();

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

  // Supabase only ever grants a session to a confirmed (or confirmation-not-
  // required) account, so a present `user` is always already verified.
  if (user) {
    return <Redirect href="/(tabs)/menu" />;
  } else if (pendingEmail) {
    return <Redirect href="/verify-email" />;
  } else {
    return <Redirect href="/(tabs)/menu" />;
  }
}
