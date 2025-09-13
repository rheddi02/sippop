import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { OrdersProvider } from "@/context/OrdersContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { WalletProvider } from "@/context/WalletContext";
import React, { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <WalletProvider>
            <CartProvider>
              <OrdersProvider>{children}</OrdersProvider>
            </CartProvider>
          </WalletProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
