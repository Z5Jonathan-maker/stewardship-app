import { TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { categoryMeta } from "@/lib/categories";
import {
  netWorth,
  netWorthMonthChange,
  leftToSpend,
  totalGiving,
  givingRate,
  cashFlow,
} from "@/lib/mock-data";

/**
 * A faithful, static preview of the Unite dashboard — used as the hero
 * "screenshot". Built from real components & mock data so it always matches
 * the product.
 */
export function AppMockup() {
  const maxBar = Math.max(...cashFlow.map((m) => Math.max(m.income, m.expenses)));

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lift">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-destructive/40" />
        <span className="h-3 w-3 rounded-full bg-amber-400/50" />
        <span className="h-3 w-3 rounded-full bg-evergreen-400/50" />
        <div className="ml-3 rounded-md bg-card px-3 py-1 text-[11px] text-muted-foreground">
          app.unitefinancial.com/dashboard
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-3">
        {/* Stat tiles */}
        <StatTile
          label="Net worth"
          value={formatCurrency(netWorth, { compact: true })}
          delta={`${formatCurrency(netWorthMonthChange, { compact: true, signed: true })} this month`}
          positive
        />
        <StatTile
          label="Left to spend"
          value={formatCurrency(leftToSpend, { compact: true })}
          delta="On track"
          positive
        />
        <StatTile
          label="Given this month"
          value={formatCurrency(totalGiving, { compact: true })}
          delta={`${formatPercent(givingRate, 1)} of income`}
          positive
          accent
        />

        {/* Cash flow chart */}
        <div className="sm:col-span-2 rounded-xl border border-border bg-cream-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-evergreen-800">Cash flow</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <TrendingUp className="h-3 w-3" /> 6 months
            </span>
          </div>
          <div className="flex h-28 items-end justify-between gap-2">
            {cashFlow.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full items-end justify-center gap-0.5">
                  <div
                    className="w-2 rounded-t bg-evergreen-500"
                    style={{ height: `${(m.income / maxBar) * 88}px` }}
                  />
                  <div
                    className="w-2 rounded-t bg-brand-400"
                    style={{ height: `${(m.expenses / maxBar) * 88}px` }}
                  />
                </div>
                <span className="text-[9px] text-muted-foreground">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Budget mini list */}
        <div className="rounded-xl border border-border bg-cream-50 p-4">
          <span className="text-xs font-semibold text-evergreen-800">Top budgets</span>
          <div className="mt-3 space-y-3">
            <MiniBudget name="Tithe" pct={0.78} />
            <MiniBudget name="Groceries" pct={0.64} />
            <MiniBudget name="Shopping" pct={1} over />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  delta,
  positive,
  accent,
}: {
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-xl border border-border p-4 ${accent ? "bg-brand-50" : "bg-cream-50"}`}>
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-semibold text-evergreen-900">
        {value}
      </p>
      <p className={`mt-1 inline-flex items-center gap-0.5 text-[11px] font-medium ${positive ? "text-evergreen-600" : "text-destructive"}`}>
        {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {delta}
      </p>
    </div>
  );
}

function MiniBudget({
  name,
  pct,
  over,
}: {
  name: string;
  pct: number;
  over?: boolean;
}) {
  const { color } = categoryMeta(name);
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5 text-[11px]">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-evergreen-800">{name}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct * 100}%`, backgroundColor: over ? "#d64545" : color }}
        />
      </div>
    </div>
  );
}
