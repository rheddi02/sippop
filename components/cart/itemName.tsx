import { useThemeColors } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedButton } from "../ThemedButton";
import { ThemedText } from "../ThemedText";

type Props = {
  item: {
    id: string;
    name: string;
  };
  removeFromCart: (id: string) => void;
};
const ItemName = ({ item, removeFromCart }: Props) => {
  const { theme } = useThemeColors();
  return (
    <View style={styles.headerRow}>
      <ThemedText style={styles.itemName}>{item.name}</ThemedText>
      <View style={styles.deleteButton}>
        <ThemedButton
          icon={<Ionicons name="trash" size={20} color={theme.danger} />}
          onPress={() => removeFromCart(item.id)}
          style={{ borderRadius: 50, marginTop: 0 }}
          variant="text"
        />
      </View>
    </View>
  );
};
export default ItemName;
const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
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
