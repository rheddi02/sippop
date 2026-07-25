import ItemCard from "@/components/cart/itemCard";
import ScreenHeader from "@/components/ScreenHeader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useOrders } from "@/context/OrdersContext";
import { useThemeColors } from "@/context/ThemeContext";
import { useProfile } from "@/hooks/useProfile";
import { formatPesoForPrice } from "@/utils/amountHelper";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { Alert, Linking, Pressable, StyleSheet } from "react-native";
import { useCart } from "../../context/CartContext";

export default function CartScreen() {
  const { cart, updateQuantity, clearCart, removeFromCart } = useCart();
  const { placeOrder } = useOrders();
  const { profile, reload: reloadProfile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [useCredit, setUseCredit] = useState(false);
  const { theme } = useThemeColors();

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const remainingCredit = profile
    ? profile.creditLimit - profile.creditBalance
    : 0;
  const canUseCredit =
    !!profile && remainingCredit >= cartTotal && cartTotal > 0;

  const handleClearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to clear the cart?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: "destructive", onPress: clearCart },
      ],
      { cancelable: true },
    );
  };

  const formatOrderText = () => {
    if (cart.length === 0) return "";

    const lines = cart.map((item) => {
      return `${item.quantity}pc - ${item.name} [${item.size}]`;
    });
    return `🧾 ORDER\n\n${lines.join("\n")}
`;
  };

  // Still fires alongside the real order below — kept as a staff-visible
  // notification until the POS is confirmed to surface Supabase orders
  // directly. The text is also copied to the clipboard since Messenger's
  // ?text= deep link doesn't reliably prefill the composer — pasting is
  // the fallback that always works.
  const notifyMessenger = async () => {
    const orderText = formatOrderText();
    try {
      await Clipboard.setStringAsync(orderText);
    } catch {
      // Non-fatal — the real order is already placed at this point.
    }

    const message = encodeURIComponent(orderText);
    const PAGE_USERNAME = "aysippop";
    const messengerWebUrl = `https://m.me/${PAGE_USERNAME}?text=${message}`;
    try {
      await Linking.openURL(messengerWebUrl);
    } catch {
      // Non-fatal — the real order is already placed at this point.
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      await placeOrder(cart, useCredit);
      await notifyMessenger();
      clearCart();
      setUseCredit(false);
      await reloadProfile();
      Alert.alert(
        "Order placed",
        (useCredit
          ? "Charged to your store credit. See you soon!"
          : "Pay at pickup. See you soon!") +
          "\n\nYour order details were copied — paste them into Messenger if they don't appear automatically.",
      );
    } catch (err) {
      // Supabase errors are plain objects with a `.message`, not Error
      // instances, so `err instanceof Error` alone would fall through to
      // `String(err)` -> "[object Object]".
      const message =
        err instanceof Error
          ? err.message
          : ((err as { message?: string })?.message ?? String(err));
      Alert.alert("Order failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScreenHeader
        title="Cart"
        right={
          <ThemedView
            style={{
              padding: 8,
              borderWidth: 1,
              borderColor: theme.border,
              borderRadius: 8,
            }}
          >
            <Ionicons
              disabled={cart.length === 0}
              name="trash"
              size={24}
              color={cart.length === 0 ? "gray" : "red"}
              onPress={handleClearCart}
            />
          </ThemedView>
        }
      />
      <ThemedView style={styles.itemCountRow}>
        <ThemedText>
          {cart.length} item{cart.length > 1 ? "s" : ""}
        </ThemedText>
      </ThemedView>

      {cart.length > 0 && (
        <ThemedView style={styles.paymentRow}>
          <Pressable
            onPress={() => setUseCredit(false)}
            style={[
              styles.paymentOption,
              {
                borderColor: !useCredit ? theme.primary : theme.border,
                backgroundColor: !useCredit
                  ? theme.primary + "20"
                  : "transparent",
              },
            ]}
          >
            <ThemedText
              style={{ color: !useCredit ? theme.primary : theme.text }}
            >
              Pay at pickup
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => canUseCredit && setUseCredit(true)}
            disabled={!canUseCredit}
            style={[
              styles.paymentOption,
              {
                borderColor: useCredit ? theme.primary : theme.border,
                backgroundColor: useCredit
                  ? theme.primary + "20"
                  : "transparent",
                opacity: canUseCredit ? 1 : 0.4,
              },
            ]}
          >
            <ThemedText
              style={{ color: useCredit ? theme.primary : theme.text }}
            >
              Store credit
            </ThemedText>
            {profile && (
              <ThemedText type="caption" style={{ color: theme.muted }}>
                {formatPesoForPrice(remainingCredit)} left
              </ThemedText>
            )}
          </Pressable>
        </ThemedView>
      )}

      <ItemCard
        {...{
          updateQuantity,
          removeFromCart,
          handleCheckout,
          cart,
          loading,
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  itemCountRow: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  paymentRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  paymentOption: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
});
