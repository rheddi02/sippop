import { fetchPromos, PromoRow } from "@/api/promos";
import { fetchCategoryCovers, CategoryCoverRow } from "@/api/categoryCovers";
import CategoryCoverCard, { getCategoryCoverCardWidth } from "@/components/CategoryCoverCard";
import EmptyState from "@/components/EmptyState";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import PromoCarousel from "@/components/PromoCarousel";
import SectionHeader from "@/components/SectionHeader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  FALLBACK_PROMOS,
  PromoConfig,
} from "@/constants/featured";
import { ROW_CARD_WIDTH, getCardHeight, getCardImageHeight } from "@/constants/productCard";
import { FLOATING_NAV_CLEARANCE, SPACING } from "@/constants/spacing";
import { useUser } from "@/hooks/useUser";
import { fetchTopSellingProducts, TopSellingRow } from "@/api/topSelling";
import { getCategoryCovers } from "@/utils/categoryCovers";
import { groupMenuByCategory } from "@/utils/categoryGroups";
import { getTopSellingItems } from "@/utils/topSelling";
import { CatalogItem } from "@/utils/types";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { fetchMenu } from "../../api/menu";
import MenuItem from "../../components/MenuItem";
import { useCart } from "../../context/CartContext";
import { useDrawer } from "../../context/DrawerContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useThemeColors } from "../../context/ThemeContext";

export default function MenuScreen() {
  const { theme } = useThemeColors();
  const { width: screenWidth } = useWindowDimensions();
  const { user } = useUser();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { cart } = useCart();
  const { openDrawer } = useDrawer();

  const { category: categoryParam } = useLocalSearchParams<{
    category?: string;
  }>();

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [menu, setMenu] = useState<CatalogItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState<string | null>(null);
  const [promoRows, setPromoRows] = useState<PromoRow[]>([]);
  const [categoryCoverRows, setCategoryCoverRows] = useState<CategoryCoverRow[]>([]);
  const [topSellingRows, setTopSellingRows] = useState<TopSellingRow[]>([]);

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
      setPromoRows(rows);
    } catch {
      // Network errors fall back to the static local promos silently —
      // matches fetchMenu()'s resilience pattern.
      setPromoRows([]);
    }
  };

  const loadCategoryCovers = async (forceRefresh = false) => {
    try {
      const rows = await fetchCategoryCovers(forceRefresh);
      setCategoryCoverRows(rows);
    } catch {
      // Degraded state is fine — the section simply doesn't render when
      // categoryCovers.length === 0, same resilience pattern as loadPromos.
      setCategoryCoverRows([]);
    }
  };

  const loadTopSelling = async (forceRefresh = false) => {
    try {
      const rows = await fetchTopSellingProducts(forceRefresh);
      setTopSellingRows(rows);
    } catch {
      // Degraded state is fine — the section simply doesn't render when
      // topSelling.length === 0, same resilience pattern as loadPromos.
      setTopSellingRows([]);
    }
  };

  useEffect(() => {
    loadMenu().finally(() => setMenuLoading(false));
    loadPromos();
    loadCategoryCovers();
    loadTopSelling();
  }, []);

  // Supports deep-linking straight into a filtered category via ?category=
  // (e.g. from a push notification or share link) — redirects into the
  // dedicated category screen rather than filtering in place, since this
  // screen no longer has a product grid of its own to filter.
  useEffect(() => {
    if (categoryParam) {
      router.push(`/category/${categoryParam}`);
      // Clear the param so navigating back to this route doesn't re-trigger
      // the redirect and trap the user in a bounce loop.
      router.setParams({ category: undefined });
    }
  }, [categoryParam]);

  const promos = useMemo<PromoConfig[]>(() => {
    if (promoRows.length === 0) return FALLBACK_PROMOS;
    return promoRows.map(
      (row): PromoConfig => ({
        id: row.id,
        title: row.title,
        subtitle: row.subtitle ?? undefined,
        image: row.image_url ? { uri: row.image_url } : undefined,
        route: row.product_id ? `/item/${row.product_id}` : undefined,
      }),
    );
  }, [promoRows]);

  const categoryCovers = useMemo(() => getCategoryCovers(categoryCoverRows), [categoryCoverRows]);

  const topSelling = useMemo(
    () => getTopSellingItems(topSellingRows, menu),
    [topSellingRows, menu],
  );
  const categoryGroups = useMemo(() => groupMenuByCategory(menu), [menu]);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const rowCardHeight = getCardHeight(ROW_CARD_WIDTH);
  // A little breathing room below the card's own height so its rounded
  // corners/shadow aren't clipped by the row height.
  const categoryCoverRowHeight =
    getCardImageHeight(getCategoryCoverCardWidth(screenWidth)) + SPACING.sm;

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadMenu(true), loadPromos(true), loadCategoryCovers(true), loadTopSelling(true)]);
    setRefreshing(false);
  };

  const renderRow = (items: CatalogItem[], badge?: string) => (
    // FlashList's own contentContainerStyle padding isn't reliably respected
    // for horizontal lists (its docs warn padding on the internal layout
    // container "is not" safe, unlike margin) — so the inset is applied on
    // this real wrapping View instead, which behaves like standard RN box
    // model regardless of FlashList's internals.
    <View style={[styles.rowContent, { height: rowCardHeight }]}>
      <FlashList
        data={items}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
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

  const renderCategoryCovers = () => (
    <View style={[styles.rowContent, { height: categoryCoverRowHeight }]}>
      <FlashList
        data={categoryCovers}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <CategoryCoverCard
            cover={item}
            onPress={(categoryId) => router.push(`/category/${categoryId}`)}
          />
        )}
      />
    </View>
  );

  const renderHeader = () => (
    <View>
      <View style={styles.greetingRow}>
        <ThemedText type="title">
          {user
            ? `Hello, ${user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email}.`
            : "Hello, Guest."}
        </ThemedText>
      </View>

      <PromoCarousel promos={promos} />

      {categoryCovers.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Shop by Category" />
          {renderCategoryCovers()}
        </View>
      )}

      {topSelling.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Top Selling" />
          {renderRow(topSelling, "Top")}
        </View>
      )}

      {categoryGroups.map((group) => (
        <View key={group.categoryId} style={styles.section}>
          <SectionHeader
            title={group.label}
            onSeeAll={() => router.push(`/category/${group.categoryId}`)}
          />
          {renderRow(group.items)}
        </View>
      ))}
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
      {/* Rendered as a plain sibling above the ScrollView so it's simply
          outside the scrollable content — the standard way to keep a header
          fixed in place while the rest scrolls underneath it. */}
      <View style={[styles.stickyHeader, { backgroundColor: theme.background }]}>
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
            onPress={() => router.push("/(tabs)/favorites")}
            hitSlop={8}
          >
            <Ionicons name="heart-outline" size={26} color={theme.text} />
          </TouchableOpacity>

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
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: FLOATING_NAV_CLEARANCE }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
            progressBackgroundColor={theme.background}
          />
        }
      >
        {renderHeader()}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stickyHeader: {
    // Rendered as a plain sibling above the ScrollView (see main return) —
    // outside the scrollable content entirely, so it simply never scrolls
    // away.
    zIndex: 1,
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
    lineHeight: 12,
    fontWeight: "700",
  },
  greetingRow: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  rowContent: {
    // MenuItem's card carries its own marginHorizontal: 4, so this is
    // reduced by that amount to land on the same 20px visible edge as the
    // banner/header (see getGridCardWidth in constants/productCard.ts,
    // which assumes the same SPACING.xl total screen gutter).
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
