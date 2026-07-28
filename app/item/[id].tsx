import { fetchMenu } from "@/api/menu";
import FavoriteButton from "@/components/FavoriteButton";
import MenuItemPlaceholder from "@/components/MenuItemPlaceholder";
import OptionPillRow from "@/components/OptionPillRow";
import ThemedLoader from "@/components/ThemedLoader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SPACING } from "@/constants/spacing";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useThemeColors } from "@/context/ThemeContext";
import { toCartItem } from "@/utils/cart";
import { CatalogItem, SizeOption } from "@/utils/types";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// The glass sheet always sits over a photo, so its palette is fixed
// (warm-dark glass, white text) instead of following the light/dark app
// theme. Values match the "Apple Wallet / Starbucks Reserve" spec exactly.
const ACCENT = "#F6A23A";
const ACCENT_TEXT_DARK = "#1B130D";
// Android's BlurView renders noticeably flatter/grayer than iOS at the same
// intensity, so the tint needs more opacity than the original 0.45 spec
// value for the warm-espresso character to actually read on Android.
const GLASS_BG = "rgba(28,18,12,0.30)";
const GLASS_BG_OPAQUE = "rgba(28,18,12,1)";
const GLASS_BG_SOLID = "rgba(28,18,12,0.94)";
const GLASS_BORDER = "rgba(255,255,255,0.08)";
const TEXT_WHITE = "#FFFFFF";
const TEXT_MUTED = "rgba(255,255,255,0.82)";
const CHIP_BG_INACTIVE = "rgba(255,255,255,0.08)";
const CHIP_TEXT_INACTIVE = "rgba(255,255,255,0.65)";
const CHIP_BG_ACTIVE = "rgba(246,162,58,0.18)";
const ICON_BUTTON_BG = "rgba(0,0,0,0.32)";
const STEPPER_BG = "rgba(255,255,255,0.08)";
const STEPPER_MINUS_BG = "rgba(0,0,0,0.35)";

const ICE_OPTIONS = ["Normal", "Less"];

const SIZE_TIER_LABELS: Record<string, string> = {
  "8oz": "Small",
  "12oz": "Medium",
  "16oz": "Large",
};

