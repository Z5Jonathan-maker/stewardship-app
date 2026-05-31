"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  type TooltipProps,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { categoryMeta } from "@/lib/categories";
import { CategoryIcon } from "@/components/app/category-icon";

const INCOME = "#33745c"; // evergreen-500
const EXPENSE = "#6285fb"; // brand-400
const BRAND = "#3b63f0"; // brand-500

/** Render children only after mount so Recharts measures real dimensions
 * (avoids SSR 0-width warnings) and gives us a clean loading skeleton. */
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function ChartSkeleton({ height }: { height: number }) {
  return (
    <div
      className="w-full animate-pulse rounded-xl bg-muted/60"
      style={{ height }}
      aria-hidden
    />
  );
}

function TooltipCard({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: string; color?: string }[];
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-lift">
      <p className="mb-1 text-xs font-semibold text-evergreen-900">{title}</p>
      <div className="space-y-0.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-2 text-xs">
            {r.color && (
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
            )}
            <span className="text-muted-foreground">{r.label}</span>
            <span className="ml-auto font-medium tabular-nums text-evergreen-900">
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------------------------- Net worth area chart */

export function TrendLine({
  data,
  height = 120,
}: {
  data: { month: string; value: number }[];
  height?: number;
}) {
  const mounted = useMounted();
  if (!mounted) return <ChartSkeleton height={height} />;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: 6 }}>
        <defs>
          <linearGradient id="nwFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={BRAND} stopOpacity={0.28} />
            <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" hide />
        <YAxis hide domain={["dataMin", "dataMax"]} />
        <Tooltip
          cursor={{ stroke: "#cdd6d0", strokeDasharray: "4 4" }}
          content={(p: TooltipProps<number, string>) =>
            p.active && p.payload?.length ? (
              <TooltipCard
                title={String(p.label)}
                rows={[{ label: "Net worth", value: formatCurrency(Number(p.payload[0].value)), color: BRAND }]}
              />
            ) : null
          }
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={BRAND}
          strokeWidth={2.5}
          fill="url(#nwFill)"
          baseValue="dataMin"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
          animationDuration={900}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ----------------------------------------------------- Cash flow bar chart */

export function CashFlowBars({
  data,
  height = 200,
}: {
  data: { month: string; income: number; expenses: number }[];
  height?: number;
}) {
  const mounted = useMounted();

  return (
    <div>
      {mounted ? (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} barGap={4} barCategoryGap="26%" margin={{ top: 8, right: 4, bottom: 0, left: 4 }}>
            <CartesianGrid vertical={false} stroke="#e6e0d4" strokeDasharray="4 4" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#7a857f" }} dy={4} />
            <YAxis hide />
            <Tooltip
              cursor={{ fill: "rgba(20,52,43,0.04)" }}
              content={(p: TooltipProps<number, string>) =>
                p.active && p.payload?.length ? (
                  <TooltipCard
                    title={String(p.label)}
                    rows={[
                      { label: "Income", value: formatCurrency(Number(p.payload[0]?.value)), color: INCOME },
                      { label: "Expenses", value: formatCurrency(Number(p.payload[1]?.value)), color: EXPENSE },
                    ]}
                  />
                ) : null
              }
            />
            <Bar dataKey="income" fill={INCOME} radius={[5, 5, 0, 0]} maxBarSize={14} animationDuration={800} />
            <Bar dataKey="expenses" fill={EXPENSE} radius={[5, 5, 0, 0]} maxBarSize={14} animationDuration={800} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <ChartSkeleton height={height} />
      )}

      <div className="mt-4 flex items-center gap-5 text-xs text-evergreen-700">
        <Legend color={INCOME} label="Income" />
        <Legend color={EXPENSE} label="Expenses" />
      </div>
    </div>
  );
}

/* -------------------------------------------- Category spending breakdown */

export function BreakdownBars({
  items,
}: {
  items: { name: string; amount: number }[];
}) {
  const total = items.reduce((s, i) => s + i.amount, 0) || 1;
  return (
    <div className="space-y-3.5">
      {items.slice(0, 6).map((item) => {
        const pct = item.amount / total;
        const { color } = categoryMeta(item.name);
        return (
          <div key={item.name} className="flex items-center gap-3">
            <CategoryIcon category={item.name} className="h-8 w-8 rounded-lg" iconClassName="h-4 w-4" />
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="truncate text-evergreen-800">{item.name}</span>
                <span className="font-medium tabular-nums text-evergreen-900">
                  {formatCurrency(item.amount)}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct * 100}%`, backgroundColor: color }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
