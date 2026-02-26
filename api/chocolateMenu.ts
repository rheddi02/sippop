const sizes = [{ name: "16oz", price: 59, isAvailable: true }];

const options = {
  sizes,
  category: "chocolate",
  isFavorite: false,
};
export const ChocolateMenu = [
  {
    id: "chocolate-1",
    name: "Chocolate Milk",
    description:
      "Rich chocolate milk with a cool, creamy texture. Perfect for satisfying your chocolate cravings.",
    image: require("@/assets/images/webp/choco-milk.webp"),
    ...options,
  },
  {
    id: "chocolate-2",
    name: "Choco Strawberry",
    description:
      "Rich chocolate milk with a cool with strawberry flavor. Perfect for satisfying your chocolate cravings.",
    image: require("@/assets/images/webp/choco-milk.webp"),
    ...options,
  },
  {
    id: "chocolate-3",
    name: "Choco Blueberry",
    description:
      "Rich chocolate milk with a cool with blueberry flavor. Perfect for satisfying your chocolate cravings.",
    image: require("@/assets/images/webp/choco-milk.webp"),
    ...options,
  },
  {
    id: "chocolate-4",
    name: "Choco Espresso",
    description:
      "Rich chocolate milk with a cool with espresso flavor. Perfect for satisfying your chocolate cravings.",
    image: require("@/assets/images/webp/choco-milk.webp"),
    ...options,
  },
];
