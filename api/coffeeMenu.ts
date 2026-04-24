const sizes = [{ name: "16oz", price: 55, isAvailable: true }];

const options = {
  sizes,
  category: "coffee",
  isFavorite: false,
  variants: ["hot", "iced"],
};
export const CoffeeMenu = [
  {
    id: "coffee-1",
    name: "Caramel Macchiato",
    description:
      "Rich espresso with vanilla syrup, milk, and caramel drizzle. A coffee lover's dream in a glass.",
    image: require("@/assets/images/coffee/caramel-macchiato.webp"),
    ...options,
  },
  {
    id: "coffee-2",
    name: "Spanish Latte",
    description:
      "Classic espresso with smooth spanish and creamy milk. Simple, elegant, and always satisfying.",
    image: require("@/assets/images/coffee/spanish-latte.webp"),
    ...options,
  },
  {
    id: "coffee-3",
    name: "Strawberry Espresso",
    description:
      "Classic espresso with smooth strawberry and creamy milk. Simple, elegant, and always satisfying.",
    image: require("@/assets/images/coffee/strawberry-espresso.webp"),
    ...options,
  },
  {
    id: "coffee-4",
    name: "Hot Spanish Latte",
    description:
      "Classic espresso with smooth spanish and creamy milk. Simple, elegant, and always satisfying.",
    image: require("@/assets/images/coffee/hot-spanish-latte.webp"),
    ...options,
    sizes: [{ name: "8oz", price: 49, isAvailable: true }],
  },
  {
    id: "coffee-5",
    name: "Hot Caramel Macchiato",
    description:
      "Classic espresso with smooth caramel and creamy milk. Simple, elegant, and always satisfying.",
    image: require("@/assets/images/coffee/hot-caramel-macchiato.webp"),
    ...options,
    sizes: [{ name: "8oz", price: 49, isAvailable: true }],
  },
];
