// Small pure helpers shared by several components.

export const LOW_STOCK_LIMIT = 10; // quantity at/below this (but > 0) is "Low Stock"

export const CATEGORIES = ["Electronics", "Clothing", "Home & Kitchen", "Books", "Sports", "Toys"];

/** Returns "in" | "low" | "out" for a given quantity. */
export function getStockStatus(quantity) {
  if (quantity <= 0) return "out";
  if (quantity <= LOW_STOCK_LIMIT) return "low";
  return "in";
}

export const STATUS_LABELS = {
  in: "In Stock",
  low: "Low Stock",
  out: "Out of Stock",
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

/** Unique id generator (crypto.randomUUID with a safe fallback). */
export const makeId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const SEED_PRODUCTS = [
  { id: "seed-1", title: "Wireless Headphones", category: "Electronics", price: 59.99, quantity: 25 },
  { id: "seed-2", title: "Cotton T-Shirt", category: "Clothing", price: 14.5, quantity: 6 },
  { id: "seed-3", title: "Non-stick Frying Pan", category: "Home & Kitchen", price: 24.0, quantity: 0 },
  { id: "seed-4", title: "JavaScript: The Good Parts", category: "Books", price: 19.99, quantity: 42 },
];
