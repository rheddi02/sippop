import { TopSellingRow } from "@/api/topSelling";
import { buildCatalogItemIndex, rankCatalogItemIds } from "./catalogRanking";
import { getCuratedItems } from "./curatedMenu";
import { CatalogItem } from "./types";

// Re-aggregates raw per-size-variant sales rows up to their parent
// CatalogItem (a flavor's sizes are separate POS product rows) before
// ranking and capping — otherwise a true top-5-flavors month could show
// fewer than 5 cards if the raw rows were capped before de-duping sizes.
export function getTopSellingItems(
  rows: TopSellingRow[],
  menu: CatalogItem[],
  limit = 5
): CatalogItem[] {
  const catalogItemByProductId = buildCatalogItemIndex(menu);

  const counts = new Map<string, number>();
  for (const row of rows) {
    const catalogItem = catalogItemByProductId.get(row.product_id);
    if (!catalogItem) continue;
    counts.set(catalogItem.id, (counts.get(catalogItem.id) ?? 0) + row.quantity);
  }

  const ranked = rankCatalogItemIds(counts, limit);
  return getCuratedItems(menu, ranked);
}
