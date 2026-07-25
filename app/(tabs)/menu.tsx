import CategoryChips from "@/components/CategoryChips";
import EmptyState from "@/components/EmptyState";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import PromoCarousel from "@/components/PromoCarousel";
import SectionHeader from "@/components/SectionHeader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  COMING_SOON_IDS,
  FALLBACK_PROMOS,
  PromoConfig,
  TOP_SELLING_IDS,
} from "@/constants/featured";
import { fetchPromos } from "@/api/promos";
import { ROW_CARD_WIDTH, getCardHeight } from "@/constants/productCard";
import { SPACING } from "@/constants/spacing";
import { getCategories } from "@/constants/categories";
import { CatalogItem } from "@/utils/types";
import { getCuratedItems } from "@/utils/curatedMenu";
import { getRecommendedItems } from "@/utils/recommendations";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  RefreshControl,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { fetchMenu } from "../../api/menu";
import MenuItem from "../../components/MenuItem";
import { useCart } from "../../context/CartContext";
import { useDrawer } from "../../context/DrawerContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useOrders } from "../../context/OrdersContext";
import { useThemeColors } from "../../context/ThemeContext";
import { useUser } from "@/hooks/useUser";

interface CategoryTab {
  id: string;
  name: string;
  count: number;
}

export default function MenuScreen() {
  const { theme } = useThemeColors();
  const { user } = useUser();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { cart } = useCart();
  const { orders } = useOrders();
  const { openDrawer } = useDrawer();

  const { category: categoryParam } = useLocalSearchParams<{
    category?: string;
  }>();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [menu, setMenu] = useState<CatalogItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState<string | null>(null);
  const [promos, setPromos] = useState<PromoConfig[]>(FALLBACK_PROMOS);

  const loadMenu = async (forceRefresh = false) => {
    try {
      setMenuError(null);
      const data = await fetchMenu(forceRefresh);
      setMenu(data);
    } catch (err) {
      setMenuError(err instanceof Error ? err.message : String(err));
    }
  };

  const loadPromos = async (forceRefresh = false) => {
    try {
      const rows = await fetchPromos(forceRefresh);
      if (rows.length === 0) {
        setPromos(FALLBACK_PROMOS);
        return;
      }
      setPromos(
        rows.map((row): PromoConfig => ({
          id: row.id,
          title: row.title,
          subtitle: row.subtitle ?? undefined,
          image: row.image_url ? { uri: row.image_url } : undefined,
          route:
            row.type === "category_cover" && row.category
              ? `/(tabs)/menu?category=${row.category}`
              : row.type === "product_campaign" && row.product_id
                ? `/item/${row.product_id}`
                : undefined,
        })),
      );
    } catch {
      // Network errors fall back to the static local promos silently —
      // matches fetchMenu()'s resilience pattern.
      setPromos(FALLBACK_PROMOS);
    }
  };

  useEffect(() => {
    loadMenu().finally(() => setMenuLoading(false));
    loadPromos();
  }, []);

  // A category_cover promo's route carries a ?category= param — apply it
  // once on arrival so tapping the promo filters the grid below.
  useEffect(() => {
    if (categoryParam) setActiveCategory(categoryParam);
  }, [categoryParam]);

  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      const matchesCategory =
        activeCategory === "all" ||
        (activeCategory === "favorite"
          ? isFavorite(item.id)
          : item.category === activeCategory);
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.ingredientNames.some((n) => n.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [menu, activeCategory, searchQuery, isFavorite]);

  const categoriesList: CategoryTab[] = [
    ...getCategories(menu),
    { id: "favorite", name: "Favorites", count: favorites.length },
  ];
  const activeCategoryLabel =
    categoriesList.find((c) => c.id === activeCategory)?.name ?? "Menu";

  const topSelling = useMemo(
    () => getCuratedItems(menu, TOP_SELLING_IDS),
    [menu],
  );
  const recommended = useMemo(
    () => getRecommendedItems(orders, menu, TOP_SELLING_IDS),
    [orders, menu],
  );
  const comingSoon = useMemo(
    () => getCuratedItems(menu, COMING_SOON_IDS),
    [menu],
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const rowCardHeight = getCardHeight(ROW_CARD_WIDTH);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadMenu(true), loadPromos(true)]);
    setRefreshing(false);
  };

  const renderMenuItem = ({
    item,
    index,
  }: {
    item: CatalogItem;
    index: number;
  }) => (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 10) * 40).springify()}
    >
      <MenuItem
        item={item}
        isFavorite={isFavorite(item.id)}
        onToggleFavorite={toggleFavorite}
        layout="grid"
        badge={TOP_SELLING_IDS.includes(item.id) ? "Top" : undefined}
      />
    </Animated.View>
  );

  const renderRow = (items: CatalogItem[], badge?: string) => (
    <View style={{ height: rowCardHeight }}>
      <FlashList
        data={items}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rowContent}
        renderItem={({ item }) => (
          <MenuItem
            item={item}
            layout="row"
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={toggleFavorite}
            badge={badge}
          />
        )}
      />
    </View>
  );

  const renderHeader = () => (
    <View>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={openDrawer} hitSlop={8}>
          <Ionicons name="menu" size={26} color={theme.text} />
        </TouchableOpacity>

        <View
          style={[styles.searchInputWrapper, { backgroundColor: theme.card }]}
        >
          <Ionicons name="search" size={18} color={theme.muted} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search menu..."
            placeholderTextColor={theme.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={theme.muted} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          onPress={() => router.push("/(tabs)/cart")}
          hitSlop={8}
        >
          <View>
            <Ionicons name="cart-outline" size={26} color={theme.text} />
            {cartCount > 0 && (
              <View
                style={[styles.cartBadge, { backgroundColor: theme.primary }]}
              >
                <ThemedText style={styles.cartBadgeText}>
                  {cartCount}
                </ThemedText>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.greetingRow}>
        <ThemedText type="title">
          {user
            ? `Hello, ${user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email}.`
            : "Hello, Guest."}
        </ThemedText>
      </View>

      <PromoCarousel promos={promos} />

      <View style={styles.chipsRow}>
        <CategoryChips
          categories={categoriesList}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
      </View>

      {topSelling.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Top Selling" />
          {renderRow(topSelling, "Top")}
        </View>
      )}

      {recommended.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Recommended for you" />
          {renderRow(recommended)}
        </View>
      )}

      <SectionHeader title={activeCategoryLabel} />
    </View>
  );

  const renderFooter = () => (
    <View>
      {comingSoon.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Coming Soon" />
          {renderRow(comingSoon, "Soon")}
        </View>
      )}
      <View style={{ height: 100 }} />
    </View>
  );

  if (menuLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.topBar}>
          <View
            style={[
              styles.skeletonBlock,
              {
                width: 26,
                height: 26,
                borderRadius: 13,
                backgroundColor: theme.border,
              },
            ]}
          />
          <View
            style={[styles.searchInputWrapper, { backgroundColor: theme.card }]}
          />
          <View
            style={[
              styles.skeletonBlock,
              {
                width: 26,
                height: 26,
                borderRadius: 13,
                backgroundColor: theme.border,
              },
            ]}
          />
        </View>
        <View
          style={[
            styles.skeletonBlock,
            styles.promoSkeleton,
            { backgroundColor: theme.card },
          ]}
        />
        <View style={styles.section}>
          <View
            style={[
              styles.skeletonBlock,
              {
                width: 120,
                height: 20,
                marginLeft: SPACING.xl,
                marginBottom: SPACING.sm,
                backgroundColor: theme.card,
              },
            ]}
          />
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: SPACING.xl,
              gap: SPACING.sm,
            }}
          >
            <ProductCardSkeleton layout="row" />
            <ProductCardSkeleton layout="row" />
          </View>
        </View>
        <View style={styles.section}>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              paddingHorizontal: SPACING.xl - SPACING.xs,
              gap: SPACING.sm,
            }}
          >
            <ProductCardSkeleton layout="grid" />
            <ProductCardSkeleton layout="grid" />
          </View>
        </View>
      </ThemedView>
    );
  }

  if (menuError && menu.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <EmptyState
          icon="cloud-offline-outline"
          title="Couldn't load the menu"
          message="Check your connection and try again."
          actionLabel="Retry"
          onAction={() => loadMenu()}
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlashList
        data={filteredMenu}
        keyExtractor={(item) => item.id}
        renderItem={renderMenuItem}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
            progressBackgroundColor={theme.background}
          />
        }
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <EmptyState
            icon="cafe-outline"
            title="No drinks match your search."
          />
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 15,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: "100%",
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
    fontWeight: "700",
  },
  greetingRow: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  chipsRow: {
    marginBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  rowContent: {
    paddingHorizontal: SPACING.xl,
  },
  gridContainer: {
    paddingHorizontal: SPACING.xl - SPACING.xs,
  },
  skeletonBlock: {
    borderRadius: 8,
  },
  promoSkeleton: {
    height: 140,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
    borderRadius: 12,
  },
});
