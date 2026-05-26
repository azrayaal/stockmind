import type {
  FastMovingProduct,
  RevenueDataPoint,
  StockMovementPoint,
} from "@/types";

export const mockRevenueData: RevenueDataPoint[] = [
  { date: "20 Mei", revenue: 2450000 },
  { date: "21 Mei", revenue: 3120000 },
  { date: "22 Mei", revenue: 2890000 },
  { date: "23 Mei", revenue: 3560000 },
  { date: "24 Mei", revenue: 4210000 },
  { date: "25 Mei", revenue: 3870000 },
  { date: "26 Mei", revenue: 2150000 },
];

export const mockStockMovement: StockMovementPoint[] = [
  { date: "20 Mei", stockIn: 450, stockOut: 320 },
  { date: "21 Mei", stockIn: 280, stockOut: 410 },
  { date: "22 Mei", stockIn: 520, stockOut: 380 },
  { date: "23 Mei", stockIn: 190, stockOut: 450 },
  { date: "24 Mei", stockIn: 340, stockOut: 290 },
  { date: "25 Mei", stockIn: 600, stockOut: 520 },
  { date: "26 Mei", stockIn: 150, stockOut: 148 },
];

export const mockFastMovingProducts: FastMovingProduct[] = [
  { name: "Indomie Goreng", sold: 245, revenue: 857500 },
  { name: "Teh Botol Sosro", sold: 189, revenue: 945000 },
  { name: "Chitato Sapi Panggang", sold: 156, revenue: 1716000 },
  { name: "Aqua 600ml", sold: 98, revenue: 4704000 },
  { name: "Kopi Kapal Api", sold: 87, revenue: 1044000 },
];
