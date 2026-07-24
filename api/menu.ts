import { supabase } from "@/lib/supabase";
import { CatalogItem, CategoryId, SizeOption } from "@/utils/types";

interface ProductRow {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string | null;
  is_active: boolean;
}

// POS category values are free-text Title Case and don't always match the
// app's category ids one-for-one (e.g. "Hot" -> "hotdrinks") — normalize
// explicitly rather than just lowercasing.
const POS_CATEGORY_MAP: Record<string, CategoryId> = {
  soda: "soda",
  milk: "milk",
  matcha: "matcha",
  biscoff: "biscoff",
  oreo: "oreo",
  coffee: "coffee",
  chocolate: "chocolate",
  hot: "hotdrinks",
  signature: "signature",
  krunch: "krunch",
  others: "others",
};

function normalizeCategory(raw: string): CategoryId {
  return POS_CATEGORY_MAP[raw.trim().toLowerCase()] ?? (raw.trim().toLowerCase() as CategoryId);
}

// The POS has no sizes/variants table — a multi-size drink is just several
// separate product rows whose names share a base and end in a size suffix,
// e.g. "Blueberry Milk 12oz" / "Blueberry Milk 16oz". This splits that
// suffix off so same-flavor rows can be grouped into one CatalogItem with a
// proper sizes list, instead of showing as separate cards.
const SIZE_SUFFIX = /^(.*?)\s+(\d+(?:\.\d+)?\s*oz)$/i;

function parseNameAndSize(rawName: string): { baseName: string; size: string | null } {
  const name = rawName.trim();
  const match = name.match(SIZE_SUFFIX);
  if (!match) return { baseName: name, size: null };
  return { baseName: match[1].trim(), size: match[2].replace(/\s+/g, "").toLowerCase() };
}

function sizeSortKey(size: string): number {
  const n = parseFloat(size);
  return Number.isNaN(n) ? 0 : n;
}

function toCatalogItems(rows: ProductRow[]): CatalogItem[] {
  const groups = new Map<
    string,
    { baseName: string; category: CategoryId; rows: { row: ProductRow; size: string | null }[] }
  >();

  for (const row of rows) {
    const category = normalizeCategory(row.category);
    const { baseName, size } = parseNameAndSize(row.name);
    const key = `${category}::${baseName.toLowerCase()}`;
    const group = groups.get(key) ?? { baseName, category, rows: [] };
    group.rows.push({ row, size });
    groups.set(key, group);
  }

  return Array.from(groups.values()).map((group) => {
    // The POS occasionally has literal duplicate rows (same name/price,
    // different ids) — within one grouped card that would otherwise show
    // the same size option twice in the picker, so keep only the first.
    const seenSizeNames = new Set<string>();
    const sizes: SizeOption[] = group.rows
      .filter(({ size }) => {
        const key = size ?? "Regular";
        if (seenSizeNames.has(key)) return false;
        seenSizeNames.add(key);
        return true;
      })
      .map(({ row, size }): SizeOption => ({
        name: size ?? "Regular",
        price: row.price,
        isAvailable: row.is_active,
        productId: row.id,
      }))
      .sort((a, b) => sizeSortKey(a.name) - sizeSortKey(b.name));

    // Use the smallest/first size's row as the group's stable id and image.
    const primary = group.rows[0].row;

    return {
      id: primary.id,
      name: group.baseName,
      // The POS schema has no description column today.
      description: "",
      image: primary.image_url ? { uri: primary.image_url } : null,
      category: group.category,
      sizes,
    };
  });
}

let cachedMenu: CatalogItem[] | null = null;

export async function fetchMenu(forceRefresh = false): Promise<CatalogItem[]> {
  if (cachedMenu && !forceRefresh) {
    return cachedMenu;
  }

  const { data, error } = await supabase
    .from("products")
    .select("id,name,price,category,image_url,is_active")
    .eq("is_active", true);

  if (error) throw error;

  const menu = toCatalogItems(data as ProductRow[]);
  cachedMenu = menu;
  return menu;
}
