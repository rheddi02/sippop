import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "expo-router";
import { useThemeColors } from "../../context/ThemeContext";

export default function ProfileScreen() {
  const { user, logout } = useUser();
  const {
    isDark,
    toggleTheme,
    isSystemTheme,
    resetToSystemTheme,
    forceSystemThemeDetection,
  } = useThemeColors();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <ThemedText
        style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}
      >
        Profile
      </ThemedText>

      <ThemedText
        style={{ fontSize: 18, marginBottom: 30, textAlign: "center" }}
      >
        Hello, {user?.name || user?.email || "Guest"}!
      </ThemedText>

      <ThemedView style={{ width: "100%", marginBottom: 30 }}>
        <ThemedText
          style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
        >
          Theme Settings
        </ThemedText>
        <ThemedText style={{ fontSize: 14, marginBottom: 10, opacity: 0.7 }}>
          Current: {isDark ? "Dark" : "Light"}{" "}
          {isSystemTheme ? "(System)" : "(Manual)"}
        </ThemedText>

        <ThemedButton
          title={isDark ? "Switch to Light" : "Switch to Dark"}
          onPress={toggleTheme}
          style={{ borderRadius: 50, width: "100%", marginBottom: 10 }}
        />

        {!isSystemTheme && (
          <ThemedButton
            title="Reset to System Theme"
            onPress={resetToSystemTheme}
            style={{ borderRadius: 50, width: "100%", marginBottom: 10 }}
          />
        )}

        <ThemedButton
          title="Force System Theme Detection"
          onPress={forceSystemThemeDetection}
          style={{ borderRadius: 50, width: "100%" }}
        />
      </ThemedView>

      <ThemedButton
        title="Logout"
        onPress={handleLogout}
        style={{ borderRadius: 50, width: "80%" }}
      />
    </ThemedView>
  );
}
