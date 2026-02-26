import { useThemeColors } from "@/context";
import { CartItem } from "@/utils/types";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { formatPesoForPrice } from "@/utils/amountHelper";

const ItemPrice = ({ item }: { item: CartItem }) => {
  const { theme } = useThemeColors();
  return (
    <View>
      <ThemedText style={styles.itemPrice}>
        {formatPesoForPrice(item.price)}
      </ThemedText>
      <ThemedText style={{ color: theme.muted }}>{item.size}</ThemedText>
    </View>
  );
};

export default ItemPrice

const styles = StyleSheet.create({
    itemPrice: {
    fontSize: 20,
    fontWeight: "500",
  },
})