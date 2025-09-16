import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    login("testUser", "testPassword");
    router.replace("/(tabs)/menu");
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">A&Y Sippop</ThemedText>
      <ThemedButton title="Click here to start" onPress={handleLogin} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 20 },
});
