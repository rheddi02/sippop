import { useThemeColors } from "@/context";
import { SizeOption } from "@/utils/types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatPesoForPrice } from "../utils/amountHelper";
import { ThemedText } from "./ThemedText";

interface MenuItemPriceProps {
  sizes: Pick<SizeOption, "name" | "price" | "isAvailable">[];
}

export default function MenuItemPrice({ sizes }: MenuItemPriceProps) {
  const { theme } = useThemeColors();

  const available = sizes.filter((s) => s.isAvailable !== false);
  const prices = (available.length ? available : sizes).map((s) => s.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const isRange = min !== max;

  return (
    <View style={styles.container}>
      <ThemedText style={[styles.price]}>
        {isRange && (
          <Text style={{ color: theme.muted, fontSize: 12 }}>from </Text>
        )}
        <Text style={{ color: theme.secondary }}>
          {isRange
            ? `${formatPesoForPrice(min)}–${formatPesoForPrice(max)}`
            : formatPesoForPrice(min)}
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
