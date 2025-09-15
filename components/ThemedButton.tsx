import { useThemeColors } from "@/context";
import React, { useMemo } from "react";
import { Pressable, StyleProp, StyleSheet, Text, useColorScheme, ViewStyle } from "react-native";

type ButtonProps = {
  title: string | React.ReactNode;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "text" | "outline"
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  loading?: boolean;
};

export function ThemedButton({ title, onPress, variant = "primary", size = "md", fullWidth, style, disabled, loading }: ButtonProps) {
  const colorScheme = useColorScheme();
  const {theme} = useThemeColors()

  const backgroundColor = useMemo(() => {
    if (variant === "primary") return theme.primary;
    if (variant === "secondary") return theme.secondary;
    if (variant === "outline") return theme.border;
    if (variant === "danger") return theme.danger;
    if (variant === "text") return "transparent";
    return theme.primary;
  }, [variant, theme])

  const textColor = useMemo(() => {
    if (variant === "primary") return theme.text;
    if (variant === "secondary") return theme.text;
    if (variant === "outline") return theme.text;
    if (variant === "danger") return theme.danger;
    if (variant === "text") return theme.text;
    return theme.text;
  }, [variant, theme])

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        size === "sm" && styles.buttonSm,
        size === "lg" && styles.buttonLg,
        fullWidth ? styles.fullWidth : undefined,
        { backgroundColor, color: textColor, opacity: disabled || loading ? 0.5 : pressed ? 0.85 : 1 },
        variant === "secondary" && colorScheme !== "dark" ? styles.secondaryBorder : variant === "primary" && colorScheme === "dark" ? styles.secondaryBorder : undefined,
        style,
      ]}
    >
      {typeof title === 'string' ? (
        <Text style={[
          styles.text,
          size === "sm" && styles.textSm,
          size === "lg" && styles.textLg,
          { color: textColor }
        ]}>
          {loading ? 'Please wait…' : title}
        </Text>
      ) : (
        loading ? (
          <Text style={[
            styles.text,
            size === "sm" && styles.textSm,
            size === "lg" && styles.textLg,
            { color: textColor }
          ]}>
            Please wait…
          </Text>
        ) : (
          title
        )
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 12,
  },
  buttonSm: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  buttonLg: {
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  fullWidth: {
    width: "100%",
  },
  secondaryBorder: {
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20
  },
  textSm: {
    fontSize: 14,
  },
  textLg: {
    fontSize: 18,
  },
});
