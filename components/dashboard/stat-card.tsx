import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  variant?: "default" | "success" | "warning" | "danger" | "purple";
  className?: string;
}

const variantStyles = {
  default: {
    icon: "bg-blue-100 text-blue-600",
    accent: "from-blue-50 to-white",
  },
  success: {
    icon: "bg-emerald-100 text-emerald-600",
    accent: "from-emerald-50 to-white",
  },
  warning: {
    icon: "bg-amber-100 text-amber-600",
    accent: "from-amber-50 to-white",
  },
  danger: {
    icon: "bg-rose-100 text-rose-500",
    accent: "from-rose-50 to-white",
  },
  purple: {
    icon: "bg-violet-100 text-violet-600",
    accent: "from-violet-50 to-white",
  },
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-100 bg-gradient-to-br p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        styles.accent,
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={cn("rounded-xl p-2.5", styles.icon)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold tracking-tight text-slate-900">{value}</p>
        {description && (
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        )}
        {trend && (
          <p
            className={cn(
              "mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
              trend.positive
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-600"
            )}
          >
            {trend.positive ? "↑" : "↓"} {trend.value}
          </p>
        )}
      </div>
    </div>
  );
}
