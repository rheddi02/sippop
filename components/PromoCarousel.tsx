import { useThemeColors } from "@/context/ThemeContext";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
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

const CARD_HEIGHT = 140;

export default function PromoCarousel({ promos }: PromoCarouselProps) {
  const { theme } = useThemeColors();
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = screenWidth - SPACING.xl * 2;
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems[0];
      if (first?.index != null) setActiveIndex(first.index);
    }
  ).current;
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  if (promos.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={{ width: cardWidth, alignSelf: "center" }}>
        <FlatList
          data={promos}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
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

  const card = (
    <ThemedCard
      variant={promo.image ? "default" : "filled"}
      borderRadius={RADIUS.md}
      padding={0}
      margin={0}
      style={[styles.card, { width, height: CARD_HEIGHT }]}
    >
      {!!promo.image && (
        <Image
          source={promo.image}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
        />
      )}
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
