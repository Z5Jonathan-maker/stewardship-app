"use client";

import { useState } from "react";
import { Flame, TrendingDown, Quote, CalendarCheck, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  getDebts,
  buildPlan,
  totalDebt,
  totalMinPayments,
  type Method,
} from "@/lib/debts";
import { formatCurrency, cn } from "@/lib/utils";

const EXTRA_PRESETS = [0, 250, 500, 1000];

export function DebtPlanner() {
  const [method, setMethod] = useState<Method>("snowball");
  const [extra, setExtra] = useState(500);

  const debts = getDebts();
  const debt = totalDebt();
  const mins = totalMinPayments();
  const plan = buildPlan(method, extra);
  // Compare against minimums-only to show interest saved.
  const baseline = buildPlan(method, 0);
  const interestSaved = Math.max(0, baseline.totalInterest - plan.totalInterest);
  const monthsSaved = Math.max(0, baseline.totalMonths - plan.totalMonths);

  // payoff order for display
  const ordered = [...plan.lines].sort((a, b) => a.monthsToPayoff - b.monthsToPayoff);

  if (debts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-evergreen-50 text-evergreen-600">
            <Check className="h-6 w-6" />
          </span>
          <p className="font-display text-lg font-semibold text-evergreen-900">
            You&apos;re free from consumer debt
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            No non-mortgage debt to cancel. Keep walking in freedom — the
            borrower is slave to the lender, but you are free.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      {/* Debt-free hero */}
      <Card className="overflow-hidden border-0 bg-evergreen-900 text-cream-50">
        <CardContent className="p-7">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-medium text-brand-200">
                <CalendarCheck className="h-4 w-4" /> Your debt-free date
              </div>
              <p className="mt-2 font-display text-4xl font-semibold">{plan.debtFreeDate}</p>
              <p className="mt-1 text-sm text-cream-100/70">
                {formatCurrency(debt)} across {debts.length} debts ·{" "}
                {plan.totalMonths} months to freedom
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <Metric label="Toward debt / mo" value={formatCurrency(plan.monthlyTotal)} />
              <Metric label="Interest saved" value={formatCurrency(interestSaved)} accent />
              <Metric label="Minimums / mo" value={formatCurrency(mins)} />
              <Metric label="Months saved" value={`${monthsSaved}`} accent />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <p className="mb-3 text-sm font-medium text-evergreen-800">Payoff strategy</p>
            <div className="grid grid-cols-2 gap-2">
              <MethodButton
                active={method === "snowball"}
                onClick={() => setMethod("snowball")}
                icon={<Flame className="h-4 w-4" />}
                title="Snowball"
                sub="Smallest balance first — fast wins"
              />
              <MethodButton
                active={method === "avalanche"}
                onClick={() => setMethod("avalanche")}
                icon={<TrendingDown className="h-4 w-4" />}
                title="Avalanche"
                sub="Highest APR first — least interest"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-evergreen-800">Extra payment / month</p>
              <span className="font-display text-lg font-semibold tabular-nums text-brand-600">
                {formatCurrency(extra)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1500}
              step={50}
              value={extra}
              onChange={(e) => setExtra(Number(e.target.value))}
              aria-label="Extra monthly payment"
              className="w-full accent-brand-500"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {EXTRA_PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setExtra(p)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    extra === p
                      ? "border-brand-400 bg-brand-50 text-brand-700"
                      : "border-border text-evergreen-700 hover:bg-muted"
                  )}
                >
                  +{formatCurrency(p)}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payoff order */}
      <div className="mt-4 space-y-3">
        {ordered.map((line, i) => {
          const d = debts.find((x) => x.id === line.id)!;
          return (
            <Card key={line.id}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 font-display text-sm font-semibold text-brand-700">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-display text-base font-semibold text-evergreen-900">
                        {d.name}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-evergreen-700">
                        <CalendarCheck className="h-4 w-4 text-brand-500" /> Free by {line.payoffDate}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {d.institution} · {formatCurrency(d.balance)} ·{" "}
                      {d.apr > 0 ? `${d.apr}% APR` : "0% APR"} · min {formatCurrency(d.minPayment)}/mo
                    </p>
                    <div className="mt-3">
                      <Progress value={0} aria-label={`${d.name} payoff`} />
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        {line.monthsToPayoff} months · {formatCurrency(line.interestPaid)} interest
                      </p>
                    </div>
                    <p className="mt-3 flex items-start gap-2 border-t border-border pt-3 text-xs italic text-evergreen-700">
                      <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" />
                      {d.declaration}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="mt-6 text-center text-sm italic text-muted-foreground">
        “The rich rule over the poor, and the borrower is slave to the lender.” — Proverbs 22:7
      </p>
    </div>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-cream-100/60">{label}</p>
      <p className={cn("font-display text-lg font-semibold tabular-nums", accent ? "text-brand-200" : "text-cream-50")}>
        {value}
      </p>
    </div>
  );
}

function MethodButton({
  active,
  onClick,
  icon,
  title,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-xl border p-3 text-left transition-all",
        active ? "border-brand-400 bg-brand-50 ring-1 ring-brand-300" : "border-border hover:bg-muted"
      )}
    >
      <span className={cn("inline-flex items-center gap-1.5 text-sm font-semibold", active ? "text-brand-700" : "text-evergreen-900")}>
        {icon} {title}
      </span>
      <span className="mt-0.5 block text-xs text-muted-foreground">{sub}</span>
    </button>
  );
}
