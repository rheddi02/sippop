import { Image } from "expo-image";
import { Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { getCardImageHeight } from "@/constants/productCard";
import { RADIUS, SPACING } from "@/constants/spacing";
import { CategoryCover } from "@/utils/categoryCovers";
import { ThemedCard } from "./ThemedCard";

const CARD_GAP = SPACING.sm; // matches the card's own marginRight below
// Fraction of the next card left peeking at the row's edge, so the row
// reads as "one full card, plus a hint there's more" instead of a cramped
// strip of several small, hard-to-read cards.
const PEEK_FRACTION = 0.3;

export function getCategoryCoverCardWidth(screenWidth: number): number {
  const visibleWidth = screenWidth - SPACING.xl * 2; // same canonical gutter as constants/productCard.ts's getGridCardWidth
  return (visibleWidth - CARD_GAP) / (1 + PEEK_FRACTION);
}

export default function CategoryCoverCard({
  cover,
  onPress,
}: {
  cover: CategoryCover;
  onPress: (categoryId: string) => void;
}) {
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = getCategoryCoverCardWidth(screenWidth);
  // 2:3 portrait, same ratio as the product grid's own card image
  // (constants/productCard.ts's getCardImageHeight).
  const cardHeight = getCardImageHeight(cardWidth);

  return (
    <Pressable onPress={() => onPress(cover.categoryId)}>
      <ThemedCard
        variant="default"
        borderRadius={RADIUS.md}
        padding={0}
        margin={0}
        style={[styles.card, { width: cardWidth, height: cardHeight }]}
      >
        <Image
          source={cover.image}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
        />
      </ThemedCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    marginRight: CARD_GAP,
  },
});
