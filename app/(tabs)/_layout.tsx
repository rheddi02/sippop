import MenuDrawer from "@/components/MenuDrawer";
import { useCart } from "@/context/CartContext";
import { DrawerProvider, useDrawer } from "@/context/DrawerContext";
import { useThemeColors } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

function TabLayoutInner() {
  const { theme } = useThemeColors();
  const { cart } = useCart();
  const { isOpen, closeDrawer } = useDrawer();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" },
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.text,
          tabBarItemStyle: {
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 14,
            paddingBottom: 8,
          },
          tabBarLabelStyle: {
            textAlign: "center",
          },
        }}
      >
        <Tabs.Screen
          name="menu"
          options={{
            title: "Menu",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="restaurant" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "Cart",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cart" size={size} color={color} />
            ),
            tabBarBadge: cartCount > 0 ? cartCount : undefined,
            tabBarBadgeStyle: { backgroundColor: theme.primary },
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: "Orders",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="receipt" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="about"
          options={{
            title: "About",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="location-sharp" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
      <MenuDrawer visible={isOpen} onClose={closeDrawer} />
    </SafeAreaView>
  );
}

export default function TabLayout() {
  return (
    <DrawerProvider>
      <TabLayoutInner />
    </DrawerProvider>
  );
}
