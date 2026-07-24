import { CatalogItem } from "@/utils/types";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import FavoriteButton from "./FavoriteButton";
import MenuItemPlaceholder from "./MenuItemPlaceholder";
import MenuItemPrice from "./MenuItemPrice";
import { ThemedCard } from "./ThemedCard";
import { ThemedText } from "./ThemedText";

interface MenuItemProps {
  item: CatalogItem;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

const AnimatedCard = Animated.createAnimatedComponent(ThemedCard);

export default function MenuItem({
  item,
  isFavorite = false,
  onToggleFavorite,
}: MenuItemProps) {
  const { width: screenWidth } = useWindowDimensions();
  const flatListPadding = 16; // 8px left + 8px right from gridContainer
  const itemMargin = 16; // 8px margin on each side (4px + 4px from marginHorizontal)
  const itemWidth = (screenWidth - flatListPadding - itemMargin) / 2;

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
        style={[styles.container, animatedStyle, { width: itemWidth, height: 320 }]}
      >
        <View style={styles.favoriteButton}>
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={handleToggleFavorite}
          />
        </View>

        <View style={styles.imageContainer}>
          <MenuItemPlaceholder name={item.name} size={160} />
        </View>

        <View style={styles.contentContainer}>
          <ThemedText
            type="subtitle"
            style={styles.name}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.name}
          </ThemedText>

          {!!item.description && (
            <ThemedText
              type="caption"
              style={styles.description}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.description}
            </ThemedText>
          )}

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
    justifyContent: "space-between",
    marginHorizontal: 4,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 8,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    left: 12,
    zIndex: 1,
  },
  imageContainer: {
    alignItems: "center",
    height: 160,
    justifyContent: "center",
    marginBottom: 8,
    overflow: "hidden",
  },
  name: {
    marginBottom: 4,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
});
