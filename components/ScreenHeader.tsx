import { useDrawer } from "@/context/DrawerContext";
import { useThemeColors } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SPACING } from "../constants/spacing";
import { ThemedText } from "./ThemedText";

interface ScreenHeaderProps {
  title: string;
  right?: ReactNode;
}

export default function ScreenHeader({ title, right }: ScreenHeaderProps) {
  const { theme } = useThemeColors();
  const { openDrawer } = useDrawer();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity onPress={openDrawer} hitSlop={8}>
        <Ionicons name="menu" size={26} color={theme.text} />
      </TouchableOpacity>
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
