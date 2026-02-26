import ItemCard from "@/components/cart/itemCard";
import { useCart } from "../../context/CartContext";
// import { useOrders } from "../../context/OrdersContext";
import { getSizeName } from "@/utils/sizeHelper";
import * as Clipboard from "expo-clipboard";
import { Alert } from "react-native";

export default function CartScreen() {
  const { cart, updateQuantity, clearCart, removeFromCart } = useCart();
  console.log("🚀 ~ CartScreen ~ cart:", cart);
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
      return `${item.quantity}pc - [${getSizeName(item.size)}] ${item.name} - ₱${item.price * item.quantity}`;
    });
    return `${lines.join("\n")}
`;
  };
  return (
    <ItemCard {...{ updateQuantity, removeFromCart, handleCheckout, cart }} />
  );
}
