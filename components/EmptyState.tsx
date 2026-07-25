import { useThemeColors } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SPACING } from "../constants/spacing";
import { ThemedButton } from "./ThemedButton";
import { ThemedText } from "./ThemedText";

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { theme } = useThemeColors();

  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={40} color={theme.muted} />
      <ThemedText type="body" style={[styles.title, { color: theme.text }]}>
        {title}
      </ThemedText>
      {!!message && (
        <ThemedText type="caption" style={[styles.message, { color: theme.muted }]}>
          {message}
        </ThemedText>
      )}
      {!!actionLabel && onAction && (
        <ThemedButton title={actionLabel} onPress={onAction} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: SPACING.xxl * 2,
    paddingHorizontal: SPACING.xl,
    width: "100%",
  },
  title: {
    marginTop: SPACING.sm,
    textAlign: "center",
    fontWeight: "600",
  },
  message: {
    marginTop: SPACING.xs,
    textAlign: "center",
  },
});
