import ItemCard from "@/components/cart/itemCard";
import { useCart } from "../../context/CartContext";
// import { useOrders } from "../../context/OrdersContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { Alert, Linking, StyleSheet } from "react-native";

export default function CartScreen() {
  const { cart, updateQuantity, clearCart, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  // const { placeOrder } = useOrders();

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
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    const orderText = formatOrderText();
    await Clipboard.setStringAsync(orderText);

    Alert.alert(
      "Order copied ✅",
      "Your order has been copied. Paste it in Messenger to order.",
    );
    // placeOrder(
    //   cart,
    //   cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    // );
    // clearCart();
  };

  const formatOrderText = () => {
    if (cart.length === 0) return "";

    const lines = cart.map((item) => {
      return `${item.quantity}pc - ${item.name} [${item.size}]`;
      // return `${item.quantity}pc - [${getSizeName(item.size)}] ${item.name} - ₱${item.price * item.quantity}`;
    });
    return `🧾 ORDER\n\n${lines.join("\n")}
`;
  };

  const openMessengerCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);

    const message = encodeURIComponent(formatOrderText());

    const PAGE_USERNAME = "aysippop";

    const messengerWebUrl = `https://m.me/${PAGE_USERNAME}?text=${message}`;

    try {
      const supported = await Linking.canOpenURL(messengerWebUrl);

      if (supported) {
        await Linking.openURL(messengerWebUrl);
      } else {
        await Linking.openURL(messengerWebUrl);
      }
    } catch (err) {
      Alert.alert("Error", "Unable to open Messenger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ThemedView style={styles.container}>
        <ThemedText bold type="title">
          Cart
        </ThemedText>
        <Ionicons
          disabled={cart.length === 0}
          name="trash"
          size={24}
          color={cart.length === 0 ? "gray" : "red"}
          onPress={handleClearCart}
        />
      </ThemedView>
      <ItemCard
        {...{
          updateQuantity,
          removeFromCart,
          handleCheckout: openMessengerCheckout,
          cart,
          loading,
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
