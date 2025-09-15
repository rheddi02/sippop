import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button, FlatList, View } from "react-native";
import { useCart } from "../../context/CartContext";
import { useOrders } from "../../context/OrdersContext";

export default function CartScreen() {
  const { cart, updateQuantity, clearCart, removeFromCart } = useCart();
  const { placeOrder } = useOrders();

  const handleCheckout = () => {
    if (cart.length === 0) return;
    placeOrder(
      cart,
      cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
    );
    clearCart();
  };

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          
            <ThemedText>Your cart is empty.</ThemedText>
        }
        renderItem={({ item }) => (
          <ThemedView
            style={{
              padding: 12,
              borderBottomWidth: 1,
              borderColor: "#ccc",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ThemedText>
              {item.name} x {item.quantity} = ₱{item.price * item.quantity}
            </ThemedText>
            <View style={{ flexDirection: "row", gap: 4 }}>
              <Button
                title="-"
                onPress={() => updateQuantity(item.id, item.quantity - 1)}
              />
              <Button
                title="+"
                onPress={() => updateQuantity(item.id, item.quantity + 1)}
              />
              <Button title="Remove" onPress={() => removeFromCart(item.id)} />
            </View>
          </ThemedView>
        )}
      />

      {/* {cart.length > 0 && (
        <ThemedView style={{ marginTop: 20 }}>
          <ThemedText style={{ fontSize: 18, fontWeight: "bold" }}>
            Total: ₱{cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}
          </ThemedText>
        </ThemedView>
      )} */}
    </ThemedView>
  );
}
