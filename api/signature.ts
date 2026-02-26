const sizes = [{ name: "16oz", price: 99, isAvailable: true }];

const options = {
  sizes,
  category: "signature",
  isFavorite: false,
};
export const SignatureMenu = [
  {
    id: "signature-1",
    name: "Affogato Latte",
    description:
      "Rich espresso with vanilla ice cream and milk. A coffee lover's dream in a glass.",
    image: require("@/assets/images/signature/affogato-latte.webp"),
    ...options,
  },
  {
    id: "signature-2",
    name: "Affogato Matcha Latte",
    description:
      "Rich matcha with vanilla ice cream and milk. A matcha lover's dream in a glass.",
    image: require("@/assets/images/signature/affogato-matcha.webp"),
    ...options,
  },
];
