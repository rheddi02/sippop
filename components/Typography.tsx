import { useThemeColors } from "@/context";
import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";

type Variant = "title" | "subtitle" | "body" | "caption";

interface TypographyProps extends TextProps {
  children: React.ReactNode;
  variant?: Variant;
  bold?: boolean;
}

export default function Typography({
  children,
  variant = "body",
  bold = false,
  style,
  ...rest
}: TypographyProps) {
  const { theme } = useThemeColors();

  return (
    <Text
      style={[
        styles[variant],
        { color: theme.text, fontWeight: bold ? "700" : "400" },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 12,
    opacity: 0.7,
  },
});
