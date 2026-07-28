import { fetchMenu } from "@/api/menu";
import EmptyState from "@/components/EmptyState";
import MenuItem from "@/components/MenuItem";
import ScreenHeader from "@/components/ScreenHeader";
import ThemedLoader from "@/components/ThemedLoader";
import { ThemedView } from "@/components/ThemedView";
import { FLOATING_NAV_CLEARANCE, SPACING } from "@/constants/spacing";
import { useFavorites } from "@/context/FavoritesContext";
import { useThemeColors } from "@/context/ThemeContext";
import { CatalogItem } from "@/utils/types";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { RefreshControl, StyleSheet, View } from "react-native";

export default function FavoritesScreen() {
  const { theme } = useThemeColors();
  const { favorites, toggleFavorite } = useFavorites();

  const [menu, setMenu] = useState<CatalogItem[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMenu()
      .then(setMenu)
      .catch(() => setMenu([]));
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      setMenu(await fetchMenu(true));
    } catch {
      // Keep showing the previously loaded menu on a failed refresh.
    } finally {
      setRefreshing(false);
    }
  };

  const items = useMemo(
    () => (menu ?? []).filter((item) => favorites.includes(item.id)),
    [menu, favorites],
  );

  return (
    <ThemedView style={styles.container} gradient>
      <ScreenHeader title="Favorites" />

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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
              colors={[theme.primary]}
              progressBackgroundColor={theme.background}
            />
          }
          renderItem={({ item }) => (
            <MenuItem
              item={item}
              isFavorite={true}
              onToggleFavorite={toggleFavorite}
              layout="grid"
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="heart-outline"
              title="No favorites yet"
              message="Tap the heart on any drink to save it here."
              actionLabel="Browse menu"
              onAction={() => router.push("/(tabs)/menu")}
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
  grid: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gridContainer: {
    paddingHorizontal: SPACING.xl - SPACING.xs,
    paddingTop: SPACING.lg,
    paddingBottom: FLOATING_NAV_CLEARANCE,
  },
});
