"use client";

import {
  Bell,
  AlertTriangle,
  Package,
  TrendingUp,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useInventoryStore } from "@/store";
import { formatDateTime } from "@/lib/utils";
import type { AlertType } from "@/types";

const alertTypeConfig: Record<
  AlertType,
  { label: string; icon: typeof Bell; variant: "destructive" | "warning" | "default" }
> = {
  low_stock: { label: "Stok Rendah", icon: Package, variant: "destructive" },
  overstock: { label: "Overstock", icon: AlertTriangle, variant: "warning" },
  unusual_movement: {
    label: "Pergerakan Tidak Biasa",
    icon: TrendingUp,
    variant: "default",
  },
};

export default function AlertsPage() {
  const { alerts, markAlertRead, markAllAlertsRead } = useInventoryStore();

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Peringatan</h2>
          <p className="text-sm text-zinc-500">
            {unreadCount} peringatan belum dibaca dari {alerts.length} total
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" className="gap-2" onClick={markAllAlertsRead}>
            <CheckCheck className="h-4 w-4" />
            Tandai Semua Dibaca
          </Button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {(["low_stock", "overstock", "unusual_movement"] as AlertType[]).map(
          (type) => {
            const config = alertTypeConfig[type];
            const count = alerts.filter((a) => a.type === type).length;
            return (
              <Card key={type}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div
                    className={`rounded-lg p-2 ${
                      type === "low_stock"
                        ? "bg-rose-50 text-rose-600 dark:bg-rose-900/20"
                        : type === "overstock"
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20"
                          : "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20"
                    }`}
                  >
                    <config.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm text-zinc-500">{config.label}</p>
                  </div>
                </CardContent>
              </Card>
            );
          }
        )}
      </div>

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Bell className="h-12 w-12 text-zinc-300" />
              <p className="mt-4 text-sm font-medium">Tidak ada peringatan</p>
              <p className="text-xs text-zinc-500">
                Semua stok dalam kondisi normal
              </p>
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert) => {
            const config = alertTypeConfig[alert.type];
            const Icon = config.icon;
            return (
              <Card
                key={alert.id}
                className={`transition-all duration-200 hover:shadow-md ${
                  !alert.read ? "border-l-4 border-l-indigo-500" : "opacity-75"
                }`}
              >
                <CardContent className="flex items-start gap-4 p-4">
                  <div
                    className={`mt-0.5 rounded-lg p-2 ${
                      alert.severity === "high"
                        ? "bg-rose-50 text-rose-600 dark:bg-rose-900/20"
                        : alert.severity === "medium"
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{alert.productName}</p>
                      <Badge variant={config.variant}>{config.label}</Badge>
                      <Badge variant="secondary">{alert.severity}</Badge>
                      {!alert.read && (
                        <Badge variant="default">Baru</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-zinc-500">{alert.message}</p>
                    <p className="mt-2 text-xs text-zinc-400">
                      {formatDateTime(alert.createdAt)}
                    </p>
                  </div>
                  {!alert.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAlertRead(alert.id)}
                    >
                      Tandai dibaca
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
