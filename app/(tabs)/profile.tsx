import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ThemedText style={{ fontSize: 18 }}>Hello, {user?.name}</ThemedText>
      <ThemedButton title="Logout" onPress={handleLogout} style={{ borderRadius: 50, width: '80%'}} />
    </ThemedView>
  );
}
