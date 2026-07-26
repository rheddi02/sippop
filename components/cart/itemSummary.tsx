import { FLOATING_NAV_CLEARANCE } from "@/constants/spacing";
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
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <ThemedText style={styles.checkoutPrice}>
          {formatPesoForCart(
            cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
          )}
        </ThemedText>
        <ThemedButton
          title="Checkout"
          onPress={handleCheckout}
          disabled={cart.length === 0 || loading}
          loading={loading}
          style={[styles.checkoutButton, { backgroundColor: theme.primary }]}
        />
      </ThemedView>
    </View>
  );
};

export default ItemSummary;

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingTop: 20,
    paddingBottom: FLOATING_NAV_CLEARANCE,
  },
  checkoutPrice: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
    marginRight: 20,
  },
  checkoutButton: {
    marginTop: 0,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
