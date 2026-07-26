import { CATEGORY_LABELS } from "@/constants/categories";
import { CatalogItem, CategoryId } from "./types";

export interface CategoryGroup {
  categoryId: CategoryId;
  label: string;
  items: CatalogItem[];
}

export function groupMenuByCategory(menu: CatalogItem[]): CategoryGroup[] {
  const itemsByCategory = new Map<CategoryId, CatalogItem[]>();
  for (const item of menu) {
    const items = itemsByCategory.get(item.category);
    if (items) items.push(item);
    else itemsByCategory.set(item.category, [item]);
  }

  return (Object.keys(CATEGORY_LABELS) as CategoryId[])
    .map((categoryId) => ({
      categoryId,
      label: CATEGORY_LABELS[categoryId],
      items: itemsByCategory.get(categoryId) ?? [],
    }))
    .filter((group) => group.items.length > 0);
}
