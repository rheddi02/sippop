import ItemCard from "@/components/cart/itemCard";
import { useCart } from "../../context/CartContext";
// import { useOrders } from "../../context/OrdersContext";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { Alert, Linking } from "react-native";

export default function CartScreen() {
  const { cart, updateQuantity, clearCart, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  // const { placeOrder } = useOrders();

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
    <ItemCard
      {...{
        updateQuantity,
        removeFromCart,
        handleCheckout: openMessengerCheckout,
        cart,
        loading,
      }}
    />
  );
}
