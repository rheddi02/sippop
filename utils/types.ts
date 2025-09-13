// Product type (used in menu, cart, orders)
export interface Product {
  id: string;
  name: string;
  price: number;
  points: number; // how many points the product gives
}

// Cart item type
export interface CartItem extends Product {
  quantity: number;
}

// Order type
export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "preparing" | "ready" | "delivered";
  createdAt: Date;
}

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  walletBalance: number;
}

// Voucher type
export interface Voucher {
  id: string;
  code: string;
  discount: number; // percent or flat discount
  isActive: boolean;
}
