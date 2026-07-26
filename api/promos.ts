import { supabase } from "@/lib/supabase";

export interface PromoRow {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  product_id: string | null;
  original_price: number | null;
  promo_price: number | null;
  sort_order: number;
}

let cachedPromos: PromoRow[] | null = null;

// Relies on the "customers read admin promos" RLS policy on the POS backend
// (supabase-schema.sql), which already filters to is_active — no auth/user
// filtering needed client-side, same trust model as fetchMenu().
export async function fetchPromos(forceRefresh = false): Promise<PromoRow[]> {
  if (cachedPromos && !forceRefresh) return cachedPromos;

  const { data, error } = await supabase
    .from("promos")
    .select("id,title,subtitle,image_url,product_id,original_price,promo_price,sort_order")
    .order("sort_order", { ascending: true });

  if (error) throw error;

  cachedPromos = (data as PromoRow[]) ?? [];
  return cachedPromos;
}
