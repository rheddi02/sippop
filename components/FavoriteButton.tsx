import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColors } from '../context/ThemeContext';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

export default function FavoriteButton({ 
  isFavorite, 
  onToggle, 
  size = 'medium',
  style 
}: FavoriteButtonProps) {
  const { theme } = useThemeColors();

  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return {
          containerSize: 28,
          iconSize: 16,
          borderRadius: 14,
        };
      case 'large':
        return {
          containerSize: 40,
          iconSize: 24,
          borderRadius: 20,
        };
      default: // medium
        return {
          containerSize: 32,
          iconSize: 20,
          borderRadius: 16,
        };
    }
  };

  const { containerSize, iconSize, borderRadius } = getSizeConfig();

  return (
    <TouchableOpacity
      onPress={onToggle}
      style={[
        styles.container,
        {
          width: containerSize,
          height: containerSize,
          borderRadius,
        },
        style,
      ]}
    >
      <Ionicons
        name={isFavorite ? "heart" : "heart-outline"}
        size={iconSize}
        color={isFavorite ? theme.primary : theme.muted}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
