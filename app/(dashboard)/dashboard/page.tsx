"use client";

import { useMemo } from "react";
import {
  Package,
  PackageMinus,
  DollarSign,
  PackageX,
  Brain,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  RevenueChart,
  StockMovementChart,
  FastMovingChart,
} from "@/components/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useInventoryStore } from "@/store";
import { computeDashboardStats } from "@/lib/compute-stats";
import {
  mockRevenueData,
  mockStockMovement,
  mockFastMovingProducts,
} from "@/mock/charts";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function DashboardPage() {
  const products = useInventoryStore((s) => s.products);
  const transactions = useInventoryStore((s) => s.transactions);
  const alerts = useInventoryStore((s) => s.alerts);

  const stats = useMemo(
    () => computeDashboardStats(products, transactions),
    [products, transactions]
  );

  const unreadAlerts = useMemo(
    () => alerts.filter((a) => !a.read),
    [alerts]
  );

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h2>
        <p className="text-sm text-slate-400">
          Ringkasan inventori Toko Berkah Jaya hari ini
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total Produk"
          value={stats.totalProducts}
          icon={Package}
          description="Produk aktif di inventori"
        />
        <StatCard
          title="Stok Rendah"
          value={stats.lowStockCount}
          icon={PackageMinus}
          variant="danger"
          description="Perlu segera restock"
        />
        <StatCard
          title="Pendapatan Hari Ini"
          value={formatCurrency(stats.revenueToday)}
          icon={DollarSign}
          variant="success"
          trend={{ value: "+12% vs kemarin", positive: true }}
        />
        <StatCard
          title="Stok Keluar Hari Ini"
          value={`${stats.stockOutToday} unit`}
          icon={PackageX}
          variant="warning"
        />
        <StatCard
          title="Forecast AI"
          value={stats.lowStockCount}
          icon={Brain}
          variant="purple"
          description={stats.forecastSummary}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart data={mockRevenueData} />
        <StockMovementChart data={mockStockMovement} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FastMovingChart data={mockFastMovingProducts} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Aktivitas Terbaru</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium">{tx.productName}</p>
                    <p className="text-xs text-zinc-500">
                      {formatDateTime(tx.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={tx.type === "in" ? "success" : "destructive"}>
                      {tx.type === "in" ? "+" : "-"}
                      {tx.quantity}
                    </Badge>
                    <p className="mt-1 text-xs text-zinc-500">
                      {formatCurrency(tx.total)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Peringatan Aktif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {unreadAlerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-3"
                >
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        alert.severity === "high"
                          ? "destructive"
                          : alert.severity === "medium"
                            ? "warning"
                            : "secondary"
                      }
                    >
                      {alert.severity}
                    </Badge>
                    <span className="text-sm font-medium">{alert.productName}</span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">{alert.message}</p>
                </div>
              ))}
              {unreadAlerts.length === 0 && (
                <p className="text-center text-sm text-zinc-500">
                  Tidak ada peringatan aktif
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
