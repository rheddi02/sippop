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
      {sizes.map((size) => (
        <ThemedText
          key={size.name}
          style={[
            styles.price,
            { borderColor: theme.border },
            sizes.indexOf(size) === 0 ? styles.firstItem : null,
            sizes.indexOf(size) === sizes.length - 1 ? styles.lastItem : null,
          ]}
        >
          <Text style={{ color: theme.muted }}>{size.name}: &nbsp;</Text>
          <Text style={{ color: theme.secondary }}>
            {formatPesoForPrice(size.price)}
          </Text>
        </ThemedText>
      ))}
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
    fontSize: 16,
    fontWeight: "bold",
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  firstItem: {
    paddingLeft: 10,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  lastItem: {
    paddingRight: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
});
