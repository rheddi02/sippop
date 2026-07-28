import { fetchPromos, PromoRow } from "@/api/promos";
import { fetchCategoryCovers, CategoryCoverRow } from "@/api/categoryCovers";
import CategoryCoverCard, { getCategoryCoverCardWidth } from "@/components/CategoryCoverCard";
import EmptyState from "@/components/EmptyState";
import MenuFilterSheet, { SortOption } from "@/components/MenuFilterSheet";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import PromoCarousel from "@/components/PromoCarousel";
import SectionHeader from "@/components/SectionHeader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CATEGORY_LABELS } from "@/constants/categories";
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
import { CatalogItem, CategoryId } from "@/utils/types";
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
import { fetchMenu, normalizeCategory } from "../../api/menu";
import MenuItem from "../../components/MenuItem";
import { useFavorites } from "../../context/FavoritesContext";
import { useThemeColors } from "../../context/ThemeContext";

function getInitials(name: string | null | undefined): string {
  const trimmed = name?.trim();
  if (!trimmed) return "G";
  const parts = trimmed.split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function getTimeOfDayGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

export default function MenuScreen() {
  const { theme } = useThemeColors();
  const { width: screenWidth } = useWindowDimensions();
  const { user } = useUser();
  const { toggleFavorite, isFavorite } = useFavorites();

  const { category: categoryParam } = useLocalSearchParams<{
    category?: string;
  }>();

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategories, setActiveCategories] = useState<CategoryId[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("featured");
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);

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
        route:
          row.type === "campaign"
            ? row.category
              ? `/category/${normalizeCategory(row.category)}`
              : undefined
            : row.product_id
              ? `/item/${row.product_id}`
              : undefined,
      }),
    );
  }, [promoRows]);

  const categoryCovers = useMemo(() => getCategoryCovers(categoryCoverRows), [categoryCoverRows]);

  const topSelling = useMemo(
    () => getTopSellingItems(topSellingRows, menu),
    [topSellingRows, menu],
  );
  const categoryGroups = useMemo(() => groupMenuByCategory(menu), [menu]);

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

  const displayName = user
    ? (user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email)
    : "Guest";
  const initials = getInitials(displayName);
  const greeting = getTimeOfDayGreeting();

  const availableCategories = useMemo(() => {
    const seen = new Set<CategoryId>();
    menu.forEach((item) => seen.add(item.category));
    return Array.from(seen).map((id) => ({ id, label: CATEGORY_LABELS[id] }));
  }, [menu]);

  const hasActiveFilters = activeCategories.length > 0 || sortOption !== "featured";
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const isFiltering = normalizedQuery.length > 0 || hasActiveFilters;

  const filteredItems = useMemo(() => {
    if (!isFiltering) return [];

    const matches = menu.filter((item) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.ingredientNames.some((ingredient) =>
          ingredient.toLowerCase().includes(normalizedQuery),
        );
      const matchesCategory =
        activeCategories.length === 0 || activeCategories.includes(item.category);
      return matchesQuery && matchesCategory;
    });

    switch (sortOption) {
      case "priceAsc":
        return [...matches].sort(
          (a, b) => (a.sizes[0]?.price ?? 0) - (b.sizes[0]?.price ?? 0),
        );
      case "priceDesc":
        return [...matches].sort(
          (a, b) => (b.sizes[0]?.price ?? 0) - (a.sizes[0]?.price ?? 0),
        );
      case "nameAsc":
        return [...matches].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return matches;
    }
  }, [isFiltering, menu, normalizedQuery, activeCategories, sortOption]);

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

  const renderSections = () => (
    <View>
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

  const renderHeader = () => (
    <View
      style={[styles.stickyHeader, { backgroundColor: theme.background }]}
    >
      <View style={styles.profileRow}>
        <TouchableOpacity
          style={styles.profileInfo}
          onPress={() => router.push("/(tabs)/profile")}
          hitSlop={8}
        >
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <ThemedText type="defaultSemiBold" style={styles.avatarText}>
              {initials}
            </ThemedText>
          </View>

          <View style={styles.profileTextWrap}>
            <ThemedText type="defaultSemiBold" numberOfLines={1}>
              {displayName}
            </ThemedText>
            <ThemedText type="caption" style={{ color: theme.muted }}>
              {greeting} 👋
            </ThemedText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: theme.card }]}
          onPress={() => router.push("/notifications")}
          hitSlop={8}
        >
          <Ionicons name="notifications-outline" size={20} color={theme.text} />
          <View
            style={[
              styles.dotBadge,
              { backgroundColor: theme.danger, borderColor: theme.background },
            ]}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
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
          style={[styles.iconButton, { backgroundColor: theme.card }]}
          onPress={() => setFilterSheetVisible(true)}
          hitSlop={8}
        >
          <Ionicons name="options-outline" size={20} color={theme.text} />
          {hasActiveFilters && (
            <View
              style={[
                styles.dotBadge,
                { backgroundColor: theme.primary, borderColor: theme.background },
              ]}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  if (menuLoading) {
    return (
      <ThemedView style={styles.container} gradient>
        {renderHeader()}
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
      <ThemedView style={styles.container} gradient>
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
    <ThemedView style={styles.container} gradient>
      {renderHeader()}

      {isFiltering ? (
        <FlashList
          data={filteredItems}
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
              title="No drinks match your search."
              message="Try a different keyword or clear your filters."
            />
          }
        />
      ) : (
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
          {renderSections()}
        </ScrollView>
      )}

      <MenuFilterSheet
        visible={filterSheetVisible}
        onClose={() => setFilterSheetVisible(false)}
        categories={availableCategories}
        activeCategories={activeCategories}
        sortOption={sortOption}
        onApply={(categories, sort) => {
          setActiveCategories(categories);
          setSortOption(sort);
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stickyHeader: {
    zIndex: 1,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  profileInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  profileTextWrap: {
    flex: 1,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  dotBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
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
  gridContainer: {
    paddingHorizontal: SPACING.xl - SPACING.xs,
    paddingTop: SPACING.lg,
    paddingBottom: FLOATING_NAV_CLEARANCE,
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
