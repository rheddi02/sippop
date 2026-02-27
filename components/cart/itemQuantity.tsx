import { useThemeColors } from "@/context/ThemeContext";
import { CartItem } from "@/utils/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

const ItemQuantity = ({
  item,
  updateQuantity,
  removeFromCart,
}: {
  item: CartItem;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
}) => {
  const { theme } = useThemeColors();
  return (
    <ThemedView
      style={[styles.quantityContainer, { backgroundColor: theme.primary }]}
    >
      {/* decrement quantity button, disabled if quantity is 1 */}
      <TouchableOpacity
        style={[styles.quantityButton, { backgroundColor: theme.primary }]}
        disabled={item.quantity === 1}
        onPress={() => updateQuantity(item.id, item.quantity - 1)}
      >
        <Ionicons name="remove" size={20} color={theme.background} />
      </TouchableOpacity>
      {/* quantity text */}
      <ThemedText style={[styles.quantityText, { color: theme.background }]}>
        {item.quantity}
      </ThemedText>
      {/* increment quantity button */}
      <TouchableOpacity
        style={[styles.quantityButton, { backgroundColor: theme.primary }]}
        onPress={() => updateQuantity(item.id, item.quantity + 1)}
      >
        <Ionicons name="add" size={20} color={theme.background} />
      </TouchableOpacity>
    </ThemedView>
  );
};

export default ItemQuantity;

const styles = StyleSheet.create({
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    width: 200,
  },
  quantityButton: {
    width: "30%",
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
    minWidth: 5,
    textAlign: "center",
  },
});
