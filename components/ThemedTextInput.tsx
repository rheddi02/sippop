import { useThemeColors } from "@/context";
import React from "react";
import { TextInput, TextInputProps } from "react-native";

const ThemedTextInput = ({
  style,
  placeholderTextColor,
  ...props
}: TextInputProps) => {
  const { theme } = useThemeColors();
  return (
    <TextInput
      style={[
        {
          backgroundColor: theme.background,
          color: theme.text,
          borderColor: theme.muted,
          padding: 12,
          borderRadius: 5,
          borderWidth: 1,
        },
        style,
      ]}
      placeholderTextColor={placeholderTextColor ?? theme.secondary}
      {...props}
    />
  );
};

export default ThemedTextInput;
