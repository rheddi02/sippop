import { useThemeColors } from "@/context";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatPesoForPrice } from "../utils/amountHelper";
import { ThemedText } from "./ThemedText";

interface MenuItemPriceProps {
  sizes: { name: string; price: number }[];
}

export default function MenuItemPrice({ sizes }: MenuItemPriceProps) {
  const { theme } = useThemeColors();

  return (
    <View style={styles.container}>
      <ThemedText key={sizes[0].name} style={[styles.price]}>
        <Text style={{ color: theme.secondary }}>
          {formatPesoForPrice(sizes[0].price)}
        </Text>
        &nbsp;
        <Text style={{ color: theme.muted, fontSize: 12 }}>
          {sizes[0].name}
        </Text>
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 4,
    gap: 6,
  },
  price: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
