import { RADIUS, SPACING } from "@/constants/spacing";
import { useCart } from "@/context/CartContext";
import { useThemeColors } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "./ThemedText";

interface NavEntry {
  key: string;
  label: string;
  route: string;
  match: string;
  iconActive: keyof typeof Ionicons.glyphMap;
  iconInactive: keyof typeof Ionicons.glyphMap;
}

const ENTRIES: NavEntry[] = [
  {
    key: "menu",
    label: "Menu",
    route: "/(tabs)/menu",
    match: "/menu",
    iconActive: "restaurant",
    iconInactive: "restaurant-outline",
  },
  {
    key: "cart",
    label: "Cart",
    route: "/(tabs)/cart",
    match: "/cart",
    iconActive: "cart",
    iconInactive: "cart-outline",
  },
  {
    key: "orders",
    label: "Orders",
    route: "/(tabs)/orders",
    match: "/orders",
    iconActive: "receipt",
    iconInactive: "receipt-outline",
  },
  {
    key: "favorites",
    label: "Favorites",
    route: "/(tabs)/favorites",
    match: "/favorites",
    iconActive: "heart",
    iconInactive: "heart-outline",
  },
];

export default function FloatingNavPill() {
  const { theme } = useThemeColors();
  const { cart } = useCart();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, { paddingBottom: insets.bottom + SPACING.md }]}
    >
      <View
        style={[
          styles.pill,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        {ENTRIES.map((entry) => {
          const active = pathname === entry.match;
          return (
            <TouchableOpacity
              key={entry.key}
              onPress={() => router.push(entry.route as never)}
              hitSlop={8}
              style={[
                styles.entry,
                active && [
                  styles.entryActive,
                  { backgroundColor: `${theme.primary}26` },
                ],
              ]}
            >
              <View>
                <Ionicons
                  name={active ? entry.iconActive : entry.iconInactive}
                  size={22}
                  color={active ? theme.primary : theme.muted}
                />
                {entry.key === "cart" && cartCount > 0 && (
                  <View
                    style={[styles.badge, { backgroundColor: theme.primary }]}
                  >
                    <ThemedText style={styles.badgeText}>
                      {cartCount}
                    </ThemedText>
                  </View>
                )}
              </View>
              {active && (
                <ThemedText style={[styles.label, { color: theme.primary }]}>
                  {entry.label}
                </ThemedText>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: RADIUS.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: SPACING.xxl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  entry: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
  },
  entryActive: {
    paddingHorizontal: SPACING.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    lineHeight: 12,
    fontWeight: "700",
  },
});
