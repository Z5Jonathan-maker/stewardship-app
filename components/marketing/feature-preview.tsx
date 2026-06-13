"use client";

import { PieChart, LineChart, Target, Sparkles } from "lucide-react";
import { CashFlowBars } from "@/components/app/charts";
import { Progress } from "@/components/ui/progress";
import { categoryMeta } from "@/lib/categories";
import { formatCurrency, formatPercent, clamp } from "@/lib/utils";
import { budget, goals, cashFlow } from "@/lib/mock-data";

// badge -> icon map (kept here so the server page doesn't pass a component
// function across the client boundary, which Next forbids).
const ICONS = { Budgeting: PieChart, "Cash Flow": LineChart, Goals: Target, "Ask UniFi": Sparkles } as const;

// Real, per-feature previews for the marketing deep-dive sections — the same
// components the product renders, so the landing page shows the actual UI
// instead of abstract placeholder bars. Wrapped in the shared "glass" frame.
export function FeaturePreview({ badge }: { badge: string }) {
  const Icon = ICONS[badge as keyof typeof ICONS] ?? PieChart;
  return (
    <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-border bg-linear-to-br from-card to-cream-50 shadow-lift">
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute left-6 top-6 z-10 inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-evergreen-800 shadow-soft">
        <Icon className="h-4 w-4 text-brand-500" /> {badge}
      </div>
      <div className="absolute inset-x-6 bottom-6 rounded-xl border border-border bg-card/95 p-4 shadow-soft backdrop-blur-sm">
        {badge === "Cash Flow" ? (
          <CashFlowBars data={cashFlow} height={150} />
        ) : badge === "Goals" ? (
          <GoalsPreview />
        ) : badge === "Ask UniFi" ? (
          <AskPreview />
        ) : (
          <BudgetPreview />
        )}
      </div>
    </div>
  );
}

function BudgetPreview() {
  const rows = budget.filter((b) => b.group !== "Income").slice(0, 3);
  return (
    <div className="space-y-3">
      {rows.map((b) => {
        const ratio = b.actual / b.budgeted;
        const over = ratio > 1;
        return (
          <div key={b.id}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 font-medium text-evergreen-800">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: categoryMeta(b.name).color }} />
                {b.name}
              </span>
              <span className={`tabular-nums ${over ? "font-semibold text-destructive" : "text-evergreen-700"}`}>
                {formatCurrency(b.actual, { compact: true })} / {formatCurrency(b.budgeted, { compact: true })}
              </span>
            </div>
            <Progress value={clamp(ratio)} aria-label={`${b.name} budget used`} indicatorColor={over ? "#d64545" : categoryMeta(b.name).color} />
          </div>
        );
      })}
    </div>
  );
}

function GoalsPreview() {
  return (
    <div className="space-y-3">
      {goals.slice(0, 3).map((g) => (
        <div key={g.id}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-evergreen-800">
              {g.emoji} {g.name.split(" — ")[0].split(" (")[0]}
            </span>
            <span className="tabular-nums text-evergreen-700">{formatPercent(g.saved / g.target)}</span>
          </div>
          <Progress value={g.saved / g.target} aria-label={`${g.name} goal progress`} />
        </div>
      ))}
    </div>
  );
}

function AskPreview() {
  return (
    <div className="space-y-2.5">
      <div className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-sm bg-brand-500 px-3 py-2 text-xs font-medium text-white">
        How much did we give this year?
      </div>
      <div className="w-fit max-w-[88%] rounded-2xl rounded-bl-sm bg-cream-100 px-3 py-2 text-xs text-evergreen-800">
        <span className="mb-1 inline-flex items-center gap-1 font-semibold text-brand-600">
          <Sparkles className="h-3 w-3" /> UniFi
        </span>
        <br />
        You&apos;ve given <span className="font-semibold tabular-nums">{formatCurrency(12480)}</span> so far this year — about 12.4% of your income. Faithful work.
      </div>
    </div>
  );
}
