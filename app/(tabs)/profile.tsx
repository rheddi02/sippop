import { LoginForm } from "@/components/LoginForm";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScreenHeader from "@/components/ScreenHeader";
import Spacer from "@/components/Spacer";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedCard } from "@/components/ThemedCard";
import { ThemedText } from "@/components/ThemedText";
import ThemedTextInput from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import ThemeSelectSheet, { ThemeSwatch } from "@/components/ThemeSelectSheet";
import { useThemeColors } from "@/context";
import { useProfile } from "@/hooks/useProfile";
import { useUser } from "@/hooks/useUser";
import { formatPesoForCart } from "@/utils/amountHelper";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

export default function ProfileScreen() {
  const {
    user,
    logout,
    isEmailVerified,
    sendVerificationEmail,
    canChangePassword,
    changePassword,
  } = useUser();
  const { profile, loading: profileLoading, reload } = useProfile();
  const { theme, themeId, themes, setThemeId } = useThemeColors();
  const router = useRouter();

  const [themeSheetVisible, setThemeSheetVisible] = useState(false);
  const activeTheme = themes.find((t) => t.id === themeId) ?? themes[0];

  const [resendState, setResendState] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [resendError, setResendError] = useState("");

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useFocusEffect(
    useCallback(() => {
      reload();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  const handleResend = async () => {
    setResendState("sending");
    setResendError("");
    try {
      await sendVerificationEmail();
      setResendState("sent");
    } catch (err) {
      setResendError(err instanceof Error ? err.message : String(err));
      setResendState("error");
    }
  };

  const resetPasswordForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setPasswordSuccess(false);
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess(false);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }
    setPasswordSubmitting(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : String(err));
    } finally {
      setPasswordSubmitting(false);
    }
  };

  return (
    <ThemedView style={{ flex: 1 }} gradient>
      <ScreenHeader title="Profile" />
      <ProtectedRoute
        fallback={
          <LoginForm subtitle="Log in to view your loyalty points, credit, and account settings." />
        }
      >
        <ScrollView
          style={{ flex: 1, backgroundColor: "transparent" }}
          contentContainerStyle={styles.container}
        >
          <ThemedText type="subtitle" style={styles.email}>
            {user?.email || "Guest"}
          </ThemedText>

          {!isEmailVerified && (
            <ThemedCard style={styles.card}>
              <ThemedText type="caption" style={{ color: theme.danger }}>
                Email not verified
              </ThemedText>
              <Spacer height={8} />
              {resendState === "sent" ? (
                <ThemedText type="caption" style={{ color: theme.muted }}>
                  Verification email sent — check your inbox.
                </ThemedText>
              ) : (
                <ThemedButton
                  title="Resend verification email"
                  variant="outline"
                  size="sm"
                  loading={resendState === "sending"}
                  onPress={handleResend}
                />
              )}
              {resendState === "error" && (
                <>
                  <Spacer height={8} />
                  <ThemedText type="caption" style={{ color: theme.danger }}>
                    {resendError}
                  </ThemedText>
                </>
              )}
            </ThemedCard>
          )}

          <ThemedCard style={styles.card}>
            <ThemedText type="defaultSemiBold">Rewards</ThemedText>
            <Spacer height={10} />
            {profileLoading && !profile ? (
              <ThemedText type="caption" style={{ color: theme.muted }}>
                Loading...
              </ThemedText>
            ) : (
              <>
                <View style={styles.row}>
                  <ThemedText>Loyalty Points</ThemedText>
                  <ThemedText type="price">
                    {profile?.points ?? 0} pts
                  </ThemedText>
                </View>
                <Spacer height={6} />
                <View style={styles.row}>
                  <ThemedText>Store Credit</ThemedText>
                  <ThemedText type="price">
                    {formatPesoForCart(profile?.creditBalance ?? 0)} /{" "}
                    {formatPesoForCart(profile?.creditLimit ?? 0)}
                  </ThemedText>
                </View>
              </>
            )}
          </ThemedCard>

          <ThemedCard style={styles.card}>
            <ThemedText type="defaultSemiBold">Password</ThemedText>
            <Spacer height={10} />
            {!canChangePassword ? (
              <ThemedText type="caption" style={{ color: theme.muted }}>
                You signed in with{" "}
                {user?.app_metadata?.provider === "google"
                  ? "Google"
                  : "a social account"}{" "}
                — there&apos;s no password to change.
              </ThemedText>
            ) : !showPasswordForm ? (
              <ThemedButton
                title="Change Password"
                variant="outline"
                onPress={() => setShowPasswordForm(true)}
              />
            ) : (
              <>
                <ThemedTextInput
                  placeholder="Current password"
                  secureTextEntry
                  autoCapitalize="none"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />
                <Spacer height={12} />
                <ThemedTextInput
                  placeholder="New password"
                  secureTextEntry
                  autoCapitalize="none"
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <Spacer height={12} />
                <ThemedTextInput
                  placeholder="Confirm new password"
                  secureTextEntry
                  autoCapitalize="none"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />

                {passwordError ? (
                  <>
                    <Spacer height={12} />
                    <ThemedCard
                      style={{ backgroundColor: "#d1001f", padding: 12 }}
                    >
                      <ThemedText style={{ color: "#fff9f9" }}>
                        {passwordError}
                      </ThemedText>
                    </ThemedCard>
                  </>
                ) : null}

                {passwordSuccess ? (
                  <>
                    <Spacer height={12} />
                    <ThemedText style={{ color: theme.primary }}>
                      Password updated.
                    </ThemedText>
                  </>
                ) : null}

                <Spacer height={12} />
                <ThemedButton
                  title="Update Password"
                  loading={passwordSubmitting}
                  onPress={handleChangePassword}
                />
                <ThemedButton
                  title="Cancel"
                  variant="text"
                  onPress={() => {
                    setShowPasswordForm(false);
                    resetPasswordForm();
                  }}
                />
              </>
            )}
          </ThemedCard>

          <ThemedCard style={styles.card}>
            <ThemedText type="defaultSemiBold">Theme</ThemedText>
            <Spacer height={10} />
            <Pressable
              style={[styles.row, styles.themeTrigger, { borderColor: theme.border }]}
              onPress={() => setThemeSheetVisible(true)}
            >
              <View style={styles.aboutLabelRow}>
                <ThemeSwatch colors={activeTheme.swatch} />
                <ThemedText type="defaultSemiBold">{activeTheme.name}</ThemedText>
              </View>
              <Ionicons name="chevron-down" size={18} color={theme.muted} />
            </Pressable>
          </ThemedCard>

          <ThemedCard style={styles.card}>
            <Pressable
              style={styles.row}
              onPress={() => router.push("/(tabs)/about")}
            >
              <View style={styles.aboutLabelRow}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={theme.text}
                />
                <ThemedText type="defaultSemiBold">About</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.muted} />
            </Pressable>
          </ThemedCard>

          <Spacer height={10} />
          <ThemedButton
            title="Logout"
            variant="danger"
            fullWidth
            onPress={handleLogout}
          />
          <Spacer height={20} />
        </ScrollView>
      </ProtectedRoute>
      <ThemeSelectSheet
        visible={themeSheetVisible}
        onClose={() => setThemeSheetVisible(false)}
        themes={themes}
        activeThemeId={themeId}
        onSelect={setThemeId}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  email: {
    marginBottom: 20,
  },
  card: {
    marginBottom: 16,
    marginHorizontal: 0,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  themeTrigger: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  aboutLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
