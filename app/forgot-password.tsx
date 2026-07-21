import PublicRoute from "@/components/PublicRoute";
import Spacer from "@/components/Spacer";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedCard } from "@/components/ThemedCard";
import { ThemedText } from "@/components/ThemedText";
import ThemedTextInput from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColors } from "@/context";
import { useUser } from "@/hooks/useUser";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
  const { theme } = useThemeColors();
  const insets = useSafeAreaInsets();
  const { resetPassword } = useUser();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    setError("");
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicRoute>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ThemedView style={[styles.container, { paddingTop: insets.top + 12 }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </Pressable>

          <Spacer height={32} />

          {sent ? (
            <View style={styles.successWrap}>
              <Ionicons
                name="checkmark-circle-outline"
                size={64}
                color={theme.tint}
              />
              <Spacer height={24} />
              <ThemedText style={styles.title}>Check your inbox</ThemedText>
              <Spacer height={12} />
              <ThemedText style={[styles.subtitle, { textAlign: "center" }]}>
                We sent a password reset link to{" "}
                <ThemedText style={{ fontWeight: "700" }}>{email}</ThemedText>.
                Check your email and follow the instructions.
              </ThemedText>
              <Spacer height={32} />
              <Pressable onPress={() => router.replace("/login")}>
                <ThemedText
                  style={{ color: theme.tint, fontWeight: "600" }}
                >
                  Back to Login
                </ThemedText>
              </Pressable>
            </View>
          ) : (
            <>
              <ThemedText style={styles.title}>Forgot Password?</ThemedText>
              <Spacer height={8} />
              <ThemedText style={styles.subtitle}>
                Enter your email and we&apos;ll send you a reset link.
              </ThemedText>

              <Spacer height={28} />

              <ThemedText style={styles.label}>Email</ThemedText>
              <ThemedTextInput
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />

              <Spacer height={20} />

              <ThemedButton
                title="Send Reset Link"
                fullWidth
                loading={loading}
                onPress={handleSend}
              />

              {error ? (
                <>
                  <Spacer height={12} />
                  <ThemedCard style={{ backgroundColor: "#d1001f", padding: 12 }}>
                    <ThemedText style={{ color: "#fff9f9" }}>{error}</ThemedText>
                  </ThemedCard>
                </>
              ) : null}

              <Spacer height={20} />

              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <ThemedText>Remembered it? </ThemedText>
                <Pressable onPress={() => router.replace("/login")}>
                  <ThemedText type="defaultSemiBold">Sign In</ThemedText>
                </Pressable>
              </View>
            </>
          )}
        </ThemedView>
      </TouchableWithoutFeedback>
    </PublicRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backBtn: {
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 36,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
  label: {
    marginBottom: 6,
  },
  successWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
