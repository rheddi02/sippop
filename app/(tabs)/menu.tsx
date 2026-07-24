import ThemedLoader from "@/components/ThemedLoader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getCategories } from "@/constants/categories";
import { CatalogItem } from "@/utils/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  LayoutChangeEvent,
  RefreshControl,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { fetchMenu } from "../../api/menu";
import MenuItem from "../../components/MenuItem";
import { ThemedButton } from "../../components/ThemedButton";
import { useFavorites } from "../../context/FavoritesContext";
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
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [menu, setMenu] = useState<CatalogItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState<string | null>(null);

  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const tabLayouts = React.useRef<Record<string, { x: number; width: number }>>({});

  const loadMenu = async (forceRefresh = false) => {
    try {
      setMenuError(null);
      const data = await fetchMenu(forceRefresh);
      setMenu(data);
    } catch (err) {
      setMenuError(err instanceof Error ? err.message : String(err));
    }
  };

  useEffect(() => {
    loadMenu().finally(() => setMenuLoading(false));
  }, []);

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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMenu(true);
    setRefreshing(false);
  };

  const categoriesList: CategoryTab[] = [
    ...getCategories(menu),
    { id: "favorite", name: "Favorites", count: favorites.length },
  ];

  const moveIndicatorTo = (id: string) => {
    const layout = tabLayouts.current[id];
    if (layout) {
      indicatorX.value = withTiming(layout.x, { duration: 200 });
      indicatorWidth.value = withTiming(layout.width, { duration: 200 });
    }
  };

  const handleTabLayout = (id: string, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    tabLayouts.current[id] = { x, width };
    if (id === activeCategory) {
      indicatorX.value = x;
      indicatorWidth.value = width;
    }
  };

  const handleSelectCategory = (id: string) => {
    setActiveCategory(id);
    moveIndicatorTo(id);
  };

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorWidth.value,
  }));

  const renderMenuItem = ({
    item,
    index,
  }: {
    item: CatalogItem;
    index: number;
  }) => (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 10) * 40).springify()}>
      <MenuItem
        item={item}
        isFavorite={isFavorite(item.id)}
        onToggleFavorite={toggleFavorite}
      />
    </Animated.View>
  );

  if (menuLoading) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ThemedLoader />
      </ThemedView>
    );
  }

  if (menuError && menu.length === 0) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <Ionicons name="cloud-offline-outline" size={40} color={theme.muted} />
        <ThemedText
          type="body"
          style={{
            color: theme.muted,
            marginTop: 8,
            textAlign: "center",
            paddingHorizontal: 32,
          }}
        >
          Couldn&apos;t load the menu. Check your connection and try again.
        </ThemedText>
        <ThemedButton title="Retry" onPress={() => loadMenu()} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container]}>
      <ThemedView
        style={{
          overflow: "hidden",
          padding: 20,
          backgroundColor: theme.background,
        }}
      >
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          <Ionicons name="person-circle" size={32} color={theme.primary} />
          <ThemedText type="title">
            {user
              ? `Hello, ${user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email}.`
              : "Hello, Guest."}
          </ThemedText>
        </View>
      </ThemedView>

      {/* Search Bar */}
      <ThemedView style={styles.searchContainer}>
        <View style={[styles.searchInputWrapper, { backgroundColor: theme.card }]}>
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
      </ThemedView>

      {/* Category Tabs */}
      <ThemedView style={[styles.tabContainer]}>
        <View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categoriesList}
            keyExtractor={(item) => item.id}
            renderItem={({ item: category }) => (
              <TouchableOpacity
                style={styles.tab}
                onLayout={(e) => handleTabLayout(category.id, e)}
                onPress={() => handleSelectCategory(category.id)}
              >
                <ThemedText
                  style={[
                    styles.tabText,
                    {
                      color:
                        activeCategory === category.id
                          ? theme.primary
                          : theme.muted,
                    },
                  ]}
                >
                  {category.name}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.tabCount,
                    {
                      color:
                        activeCategory === category.id
                          ? theme.primary
                          : theme.muted,
                    },
                  ]}
                >
                  ({category.count})
                </ThemedText>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.tabsContent}
          />
          <Animated.View
            style={[
              styles.tabIndicator,
              { backgroundColor: theme.primary },
              indicatorStyle,
            ]}
          />
        </View>
      </ThemedView>

      {/* Menu Grid */}
      <FlatList
        key={activeCategory + searchQuery}
        data={filteredMenu}
        keyExtractor={(item) => item.id}
        renderItem={renderMenuItem}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.row}
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
        ListEmptyComponent={
          <ThemedView style={styles.emptyState}>
            <Ionicons name="cafe-outline" size={40} color={theme.muted} />
            <ThemedText type="body" style={{ color: theme.muted, marginTop: 8 }}>
              No drinks match your search.
            </ThemedText>
          </ThemedView>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  tabContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  tabsContent: {
    paddingRight: 20,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 12,
    alignItems: "center",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  tabCount: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: "400",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    height: 2,
    borderRadius: 1,
  },
  gridContainer: {
    paddingHorizontal: 8,
    paddingBottom: 100, // Space for checkout button
    width: "100%",
    alignItems: "flex-start",
  },
  row: {
    justifyContent: "space-around",
    marginBottom: -10,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  searchInputWrapper: {
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
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    width: "100%",
  },
});
