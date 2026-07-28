import { RADIUS, SPACING } from "@/constants/spacing";
import { useThemeColors } from "@/context/ThemeContext";
import { AppTheme } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { ThemedText } from "./ThemedText";

interface ThemeSelectSheetProps {
  visible: boolean;
  onClose: () => void;
  themes: AppTheme[];
  activeThemeId: string;
  onSelect: (id: string) => void;
}

export function ThemeSwatch({
  colors,
  size = 28,
}: {
  colors: string[];
  size?: number;
}) {
  const cell = size / 2;
  return (
    <View
      style={[
        styles.swatch,
        { width: size, height: size, borderRadius: RADIUS.sm },
      ]}
    >
      {colors.slice(0, 4).map((color, index) => (
        <View
          key={index}
          style={{ width: cell, height: cell, backgroundColor: color }}
        />
      ))}
    </View>
  );
}

export default function ThemeSelectSheet({
  visible,
  onClose,
  themes,
  activeThemeId,
  onSelect,
}: ThemeSelectSheetProps) {
  const { theme } = useThemeColors();
  const { height: screenHeight } = useWindowDimensions();

  const handleSelect = (id: string) => {
    onSelect(id);
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
          <ThemedText type="subtitle">Theme</ThemedText>
          <Pressable onPress={onClose} hitSlop={8}>
            <Ionicons name="close" size={24} color={theme.text} />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {themes.map((option) => {
            const active = option.id === activeThemeId;
            return (
              <Pressable
                key={option.id}
                onPress={() => handleSelect(option.id)}
                style={[
                  styles.row,
                  {
                    backgroundColor: active ? theme.card : "transparent",
                    borderColor: active ? theme.primary : theme.border,
                  },
                ]}
              >
                <ThemeSwatch colors={option.swatch} />
                <ThemedText type="defaultSemiBold" style={styles.rowLabel}>
                  {option.name}
                </ThemedText>
                {active && (
                  <Ionicons name="checkmark" size={20} color={theme.primary} />
                )}
              </Pressable>
            );
          })}
        </ScrollView>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.sm,
  },
  rowLabel: {
    flex: 1,
  },
  swatch: {
    flexDirection: "row",
    flexWrap: "wrap",
    overflow: "hidden",
  },
});
