import PublicRoute from "@/components/PublicRoute";
import Spacer from "@/components/Spacer";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import ThemedTextInput from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColors } from "@/context";
import { useUser } from "@/hooks/useUser";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function SocialButton({
  icon,
  color,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.socialBtn,
        { opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <Ionicons
        name={icon}
        size={20}
        style={{ marginRight: 10 }}
        color={color}
      />
      <ThemedText>{label}</ThemedText>
    </Pressable>
  );
}

const RegisterScreen = () => {
  const { theme } = useThemeColors();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState("");

  const { register } = useUser();
  const handleRegister = async () => {
    try {
      await register(email, password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setErrors(message);
    }
  };
  return (
    <PublicRoute>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ThemedView style={[styles.container, { paddingTop: insets.top + 12 }]}>
          <Spacer height={28} />
          <View>
            <ThemedText style={styles.title}>Sign Up</ThemedText>
            <ThemedText style={styles.subtitle}>
              Create an account to continue!
            </ThemedText>
          </View>

          <Spacer height={16} />

          <View>
            <ThemedText style={styles.label}>Email</ThemedText>
            <ThemedTextInput
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <Spacer height={16} />

          <View>
            <ThemedText style={styles.label}>Password</ThemedText>
            <View style={{ position: "relative" }}>
              <ThemedTextInput
                placeholder="Password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable
                onPress={() => setShowPassword((p) => !p)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color={theme.text}
                />
              </Pressable>
            </View>
          </View>

          <Spacer height={20} />

          <ThemedButton title="Register" fullWidth onPress={handleRegister} />

          <Spacer height={20} />
          {errors && <ThemedText style={{ color: "red" }}>{errors}</ThemedText>}

          <View style={styles.separatorRow}>
            <View style={styles.separatorLine} />
            <ThemedText>Or</ThemedText>
            <View style={styles.separatorLine} />
          </View>

          <Spacer height={20} />

          <SocialButton
            icon="logo-google"
            color={theme.text}
            label="Continue with Google"
            onPress={() => Alert.alert("Not yet implemented")}
          />

          <SocialButton
            icon="logo-facebook"
            color={theme.text}
            label="Continue with Facebook"
            onPress={() => Alert.alert("Not yet implemented")}
          />

          <Spacer height={12} />

          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <ThemedText>Already have an account? </ThemedText>
            <Pressable onPress={() => router.push("/login")}>
              <ThemedText type="defaultSemiBold">Sign In</ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </TouchableWithoutFeedback>
    </PublicRoute>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#3b82f6",
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 38,
  },
  subtitle: {
    marginTop: 12,
  },
  label: {
    marginBottom: 6,
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: 14,
  },
  separatorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 16,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(150,150,150,0.2)",
  },
  socialBtn: {
    borderWidth: 1,
    borderColor: "rgba(150,150,150,0.3)",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
});
