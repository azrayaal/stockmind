import type { Product, Transaction } from "@/types";

export function computeDashboardStats(
  products: Product[],
  transactions: Transaction[]
) {
  const today = new Date().toDateString();
  const todayTransactions = transactions.filter(
    (t) => new Date(t.createdAt).toDateString() === today
  );

  const revenueToday = todayTransactions
    .filter((t) => t.type === "out")
    .reduce((sum, t) => sum + t.total, 0);

  const stockOutToday = todayTransactions
    .filter((t) => t.type === "out")
    .reduce((sum, t) => sum + t.quantity, 0);

  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;

  return {
    totalProducts: products.length,
    lowStockCount,
    revenueToday,
    stockOutToday,
    forecastSummary: `${lowStockCount} produk perlu restock dalam 7 hari`,
  };
}
