export const sizes = [
  { name: "12oz", price: 39, isAvailable: true },
  { name: "16oz", price: 49, isAvailable: true },
];

const options = {
  sizes,
  category: "milk",
  isFavorite: false,
};
export const MilkMenu = [
  {
    id: "milk-1",
    name: "Strawberry Milk",
    description:
      "Fresh strawberry milk with a cool, fizzy twist. Perfect for hot days and refreshing moments.",
    image: require("@/assets/images/milk/strawberry-milk.webp"),
    ...options,
  },
  {
    id: "milk-2",
    name: "Lychee Milk",
    description:
      "Fresh lychee milk with a cool, fizzy twist. Perfect for hot days and refreshing moments.",
    image: require("@/assets/images/milk/lychee-milk.webp"),
    ...options,
  },
  {
    id: "milk-3",
    name: "Green Apple Milk",
    description:
      "Fresh green apple milk with a cool, fizzy twist. Perfect for hot days and refreshing moments.",
    image: require("@/assets/images/milk/green-apple-milk.webp"),
    ...options,
  },

  {
    id: "milk-4",
    name: "Blueberry Milk",
    description:
      "Fresh blueberry milk with a cool, fizzy twist. Perfect for hot days and refreshing moments.",
    image: require("@/assets/images/milk/blueberry-milk.webp"),
    ...options,
  },
];
