import { CatalogItem } from "./types";

// Maps every size variant's underlying POS product id back to its parent
// CatalogItem, so per-size sales can be re-aggregated at the flavor level.
export function buildCatalogItemIndex(menu: CatalogItem[]): Map<string, CatalogItem> {
  const index = new Map<string, CatalogItem>();
  for (const item of menu) {
    for (const size of item.sizes) {
      if (size.productId) index.set(size.productId, item);
    }
  }
  return index;
}

export function rankCatalogItemIds(counts: Map<string, number>, limit: number): string[] {
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);
}
