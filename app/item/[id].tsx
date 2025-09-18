import { mockMenu } from "@/api/mockData";
import FavoriteButton from "@/components/FavoriteButton";
import { ThemedCard } from "@/components/ThemedCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useThemeColors } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// const { width } = Dimensions.get("window");

export default function ItemView() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useThemeColors();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const insets = useSafeAreaInsets();

  const item = mockMenu.find((pizza) => pizza.id === id)!;

  const [selectedSize, setSelectedSize] = useState(
    item.sizes.find((size) => size.isAvailable) || item.sizes[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // Parallax animation
  const scrollY = useRef(new Animated.Value(0)).current;
  const imageHeight = 300;
  const parallaxFactor = 0.5;

  const basePrice = selectedSize.price;

  // Calculate addon costs
  const addonCosts = selectedAddons.reduce((total, addonName) => {
    const addon = item.addOns?.find(addon => addon.name === addonName);
    return total + (addon?.price || 0);
  }, 0);

  const totalPrice = (basePrice + addonCosts) * quantity;

  const handleAddToCart = () => {
    // const addonNames = selectedAddons.length > 0 ? ` + ${selectedAddons.join(', ')}` : '';
    // addToCart({
    //   id: `${item.id}-${selectedSize.name}${selectedAddons.length > 0 ? `-${selectedAddons.join('-')}` : ''}`,
    //   name: `${item.name} (${selectedSize.name})${addonNames}`,
    //   price: totalPrice,
    //   points: item.points,
    // });
    // router.back();
  };

  const handleToggleFavorite = () => {
    toggleFavorite(item.id);
  };

  const handleToggleAddon = (addonName: string) => {
    setSelectedAddons(prev =>
      prev.includes(addonName)
        ? prev.filter(name => name !== addonName)
        : [...prev, addonName]
    );
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
        <FavoriteButton isFavorite={isFavorite(item.id)}
          onToggle={handleToggleFavorite}
          size="large" />
      </ThemedView>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Beverage Image with Parallax */}
        <ThemedView style={styles.imageContainer}>
          <Animated.Image
            source={item.image}
            style={[
              styles.image,
              {
                transform: [
                  {
                    translateY: scrollY.interpolate({
                      inputRange: [-imageHeight, 0, imageHeight],
                      outputRange: [
                        -imageHeight * parallaxFactor,
                        0,
                        imageHeight * parallaxFactor,
                      ],
                      extrapolate: "clamp",
                    }),
                  },
                  {
                    scale: scrollY.interpolate({
                      inputRange: [-imageHeight, 0, imageHeight],
                      outputRange: [1.2, 1, 0.8],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              },
            ]}
          />
        </ThemedView>

        {/* Item Info */}
        <ThemedCard style={[styles.infoContainer]}>
          <ThemedText style={[styles.itemName, { color: theme.text }]}>
            {item.name}
          </ThemedText>
          <ThemedText style={[styles.itemDescription, { color: theme.muted }]}>
            {item.description}
          </ThemedText>
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
                  selectedSize.name === size.name && styles.selectedSize,
                  !size.isAvailable && styles.disabledSize,
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
                ]}
                onPress={() => size.isAvailable && setSelectedSize(size)}
                disabled={!size.isAvailable}
              >
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

        {/* Addons Selection */}
        {item.addOns && item.addOns.length > 0 && (
          <ThemedView
            style={[styles.sectionContainer, { backgroundColor: theme.card }]}
          >
            <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
              Add-ons
            </ThemedText>
            <View style={styles.addonsContainer}>
              {item.addOns.map((addon) => (
                <TouchableOpacity
                  key={addon.name}
                  style={[
                    styles.addonOption,
                    selectedAddons.includes(addon.name) && styles.selectedAddon,
                    !addon.isAvailable && styles.disabledAddon,
                    {
                      borderColor: selectedAddons.includes(addon.name)
                        ? theme.primary
                        : !addon.isAvailable
                          ? theme.muted
                          : theme.border,
                      backgroundColor: selectedAddons.includes(addon.name)
                        ? theme.primary + "20"
                        : !addon.isAvailable
                          ? theme.muted + "20"
                          : "transparent",
                    },
                  ]}
                  onPress={() => addon.isAvailable && handleToggleAddon(addon.name)}
                  disabled={!addon.isAvailable}
                >
                  <View style={styles.addonContent}>
                    <ThemedText
                      style={[
                        styles.addonName,
                        {
                          color: selectedAddons.includes(addon.name)
                            ? theme.primary
                            : !addon.isAvailable
                              ? theme.muted
                              : theme.text,
                        },
                      ]}
                    >
                      {addon.name}
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.addonPrice,
                        {
                          color: selectedAddons.includes(addon.name)
                            ? theme.primary
                            : !addon.isAvailable
                              ? theme.muted
                              : theme.muted,
                        },
                      ]}
                    >
                      +₱{addon.price}
                    </ThemedText>
                  </View>
                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderColor: selectedAddons.includes(addon.name)
                          ? theme.primary
                          : theme.border,
                        backgroundColor: selectedAddons.includes(addon.name)
                          ? theme.primary
                          : "transparent",
                      },
                    ]}
                  >
                    {selectedAddons.includes(addon.name) && (
                      <Ionicons name="checkmark" size={16} color={theme.background} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ThemedView>
        )}

        {/* Quantity Selection */}
        <ThemedView
          style={[styles.sectionContainer, { backgroundColor: theme.card }]}
        >
          {/* <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
            Quantity
          </ThemedText> */}
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
            <ThemedText style={[styles.quantityText, { color: theme.background }]}>
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
      </ScrollView>

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
        {/* <TouchableOpacity
          style={[styles.addToCartButton, { backgroundColor: theme.primary }]}
          onPress={handleAddToCart}
        >
          <ThemedText
            style={[styles.addToCartText, { color: theme.background }]}
          >
            Add to Cart
          </ThemedText>
        </TouchableOpacity> */}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  favoriteButton: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
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
  image: {
    width: "100%",
    height: 500,
    resizeMode: "contain",
  },
  beverageImage: {
    fontSize: 120,
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
  },
  sizeOption: {
    flex: 1,
    padding: 5,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
  },
  selectedSize: {
    // backgroundColor handled in style prop
  },
  disabledSize: {
    opacity: 0.6,
  },
  sizeText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    letterSpacing: 5,
  },
  sizePrice: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 3,
  },
  addonsContainer: {
    gap: 12,
  },
  addonOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  selectedAddon: {
    // backgroundColor handled in style prop
  },
  disabledAddon: {
    opacity: 0.6,
  },
  addonContent: {
    flex: 1,
  },
  addonName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  addonPrice: {
    fontSize: 14,
    fontWeight: "500",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  quantityButton: {
    width: '40%',
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
  errorText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
});
