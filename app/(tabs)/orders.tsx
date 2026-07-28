import ScreenHeader from "@/components/ScreenHeader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FLOATING_NAV_CLEARANCE } from "@/constants/spacing";
import { useThemeColors } from "@/context/ThemeContext";
import { formatPesoForCart } from "@/utils/amountHelper";
import { Order } from "@/utils/types";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useOrders } from "../../context/OrdersContext";

const STATUS_LABELS: Record<Order["status"], string> = {
  pending: "Pending",
  preparing: "Preparing",
  ready: "Ready for pickup",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrdersScreen() {
  const { orders, loading, refresh } = useOrders();
  const { theme } = useThemeColors();

  useFocusEffect(
    useCallback(() => {
      refresh();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  return (
    <>
      <ThemedView style={styles.container} gradient>
        <ScreenHeader title="Orders" />
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          refreshing={loading}
          onRefresh={refresh}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <ThemedText
              style={{ color: theme.muted, textAlign: "center", marginTop: 40 }}
            >
              {loading ? "Loading orders..." : "No orders yet."}
            </ThemedText>
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.card,
                { borderColor: theme.border, backgroundColor: theme.card },
              ]}
            >
              <View style={styles.row}>
                <ThemedText type="defaultSemiBold">
                  {item.createdAt.toLocaleDateString()}{" "}
                  {item.createdAt.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </ThemedText>
                <ThemedText
                  style={{
                    color:
                      item.status === "cancelled"
                        ? theme.danger
                        : theme.primary,
                    fontWeight: "600",
                  }}
                >
                  {STATUS_LABELS[item.status]}
                </ThemedText>
              </View>
              {item.items.map((line, index) => (
                <ThemedText
                  key={index}
                  type="caption"
                  style={{ color: theme.muted }}
                >
                  {line.quantity}x {line.name} ({line.size})
                </ThemedText>
              ))}
              <View style={[styles.row, { marginTop: 8 }]}>
                <ThemedText type="caption" style={{ color: theme.muted }}>
                  {item.paymentMethod === "credit"
                    ? "Paid with store credit"
                    : "Cash on pickup"}
                  {" · +"}
                  {item.pointsEarned} pts
                </ThemedText>
                <ThemedText type="defaultSemiBold">
                  {formatPesoForCart(item.total)}
                </ThemedText>
              </View>
            </View>
          )}
        />
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: FLOATING_NAV_CLEARANCE,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
});
