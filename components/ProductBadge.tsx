import { useThemeColors } from "@/context/ThemeContext";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { RADIUS, SPACING } from "../constants/spacing";

interface ProductBadgeProps {
  label: string;
}

export default function ProductBadge({ label }: ProductBadgeProps) {
  const { theme } = useThemeColors();

  return (
    <Text style={[styles.badge, { backgroundColor: theme.primary, color: "#FFFFFF" }]}>
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: SPACING.md,
    right: SPACING.md,
    zIndex: 1,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.pill,
    fontSize: 11,
    fontWeight: "700",
    overflow: "hidden",
  },
});
