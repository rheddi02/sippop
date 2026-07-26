import { buildCatalogItemIndex, rankCatalogItemIds } from "./catalogRanking";
import { getCuratedItems } from "./curatedMenu";
import { CatalogItem, Order } from "./types";

// "Recommended for you" — tallies how often each CatalogItem was ordered
// (Order.items are priced/size-level rows keyed by productId, so each line
// is mapped back to its parent CatalogItem via CatalogItem.sizes[].productId
// before counting) and ranks by frequency. Falls back to the curated
// top-selling list when there's no usable order history — a guest with no
// orders yet, or a returning customer whose past items have since been
// deactivated and no longer resolve against the current menu.
export function getRecommendedItems(
  orders: Order[],
  menu: CatalogItem[],
  fallbackIds: string[],
  limit = 10
): CatalogItem[] {
  const catalogItemByProductId = buildCatalogItemIndex(menu);

  const counts = new Map<string, number>();
  for (const order of orders) {
    for (const line of order.items) {
      const catalogItem = catalogItemByProductId.get(line.productId);
      if (!catalogItem) continue;
      counts.set(catalogItem.id, (counts.get(catalogItem.id) ?? 0) + line.quantity);
    }
  }

  const ranked = rankCatalogItemIds(counts, limit);
  const items = getCuratedItems(menu, ranked);
  return items.length > 0 ? items : getCuratedItems(menu, fallbackIds);
}
