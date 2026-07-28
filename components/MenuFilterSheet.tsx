import { RADIUS, SPACING } from "@/constants/spacing";
import { useThemeColors } from "@/context/ThemeContext";
import { CategoryId } from "@/utils/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { ThemedButton } from "./ThemedButton";
import { ThemedText } from "./ThemedText";

export type SortOption = "featured" | "priceAsc" | "priceDesc" | "nameAsc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "priceAsc", label: "Price: Low to High" },
  { value: "priceDesc", label: "Price: High to Low" },
  { value: "nameAsc", label: "Name: A-Z" },
];

interface CategoryOption {
  id: CategoryId;
  label: string;
}

interface MenuFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  categories: CategoryOption[];
  activeCategories: CategoryId[];
  sortOption: SortOption;
  onApply: (categories: CategoryId[], sort: SortOption) => void;
}

export default function MenuFilterSheet({
  visible,
  onClose,
  categories,
  activeCategories,
  sortOption,
  onApply,
}: MenuFilterSheetProps) {
  const { theme } = useThemeColors();
  const { height: screenHeight } = useWindowDimensions();
  const [draftCategories, setDraftCategories] = useState<CategoryId[]>(activeCategories);
  const [draftSort, setDraftSort] = useState<SortOption>(sortOption);

  useEffect(() => {
    if (visible) {
      setDraftCategories(activeCategories);
      setDraftSort(sortOption);
    }
  }, [visible, activeCategories, sortOption]);

  const toggleCategory = (id: CategoryId) => {
    setDraftCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleReset = () => {
    setDraftCategories([]);
    setDraftSort("featured");
  };

  const handleApply = () => {
    onApply(draftCategories, draftSort);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View
        style={[
          styles.sheet,
          { backgroundColor: theme.background, maxHeight: screenHeight * 0.75 },
        ]}
      >
        <View style={styles.headerRow}>
          <ThemedText type="subtitle">Sort &amp; Filter</ThemedText>
          <Pressable onPress={onClose} hitSlop={8}>
            <Ionicons name="close" size={24} color={theme.text} />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Sort by
          </ThemedText>
          <View style={styles.pillRow}>
            {SORT_OPTIONS.map((option) => {
              const active = draftSort === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setDraftSort(option.value)}
                  style={[
                    styles.pill,
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
                    {option.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          {categories.length > 0 && (
            <>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                Category
              </ThemedText>
              <View style={styles.pillRow}>
                {categories.map((category) => {
                  const active = draftCategories.includes(category.id);
                  return (
                    <Pressable
                      key={category.id}
                      onPress={() => toggleCategory(category.id)}
                      style={[
                        styles.pill,
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
                        {category.label}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}
        </ScrollView>

        <View style={styles.actions}>
          <ThemedButton
            title="Reset"
            variant="outline"
            style={styles.actionButton}
            onPress={handleReset}
          />
          <ThemedButton
            title="Apply"
            style={styles.actionButton}
            onPress={handleApply}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: RADIUS.md,
    borderTopRightRadius: RADIUS.md,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  pill: {
    height: 36,
    justifyContent: "center",
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
  },
  actions: {
    flexDirection: "row",
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  actionButton: {
    flex: 1,
    marginTop: 0,
  },
});
