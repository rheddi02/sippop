import { CatalogItem, Product, SizeOption } from "./types";

export function buildCartItemId(
  itemId: string,
  sizeName: string,
  sweetness?: string,
  ice?: string,
): string {
  const base = `${itemId}-${sizeName}`;
  const suffix = [sweetness, ice].filter(Boolean).join("-");
  return `${suffix ? `${base}-${suffix}` : base}`
    .toLowerCase()
    .replace(/\s+/g, "");
}

export function toCartItem(
  item: Pick<CatalogItem, "id" | "name" | "image">,
  size: SizeOption,
  quantity: number,
  sweetness?: string,
  ice?: string,
): Product {
  return {
    id: buildCartItemId(item.id, size.name, sweetness, ice),
    name: item.name,
    quantity,
    price: size.price,
    image: size.image ?? item.image,
    size: size.name,
    productId: size.productId ?? item.id,
    ...(sweetness ? { sweetness } : {}),
    ...(ice ? { ice } : {}),
  };
}
