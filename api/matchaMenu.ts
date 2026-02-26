const sizes = [{ name: "16oz", price: 59, isAvailable: true }];

const options = {
  sizes,
  category: "matcha",
  isFavorite: false,
};
export const MatchaMenu = [
  {
    id: "matcha-1",
    name: "Matcha Latte",
    description:
      "Rich matcha milk with a cool, creamy texture. Perfect for satisfying your matcha cravings.",
    image: require("@/assets/images/matcha/matcha-latte.webp"),
    ...options,
  },
  {
    id: "matcha-2",
    name: "Matcha Strawberry",
    description:
      "Rich matcha milk with a cool with strawberry flavor. Perfect for satisfying your matcha cravings.",
    image: require("@/assets/images/matcha/matcha-strawberry.webp"),
    ...options,
  },
  {
    id: "matcha-3",
    name: "Matcha Caramel",
    description:
      "Rich matcha milk with a cool with caramel flavor. Perfect for satisfying your matcha cravings.",
    image: require("@/assets/images/matcha/matcha-caramel.webp"),
    ...options,
  },
  {
    id: "matcha-4",
    name: "Matcha Espresso",
    description:
      "Rich matcha milk with a cool with espresso flavor. Perfect for satisfying your matcha cravings.",
    image: require("@/assets/images/matcha/matcha-espresso.webp"),
    ...options,
  },
  {
    id: "matcha-5",
    name: "Hot Matcha Latte",
    description:
      "Rich matcha milk with a hot, creamy texture. Perfect for satisfying your matcha cravings.",
    image: require("@/assets/images/matcha/hot-matcha-latte.webp"),
    ...options,
    sizes: [{ name: "8oz", price: 49, isAvailable: true }],
  },
];
