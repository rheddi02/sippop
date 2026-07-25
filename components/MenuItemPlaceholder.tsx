import { useThemeColors } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

interface MenuItemPlaceholderProps {
  name: string;
  size: number;
  height?: number;
  borderRadius?: number;
}

const FLAVOR_STYLES: { match: RegExp; color: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { match: /matcha/i, color: "#7CB342", icon: "leaf" },
  { match: /ube/i, color: "#9575CD", icon: "nutrition" },
  { match: /chocolate|choco|mocha/i, color: "#795548", icon: "cafe" },
  { match: /cookies|cream|oreo/i, color: "#8D8D8D", icon: "ice-cream" },
  { match: /krunch/i, color: "#FF8A65", icon: "sparkles" },
];

function getFlavorStyle(name: string) {
  return FLAVOR_STYLES.find((f) => f.match.test(name));
}

export default function MenuItemPlaceholder({
  name,
  size,
  height,
  borderRadius = 8,
}: MenuItemPlaceholderProps) {
  const { theme } = useThemeColors();
  const flavor = getFlavorStyle(name);
  const backgroundColor = flavor ? `${flavor.color}33` : `${theme.accent}33`;
  const iconColor = flavor ? flavor.color : theme.accent;
  const resolvedHeight = height ?? size;

  return (
    <View
      style={[
        styles.container,
        { width: size, height: resolvedHeight, backgroundColor, borderRadius },
      ]}
    >
      <Ionicons name={flavor?.icon ?? "cafe"} size={Math.min(size, resolvedHeight) * 0.28} color={iconColor} />
      <ThemedText
        type="caption"
        style={[styles.label, { color: iconColor }]}
        numberOfLines={2}
      >
        {name}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    padding: 8,
  },
  label: {
    marginTop: 6,
    fontSize: 11,
    textAlign: "center",
    fontWeight: "600",
  },
});
