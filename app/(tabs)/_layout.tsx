import { useThemeColors } from "@/context/ThemeContext";
import { useUser } from "@/hooks/useUser";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
  const { theme } = useThemeColors();
  const { user, isAuthChecked } = useUser();
  // Only dim once the initial session check has resolved, so tabs don't
  // flash disabled while auth state is still loading.
  const loggedOut = isAuthChecked && !user;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.background,
            borderTopColor: theme.border,
            height: 80,
          },
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
            ...(loggedOut && {
              tabBarActiveTintColor: theme.muted,
              tabBarInactiveTintColor: theme.muted,
            }),
          }}
          listeners={{
            tabPress: (e) => {
              if (loggedOut) e.preventDefault();
            },
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: "Orders",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="receipt" size={size} color={color} />
            ),
            ...(loggedOut && {
              tabBarActiveTintColor: theme.muted,
              tabBarInactiveTintColor: theme.muted,
            }),
          }}
          listeners={{
            tabPress: (e) => {
              if (loggedOut) e.preventDefault();
            },
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
    </SafeAreaView>
  );
}
