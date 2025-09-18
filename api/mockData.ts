const addOns = [
  { name: "Rainbow Jelly", price: 5, isAvailable: true },
  { name: "Yakult", price: 15, isAvailable: true },
]
const sizes = [
  { name: "12oz", price: 29, multiplier: 1, isAvailable: true },
  { name: "16oz", price: 39, multiplier: 1.25, isAvailable: true }
]
export const mockMenu = [
  { 
    id: "1", 
    name: "Green Apple Soda Cooler",
    points: 1,
    description: "Fresh green apple soda with a cool, fizzy twist. Perfect for hot days and refreshing moments.",
    image: require("@/assets/images/webp/green-apple-soda.webp"), // Soda cup emoji
    isFavorite: false,
    category: "soda",
    inCart: true,
    sizes,
    addOns,
  },
  { 
    id: "2", 
    name: "Blueberry Soda Cooler", 
    points: 1,
    description: "Fresh blueberry soda with a cool, fizzy twist. Perfect for hot days and refreshing moments.",
    image: require("@/assets/images/webp/blueberry-soda.webp"), // Soda cup emoji
    isFavorite: false,
    category: "soda",
    inCart: true,
    sizes,
    addOns,
  },
  { 
    id: "3", 
    name: "Lychee Soda Cooler", 
    points: 1,
    description: "Fresh lychee soda with a cool, fizzy twist. Perfect for hot days and refreshing moments.",
    image: require("@/assets/images/webp/lychee-soda.webp"), // Soda cup emoji
    isFavorite: false,
    category: "soda",
    inCart: true,
    sizes,
    addOns,
  },
  { 
    id: "4", 
    name: "Strawberry Soda Cooler", 
    points: 1,
    description: "Fresh strawberry soda with a cool, fizzy twist. Perfect for hot days and refreshing moments.",
    image: require("@/assets/images/webp/strawberry-soda.webp"), // Soda cup emoji
    isFavorite: false,
    category: "soda",
    inCart: true,
    sizes,
    addOns,
  },
  { 
    id: "5", 
    name: "Blue Lemonade Soda Cooler", 
    points: 1,
    description: "Zesty blue lemon soda with a burst of citrus flavor. Cool and refreshing with every sip.",
    image: require("@/assets/images/webp/blue-lemonade-soda.webp"),
    isFavorite: false,
    category: "soda",
    sizes,
    addOns,
  },
  { 
    id: "6", 
    name: "Strawberry Milk", 
    points: 1,
    description: "Fresh strawberry milk with a cool, fizzy twist. Perfect for hot days and refreshing moments.",
    image: require("@/assets/images/webp/strawberry-milk.webp"), // Soda cup emoji
    isFavorite: false,
    category: "milk",
    inCart: true,
    sizes: sizes.reduce((acc, size) => {
      return [...acc, { ...size, price: size.price + 10 }];
    }, []),
    addOns: [
      { name: "Rainbow Jelly", price: 5, isAvailable: true },
    ],
  },
  { 
    id: "7", 
    name: "Lychee Milk", 
    points: 1,
    description: "Fresh lychee milk with a cool, fizzy twist. Perfect for hot days and refreshing moments.",
    image: require("@/assets/images/webp/lychee-milk.webp"), // Soda cup emoji
    isFavorite: false,
    category: "milk",
    inCart: true,
    sizes: sizes.reduce((acc, size) => {
      return [...acc, { ...size, price: size.price + 10 }];
    }, []),
    addOns: [
      { name: "Rainbow Jelly", price: 5, isAvailable: true },
    ],
  },
  { 
    id: "8", 
    name: "Green Apple Milk",
    points: 1,
    description: "Fresh green apple milk with a cool, fizzy twist. Perfect for hot days and refreshing moments.",
    image: require("@/assets/images/webp/green-apple-milk.webp"), // Soda cup emoji
    isFavorite: false,
    category: "milk",
    inCart: true,
    sizes: sizes.reduce((acc, size) => {
      return [...acc, { ...size, price: size.price + 10 }];
    }, []),
    addOns: [
      { name: "Rainbow Jelly", price: 5, isAvailable: true },
    ],
  },

  { 
    id: "9", 
    name: "Blueberry Milk", 
    points: 1,
    description: "Fresh blueberry milk with a cool, fizzy twist. Perfect for hot days and refreshing moments.",
    image: require("@/assets/images/webp/blueberry-milk.webp"), // Soda cup emoji
    isFavorite: false,
    category: "milk",
    inCart: true,
    sizes: sizes.reduce((acc, size) => {
      return [...acc, { ...size, price: size.price + 10 }];
    }, []),
    addOns: [
      { name: "Rainbow Jelly", price: 5, isAvailable: true },
    ],
  },
  { 
    id: "10", 
    name: "Iced Caramel Macchiato", 
    points: 2,
    description: "Rich espresso with vanilla syrup, milk, and caramel drizzle. A coffee lover's dream in a glass.",
    image: require("@/assets/images/webp/caramel-macchiato.webp"), // Coffee emoji
    isFavorite: true,
    category: "coffee",
    sizes: [
      { name: "16oz", price: 49, multiplier: 1.25, isAvailable: true }
    ],
  },
  { 
    id: "11", 
    name: "Iced Spanish Latte", 
    points: 1,
    description: "Classic espresso with smooth spanish and creamy milk. Simple, elegant, and always satisfying.",
    image: require("@/assets/images/webp/spanish-latte.webp"), // Coffee emoji
    isFavorite: false,
    category: "coffee",
    sizes: [
      { name: "16oz", price: 49, multiplier: 1.25, isAvailable: true }
    ],
  },
];
