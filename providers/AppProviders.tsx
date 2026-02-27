import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { OrdersProvider } from "@/context/OrdersContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { WalletProvider } from "@/context/WalletContext";
import React, { ReactNode } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <AuthProvider>
            <WalletProvider>
              <CartProvider>
                <OrdersProvider>
                  <FavoritesProvider>{children}</FavoritesProvider>
                </OrdersProvider>
              </CartProvider>
            </WalletProvider>
          </AuthProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
