export const mockMenu = [
  { 
    id: "1", 
    name: "Green Apple Soda Cooler",
    price: 39, 
    points: 1,
    description: "Fresh green apple soda with a cool, fizzy twist. Perfect for hot days and refreshing moments.",
    image: require("@/assets/images/soda.webp"), // Soda cup emoji
    isFavorite: false,
    category: "soda",
    inCart: true,
    sizes: [
      { name: "12oz", price: 39, multiplier: 1, isAvailable: true },
      { name: "16oz", price: 49, multiplier: 1.25, isAvailable: true }
    ],
  },
  { 
    id: "9", 
    name: "Blueberry Soda Cooler", 
    price: 39, 
    points: 1,
    description: "Fresh blueberry soda with a cool, fizzy twist. Perfect for hot days and refreshing moments.",
    image: require("@/assets/images/soda.webp"), // Soda cup emoji
    isFavorite: false,
    category: "soda",
    inCart: true,
    sizes: [
      { name: "12oz", price: 39, multiplier: 1, isAvailable: true },
      { name: "16oz", price: 49, multiplier: 1.25, isAvailable: true }
    ],
  },
  { 
    id: "3", 
    name: "Lychee Soda Cooler", 
    price: 39, 
    points: 1,
    description: "Fresh lychee soda with a cool, fizzy twist. Perfect for hot days and refreshing moments.",
    image: require("@/assets/images/soda.webp"), // Soda cup emoji
    isFavorite: false,
    category: "soda",
    inCart: true,
    sizes: [
      { name: "12oz", price: 39, multiplier: 1, isAvailable: true },
      { name: "16oz", price: 49, multiplier: 1.25, isAvailable: true }
    ],
  },
  { 
    id: "4", 
    name: "Strawberry Soda Cooler", 
    price: 39, 
    points: 1,
    description: "Fresh strawberry soda with a cool, fizzy twist. Perfect for hot days and refreshing moments.",
    image: require("@/assets/images/soda.webp"), // Soda cup emoji
    isFavorite: false,
    category: "soda",
    inCart: true,
    sizes: [
      { name: "12oz", price: 39, multiplier: 1, isAvailable: true },
      { name: "16oz", price: 49, multiplier: 1.25, isAvailable: true }
    ],
  },
  { 
    id: "5", 
    name: "Blue Lemon Soda Cooler", 
    price: 39, 
    points: 1,
    description: "Zesty blue lemon soda with a burst of citrus flavor. Cool and refreshing with every sip.",
    image: require("@/assets/images/soda.webp"),
    isFavorite: false,
    category: "soda",
    sizes: [
      { name: "12oz", price: 39, multiplier: 1, isAvailable: true },
      { name: "16oz", price: 49, multiplier: 1.25, isAvailable: true }
    ],
  },
  { 
    id: "6", 
    name: "Iced Caramel Macchiato", 
    price: 49, 
    points: 2,
    description: "Rich espresso with vanilla syrup, milk, and caramel drizzle. A coffee lover's dream in a glass.",
    image: require("@/assets/images/coffee.webp"), // Coffee emoji
    isFavorite: true,
    category: "coffee",
    sizes: [
      { name: "12oz", price: 39, multiplier: 1, isAvailable: false },
      { name: "16oz", price: 49, multiplier: 1.25, isAvailable: true }
    ],
  },
  { 
    id: "7", 
    name: "Iced Mocha Latte", 
    price: 49, 
    points: 2,
    description: "Smooth espresso blended with chocolate and milk. Perfect balance of coffee and sweetness.",
    image: require("@/assets/images/coffee.webp"), // Coffee emoji
    isFavorite: false,
    category: "coffee",
    sizes: [
      { name: "12oz", price: 39, multiplier: 1, isAvailable: false },
      { name: "16oz", price: 49, multiplier: 1.25, isAvailable: true }
    ],
  },
  { 
    id: "8", 
    name: "Iced Vanilla Latte", 
    price: 39, 
    points: 1,
    description: "Classic espresso with smooth vanilla and creamy milk. Simple, elegant, and always satisfying.",
    image: require("@/assets/images/coffee.webp"), // Coffee emoji
    isFavorite: false,
    category: "coffee",
    sizes: [
      { name: "12oz", price: 39, multiplier: 1, isAvailable: false },
      { name: "16oz", price: 49, multiplier: 1.25, isAvailable: true }
    ],
  },
];
