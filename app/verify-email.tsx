import Spacer from "@/components/Spacer";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColors } from "@/context";
import { useUser } from "@/hooks/useUser";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const RESEND_COOLDOWN = 60;

export default function VerifyEmailScreen() {
  const { user, isAuthChecked, sendVerificationEmail, refreshUser, logout } =
    useUser();
  const { theme } = useThemeColors();
  const insets = useSafeAreaInsets();

  const [cooldown, setCooldown] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [notVerifiedError, setNotVerifiedError] = useState(false);
  const [sendError, setSendError] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isAuthChecked) return;
    if (!user) {
      router.replace("/login");
    } else if (user.emailVerified) {
      router.replace("/");
    }
  }, [user, isAuthChecked]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN);
    intervalRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    setSendError("");
    try {
      await sendVerificationEmail();
      startCooldown();
    } catch (err: unknown) {
      setSendError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleCheckVerification = async () => {
    setRefreshing(true);
    setNotVerifiedError(false);
    try {
      const verified = await refreshUser();
      if (verified) {
        router.replace("/");
      } else {
        setNotVerifiedError(true);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <ThemedView
      style={[styles.container, { paddingTop: insets.top + 24 }]}
    >
      <View style={styles.iconWrap}>
        <Ionicons name="mail-outline" size={64} color={theme.tint} />
      </View>

      <Spacer height={24} />

      <ThemedText style={styles.title}>Verify your email</ThemedText>
      <Spacer height={8} />
      <ThemedText style={styles.subtitle}>
        We sent a verification link to
      </ThemedText>
      <ThemedText style={[styles.email, { color: theme.tint }]}>
        {user?.email}
      </ThemedText>

      <Spacer height={32} />

      <ThemedButton
        title={
          cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Verification Email"
        }
        fullWidth
        onPress={handleResend}
        disabled={cooldown > 0}
      />

      {sendError ? (
        <>
          <Spacer height={8} />
          <ThemedText style={styles.errorText}>{sendError}</ThemedText>
        </>
      ) : null}

      <Spacer height={12} />

      <ThemedButton
        title="I've Verified My Email"
        fullWidth
        loading={refreshing}
        onPress={handleCheckVerification}
      />

      {notVerifiedError ? (
        <>
          <Spacer height={8} />
          <ThemedText style={styles.errorText}>
            Email not verified yet. Please check your inbox and click the link.
          </ThemedText>
        </>
      ) : null}

      <Spacer height={32} />

      <Pressable onPress={handleSignOut}>
        <ThemedText style={[styles.signOutLink, { color: theme.muted }]}>
          Sign out
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  iconWrap: {
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.7,
  },
  email: {
    fontWeight: "700",
    textAlign: "center",
    marginTop: 4,
  },
  errorText: {
    color: "#d1001f",
    textAlign: "center",
    fontSize: 13,
  },
  signOutLink: {
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
