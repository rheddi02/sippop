import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";

type Props = {
  item: {
    id: string;
    name: string;
  };
  removeFromCart: (id: string) => void;
};
const ItemName = ({ item, removeFromCart }: Props) => {
  return (
    <View style={styles.headerRow}>
      <ThemedText style={styles.itemName}>{item.name}</ThemedText>
    </View>
  );
};
export default ItemName;
const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "800",
    flexShrink: 1,
    marginRight: 8,
    flex: 1,
  },
  deleteButton: {
    marginLeft: "auto",
    flexShrink: 0,
  },
});
