import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, ArrowRight, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  GivenThisMonth,
  LiveGivingRate,
  NetWorthCountUp,
  SpendingCountUp,
} from "@/components/app/live-stats";
import { DashboardRecent } from "@/components/app/dashboard-recent";
import { RoadmapWidget } from "@/components/app/roadmap-widget";
import { CountUp } from "@/components/app/count-up";
import { categoryMeta } from "@/lib/categories";
import { PageHeader } from "@/components/app/page-header";
import { CashFlowBars, TrendLine } from "@/components/app/charts";
import { formatCurrency, formatPercent, clamp } from "@/lib/utils";
import {
  household,
  netWorth,
  netWorthMonthChange,
  leftToSpend,
  spendingBudgeted,
  monthlySpending,
  monthlyIncome,
  totalGiving,
  cashFlow,
  netWorthTrend,
  netWorthGain,
  transactions,
  budget,
  goals,
} from "@/lib/mock-data";

export default function DashboardPage() {
  const recent = transactions.slice(0, 5);
  const topBudgets = budget.filter((b) => b.group !== "Income").slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title={`Good evening, ${household.members[0]}`}
        subtitle="Here's how your household is doing this month."
      />

      {/* Stat row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Net worth" value={<NetWorthCountUp base={netWorth} />} delta={`${formatCurrency(netWorthMonthChange, { signed: true })} this month`} trend="up" />
        <StatCard label="Left to spend" value={<CountUp value={leftToSpend} />} delta="On track" trend="up" />
        <StatCard label="Spending" value={<SpendingCountUp base={monthlySpending} />} delta={`of ${formatCurrency(spendingBudgeted, { compact: true })} budget`} trend="neutral" />
        <StatCard label="Given this month" value={<GivenThisMonth base={totalGiving} />} delta={<LiveGivingRate givingBase={totalGiving} income={monthlyIncome} />} trend="up" accent />
      </div>

      <Card className="mt-4">
        <RoadmapWidget />
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Cash flow */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Cash flow</CardTitle>
            <Link href="/cashflow" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">
              Details <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <CashFlowBars data={cashFlow} />
          </CardContent>
        </Card>

        {/* Net worth trend */}
        <Card>
          <CardHeader>
            <CardTitle>Net worth trend</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl font-semibold text-evergreen-900">
              <NetWorthCountUp base={netWorth} />
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-evergreen-600">
              <ArrowUpRight className="h-4 w-4" /> Up {formatCurrency(netWorthGain)} in 6 months
            </p>
            <div className="mt-4 h-28">
              <TrendLine data={netWorthTrend} />
            </div>
          </CardContent>
        </Card>

        {/* Budget progress */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Budget progress</CardTitle>
            <Link href="/budget" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">
              Manage <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {topBudgets.map((b) => {
              const ratio = b.actual / b.budgeted;
              const over = ratio > 1;
              return (
                <div key={b.id}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-evergreen-800">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: categoryMeta(b.name).color }}
                      />
                      {b.name}
                    </span>
                    <span className={`tabular-nums ${over ? "font-semibold text-destructive" : "text-evergreen-700"}`}>
                      {formatCurrency(b.actual)} / {formatCurrency(b.budgeted)}
                    </span>
                  </div>
                  <Progress
                    value={clamp(ratio)}
                    aria-label={`${b.name} budget used`}
                    indicatorColor={over ? "#d64545" : categoryMeta(b.name).color}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Verse of the day */}
        <Card className="bg-evergreen-900 text-cream-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cream-50">
              <BookOpen className="h-4 w-4 text-brand-300" /> Verse of the day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-cream-100/90">
              “{household.verseOfDay.text}”
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-brand-300">
              {household.verseOfDay.ref}
            </p>
          </CardContent>
        </Card>

        {/* Recent transactions */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent transactions</CardTitle>
            <Link href="/transactions" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            <DashboardRecent seed={recent} />
          </CardContent>
        </Card>

        {/* Goals */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Goals</CardTitle>
            <Link href="/goals" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">
              All <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.slice(0, 3).map((g) => (
              <div key={g.id}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-evergreen-800">
                    {g.emoji} {g.name.split(" — ")[0].split(" (")[0]}
                  </span>
                  <span className="text-evergreen-700">{formatPercent(g.saved / g.target)}</span>
                </div>
                <Progress value={g.saved / g.target} aria-label={`${g.name} goal progress`} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// evergreen-600 (not the lighter `success` token) keeps small delta text above
// the 4.5:1 WCAG AA contrast threshold on cream/white and brand-50 cards.
const trendMeta = {
  up: { Icon: ArrowUpRight, color: "text-evergreen-600" },
  down: { Icon: ArrowDownRight, color: "text-destructive" },
  neutral: { Icon: null, color: "text-muted-foreground" },
} as const;

function StatCard({
  label,
  value,
  delta,
  trend = "neutral",
  accent,
}: {
  label: string;
  value: React.ReactNode;
  delta: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  accent?: boolean;
}) {
  const { Icon, color } = trendMeta[trend];
  return (
    <Card className={`shadow-soft transition-shadow hover:shadow-lift ${accent ? "bg-brand-50" : ""}`}>
      <CardContent className="p-5">
        <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="mt-2 font-display text-[1.75rem] font-semibold leading-none tracking-tight tabular-nums text-evergreen-900">
          {value}
        </p>
        <p className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${color}`}>
          {Icon && <Icon className="h-3 w-3" />}
          {delta}
        </p>
      </CardContent>
    </Card>
  );
}
