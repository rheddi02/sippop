import { useContext } from "react";
import { FlatList, Text, View } from "react-native";
import { OrdersContext } from "../../context/OrdersContext";

export default function OrdersScreen() {
  const { orders } = useContext(OrdersContext);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No orders yet.</Text>}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              borderBottomWidth: 1,
              borderColor: "#ccc",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Order #{item.id}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Total: ₱{item.total}</Text>
            <Text>Date: {item.createdAt.toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}
