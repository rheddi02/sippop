import { useThemeColors } from "@/context";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  Platform
} from "react-native";

type ButtonVariant = "primary" | "secondary" | "danger" | "outline" | "text";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  title?: string;
  onPress?: () => void;

  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  icon?: React.ReactNode; // icon-only button

  variant?: ButtonVariant;
  size?: ButtonSize;

  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;

  style?: StyleProp<ViewStyle>;
};

export function ThemedButton({
  title,
  onPress,
  leftIcon,
  rightIcon,
  icon,
  variant = "primary",
  size = "md",
  fullWidth,
  disabled,
  loading,
  style,
}: ButtonProps) {
  const { theme } = useThemeColors();

  const isIconOnly = !!icon && !title;

  /* ---------------- COLORS ---------------- */

  const colors = useMemo(() => {
    switch (variant) {
      case "secondary":
        return {
          bg: theme.secondary,
          text: theme.text,
          border: "transparent",
        };

      case "danger":
        return {
          bg: theme.danger,
          text: theme.text,
          border: "transparent",
        };

      case "outline":
        return {
          bg: "transparent",
          text: theme.primary,
          border: theme.primary,
        };

      case "text":
        return {
          bg: "transparent",
          text: theme.primary,
          border: "transparent",
        };

      default:
        return {
          bg: theme.primary,
          text: theme.text,
          border: "transparent",
        };
    }
  }, [variant, theme]);

  /* ---------------- SIZE ---------------- */

  const sizeStyle = useMemo(() => {
    switch (size) {
      case "sm":
        return styles.sm;
      case "lg":
        return styles.lg;
      default:
        return styles.md;
    }
  }, [size]);

  const rippleColor = useMemo(() => {
  if (variant === "primary") return "rgba(255,255,255,0.2)";
  if (variant === "text") return "rgba(0,0,0,0.08)";
  if (variant === "outline") return "rgba(0,0,0,0.08)";
  return "rgba(255,255,255,0.15)";
}, [variant]);
  /* ---------------- RENDER ---------------- */

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      android_ripple={{
    color: rippleColor,
    borderless: false,
  }}
      style={({ pressed }) => [
        styles.base,
        sizeStyle,
        fullWidth && styles.fullWidth,
        isIconOnly && styles.iconOnly,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          opacity: disabled || loading ? 0.5 : pressed ? 0.85 : 1,
        },
        variant === "outline" && styles.outlineBorder,
        style,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <>
            {isIconOnly && icon}

            {!isIconOnly && (
              <>
                {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

                {title && (
                  <Text
                    style={[
                      styles.text,
                      textSize(size),
                      { color: colors.text },
                      variant === "text" && styles.linkText,
                    ]}
                  >
                    {title}
                  </Text>
                )}

                {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
              </>
            )}
          </>
        )}
      </View>
    </Pressable>
  );
}

/* ---------------- TEXT SIZE HELPER ---------------- */

const textSize = (size: ButtonSize) => {
  switch (size) {
    case "sm":
      return styles.textSm;
    case "lg":
      return styles.textLg;
    default:
      return styles.textMd;
  }
};

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  base: {
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    overflow: "hidden",
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  fullWidth: {
    width: "100%",
  },

  outlineBorder: {
    borderWidth: 1,
  },

  /* sizes */
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  md: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  lg: {
    paddingVertical: 18,
    paddingHorizontal: 22,
  },

  iconOnly: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },

  /* text */
  text: {
    fontWeight: "600",
  },

  textSm: { fontSize: 14 },
  textMd: { fontSize: 16 },
  textLg: { fontSize: 18 },

  linkText: {
    textDecorationLine: "underline",
  },

  leftIcon: {
    marginRight: 8,
  },

  rightIcon: {
    marginLeft: 8,
  },
});
