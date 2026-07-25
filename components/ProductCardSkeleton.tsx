import { useThemeColors } from "@/context/ThemeContext";
import React from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import {
  ROW_CARD_WIDTH,
  getCardImageHeight,
  getGridCardWidth,
} from "../constants/productCard";
import { RADIUS, SPACING } from "../constants/spacing";
import { ThemedCard } from "./ThemedCard";

interface ProductCardSkeletonProps {
  layout?: "grid" | "row";
}

export default function ProductCardSkeleton({
  layout = "grid",
}: ProductCardSkeletonProps) {
  const { theme } = useThemeColors();
  const { width: screenWidth } = useWindowDimensions();

  const cardWidth = layout === "row" ? ROW_CARD_WIDTH : getGridCardWidth(screenWidth);
  const imageHeight = getCardImageHeight(cardWidth);
  const blockColor = theme.border;

  return (
    <ThemedCard
      variant="elevated"
      padding={0}
      borderRadius={RADIUS.md}
      style={[styles.container, { width: cardWidth }]}
    >
      <View style={{ width: cardWidth, height: imageHeight, backgroundColor: blockColor }} />
      <View style={styles.textBlock}>
        <View style={[styles.line, { width: "80%", backgroundColor: blockColor }]} />
        <View style={[styles.line, { width: "40%", backgroundColor: blockColor }]} />
      </View>
    </ThemedCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 4,
    marginBottom: 8,
  },
  textBlock: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  line: {
    height: 12,
    borderRadius: 4,
    marginTop: SPACING.xs,
  },
});
