import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";

// This row is only ever rendered inside the item-detail screen's glass
// bottom sheet, so its palette/sizing is fixed to match that spec exactly
// (warm-dark glass, white text) rather than following the app theme —
// mirrors the Size group built directly in app/item/[id].tsx.
const ACCENT = "#F6A23A";
const TEXT_WHITE = "#FFFFFF";
const GLASS_BORDER = "rgba(255,255,255,0.08)";
const CHIP_BG_INACTIVE = "rgba(255,255,255,0.08)";
const CHIP_TEXT_INACTIVE = "rgba(255,255,255,0.65)";
const CHIP_BG_ACTIVE = "rgba(246,162,58,0.18)";

interface OptionPillRowProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export default function OptionPillRow({
  label,
  options,
  selected,
  onSelect,
  disabled = false,
}: OptionPillRowProps) {
  return (
    <View style={styles.group}>
      <ThemedText style={styles.title}>{label}</ThemedText>
      <View style={styles.chipRow}>
        {options.map((option) => {
          const active = !disabled && selected === option;
          return (
            <TouchableOpacity
              key={option}
              onPress={() => onSelect(option)}
              disabled={disabled}
              style={[
                styles.chip,
                active ? styles.chipActive : styles.chipInactive,
                disabled && styles.chipDisabled,
              ]}
            >
              <ThemedText style={[styles.chipText, active && styles.chipTextActive]}>
                {option}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "600",
    color: TEXT_WHITE,
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    height: 44,
    justifyContent: "center",
    paddingHorizontal: 20,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: CHIP_BG_ACTIVE,
    borderColor: ACCENT,
  },
  chipInactive: {
    backgroundColor: CHIP_BG_INACTIVE,
    borderColor: GLASS_BORDER,
  },
  chipDisabled: {
    opacity: 0.35,
  },
  chipText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "600",
    color: CHIP_TEXT_INACTIVE,
  },
  chipTextActive: {
    color: ACCENT,
  },
});