export default function ItemView() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useThemeColors();
  const { height: windowHeight } = useWindowDimensions();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const insets = useSafeAreaInsets();

  const [menu, setMenu] = useState<CatalogItem[] | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizeOption | undefined>(
    undefined,
  );
  const [quantity, setQuantity] = useState(1);
  const [sweetness, setSweetness] = useState("Original");
  const [ice, setIce] = useState("Normal");
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  const item = menu?.find((i) => i.id === id);
  // Only offered once a product actually has more than one real size variant.
  const sizeApplicable = !!item && item.sizes.length > 1;
  const availableSizes = sizeApplicable ? item!.sizes : [];

  useEffect(() => {
    fetchMenu()
      .then(setMenu)
      .catch(() => setMenu([]));
  }, []);

  useEffect(() => {
    if (item && !selectedSize) {
      setSelectedSize(
        item.sizes.find((size) => size.isAvailable) || item.sizes[0],
      );
    }
  }, [item, selectedSize]);

  if (menu === null) {
    return (
      <ThemedView style={[styles.container, styles.notFoundContainer]} gradient>
        <ThemedLoader />
      </ThemedView>
    );
  }

  if (!item || !selectedSize) {
    return (
      <ThemedView style={[styles.container, styles.notFoundContainer]} gradient>
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
    addToCart(
      toCartItem(
        item,
        selectedSize,
        quantity,
        sweetness !== "Original" ? sweetness : undefined,
        ice !== "Normal" ? ice : undefined,
      ),
    );
    router.back();
  };

  const handleToggleFavorite = () => {
    toggleFavorite(item.id);
  };

  return (
    <ThemedView style={styles.container} gradient>
      {/* Fixed hero backdrop, pinned behind everything, full screen */}
      <View style={styles.backdrop} pointerEvents="none">
        {item.image ? (
          <Image
            source={item.image}
            style={styles.backdropFill}
            contentFit="cover"
            transition={150}
          />
        ) : (
          <View
            style={[
              styles.backdropFill,
              styles.backdropPlaceholder,
              { backgroundColor: theme.card },
            ]}
          >
            <MenuItemPlaceholder
              name={item.name}
              size={220}
              borderRadius={16}
            />
          </View>
        )}
      </View>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconButton}
        >
          <Ionicons name="arrow-back" size={20} color={TEXT_WHITE} />
        </TouchableOpacity>
        <ThemedText type="subtitle" style={styles.headerTitle}>
          Details
        </ThemedText>
        <FavoriteButton
          isFavorite={isFavorite(item.id)}
          onToggle={handleToggleFavorite}
          size="large"
          style={styles.iconButton}
        />
      </View>

      {/* Glassmorphism bottom sheet */}
      <View style={[styles.glassSheet, { height: windowHeight * 0.62 }]}>
        <BlurView
          intensity={32}
          tint="dark"
          experimentalBlurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={[GLASS_BG, GLASS_BG_OPAQUE]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.sheetInner}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sheetScrollContent}
          >
            {/* Header row: name + rating, quantity stepper */}
            <View style={styles.headerRow}>
              <View style={styles.headerRowLeft}>
                <ThemedText style={styles.productName} numberOfLines={2}>
                  {item.name}
                </ThemedText>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={18} color={ACCENT} />
                  <ThemedText style={styles.ratingText}>4.9/5</ThemedText>
                </View>
              </View>

              <View style={styles.stepper}>
                <TouchableOpacity
                  style={[
                    styles.stepperButton,
                    { backgroundColor: STEPPER_MINUS_BG },
                  ]}
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Ionicons name="remove" size={18} color={TEXT_WHITE} />
                </TouchableOpacity>
                <ThemedText style={styles.stepperCount}>{quantity}</ThemedText>
                <TouchableOpacity
                  style={[styles.stepperButton, { backgroundColor: ACCENT }]}
                  onPress={() => setQuantity(quantity + 1)}
                >
                  <Ionicons name="add" size={18} color={ACCENT_TEXT_DARK} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Size */}
            <View style={styles.optionGroup}>
              <ThemedText style={styles.optionTitle}>Size</ThemedText>
              <View style={styles.chipRow}>
                {sizeApplicable ? (
                  availableSizes.map((size) => {
                    const active = selectedSize.name === size.name;
                    return (
                      <TouchableOpacity
                        key={size.name}
                        disabled={!size.isAvailable}
                        onPress={() =>
                          size.isAvailable && setSelectedSize(size)
                        }
                        style={[
                          styles.chip,
                          styles.chipStacked,
                          active ? styles.chipActive : styles.chipInactive,
                          !size.isAvailable && styles.chipDisabled,
                        ]}
                      >
                        {!!SIZE_TIER_LABELS[size.name] && (
                          <ThemedText
                            style={[
                              styles.chipLabel,
                              active && styles.chipTextActive,
                            ]}
                          >
                            {SIZE_TIER_LABELS[size.name]}
                          </ThemedText>
                        )}
                        <ThemedText
                          style={[
                            styles.chipText,
                            active && styles.chipTextActive,
                          ]}
                        >
                          {size.name}
                        </ThemedText>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <View
                    style={[
                      styles.chip,
                      styles.chipStacked,
                      styles.chipActive,
                      styles.chipDisabledSelected,
                    ]}
                  >
                    <ThemedText
                      style={[styles.chipLabel, styles.chipTextActive]}
                    >
                      {SIZE_TIER_LABELS["16oz"]}
                    </ThemedText>
                    <ThemedText
                      style={[styles.chipText, styles.chipTextActive]}
                    >
                      16oz
                    </ThemedText>
                  </View>
                )}
              </View>
            </View>

            {/* Sweetness — admin-controlled per product, not every category has it */}
            {item.hasSweetener && (
              <OptionPillRow
                label="Sweetener"
                options={["Original", "75%", "50%"]}
                selected={sweetness}
                onSelect={setSweetness}
              />
            )}

            {/* Ice */}
            <OptionPillRow
              label="Ice"
              options={ICE_OPTIONS}
              selected={ice}
              onSelect={setIce}
            />

            {/* Description */}
            {!!item.description && (
              <View style={styles.optionGroup}>
                <ThemedText style={styles.optionTitle}>Description</ThemedText>
                <View>
                  <ThemedText
                    style={styles.descriptionText}
                    numberOfLines={descriptionExpanded ? undefined : 3}
                  >
                    {item.description}
                  </ThemedText>
                  {!descriptionExpanded && (
                    <LinearGradient
                      colors={["transparent", GLASS_BG_SOLID]}
                      style={styles.descriptionFade}
                      pointerEvents="none"
                    />
                  )}
                </View>
                <TouchableOpacity
                  onPress={() =>
                    setDescriptionExpanded((expanded) => !expanded)
                  }
                  hitSlop={8}
                >
                  <ThemedText style={styles.seeMore}>
                    {descriptionExpanded ? "See less" : "See more"}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          {/* Bottom action bar, pinned inside the glass sheet */}
          <View
            style={[
              styles.bottomBar,
              { paddingBottom: SPACING.xxl + insets.bottom },
            ]}
          >
            <View style={styles.priceContainer}>
              <ThemedText style={styles.totalLabel}>Total</ThemedText>
              <ThemedText style={styles.totalPrice}>₱{totalPrice}</ThemedText>
            </View>
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={handleAddToCart}
            >
              <ThemedText style={styles.addToCartText}>Add to Cart</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
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
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  backdropFill: {
    ...StyleSheet.absoluteFillObject,
  },
  backdropPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
    paddingBottom: 15,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ICON_BUTTON_BG,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: ACCENT_TEXT_DARK,
  },

  // Glassmorphism bottom sheet
  glassSheet: {
    position: "absolute",
    left: -1,
    right: -1,
    bottom: 0,
    overflow: "hidden",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: GLASS_BORDER,
    // Shadow cast upward onto the photo above the sheet. iOS-only —
    // Android's `elevation` shadow is omnidirectional (no top-only option)
    // and on a full-bleed, edge-to-edge sheet it renders as unwanted dark
    // banding down the left/right edges, so it's deliberately left unset
    // here rather than approximated.
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  sheetInner: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  sheetScrollContent: {
    paddingHorizontal: 28,
    paddingTop: 28,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  headerRowLeft: {
    flex: 1,
    marginRight: SPACING.md,
  },
  productName: {
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 40,
    color: TEXT_WHITE,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  ratingText: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "500",
    color: TEXT_MUTED,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 52,
    borderRadius: 26,
    paddingHorizontal: 6,
    backgroundColor: STEPPER_BG,
  },
  stepperButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperCount: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "700",
    minWidth: 20,
    textAlign: "center",
    color: TEXT_WHITE,
  },

  optionGroup: {
    marginBottom: 24,
  },
  optionTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "600",
    color: TEXT_WHITE,
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  // Size chips stack a tier label ("Small"/"Medium"/"Large") above the oz
  // value — plain View/TouchableOpacity default to column flex already, this
  // just centers the two lines horizontally against each other.
  chipStacked: {
    alignItems: "center",
  },
  chipLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "500",
    color: CHIP_TEXT_INACTIVE,
  },
  chipActive: {
    backgroundColor: CHIP_BG_ACTIVE,
    borderColor: ACCENT,
  },
  chipInactive: {
    backgroundColor: CHIP_BG_INACTIVE,
    borderColor: GLASS_BORDER,
  },
  chipDisabled: {
    opacity: 0.35,
  },
  // Single-size items: the only size is inherently "selected" (there's
  // nothing else to pick), so it stays visually active/orange rather than
  // reading as an unavailable gray option — just dimmed enough to signal
  // it isn't tappable.
  chipDisabledSelected: {
    opacity: 0.7,
  },
  chipText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "600",
    color: CHIP_TEXT_INACTIVE,
  },
  chipTextActive: {
    color: ACCENT,
  },

  descriptionText: {
    fontSize: 15,
    lineHeight: 21,
    color: TEXT_MUTED,
  },
  descriptionFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 28,
  },
  seeMore: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "700",
    color: ACCENT,
    marginTop: 6,
  },

  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: GLASS_BORDER,
  },
  priceContainer: {},
  totalLabel: {
    fontSize: 13,
    lineHeight: 16,
    color: TEXT_MUTED,
  },
  totalPrice: {
    fontSize: 40,
    lineHeight: 46,
    fontWeight: "800",
    color: TEXT_WHITE,
  },
  addToCartButton: {
    width: "46%",
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ACCENT,
  },
  addToCartText: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "700",
    color: ACCENT_TEXT_DARK,
  },
});
