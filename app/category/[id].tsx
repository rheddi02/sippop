import { fetchMenu } from "@/api/menu";
import EmptyState from "@/components/EmptyState";
import ThemedLoader from "@/components/ThemedLoader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CATEGORY_LABELS } from "@/constants/categories";
import { RADIUS, SPACING } from "@/constants/spacing";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useThemeColors } from "@/context/ThemeContext";
import { CatalogItem, CategoryId } from "@/utils/types";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MenuItem from "@/components/MenuItem";

const CATEGORY_IDS = Object.keys(CATEGORY_LABELS) as CategoryId[];

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useThemeColors();
  const insets = useSafeAreaInsets();
  const { cart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [menu, setMenu] = useState<CatalogItem[] | null>(null);

  useEffect(() => {
    fetchMenu()
      .then(setMenu)
      .catch(() => setMenu([]));
  }, []);

  // id is a plain route-param string, not a closed CategoryId union — fall
  // back to the raw id itself for a malformed/unexpected deep link instead
  // of throwing.
  const label = CATEGORY_LABELS[id as CategoryId] ?? id;

  const items = useMemo(
    () => (menu ?? []).filter((item) => item.category === id),
    [menu, id],
  );

  // Only pill categories that actually have products, and only bother
  // showing the row at all if there's somewhere else to switch to.
  const categoryPills = useMemo(() => {
    if (!menu) return [];
    return CATEGORY_IDS.map((categoryId) => ({
      id: categoryId,
      label: CATEGORY_LABELS[categoryId],
      count: menu.filter((item) => item.category === categoryId).length,
    })).filter((category) => category.count > 0);
  }, [menu]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ThemedView style={styles.container} gradient>
      <View
        style={[
          styles.header,
          { borderBottomColor: theme.border, paddingTop: insets.top + 10 },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <ThemedText type="subtitle" numberOfLines={1} style={styles.title}>
          {label}
        </ThemedText>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/favorites")}
          hitSlop={8}
        >
          <Ionicons name="heart-outline" size={24} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(tabs)/cart")} hitSlop={8}>
          <View>
            <Ionicons name="cart-outline" size={24} color={theme.text} />
            {cartCount > 0 && (
              <View style={[styles.cartBadge, { backgroundColor: theme.primary }]}>
                <ThemedText style={styles.cartBadgeText}>{cartCount}</ThemedText>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {categoryPills.length > 1 && (
        <ScrollView
          horizontal
          style={styles.pillsWrapper}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsRow}
        >
          {categoryPills.map((category) => {
            const active = category.id === id;
            return (
              <TouchableOpacity
                key={category.id}
                onPress={() => router.replace(`/category/${category.id}`)}
                style={[
                  styles.pill,
                  {
                    backgroundColor: active ? theme.primary : theme.card,
                    borderColor: active ? theme.primary : theme.border,
                  },
                ]}
              >
                <ThemedText
                  type="label"
                  style={{ color: active ? "#FFFFFF" : theme.text }}
                >
                  {category.label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {menu === null ? (
        <View style={styles.loaderContainer}>
          <ThemedLoader />
        </View>
      ) : (
        <FlashList
          style={styles.grid}
          data={items}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <MenuItem
              item={item}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={toggleFavorite}
              layout="grid"
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="cafe-outline"
              title="No drinks in this category yet."
            />
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SPACING.md,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  pillsWrapper: {
    // Bounds the horizontal ScrollView's own height explicitly — without
    // this it has no intrinsic size to fall back to next to the FlashList
    // below (which needs its own explicit flex: 1, see styles.grid) and
    // was stretching to fill most of the remaining screen.
    flexGrow: 0,
    flexShrink: 0,
    height: 36 + SPACING.md * 2,
  },
  pillsRow: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  grid: {
    flex: 1,
  },
  pill: {
    height: 36,
    justifyContent: "center",
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
  },
  title: {
    flex: 1,
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    lineHeight: 12,
    fontWeight: "700",
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gridContainer: {
    paddingHorizontal: SPACING.xl - SPACING.xs,
    paddingTop: SPACING.lg,
  },
});
