const sizes = [{ name: "16oz", price: 65, isAvailable: true }];

const options = {
  sizes,
  category: "other",
  isFavorite: false,
};
export const OtherMenu = [
  {
    id: "other-1",
    name: "Cookies and Cream",
    description:
      "Classic espresso with crushed cookies and creamy milk. A delightful blend of rich coffee and sweet indulgence.",
    image: require("@/assets/images/others/cookies-cream.webp"),
    ...options,
  },
  {
    id: "other-2",
    name: "Coke Float",
    description:
      "Classic espresso with fizzy cola and creamy milk. A nostalgic treat that combines the best of both worlds.",
    image: require("@/assets/images/others/coke-float.webp"),
    ...options,
  },
  {
    id: "other-3",
    name: "Creamy Ube",
    description:
      "Classic espresso with smooth ube and creamy milk. Simple, elegant, and always satisfying.",
    image: require("@/assets/images/others/creamy-ube.webp"),
    ...options,
  },
];
