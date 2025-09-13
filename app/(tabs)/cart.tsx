import { useContext } from "react";
import { Button, FlatList, Text, View } from "react-native";
import { CartContext } from "../../context/CartContext";
import { OrdersContext } from "../../context/OrdersContext";

export default function CartScreen() {
  const { cart, updateQty, removeFromCart, total, clearCart } = useContext(CartContext);
  const { placeOrder } = useContext(OrdersContext);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    placeOrder(cart, total);
    clearCart();
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>Your cart is empty.</Text>}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              borderBottomWidth: 1,
              borderColor: "#ccc",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text>
              {item.name} x {item.qty} = ₱{item.price * item.qty}
            </Text>
            <View style={{ flexDirection: "row", gap: 4 }}>
              <Button title="-" onPress={() => updateQty(item.id, item.qty - 1)} />
              <Button title="+" onPress={() => updateQty(item.id, item.qty + 1)} />
              <Button title="Remove" onPress={() => removeFromCart(item.id)} />
            </View>
          </View>
        )}
      />

      {cart.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Total: ₱{total}
          </Text>
          <Button title="Checkout" onPress={handleCheckout} />
        </View>
      )}
    </View>
  );
}
