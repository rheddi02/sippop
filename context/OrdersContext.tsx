import React, { createContext, useState, ReactNode, useContext } from "react";
import { Order, CartItem } from "@/utils/types";

interface OrdersContextType {
  orders: Order[];
  placeOrder: (items: CartItem[], total: number) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
}

export const OrdersContext = createContext<OrdersContextType | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const placeOrder = (items: CartItem[], total: number) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      items,
      total,
      status: "pending",
      createdAt: new Date(),
    };
    setOrders((prev) => [...prev, newOrder]);
  };

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
  };

  return (
    <OrdersContext.Provider value={{ orders, placeOrder, updateOrderStatus }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}