import { useThemeColors } from '@/context/ThemeContext';
import { View, type ViewProps } from 'react-native';


export type ThemedViewProps = ViewProps & {
};

export function ThemedView({ style, ...otherProps }: ThemedViewProps) {
  const {theme} = useThemeColors();
  return <View style={[{ backgroundColor: theme.background }, style]} {...otherProps} />;
}
