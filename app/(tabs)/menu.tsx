import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { categories } from "@/constants/categories";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { mockMenu } from "../../api/mockData";
import MenuItem from "../../components/MenuItem";
import { useFavorites } from "../../context/FavoritesContext";
import { useThemeColors } from "../../context/ThemeContext";

export default function MenuScreen() {
  const { theme } = useThemeColors();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);

  const filteredMenu = mockMenu.filter((item) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "favorite") return isFavorite(item.id);
    return item.category === activeCategory;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const categoriesList = [
    ...categories,
    { id: "favorite", name: "Favorites", count: favorites.length },
  ];

  const renderMenuItem = ({ item }: { item: any }) => (
    <MenuItem
      id={item.id}
      name={item.name}
      description={item.description}
      image={item.image}
      isFavorite={isFavorite(item.id)}
      sizes={item.sizes}
      onToggleFavorite={toggleFavorite}
    />
  );

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
          <ThemedText type="title">Hello, Guest.</ThemedText>
        </View>
      </ThemedView>

      {/* Category Tabs */}
      <ThemedView style={[styles.tabContainer]}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categoriesList}
          keyExtractor={(item) => item.id}
          renderItem={({ item: category }) => (
            <TouchableOpacity
              style={[
                styles.tab,
                activeCategory === category.id && styles.activeTab,
              ]}
              onPress={() => setActiveCategory(category.id)}
            >
              <ThemedText
                style={[
                  styles.tabText,
                  activeCategory === category.id
                    ? styles.activeTabText
                    : { color: theme.muted },
                ]}
              >
                {category.name}
              </ThemedText>
              <ThemedText
                style={[
                  styles.tabCount,
                  activeCategory === category.id
                    ? styles.activeTabCount
                    : { color: theme.muted },
                ]}
              >
                ({category.count})
              </ThemedText>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.tabsContent}
        />
      </ThemedView>

      {/* Menu Grid */}
      <FlatList
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
      />

      {/* Checkout Button */}
      {/* <TouchableOpacity style={styles.checkoutButton}>
        <ThemedText style={styles.checkoutButtonText}>Checkout order</ThemedText>
      </TouchableOpacity> */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  walletWrapper: {
    overflow: "hidden",
    marginBottom: 10,
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
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#FF6B35",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  activeTabText: {
    color: "#FF6B35",
  },
  tabCount: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: "400",
  },
  activeTabCount: {
    color: "#FF6B35",
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
  // checkoutButton: {
  //   position: "absolute",
  //   bottom: 10,
  //   left: 20,
  //   right: 20,
  //   height: 50,
  //   borderRadius: 25,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   shadowColor: "#000",
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 3.84,
  //   elevation: 5,
  // },
  // checkoutButtonText: {
  //   color: "#FFFFFF",
  //   fontSize: 18,
  //   fontWeight: "600",
  // },
});
