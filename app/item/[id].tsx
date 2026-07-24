import { fetchMenu } from "@/api/menu";
import FavoriteButton from "@/components/FavoriteButton";
import MenuItemPlaceholder from "@/components/MenuItemPlaceholder";
import { ThemedCard } from "@/components/ThemedCard";
import ThemedLoader from "@/components/ThemedLoader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useThemeColors } from "@/context/ThemeContext";
import { toCartItem } from "@/utils/cart";
import { CatalogItem, SizeOption } from "@/utils/types";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ItemView() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useThemeColors();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const insets = useSafeAreaInsets();

  const [menu, setMenu] = useState<CatalogItem[] | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizeOption | undefined>(
    undefined,
  );
  const [quantity, setQuantity] = useState(1);

  // Parallax + entrance animation
  const scrollY = useSharedValue(0);
  const heroProgress = useSharedValue(0);
  const imageHeight = 300;
  const parallaxFactor = 0.5;

  const item = menu?.find((i) => i.id === id);

  useEffect(() => {
    fetchMenu()
      .then(setMenu)
      .catch(() => setMenu([]));
  }, []);

  useEffect(() => {
    if (item && !selectedSize) {
      setSelectedSize(item.sizes.find((size) => size.isAvailable) || item.sizes[0]);
    }
  }, [item, selectedSize]);

  React.useEffect(() => {
    heroProgress.value = withDelay(50, withSpring(1, { damping: 16 }));
  }, [heroProgress]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const heroAnimatedStyle = useAnimatedStyle(() => {
    const parallaxTranslateY = interpolate(
      scrollY.value,
      [-imageHeight, 0, imageHeight],
      [-imageHeight * parallaxFactor, 0, imageHeight * parallaxFactor],
      "clamp",
    );
    const parallaxScale = interpolate(
      scrollY.value,
      [-imageHeight, 0, imageHeight],
      [1.2, 1, 0.8],
      "clamp",
    );
    const entranceScale = interpolate(heroProgress.value, [0, 1], [0.9, 1]);
    const entranceOpacity = heroProgress.value;

    return {
      opacity: entranceOpacity,
      transform: [
        { translateY: parallaxTranslateY },
        { scale: parallaxScale * entranceScale },
      ],
    };
  });

  if (menu === null) {
    return (
      <ThemedView style={[styles.container, styles.notFoundContainer]}>
        <ThemedLoader />
      </ThemedView>
    );
  }

  if (!item || !selectedSize) {
    return (
      <ThemedView style={[styles.container, styles.notFoundContainer]}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.muted} />
        <ThemedText type="subtitle" style={{ marginTop: 12 }}>
          Item not found
        </ThemedText>
        <TouchableOpacity
          style={[styles.backToMenuButton, { backgroundColor: theme.primary }]}
          onPress={() => router.back()}
        >
          <ThemedText style={{ color: theme.background }}>Go back</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const basePrice = selectedSize.price;
  const totalPrice = basePrice * quantity;

  const handleAddToCart = () => {
    addToCart(toCartItem(item, selectedSize, quantity));
    router.back();
  };

  const handleToggleFavorite = () => {
    toggleFavorite(item.id);
  };

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header */}
      <ThemedView
        style={[
          styles.header,
          {
            backgroundColor: theme.background,
            borderBottomColor: theme.border,
            paddingTop: insets.top + 10,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <FavoriteButton
          isFavorite={isFavorite(item.id)}
          onToggle={handleToggleFavorite}
          size="large"
        />
      </ThemedView>

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Beverage Image with Parallax */}
        <ThemedView style={styles.imageContainer}>
          <Animated.View style={heroAnimatedStyle}>
            <MenuItemPlaceholder name={item.name} size={220} borderRadius={16} />
          </Animated.View>
        </ThemedView>

        {/* Item Info */}
        <ThemedCard style={[styles.infoContainer]}>
          <ThemedText style={[styles.itemName, { color: theme.text }]}>
            {item.name}
          </ThemedText>
          {!!item.description && (
            <ThemedText style={[styles.itemDescription, { color: theme.muted }]}>
              {item.description}
            </ThemedText>
          )}
        </ThemedCard>

        {/* Size Selection */}
        <ThemedView
          style={[styles.sectionContainer, { backgroundColor: theme.card }]}
        >
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
            Size
          </ThemedText>
          <View style={styles.sizeContainer}>
            {item.sizes.map((size) => (
              <TouchableOpacity
                key={size.name}
                style={[
                  styles.sizeOption,
                  {
                    borderColor:
                      selectedSize.name === size.name
                        ? theme.primary
                        : !size.isAvailable
                          ? theme.muted
                          : theme.border,
                    backgroundColor:
                      selectedSize.name === size.name
                        ? theme.primary
                        : !size.isAvailable
                          ? theme.muted + "20"
                          : "transparent",
                  },
                  !size.isAvailable && styles.disabledSize,
                ]}
                onPress={() => size.isAvailable && setSelectedSize(size)}
                disabled={!size.isAvailable}
              >
                {size.temperature && (
                  <Ionicons
                    name={size.temperature === "hot" ? "flame" : "snow"}
                    size={14}
                    color={
                      selectedSize.name === size.name
                        ? theme.background
                        : !size.isAvailable
                          ? theme.muted
                          : theme.muted
                    }
                    style={styles.tempIcon}
                  />
                )}
                <ThemedText
                  style={[
                    styles.sizeText,
                    {
                      color:
                        selectedSize.name === size.name
                          ? theme.background
                          : !size.isAvailable
                            ? theme.muted
                            : theme.text,
                    },
                  ]}
                >
                  {size.name}
                  {size.temperature ? ` · ${size.temperature === "hot" ? "Hot" : "Iced"}` : ""}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.sizePrice,
                    {
                      color:
                        selectedSize.name === size.name
                          ? theme.background
                          : !size.isAvailable
                            ? theme.muted
                            : theme.muted,
                    },
                  ]}
                >
                  ₱{size.price}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </ThemedView>

        {/* Quantity Selection */}
        <ThemedView
          style={[styles.sectionContainer, { backgroundColor: theme.card }]}
        >
          <ThemedView
            style={[
              styles.quantityContainer,
              { backgroundColor: theme.primary },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.quantityButton,
                { backgroundColor: theme.primary },
              ]}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Ionicons name="remove" size={20} color={theme.background} />
            </TouchableOpacity>
            <ThemedText
              style={[styles.quantityText, { color: theme.background }]}
            >
              {quantity}
            </ThemedText>
            <TouchableOpacity
              style={[
                styles.quantityButton,
                { backgroundColor: theme.primary },
              ]}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Ionicons name="add" size={20} color={theme.background} />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </Animated.ScrollView>

      {/* Bottom Bar */}
      <ThemedView
        style={[
          styles.bottomBar,
          { backgroundColor: theme.background, borderTopColor: theme.border },
        ]}
      >
        <ThemedView style={styles.priceContainer}>
          <ThemedText style={[styles.totalLabel, { color: theme.muted }]}>
            Total
          </ThemedText>
          <ThemedText style={[styles.totalPrice, { color: theme.text }]}>
            ₱{totalPrice}
          </ThemedText>
        </ThemedView>
        <TouchableOpacity
          style={[styles.addToCartButton, { backgroundColor: theme.primary }]}
          onPress={handleAddToCart}
        >
          <ThemedText
            style={[styles.addToCartText, { color: theme.background }]}
          >
            Add to Cart
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notFoundContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  backToMenuButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    alignItems: "center",
    height: 400,
    justifyContent: "center",
    marginBottom: 10,
    overflow: "hidden",
  },
  infoContainer: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  itemName: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 35,
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 20,
  },
  sectionContainer: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  sizeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  sizeOption: {
    flex: 1,
    minWidth: "45%",
    padding: 8,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
  },
  disabledSize: {
    opacity: 0.6,
  },
  tempIcon: {
    marginBottom: 2,
  },
  sizeText: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  sizePrice: {
    fontSize: 18,
    fontWeight: "800",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  quantityButton: {
    width: "40%",
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: "center",
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    borderTopWidth: 1,
  },
  priceContainer: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 14,
  },
  totalPrice: {
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
  },
  addToCartButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
  },
  addToCartText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
