import { type ViewProps } from 'react-native';
import { ThemedView } from './ThemedView';


export function Spacer({ style, ...otherProps }: ViewProps) {
  return <ThemedView style={style} {...otherProps} />;
}
