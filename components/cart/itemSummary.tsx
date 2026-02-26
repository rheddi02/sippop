import { useThemeColors } from "@/context";
import { formatPesoForCart } from "@/utils/amountHelper";
import { CartItem } from "@/utils/types";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedButton } from "../ThemedButton";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

type Props = {
  cart: CartItem[];
  handleCheckout: () => void;
  loading: boolean;
};
const ItemSummary = ({ cart, handleCheckout, loading }: Props) => {
  const { theme } = useThemeColors();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ThemedView
        style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <ThemedText
          style={{
            fontSize: 18,
          }}
        >
          Total:
        </ThemedText>
        <ThemedText
          style={{
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          {formatPesoForCart(
            cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
          )}
        </ThemedText>
      </ThemedView>
      {/* Checkout Button */}
      <ThemedButton
        title="Checkout"
        onPress={handleCheckout}
        disabled={cart.length === 0 || loading}
        loading={loading}
        style={[styles.checkoutButton, { backgroundColor: theme.primary }]}
      />
    </View>
  );
};

export default ItemSummary;

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
  },
  checkoutButton: {
    marginTop: 20,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
