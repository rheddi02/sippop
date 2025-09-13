import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useThemeColors } from "../theme/ThemeContext";

export default function PrimaryButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  const { theme } = useThemeColors();
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.primary }]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: "#fff" }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginVertical: 6,
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
});
