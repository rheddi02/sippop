import ItemCard from "@/components/cart/itemCard";
import { useCart } from "../../context/CartContext";
// import { useOrders } from "../../context/OrdersContext";
import * as Clipboard from "expo-clipboard";
import { Alert } from "react-native";

export default function CartScreen() {
  const { cart, updateQuantity, clearCart, removeFromCart } = useCart();
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
      return `${item.quantity}pc - ${item.size} ${item.name} - ₱${item.price * item.quantity}`;
    });

    const total = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    return `${lines.join("\n")}

Total: ₱${total}`;
  };
  return (
    <ItemCard {...{ updateQuantity, removeFromCart, handleCheckout, cart }} />
  );
}
