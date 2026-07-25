import { useFavorites } from "@/context/FavoritesContext";
import { useThemeColors } from "@/context/ThemeContext";
import { useUser } from "@/hooks/useUser";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SPACING } from "../constants/spacing";
import { ThemedText } from "./ThemedText";

interface MenuDrawerProps {
  visible: boolean;
  onClose: () => void;
}

interface DrawerLink {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export default function MenuDrawer({ visible, onClose }: MenuDrawerProps) {
  const { theme, isDark, toggleTheme } = useThemeColors();
  const { user } = useUser();
  const { favorites } = useFavorites();
  const { width: screenWidth } = useWindowDimensions();
  const panelWidth = Math.min(screenWidth * 0.78, 320);
  const translateX = useSharedValue(-panelWidth);

  useEffect(() => {
    translateX.value = withTiming(visible ? 0 : -panelWidth, { duration: 220 });
  }, [visible, panelWidth, translateX]);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const navigateTo = (path: string) => {
    onClose();
    router.push(path as never);
  };

  const links: DrawerLink[] = [
    {
      label: "Menu",
      icon: "restaurant-outline",
      onPress: () => navigateTo("/(tabs)/menu"),
    },
    {
      label: "Cart",
      icon: "cart-outline",
      onPress: () => navigateTo("/(tabs)/cart"),
    },
    {
      label: "Profile",
      icon: "person-outline",
      onPress: () => navigateTo("/(tabs)/profile"),
    },
    {
      label: "Orders",
      icon: "receipt-outline",
      onPress: () => navigateTo("/(tabs)/orders"),
    },
    {
      label: `Favorites (${favorites.length})`,
      icon: "heart-outline",
      onPress: () => navigateTo("/(tabs)/menu?category=favorite"),
    },
    {
      label: "About",
      icon: "location-outline",
      onPress: () => navigateTo("/(tabs)/about"),
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View
        style={[
          styles.panel,
          panelStyle,
          { width: panelWidth, backgroundColor: theme.background },
        ]}
      >
        <View style={styles.header}>
          <Ionicons name="person-circle" size={36} color={theme.primary} />
          <ThemedText type="subtitle" style={styles.headerText}>
            {user
              ? (user.user_metadata?.full_name ??
                user.user_metadata?.name ??
                user.email)
              : "Guest"}
          </ThemedText>
        </View>

        {links.map((link) => (
          <Pressable key={link.label} style={styles.row} onPress={link.onPress}>
            <Ionicons name={link.icon} size={20} color={theme.text} />
            <ThemedText type="body" style={styles.rowText}>
              {link.label}
            </ThemedText>
          </Pressable>
        ))}

        <Pressable style={styles.row} onPress={toggleTheme}>
          <Ionicons
            name={isDark ? "moon" : "sunny-outline"}
            size={20}
            color={theme.text}
          />
          <ThemedText type="body" style={styles.rowText}>
            {isDark ? "Dark mode" : "Light mode"}
          </ThemedText>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  panel: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    paddingTop: SPACING.xxl * 2,
    paddingHorizontal: SPACING.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  headerText: {
    flexShrink: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingVertical: SPACING.md,
  },
  rowText: {
    flex: 1,
  },
});
