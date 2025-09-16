import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearAllFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

const FAVORITES_STORAGE_KEY = '@sippop_favorites';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load favorites from AsyncStorage on app start
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const savedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
        if (savedFavorites) {
          const parsedFavorites = JSON.parse(savedFavorites);
          setFavorites(parsedFavorites);
          console.log('📱 Loaded favorites from storage:', parsedFavorites);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadFavorites();
  }, []);

  const toggleFavorite = async (id: string) => {
    const newFavorites = favorites.includes(id) 
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];
    
    setFavorites(newFavorites);
    
    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
      console.log('💾 Saved favorites to storage:', newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const clearAllFavorites = async () => {
    setFavorites([]);
    try {
      await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
      console.log('🗑️ Cleared all favorites from storage');
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, clearAllFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
};
