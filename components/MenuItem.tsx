import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '../context/CartContext';
import { useThemeColors } from '../context/ThemeContext';

interface MenuItemProps {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  isFavorite?: boolean;
  inCart?: boolean;
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
  onToggleFavorite,
}: MenuItemProps) {
  const { theme } = useThemeColors();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({ id, name, price, points: 1 });
  };

  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      {/* Favorite Heart Icon */}
      <TouchableOpacity 
        style={styles.favoriteButton} 
        onPress={handleToggleFavorite}
      >
        <Text style={[
          styles.favoriteIcon,
          { color: isFavorite ? theme.primary : theme.muted }
        ]}>
          ♥
        </Text>
      </TouchableOpacity>

      {/* Pizza Image */}
      <View style={styles.imageContainer}>
        <Text style={styles.image}>{image}</Text>
      </View>

      {/* Pizza Name */}
      <Text style={[styles.name, { color: theme.text }]}>{name}</Text>

      {/* Price */}
      <Text style={[styles.price, { color: theme.text }]}>€ {price}</Text>

      {/* Description */}
      <Text style={[styles.description, { color: theme.muted }]}>{description}</Text>

      {/* Add to Cart Button */}
      <TouchableOpacity 
        style={[
          styles.addButton,
          { backgroundColor: inCart ? theme.primary : theme.card }
        ]}
        onPress={handleAddToCart}
      >
        <Text style={[
          styles.addButtonText,
          { color: inCart ? theme.background : theme.text }
        ]}>
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    margin: 8,
    width: 160,
    height: 220,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 1,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteIcon: {
    fontSize: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  image: {
    fontSize: 60,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    marginBottom: 16,
    flex: 1,
  },
  addButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
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
