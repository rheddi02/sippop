import { useThemeColors } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
  const { theme } = useThemeColors();

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
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 14,
            paddingBottom: 8,
          },
          tabBarLabelStyle: {
            textAlign: 'center',
          },
        }}
      >
      <Tabs.Screen 
        name="wallet" 
        options={{ 
          href: null
        }} 
      />
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
          href: null
        }} 
      />
      {/* <Tabs.Screen 
        name="profile" 
        options={{ 
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }} 
      /> */}
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
