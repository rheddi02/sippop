import { supabase } from "@/lib/supabase";
import { CartItem, Order, OrderLineItem } from "@/utils/types";

interface OrderRow {
  id: string;
  items: {
    product_id: string;
    name: string;
    size: string;
    quantity: number;
    unit_price: number;
    line_total: number;
  }[];
  subtotal: number;
  status: Order["status"];
  payment_method: Order["paymentMethod"];
  points_earned: number;
  created_at: string;
}

function toOrder(row: OrderRow): Order {
  const items: OrderLineItem[] = (row.items ?? []).map((item) => ({
    productId: item.product_id,
    name: item.name,
    size: item.size,
    quantity: item.quantity,
    unitPrice: item.unit_price,
    lineTotal: item.line_total,
  }));

  return {
    id: row.id,
    items,
    total: Number(row.subtotal),
    status: row.status,
    paymentMethod: row.payment_method,
    pointsEarned: row.points_earned,
    createdAt: new Date(row.created_at),
  };
}

// Places an order via the place_order RPC — the only place order/points/
// credit rows ever get written. Price is never trusted from the client;
// the RPC re-looks-up each product's current price server-side.
export async function placeOrder(
  cart: CartItem[],
  useCredit = false,
): Promise<Order> {
  const items = cart.map((item) => ({
    product_id: item.productId,
    size: item.size,
    quantity: item.quantity,
  }));

  const { data, error } = await supabase.rpc("place_order", {
    p_items: items,
    p_use_credit: useCredit,
  });
  if (error) throw error;
  return toOrder(data as OrderRow);
}

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("id, items, subtotal, status, payment_method, points_earned, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as OrderRow[]).map(toOrder);
}
