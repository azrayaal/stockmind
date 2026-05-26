"use client";

import {
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  Bell,
  FileBarChart,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Sparkles,
  Brain,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore, useInventoryStore } from "@/store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, color: "text-blue-500" },
  { href: "/inventory", label: "Inventori", icon: Package, color: "text-violet-500" },
  { href: "/incoming", label: "Barang Masuk", icon: ArrowDownToLine, color: "text-emerald-500" },
  { href: "/outgoing", label: "Barang Keluar", icon: ArrowUpFromLine, color: "text-rose-500" },
  { href: "/forecast", label: "AI Forecast", icon: Brain, color: "text-purple-500" },
  { href: "/alerts", label: "Peringatan", icon: Bell, color: "text-amber-500" },
  { href: "/reports", label: "Laporan", icon: FileBarChart, color: "text-slate-500" },
];

export function Sidebar({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const alerts = useInventoryStore((s) => s.alerts);
  const unreadAlerts = useMemo(
    () => alerts.filter((a) => !a.read).length,
    [alerts]
  );

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r border-slate-100 bg-white",
        mobile && "fixed inset-y-0 left-0 z-50 shadow-xl"
      )}
    >
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 shadow-sm shadow-blue-200">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-bold text-slate-900">StockMind</span>
            <span className="ml-1 rounded-md bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-600">
              AI
            </span>
          </div>
        </Link>
        {mobile && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const showBadge = item.href === "/alerts" && unreadAlerts > 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-pink-50 text-slate-900 shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-pink-400" />
              )}
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg",
                  isActive ? "bg-white shadow-sm" : "bg-slate-50"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? item.color : "text-slate-400")} />
              </div>
              <span className="flex-1">{item.label}</span>
              {showBadge && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
                  {unreadAlerts}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-blue-100 text-xs font-bold text-blue-600">
              {user?.name?.charAt(0) ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">
            <p className="truncate text-sm font-semibold text-slate-900">{user?.name}</p>
            <p className="truncate text-xs text-slate-400">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="mt-2 w-full justify-start gap-2 text-slate-500 hover:text-slate-900"
          onClick={() => {
            logout();
            window.location.href = "/login";
          }}
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </Button>
      </div>
    </aside>
  );
}

export function TopNav({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const currentNav = navItems.find((item) => item.href === pathname);
  const alerts = useInventoryStore((s) => s.alerts);
  const unreadAlerts = useMemo(
    () => alerts.filter((a) => !a.read).length,
    [alerts]
  );

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-100 bg-white/90 px-4 backdrop-blur-md lg:px-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-lg font-bold text-slate-900">
            {currentNav?.label ?? "StockMind AI"}
          </h1>
          <p className="text-xs text-slate-400">
            Toko Berkah Jaya — Karawaci
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/alerts">
          <Button variant="ghost" size="icon" className="relative rounded-xl">
            <Bell className="h-5 w-5 text-slate-500" />
            {unreadAlerts > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {unreadAlerts}
              </span>
            )}
          </Button>
        </Link>
      </div>
    </header>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <Sidebar mobile onClose={() => setMobileOpen(false)} />
        </>
      )}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
