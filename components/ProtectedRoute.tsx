import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useUser } from "@/hooks/useUser";
import { router } from "expo-router";
import ThemedLoader from "./ThemedLoader";

function DefaultLoggedOutNotice() {
  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <ThemedText style={{ fontSize: 16, marginBottom: 16, textAlign: "center" }}>
        Log in to view this.
      </ThemedText>
      <ThemedButton
        title="Go to Profile to log in"
        onPress={() => router.push("/(tabs)/profile")}
      />
    </ThemedView>
  );
}

const ProtectedRoute = ({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => {
  const { user, isAuthChecked } = useUser();

  if (!isAuthChecked) {
    return <ThemedLoader />;
  }
  if (!user) {
    return fallback ?? <DefaultLoggedOutNotice />;
  }
  return children;
};

export default ProtectedRoute;
