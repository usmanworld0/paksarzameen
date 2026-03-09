import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  variant?: "default" | "warning" | "success" | "gold" | "danger";
  trend?: { value: string; positive: boolean };
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  variant = "default",
  trend,
}: StatsCardProps) {
  const iconBg = {
    default: "bg-brand-green/[0.08] text-brand-green",
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
    danger: "bg-red-50 text-red-500",
    gold: "bg-neutral-900/5 text-neutral-700",
  }[variant];

  const cardBg = {
    default: "",
    success: "stat-card-green",
    warning: "stat-card-warning",
    danger: variant === "danger" && Number(value) > 0 ? "stat-card-danger" : "",
    gold: "stat-card-gold",
  }[variant];

  return (
    <div className={`admin-card rounded-xl p-4 sm:p-5 ${cardBg}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400">
            {title}
          </p>
          <p
            className={`mt-2 text-2xl font-semibold sm:text-3xl ${
              variant === "danger" && Number(value) > 0
                ? "text-red-600"
                : "text-neutral-900"
            }`}
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {value}
          </p>
          {description && (
            <p className="mt-1 text-[11px] text-neutral-400">
              {description}
            </p>
          )}
          {trend && (
            <p className={`mt-1.5 text-[11px] font-semibold ${trend.positive ? "text-emerald-600" : "text-red-500"}`}>
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
