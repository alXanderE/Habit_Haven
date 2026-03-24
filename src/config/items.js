export const STORE_ITEMS = [
  {
    id: "hat-red",
    name: "Red Cap",
    type: "avatar",
    cost: 30,
    style: "linear-gradient(135deg, #ef4444, #f97316)"
  },
  {
    id: "hat-ocean",
    name: "Ocean Helm",
    type: "avatar",
    cost: 60,
    style: "linear-gradient(135deg, #0ea5e9, #2563eb)"
  },
  {
    id: "petal-wall",
    name: "Petal Wall",
    type: "base",
    cost: 45,
    style: "linear-gradient(135deg, #f9a8d4, #fef08a)"
  },
  {
    id: "forest-wall",
    name: "Forest Wall",
    type: "base",
    cost: 75,
    style: "linear-gradient(135deg, #4ade80, #166534)"
  }
];

export function getItemById(itemId) {
  return STORE_ITEMS.find((item) => item.id === itemId);
}
