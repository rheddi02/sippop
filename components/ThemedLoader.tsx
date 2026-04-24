import { ActivityIndicator } from "react-native";
import { useThemeColors } from "../context/ThemeContext";
import { ThemedView } from "./ThemedView";

const ThemedLoader = () => {
  const { theme } = useThemeColors();

  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color={theme.text} />
    </ThemedView>
  );
};

export default ThemedLoader;
