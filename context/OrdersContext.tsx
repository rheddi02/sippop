import { fetchOrders, placeOrder as placeOrderApi } from "@/api/orders";
import { CartItem, Order } from "@/utils/types";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface OrdersContextType {
  orders: Order[];
  loading: boolean;
  placeOrder: (items: CartItem[], useCredit?: boolean) => Promise<Order>;
  refresh: () => Promise<void>;
}

export const OrdersContext = createContext<OrdersContextType | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      setOrders(await fetchOrders());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const placeOrder = async (items: CartItem[], useCredit = false) => {
    const order = await placeOrderApi(items, useCredit);
    setOrders((prev) => [order, ...prev]);
    return order;
  };

  return (
    <OrdersContext.Provider value={{ orders, loading, placeOrder, refresh }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
