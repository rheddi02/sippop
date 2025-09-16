import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useOrders } from "../../context/OrdersContext";

export default function OrdersScreen() {
  const { orders } = useOrders();

  return (
    <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <ThemedText style={{ fontSize: 18, marginBottom: 20 }}>This page is under development.</ThemedText>
      </ThemedView>
  )
  // return (
  //   <ThemedView style={{ flex: 1, padding: 16 }}>
  //     <FlatList
  //       data={orders}
  //       keyExtractor={(item) => item.id}
  //       ListEmptyComponent={<ThemedText>No orders yet.</ThemedText>}
  //       renderItem={({ item }) => (
  //         <View
  //           style={{
  //             padding: 12,
  //             borderBottomWidth: 1,
  //             borderColor: "#ccc",
  //           }}
  //         >
  //           <Text style={{ fontWeight: "bold" }}>Order #{item.id}</Text>
  //           <Text>Status: {item.status}</Text>
  //           <Text>Total: ₱{item.total}</Text>
  //           <Text>Date: {item.createdAt.toLocaleString()}</Text>
  //         </View>
  //       )}
  //     />
  //   </ThemedView>
  // );
}
