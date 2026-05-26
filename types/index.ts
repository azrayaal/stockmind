export type ProductCategory =
  | "Makanan"
  | "Minuman"
  | "Sembako"
  | "Snack"
  | "Perawatan"
  | "Lainnya";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  stock: number;
  minStock: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = "in" | "out";

export interface Transaction {
  id: string;
  productId: string;
  productName: string;
  type: TransactionType;
  quantity: number;
  unitPrice: number;
  total: number;
  note?: string;
  createdAt: string;
}

export type AlertType = "low_stock" | "overstock" | "unusual_movement";

export type AlertSeverity = "low" | "medium" | "high";

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  productId: string;
  productName: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface Forecast {
  productId: string;
  productName: string;
  currentStock: number;
  avgDailyUsage: number;
  daysUntilDepletion: number;
  recommendedReorder: number;
  confidence: number;
  trend: "up" | "down" | "stable";
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
}

export interface StockMovementPoint {
  date: string;
  stockIn: number;
  stockOut: number;
}

export interface FastMovingProduct {
  name: string;
  sold: number;
  revenue: number;
}

export interface DashboardStats {
  totalProducts: number;
  lowStockCount: number;
  revenueToday: number;
  stockOutToday: number;
  forecastSummary: string;
}

export interface ProductFormData {
  name: string;
  sku: string;
  category: ProductCategory;
  stock: number;
  minStock: number;
  price: number;
}

export interface TransactionFormData {
  productId: string;
  quantity: number;
  note?: string;
}
