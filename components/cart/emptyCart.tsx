import { useThemeColors } from "@/context";
import { ThemedText } from "../ThemedText";

const EmptyCart = () => {
  const { theme } = useThemeColors();
  return (
    <ThemedText
      style={{
        marginTop: 50,
        color: theme.muted,
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
      }}
    >
      Your cart is empty.
    </ThemedText>
  );
};

export default EmptyCart;
