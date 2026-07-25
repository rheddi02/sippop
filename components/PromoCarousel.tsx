import { useThemeColors } from "@/context/ThemeContext";
import { Image, ImageLoadEventData } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  ViewToken,
  useWindowDimensions,
} from "react-native";
import { PromoConfig } from "../constants/featured";
import { RADIUS, SPACING } from "../constants/spacing";
import { ThemedCard } from "./ThemedCard";
import { ThemedText } from "./ThemedText";

interface PromoCarouselProps {
  promos: PromoConfig[];
}

// Fallback height for color-block promos (no image) and as the initial
// height for image promos before their natural dimensions are known.
const CARD_HEIGHT = 175;
const AUTO_SCROLL_INTERVAL_MS = 5000;

export default function PromoCarousel({ promos }: PromoCarouselProps) {
  const { theme } = useThemeColors();
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = screenWidth - SPACING.xl * 2;
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList<PromoConfig>>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems[0];
      if (first?.index != null) setActiveIndex(first.index);
    }
  ).current;
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  useEffect(() => {
    if (promos.length <= 1) return;

    const timer = setTimeout(() => {
      const nextIndex = (activeIndex + 1) % promos.length;
      listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, AUTO_SCROLL_INTERVAL_MS);

    return () => clearTimeout(timer);
  }, [activeIndex, promos.length]);

  if (promos.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={{ width: cardWidth, alignSelf: "center" }}>
        <FlatList
          ref={listRef}
          data={promos}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(_, index) => ({
            length: cardWidth,
            offset: cardWidth * index,
            index,
          })}
          renderItem={({ item }) => (
            <PromoCard promo={item} width={cardWidth} />
          )}
        />
      </View>
      {promos.length > 1 && (
        <View style={styles.dots}>
          {promos.map((promo, index) => (
            <View
              key={promo.id}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === activeIndex ? theme.primary : theme.border,
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

function PromoCard({ promo, width }: { promo: PromoConfig; width: number }) {
  const { theme } = useThemeColors();
  const textColor = promo.image ? "#FFFFFF" : theme.text;
  const [imageHeight, setImageHeight] = useState(CARD_HEIGHT);

  const handleImageLoad = ({ source }: ImageLoadEventData) => {
    if (source.width > 0 && source.height > 0) {
      setImageHeight(width / (source.width / source.height));
    }
  };

  const cardHeight = promo.image ? imageHeight : CARD_HEIGHT;

  const card = (
    <ThemedCard
      variant={promo.image ? "default" : "filled"}
      borderRadius={RADIUS.md}
      padding={0}
      margin={0}
      style={[styles.card, { width, height: cardHeight }]}
    >
      {!!promo.image && (
        <Image
          source={promo.image}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          onLoad={handleImageLoad}
        />
      )}
      {!promo.image && (
        <View style={styles.textOverlay}>
          <ThemedText type="subtitle" style={{ color: textColor }}>
            {promo.title}
          </ThemedText>
          {!!promo.subtitle && (
            <ThemedText
              type="caption"
              style={{ color: textColor, opacity: 0.85 }}
            >
              {promo.subtitle}
            </ThemedText>
          )}
        </View>
      )}
    </ThemedCard>
  );

  if (!promo.route) return card;

  return (
    <Pressable onPress={() => router.push(promo.route as never)}>
      {card}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.sm,
  },
  card: {
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  textOverlay: {
    padding: SPACING.lg,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: SPACING.xs,
    marginTop: SPACING.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
