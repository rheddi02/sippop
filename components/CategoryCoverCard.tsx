import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";
import { CATEGORY_LABELS } from "@/constants/categories";
import { getCardImageHeight } from "@/constants/productCard";
import { RADIUS, SPACING } from "@/constants/spacing";
import { CategoryCover } from "@/utils/categoryCovers";
import { ThemedCard } from "./ThemedCard";
import { ThemedText } from "./ThemedText";

export const CARD_WIDTH = 160;
// 2:3 portrait, same ratio as the product grid's own card image
// (constants/productCard.ts's getCardImageHeight).
export const CARD_HEIGHT = getCardImageHeight(CARD_WIDTH);

export default function CategoryCoverCard({
  cover,
  onPress,
}: {
  cover: CategoryCover;
  onPress: (categoryId: string) => void;
}) {
  return (
    <Pressable onPress={() => onPress(cover.categoryId)}>
      <ThemedCard
        variant="default"
        borderRadius={RADIUS.md}
        padding={0}
        margin={0}
        style={styles.card}
      >
        <Image
          source={cover.image}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
        />
        <View style={styles.overlay}>
          <ThemedText type="label" style={styles.title} numberOfLines={2}>
            {CATEGORY_LABELS[cover.categoryId] ?? cover.categoryId}
          </ThemedText>
        </View>
      </ThemedCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    justifyContent: "flex-end",
    overflow: "hidden",
    marginRight: SPACING.sm,
  },
  overlay: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
