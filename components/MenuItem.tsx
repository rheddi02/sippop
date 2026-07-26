import { CatalogItem } from "@/utils/types";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  CARD_BOTTOM_MARGIN,
  ROW_CARD_WIDTH,
  getCardImageHeight,
  getGridCardWidth,
} from "../constants/productCard";
import { RADIUS, SPACING } from "../constants/spacing";
import FavoriteButton from "./FavoriteButton";
import MenuItemPlaceholder from "./MenuItemPlaceholder";
import MenuItemPrice from "./MenuItemPrice";
import ProductBadge from "./ProductBadge";
import { ThemedCard } from "./ThemedCard";
import { ThemedText } from "./ThemedText";

interface MenuItemProps {
  item: CatalogItem;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  layout?: "grid" | "row";
  badge?: string;
}

const AnimatedCard = Animated.createAnimatedComponent(ThemedCard);

export default function MenuItem({
  item,
  isFavorite = false,
  onToggleFavorite,
  layout = "grid",
  badge,
}: MenuItemProps) {
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = layout === "row" ? ROW_CARD_WIDTH : getGridCardWidth(screenWidth);
  const imageHeight = getCardImageHeight(cardWidth);

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleToggleFavorite = () => {
    onToggleFavorite?.(item.id);
  };

  const handleItemPress = () => {
    router.push(`/item/${item.id}`);
  };

  return (
    <Pressable
      onPress={handleItemPress}
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 15 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15 });
      }}
    >
      <AnimatedCard
        variant="elevated"
        padding={0}
        borderRadius={RADIUS.md}
        style={[styles.container, animatedStyle, { width: cardWidth }]}
      >
        <View style={styles.favoriteButton}>
          <FavoriteButton isFavorite={isFavorite} onToggle={handleToggleFavorite} size="small" />
        </View>

        {!!badge && <ProductBadge label={badge} />}

        <View style={{ width: cardWidth, height: imageHeight }}>
          {item.image ? (
            <Image
              source={item.image}
              style={styles.image}
              contentFit="cover"
              transition={150}
            />
          ) : (
            <MenuItemPlaceholder name={item.name} size={cardWidth} height={imageHeight} borderRadius={0} />
          )}
        </View>

        <View style={styles.contentContainer}>
          <ThemedText
            type="defaultSemiBold"
            style={styles.name}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.name}
          </ThemedText>

          <View style={styles.priceRow}>
            <MenuItemPrice sizes={item.sizes} />
          </View>
        </View>
      </AnimatedCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginHorizontal: 4,
    marginBottom: CARD_BOTTOM_MARGIN,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  favoriteButton: {
    position: "absolute",
    top: SPACING.sm,
    left: SPACING.sm,
    zIndex: 1,
  },
  name: {
    marginBottom: 2,
  },
});
