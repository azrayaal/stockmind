"use client";

import { Brain, TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ForecastTrendChart } from "@/components/charts";
import { mockForecasts } from "@/mock/forecasts";
import { useInventoryStore } from "@/store";

const forecastTrendData = [
  { day: "Hari 1", stock: 245, predicted: 240 },
  { day: "Hari 3", stock: 210, predicted: 205 },
  { day: "Hari 5", stock: 175, predicted: 170 },
  { day: "Hari 7", stock: 140, predicted: 135 },
  { day: "Hari 9", stock: 105, predicted: 100 },
  { day: "Hari 11", stock: 70, predicted: 65 },
  { day: "Hari 13", stock: 35, predicted: 30 },
  { day: "Hari 14", stock: 20, predicted: 15 },
];

const trendIcon = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

const trendColor = {
  up: "text-rose-600",
  down: "text-emerald-600",
  stable: "text-zinc-500",
};

export default function ForecastPage() {
  const products = useInventoryStore((s) => s.products);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Forecast</h2>
          <p className="text-sm text-zinc-500">
            Prediksi stok dan rekomendasi restock berbasis AI
          </p>
        </div>
        <Badge variant="default" className="gap-1 self-start">
          <Sparkles className="h-3 w-3" />
          Model v1.0 — Mock AI
        </Badge>
      </div>

      <Card className="border-violet-100 bg-gradient-to-r from-violet-50 via-pink-50 to-white">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500 shadow-sm shadow-violet-200">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-semibold">Rekomendasi AI Hari Ini</p>
              <p className="text-sm text-zinc-500">
                3 produk perlu restock segera. Estimasi kerugian Rp 2.4 juta jika
                tidak ditangani dalam 3 hari.
              </p>
            </div>
          </div>
          <Button className="shrink-0">Lihat Detail</Button>
        </CardContent>
      </Card>

      <ForecastTrendChart data={forecastTrendData} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockForecasts.map((forecast) => {
          const TrendIcon = trendIcon[forecast.trend];
          return (
            <Card
              key={forecast.productId}
              className="transition-all duration-200 hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{forecast.productName}</CardTitle>
                  <Badge
                    variant={
                      forecast.daysUntilDepletion <= 3
                        ? "destructive"
                        : forecast.daysUntilDepletion <= 7
                          ? "warning"
                          : "success"
                    }
                  >
                    {forecast.daysUntilDepletion} hari
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-zinc-500">Stok Saat Ini</p>
                    <p className="text-lg font-semibold">{forecast.currentStock}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Pemakaian/Hari</p>
                    <p className="text-lg font-semibold">
                      {forecast.avgDailyUsage}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Restock Disarankan</p>
                    <p className="text-lg font-semibold text-indigo-600">
                      {forecast.recommendedReorder} unit
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Confidence</p>
                    <p className="text-lg font-semibold">{forecast.confidence}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
                  <TrendIcon className={`h-4 w-4 ${trendColor[forecast.trend]}`} />
                  <p className="text-xs text-zinc-500">
                    Tren permintaan{" "}
                    {forecast.trend === "up"
                      ? "naik"
                      : forecast.trend === "down"
                        ? "turun"
                        : "stabil"}
                  </p>
                </div>
                <Button variant="outline" className="w-full" size="sm">
                  Buat Pesanan Restock
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Panel Rekomendasi AI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {products
            .filter((p) => p.stock <= p.minStock)
            .map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30"
              >
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-zinc-500">
                    Stok {product.stock} / min {product.minStock} — Restock{" "}
                    {product.minStock * 2} unit disarankan
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Restock
                </Button>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
