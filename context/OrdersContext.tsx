import { fetchOrders, placeOrder as placeOrderApi } from "@/api/orders";
import { useUser } from "@/hooks/useUser";
import { buildGuestOrder, loadGuestOrders, saveGuestOrder } from "@/utils/guestOrders";
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
  const { user, isAuthChecked } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      setOrders(user ? await fetchOrders() : await loadGuestOrders());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Wait for the initial session check so a guest's orders aren't fetched
    // (and then immediately replaced) while a stored session is still loading.
    if (!isAuthChecked) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthChecked, user]);

  const placeOrder = async (items: CartItem[], useCredit = false) => {
    if (user) {
      const order = await placeOrderApi(items, useCredit);
      setOrders((prev) => [order, ...prev]);
      return order;
    }

    const order = buildGuestOrder(items);
    await saveGuestOrder(order);
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
