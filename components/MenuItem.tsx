import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useCart } from '../context/CartContext';
import { useThemeColors } from '../context/ThemeContext';
import { ThemedCard } from './ThemedCard';
import { ThemedText } from './ThemedText';

interface MenuItemProps {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  isFavorite?: boolean;
  inCart?: boolean;
  sizes?: { name: string; price: number; multiplier: number; isAvailable: boolean }[];
  onToggleFavorite?: (id: string) => void;
}

export default function MenuItem({
  id,
  name,
  price,
  description,
  image,
  isFavorite = false,
  inCart = false,
  sizes,
  onToggleFavorite,
}: MenuItemProps) {
  const { theme } = useThemeColors();
  const { addToCart } = useCart();
  
  // Calculate exact width for 2-column layout
  const screenWidth = Dimensions.get('window').width;
  const flatListPadding = 16; // 8px left + 8px right from gridContainer
  const itemMargin = 16; // 8px margin on each side
  const itemWidth = (screenWidth - flatListPadding - itemMargin) / 2;

  const handleAddToCart = () => {
    addToCart({ id, name, price, points: 1 });
  };

  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };

  const handleItemPress = () => {
    router.push(`/item/${id}`);
  };

  return (
    <TouchableOpacity onPress={handleItemPress} activeOpacity={0.8}>
      <ThemedCard variant="elevated" style={[styles.container, { width: itemWidth, height: 320 }]}>
        {/* Favorite Heart Icon */}
        <View style={styles.favoriteButton}>
          <TouchableOpacity 
            onPress={handleToggleFavorite}
            style={[
              styles.favoriteIconContainer,
              { 
                backgroundColor: isFavorite ? theme.primary : theme.background,
                borderColor: isFavorite ? theme.primary : theme.border
              }
            ]}
          >
            <ThemedText 
              style={[
                styles.favoriteIcon,
                { 
                  color: isFavorite ? theme.background : theme.muted,
                  fontSize: isFavorite ? 18 : 16
                }
              ]}
            >
              {isFavorite ? '♥' : '♡'}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Beverage Image */}
        <View style={styles.imageContainer}>
          {typeof image === 'string' ? (
            <ThemedText style={styles.image}>{image}</ThemedText>
          ) : (
            <Image source={image} style={styles.image} resizeMode="contain" />
          )}
        </View>

        {/* Content Container with Fixed Height */}
        <View style={styles.contentContainer}>
          {/* Beverage Name */}
          <ThemedText type="subtitle" style={styles.name} numberOfLines={2} ellipsizeMode="tail">
            {name}
          </ThemedText>
          
          {/* Description */}
          <ThemedText type="caption" style={styles.description} numberOfLines={2} ellipsizeMode="tail">
            {description}
          </ThemedText>
          
          {/* Price Row */}
          <View style={styles.priceRow}>
            {/* Price */}
            <ThemedText type="price" style={styles.price}>
              ₱ {sizes && sizes.filter(size=>size.isAvailable).length > 0 ? sizes.filter(size=>size.isAvailable)[0].price : price}
            </ThemedText>

            {/* Add to Cart Button */}
            <TouchableOpacity 
              style={[
                styles.addButton,
                { backgroundColor: inCart ? theme.primary : theme.card }
              ]}
              onPress={handleAddToCart}
            >
              <ThemedText 
                style={[
                  styles.addButtonText,
                  { color: inCart ? theme.background : theme.text }
                ]}
              >
                +
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 1,
    width: 32,
    height: 32,
  },
  favoriteIconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
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
  favoriteIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    height: 160,
    justifyContent: 'center',
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: 140,
    marginVertical: 8,
  },
  name: {
    marginBottom: 4,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  price: {
    flex: 1,
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
    color: '#666',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
