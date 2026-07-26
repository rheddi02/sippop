import { supabase } from "@/lib/supabase";

export interface TopSellingRow {
  product_id: string;
  quantity: number;
}

let cachedTopSelling: TopSellingRow[] | null = null;

// Store-wide, security-definer aggregate (orders RLS restricts direct reads
// to the caller's own rows — see fetchOrders() in api/orders.ts). Returns the
// current month's (or previous month's, if current is empty) non-cancelled
// sales by raw product_id, uncapped — capping to "max 5" happens after
// CatalogItem re-mapping, in utils/topSelling.ts.
export async function fetchTopSellingProducts(forceRefresh = false): Promise<TopSellingRow[]> {
  if (cachedTopSelling && !forceRefresh) return cachedTopSelling;

  const { data, error } = await supabase.rpc("get_admin_top_selling_products");
  if (error) throw error;

  cachedTopSelling = (data as TopSellingRow[]) ?? [];
  return cachedTopSelling;
}
