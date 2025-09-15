import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { useThemeColors } from '../context/ThemeContext';

interface ThemedTextProps extends TextProps {
  type?: 'title' | 'subtitle' | 'body' | 'caption' | 'price' | 'label';
  children: React.ReactNode;
}

export function ThemedText({ 
  type = 'body', 
  style, 
  children, 
  ...props 
}: ThemedTextProps) {
  const { theme } = useThemeColors();

  const getTextStyle = () => {
    switch (type) {
      case 'title':
        return [styles.title, { color: theme.text }];
      case 'subtitle':
        return [styles.subtitle, { color: theme.text }];
      case 'body':
        return [styles.body, { color: theme.text }];
      case 'caption':
        return [styles.caption, { color: theme.muted }];
      case 'price':
        return [styles.price, { color: theme.primary }];
      case 'label':
        return [styles.label, { color: theme.text }];
      default:
        return [styles.body, { color: theme.text }];
    }
  };

  return (
    <Text style={[getTextStyle(), style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
});
