import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Shared Monarch-grade stat tile: tight all-caps tracked label, a large
// leading-none tabular value, and an optional direction-driven delta. `up`
// uses evergreen-600 (not the lighter `success` token) to stay >=4.5:1 WCAG AA
// on cream/white and accent cards.
const trendMeta = {
  up: { Icon: ArrowUpRight, color: "text-evergreen-600" },
  down: { Icon: ArrowDownRight, color: "text-destructive" },
  neutral: { Icon: null, color: "text-muted-foreground" },
} as const;

const accentBg = { brand: "bg-brand-50", evergreen: "bg-evergreen-50", none: "" } as const;

export function StatTile({
  label,
  value,
  delta,
  trend = "neutral",
  accent = "none",
  valueClassName,
  className,
}: {
  label: string;
  value: React.ReactNode;
  delta?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  accent?: "brand" | "evergreen" | "none";
  valueClassName?: string;
  className?: string;
}) {
  const { Icon, color } = trendMeta[trend];
  return (
    <Card className={cn("shadow-soft transition-shadow hover:shadow-lift", accentBg[accent], className)}>
      <CardContent className="p-5">
        <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p
          className={cn(
            "mt-2 font-display text-[1.75rem] font-semibold leading-none tracking-tight tabular-nums text-evergreen-900",
            valueClassName
          )}
        >
          {value}
        </p>
        {delta != null && (
          <p className={cn("mt-2 inline-flex items-center gap-1 text-xs font-medium", color)}>
            {Icon && <Icon className="h-3 w-3" />}
            {delta}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
