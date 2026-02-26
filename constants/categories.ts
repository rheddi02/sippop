import { mockMenu } from "@/api/mockData";

export const categories = [
  { id: "all", name: "All", count: mockMenu.length },
  {
    id: "soda",
    name: "Soda",
    count: mockMenu.filter((item) => item.category === "soda").length,
  },
  {
    id: "milk",
    name: "Milk",
    count: mockMenu.filter((item) => item.category === "milk").length,
  },
  {
    id: "coffee",
    name: "Coffee",
    count: mockMenu.filter((item) => item.category === "coffee").length,
  },
  {
    id: "matcha",
    name: "Matcha",
    count: mockMenu.filter((item) => item.category === "matcha").length,
  },
  {
    id: "chocolate",
    name: "Chocolate",
    count: mockMenu.filter((item) => item.category === "chocolate").length,
  },
  {
    id: "signature",
    name: "Signature",
    count: mockMenu.filter((item) => item.category === "signature").length,
  },
  {
    id: "other",
    name: "Other",
    count: mockMenu.filter((item) => item.category === "other").length,
  },
];
