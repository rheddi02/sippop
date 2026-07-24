import { ImageSourcePropType } from "react-native";

// Catalog/menu category ids
export type CategoryId =
  | "soda"
  | "milk"
  | "matcha"
  | "biscoff"
  | "oreo"
  | "coffee"
  | "chocolate"
  | "hotdrinks"
  | "signature"
  | "krunch"
  | "others";

// A purchasable size/temperature option for a catalog item
export interface SizeOption {
  name: string;
  price: number;
  isAvailable: boolean;
  temperature?: "hot" | "iced";
  image?: ImageSourcePropType;
  // The POS row this size variant came from — POS-sourced products don't
  // have a separate sizes table, so each size is its own product row.
  // Needed once order placement has to reference a real POS product id.
  productId?: string;
}

// A menu/catalog item as browsed on the Menu tab (distinct from the cart-facing Product below)
export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  image: ImageSourcePropType | null;
  category: CategoryId;
  sizes: SizeOption[];
}

// Product type (used in menu, cart, orders)
export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: ImageSourcePropType | null;
  size: string;
  // The real POS product row this cart item was built from — needed by
  // place_order() to look up an authoritative, server-verified price.
  productId: string;
}

// Cart item type
export interface CartItem extends Product {
  quantity: number;
}

// A single line item as actually persisted by place_order() — priced
// server-side, distinct from CartItem which is the client-side cart shape.
export interface OrderLineItem {
  productId: string;
  name: string;
  size: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

// Order type
export interface Order {
  id: string;
  items: OrderLineItem[];
  total: number;
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled";
  paymentMethod: "cash" | "credit";
  pointsEarned: number;
  createdAt: Date;
}

// A customer's points/credit profile (the `customers` table, extended with
// loyalty fields in Phase 3 — 1:1 with auth.users via `user_id`).
export interface Profile {
  points: number;
  creditBalance: number;
  creditLimit: number;
}

// Supabase's User.app_metadata is a loose { [key: string]: any } — this narrows
// the one claim this app cares about. Set on auth.users by the shop owner via
// the Supabase Dashboard; there is exactly one "admin" account, everyone else
// is a customer.
export interface AppMetadata {
  role?: "admin";
  provider?: string;
  providers?: string[];
}
