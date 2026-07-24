import { CatalogItem, Product, SizeOption } from "./types";

export function buildCartItemId(itemId: string, sizeName: string): string {
  return `${itemId}-${sizeName}`.toLowerCase().replace(/\s+/g, "");
}

export function toCartItem(
  item: Pick<CatalogItem, "id" | "name" | "image">,
  size: SizeOption,
  quantity: number,
): Product {
  return {
    id: buildCartItemId(item.id, size.name),
    name: item.name,
    quantity,
    price: size.price,
    image: size.image ?? item.image,
    size: size.name,
    productId: size.productId ?? item.id,
  };
}
