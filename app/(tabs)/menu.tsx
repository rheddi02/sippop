import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { mockMenu } from "../../api/mockData";
import MenuItem from "../../components/MenuItem";
import { useThemeColors } from "../../context/ThemeContext";

export default function MenuScreen() {
  const { theme } = useThemeColors();
  const [favorites, setFavorites] = useState<string[]>(
    mockMenu.filter(item => item.isFavorite).map(item => item.id)
  );

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  const renderMenuItem = ({ item }: { item: any }) => (
    <MenuItem
      id={item.id}
      name={item.name}
      price={item.price}
      description={item.description}
      image={item.image}
      isFavorite={favorites.includes(item.id)}
      inCart={item.inCart}
      onToggleFavorite={toggleFavorite}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Category Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Pizza</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={[styles.tabText, { color: theme.muted }]}>Beer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={[styles.tabText, { color: theme.muted }]}>Food</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Grid */}
      <FlatList
        data={mockMenu}
        keyExtractor={(item) => item.id}
        renderItem={renderMenuItem}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Checkout Button */}
      <TouchableOpacity style={styles.checkoutButton}>
        <Text style={styles.checkoutButtonText}>Checkout order</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B35',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FF6B35',
  },
  gridContainer: {
    paddingHorizontal: 8,
    paddingBottom: 100, // Space for checkout button
  },
  checkoutButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
