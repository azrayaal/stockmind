"use client";

import { useState } from "react";
import { Download, FileBarChart, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RevenueChart, StockMovementChart } from "@/components/charts";
import { useInventoryStore } from "@/store";
import { formatCurrency } from "@/lib/utils";
import {
  mockRevenueData,
  mockStockMovement,
} from "@/mock/charts";

export default function ReportsPage() {
  const { products, transactions } = useInventoryStore();
  const [dateFrom, setDateFrom] = useState("2026-05-20");
  const [dateTo, setDateTo] = useState("2026-05-26");
  const [exporting, setExporting] = useState(false);

  const totalRevenue = transactions
    .filter((t) => t.type === "out")
    .reduce((sum, t) => sum + t.total, 0);

  const totalStockIn = transactions
    .filter((t) => t.type === "in")
    .reduce((sum, t) => sum + t.quantity, 0);

  const totalStockOut = transactions
    .filter((t) => t.type === "out")
    .reduce((sum, t) => sum + t.quantity, 0);

  const inventoryValue = products.reduce(
    (sum, p) => sum + p.stock * p.price,
    0
  );

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      alert("Export berhasil! (Mock — file tidak benar-benar diunduh)");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Laporan</h2>
          <p className="text-sm text-zinc-500">
            Analisis pendapatan, inventori, dan pergerakan stok
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={handleExport}
          disabled={exporting}
        >
          <Download className="h-4 w-4" />
          {exporting ? "Mengekspor..." : "Export PDF"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4" />
            Filter Periode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Dari</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">Sampai</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <Button>Terapkan Filter</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Pendapatan", value: formatCurrency(totalRevenue), color: "text-emerald-600" },
          { label: "Nilai Inventori", value: formatCurrency(inventoryValue), color: "text-indigo-600" },
          { label: "Total Stok Masuk", value: `${totalStockIn} unit`, color: "text-emerald-600" },
          { label: "Total Stok Keluar", value: `${totalStockOut} unit`, color: "text-rose-600" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-sm text-zinc-500">{stat.label}</p>
              <p className={`mt-1 text-xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart data={mockRevenueData} />
        <StockMovementChart data={mockStockMovement} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileBarChart className="h-4 w-4" />
            Laporan Inventori
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produk</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-right">Stok</TableHead>
                <TableHead className="text-right">Harga</TableHead>
                <TableHead className="text-right">Nilai Stok</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{product.stock}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(product.price)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(product.stock * product.price)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.stock <= product.minStock
                          ? "destructive"
                          : product.stock > product.minStock * 3
                            ? "warning"
                            : "success"
                      }
                    >
                      {product.stock <= product.minStock
                        ? "Rendah"
                        : product.stock > product.minStock * 3
                          ? "Overstock"
                          : "Normal"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Laporan Pergerakan Stok</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produk</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.slice(0, 10).map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium">{tx.productName}</TableCell>
                  <TableCell>
                    <Badge variant={tx.type === "in" ? "success" : "destructive"}>
                      {tx.type === "in" ? "Masuk" : "Keluar"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{tx.quantity}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(tx.total)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
