import { useThemeColors } from "@/context/ThemeContext";
import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { SPACING } from "../constants/spacing";
import { ThemedText } from "./ThemedText";

interface ScreenHeaderProps {
  title: string;
  right?: ReactNode;
}

export default function ScreenHeader({ title, right }: ScreenHeaderProps) {
  const { theme } = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ThemedText type="title" style={styles.title} numberOfLines={1}>
        {title}
      </ThemedText>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  title: {
    flex: 1,
  },
  right: {
    minWidth: 26,
    alignItems: "flex-end",
  },
});
