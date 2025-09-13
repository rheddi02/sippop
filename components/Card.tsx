import React from "react";
import { StyleSheet, View } from "react-native";
import { useThemeColors } from "../theme/ThemeContext";

export default function Card({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeColors();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 6,
  },
});
