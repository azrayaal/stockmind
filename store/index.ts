import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockProducts } from "@/mock/products";
import { mockTransactions } from "@/mock/transactions";
import { mockAlerts } from "@/mock/alerts";
import type {
  Alert,
  Product,
  ProductFormData,
  Transaction,
  TransactionFormData,
} from "@/types";

interface AuthState {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (email, _password) => {
        if (email) {
          set({
            isAuthenticated: true,
            user: { name: "Budi Santoso", email },
          });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    { name: "stockmind-auth" }
  )
);

interface InventoryState {
  products: Product[];
  transactions: Transaction[];
  alerts: Alert[];
  isLoading: boolean;
  searchQuery: string;
  categoryFilter: string;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  addProduct: (data: ProductFormData) => void;
  updateProduct: (id: string, data: ProductFormData) => void;
  deleteProduct: (id: string) => void;
  addTransaction: (data: TransactionFormData, type: "in" | "out") => void;
  markAlertRead: (id: string) => void;
  markAllAlertsRead: () => void;
  getLowStockProducts: () => Product[];
  getDashboardStats: () => {
    totalProducts: number;
    lowStockCount: number;
    revenueToday: number;
    stockOutToday: number;
    forecastSummary: string;
  };
}

export const useInventoryStore = create<InventoryState>()((set, get) => ({
  products: mockProducts,
  transactions: mockTransactions,
  alerts: mockAlerts,
  isLoading: false,
  searchQuery: "",
  categoryFilter: "all",

  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategoryFilter: (category) => set({ categoryFilter: category }),

  addProduct: (data) => {
    const now = new Date().toISOString();
    const product: Product = {
      id: `p${Date.now()}`,
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ products: [...state.products, product] }));
  },

  updateProduct: (id, data) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
      ),
    }));
  },

  deleteProduct: (id) => {
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));
  },

  addTransaction: (data, type) => {
    const product = get().products.find((p) => p.id === data.productId);
    if (!product) return;

    const transaction: Transaction = {
      id: `t${Date.now()}`,
      productId: product.id,
      productName: product.name,
      type,
      quantity: data.quantity,
      unitPrice: product.price,
      total: product.price * data.quantity,
      note: data.note,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      transactions: [transaction, ...state.transactions],
      products: state.products.map((p) =>
        p.id === product.id
          ? {
              ...p,
              stock:
                type === "in"
                  ? p.stock + data.quantity
                  : Math.max(0, p.stock - data.quantity),
              updatedAt: new Date().toISOString(),
            }
          : p
      ),
    }));
  },

  markAlertRead: (id) => {
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id ? { ...a, read: true } : a
      ),
    }));
  },

  markAllAlertsRead: () => {
    set((state) => ({
      alerts: state.alerts.map((a) => ({ ...a, read: true })),
    }));
  },

  getLowStockProducts: () => {
    return get().products.filter((p) => p.stock <= p.minStock);
  },

  getDashboardStats: () => {
    const { products, transactions } = get();
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

    const lowStockCount = products.filter(
      (p) => p.stock <= p.minStock
    ).length;

    return {
      totalProducts: products.length,
      lowStockCount,
      revenueToday,
      stockOutToday,
      forecastSummary: `${lowStockCount} produk perlu restock dalam 7 hari`,
    };
  },
}));
