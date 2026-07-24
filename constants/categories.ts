import { CatalogItem, CategoryId } from "@/utils/types";

const CATEGORY_LABELS: Record<CategoryId, string> = {
  soda: "Soda",
  milk: "Milk",
  matcha: "Matcha",
  biscoff: "Biscoff",
  oreo: "Oreo",
  coffee: "Coffee",
  chocolate: "Chocolate",
  hotdrinks: "Hot Drinks",
  signature: "Signature",
  krunch: "Krunch",
  others: "Others",
};

const CATEGORY_ORDER: CategoryId[] = [
  "soda",
  "milk",
  "matcha",
  "biscoff",
  "oreo",
  "coffee",
  "chocolate",
  "hotdrinks",
  "signature",
  "krunch",
  "others",
];

export function getCategories(menu: CatalogItem[]) {
  return [
    { id: "all", name: "All", count: menu.length },
    ...CATEGORY_ORDER.map((id) => ({
      id,
      name: CATEGORY_LABELS[id],
      count: menu.filter((item) => item.category === id).length,
    })),
  ];
}
