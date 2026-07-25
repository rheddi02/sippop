import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { CartItem, Order, OrderLineItem } from "./types";

// Guest (logged-out) order history lives entirely on-device — no Supabase
// session to attribute a row to, and no points/credit to track since both
// are account-only features. The Facebook Messenger notification already
// fired on every checkout (see cart.tsx) remains the one real channel that
// tells the shop about the order, same as it always has.
const GUEST_ORDERS_STORAGE_KEY = "@sippop_guest_orders";

export function buildGuestOrder(cart: CartItem[]): Order {
  const items: OrderLineItem[] = cart.map((item) => ({
    productId: item.productId,
    name: item.name,
    size: item.size,
    quantity: item.quantity,
    unitPrice: item.price,
    lineTotal: item.price * item.quantity,
  }));

  return {
    id: Crypto.randomUUID(),
    items,
    total: items.reduce((sum, item) => sum + item.lineTotal, 0),
    status: "pending",
    paymentMethod: "cash",
    pointsEarned: 0,
    createdAt: new Date(),
  };
}

export async function loadGuestOrders(): Promise<Order[]> {
  const stored = await AsyncStorage.getItem(GUEST_ORDERS_STORAGE_KEY);
  if (!stored) return [];

  const parsed = JSON.parse(stored) as (Omit<Order, "createdAt"> & {
    createdAt: string;
  })[];
  return parsed.map((order) => ({
    ...order,
    createdAt: new Date(order.createdAt),
  }));
}

export async function saveGuestOrder(order: Order): Promise<void> {
  const existing = await loadGuestOrders();
  const updated = [order, ...existing];
  await AsyncStorage.setItem(GUEST_ORDERS_STORAGE_KEY, JSON.stringify(updated));
}
