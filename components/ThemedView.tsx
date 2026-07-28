import { useThemeColors } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { View, type ViewProps } from 'react-native';


export type ThemedViewProps = ViewProps & {
  // Paints the theme's background gradient instead of a flat color.
  gradient?: boolean;
};

export function ThemedView({ style, gradient, ...otherProps }: ThemedViewProps) {
  const { theme, backgroundGradient } = useThemeColors();

  if (gradient) {
    return <LinearGradient colors={backgroundGradient} style={style} {...otherProps} />;
  }

  return <View style={[{ backgroundColor: theme.background }, style]} {...otherProps} />;
}
