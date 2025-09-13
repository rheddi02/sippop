import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18 }}>Hello, {user?.name}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
