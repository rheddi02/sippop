import { useThemeColors } from "@/context/ThemeContext";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { RADIUS, SPACING } from "../constants/spacing";
import { ThemedText } from "./ThemedText";

export interface CategoryTab {
  id: string;
  name: string;
  count: number;
}

interface CategoryChipsProps {
  categories: CategoryTab[];
  activeCategory: string;
  onSelect: (id: string) => void;
}

export default function CategoryChips({
  categories,
  activeCategory,
  onSelect,
}: CategoryChipsProps) {
  const { theme } = useThemeColors();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {categories.map((category) => {
        const active = category.id === activeCategory;
        return (
          <TouchableOpacity
            key={category.id}
            onPress={() => onSelect(category.id)}
            style={[
              styles.chip,
              {
                backgroundColor: active ? theme.primary : theme.card,
                borderColor: active ? theme.primary : theme.border,
              },
            ]}
          >
            <ThemedText
              type="label"
              style={{ color: active ? "#FFFFFF" : theme.text }}
            >
              {category.name}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
  chip: {
    height: 36,
    justifyContent: "center",
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
  },
});
