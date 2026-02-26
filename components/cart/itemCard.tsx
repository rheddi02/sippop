import EmptyCart from "@/components/cart/emptyCart";
import ItemName from "@/components/cart/itemName";
import ItemPrice from "@/components/cart/itemPrice";
import ItemQuantity from "@/components/cart/itemQuantity";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColors } from "@/context/ThemeContext";
import React from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";
import ItemSummary from "./itemSummary";

type Props = {
  cart: any[];
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  handleCheckout: () => void;
  loading: boolean;
};
const ItemCard = ({
  cart,
  updateQuantity,
  removeFromCart,
  handleCheckout,
  loading,
}: Props) => {
  const { theme } = useThemeColors();

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyCart />}
        renderItem={({ item }) => (
          <ThemedView
            style={[
              styles.cartItem,
              { backgroundColor: theme.border, borderRadius: 8 },
            ]}
          >
            <ThemedView
              style={{
                padding: 8,
                marginRight: 12,
                borderRadius: 8,
                overflow: "hidden",
                backgroundColor: theme.muted + 20,
              }}
            >
              <Image source={item.image} style={styles.image} />
            </ThemedView>
            <View style={[styles.item]}>
              <ItemName item={item} removeFromCart={removeFromCart} />
              <View style={styles.itemPriceQuantity}>
                <ItemPrice item={item} />
                <ItemQuantity
                  item={item}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              </View>
            </View>
          </ThemedView>
        )}
      />

      <ItemSummary {...{ cart, handleCheckout, loading }} />
    </ThemedView>
  );
};

export default ItemCard;

const styles = StyleSheet.create({
  cartItem: {
    padding: 12,
    flexDirection: "row",
    marginBottom: 12,
  },
  item: {
    flex: 1,
    flexDirection: "column",
    gap: 10,
  },

  itemPriceQuantity: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  image: {
    height: 100,
    width: 100,
  },
});
