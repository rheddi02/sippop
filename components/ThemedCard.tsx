import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { useThemeColors } from '../context/ThemeContext';

export type ThemedCardProps = ViewProps & {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: number;
  margin?: number;
  borderRadius?: number;
};

export function ThemedCard({ 
  style, 
  variant = 'default', 
  padding = 16,
  margin = 8,
  borderRadius = 12,
  ...rest 
}: ThemedCardProps) {
  const { theme } = useThemeColors();

  const cardStyles = [
    styles.base,
    {
      backgroundColor: theme.card,
      borderColor: theme.border,
      padding,
      margin,
      borderRadius,
    },
    variant === 'elevated' && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    variant === 'outlined' && {
      borderWidth: 1,
    },
    variant === 'filled' && {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    style,
  ];

  return <View style={cardStyles} {...rest} />;
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
