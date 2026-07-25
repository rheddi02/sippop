import { useThemeColors } from "@/context/ThemeContext";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SPACING } from "../constants/spacing";
import { ThemedText } from "./ThemedText";

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
}

export default function SectionHeader({ title, onSeeAll }: SectionHeaderProps) {
  const { theme } = useThemeColors();

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">{title}</ThemedText>
      {!!onSeeAll && (
        <TouchableOpacity onPress={onSeeAll} hitSlop={8}>
          <ThemedText type="label" style={{ color: theme.primary }}>
            See all
          </ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.sm,
  },
});
