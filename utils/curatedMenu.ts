import { CatalogItem } from "./types";

// Resolves a hand-curated list of CatalogItem ids (see constants/featured.ts)
// against the live menu, preserving curation order and dropping any id that
// no longer matches a fetched item (deactivated product, stale/typo'd id).
export function getCuratedItems(menu: CatalogItem[], ids: string[]): CatalogItem[] {
  const byId = new Map(menu.map((item) => [item.id, item]));
  return ids.reduce<CatalogItem[]>((acc, id) => {
    const item = byId.get(id);
    if (item) acc.push(item);
    return acc;
  }, []);
}
