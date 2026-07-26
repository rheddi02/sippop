import { supabase } from "@/lib/supabase";

export interface CategoryCoverRow {
  id: string;
  category: string;
  image_url: string | null;
}

let cachedCovers: CategoryCoverRow[] | null = null;

// Relies on the "customers read admin category covers" RLS policy on the
// POS backend (supabase-schema.sql) — no auth/user filtering needed
// client-side, same trust model as fetchMenu()/fetchPromos().
export async function fetchCategoryCovers(forceRefresh = false): Promise<CategoryCoverRow[]> {
  if (cachedCovers && !forceRefresh) return cachedCovers;

  const { data, error } = await supabase
    .from("category_covers")
    .select("id,category,image_url");

  if (error) throw error;

  cachedCovers = (data as CategoryCoverRow[]) ?? [];
  return cachedCovers;
}
