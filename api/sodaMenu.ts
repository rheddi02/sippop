const sizes = [
  { name: "12oz", price: 29, isAvailable: true },
  { name: "16oz", price: 39, isAvailable: true },
];

const options = {
  sizes,
  category: "soda",
  isFavorite: false,
};
export const SodaMenu = [
  {
    id: "soda-1",
    name: "Green Apple Soda Cooler",
    description:
      "Fresh green apple soda with a cool, fizzy twist. Perfect for hot days and refreshing moments.",
    image: require("@/assets/images/soda/green-apple-soda.webp"),
    ...options,
  },
  {
    id: "soda-2",
    name: "Blueberry Soda Cooler",
    description:
      "Fresh blueberry soda with a cool, fizzy twist. Perfect for hot days and refreshing moments.",
    image: require("@/assets/images/soda/blueberry-soda.webp"),
    ...options,
  },
  {
    id: "soda-3",
    name: "Strawberry Soda Cooler",
    description:
      "Fresh strawberry soda with a cool, fizzy twist. Perfect for hot days and refreshing moments.",
    image: require("@/assets/images/soda/strawberry-soda.webp"),
    ...options,
  },
  {
    id: "soda-4",
    name: "Blue Lemonade Soda Cooler",
    description:
      "Zesty blue lemon soda with a burst of citrus flavor. Cool and refreshing with every sip.",
    image: require("@/assets/images/soda/blue-lemonade-soda.webp"),
    ...options,
  },
];
