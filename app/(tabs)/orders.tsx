import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FlatList, Text, View } from "react-native";
import { useOrders } from "../../context/OrdersContext";

export default function OrdersScreen() {
  const { orders } = useOrders();

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<ThemedText>No orders yet.</ThemedText>}
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
    </ThemedView>
  );
}
