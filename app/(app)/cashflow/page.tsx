import type { Metadata } from "next";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/app/page-header";
import { CashFlowBars, SpendingDonut } from "@/components/app/charts";
import { SankeyFlow } from "@/components/app/sankey-flow";
import { CashflowTabs } from "@/components/app/cashflow-tabs";
import { CategoryIcon } from "@/components/app/category-icon";
import {
  IncomeCountUp,
  OutflowCountUp,
  NetCashFlowCountUp,
} from "@/components/app/live-stats";
import { formatCurrency, formatPercent } from "@/lib/utils";
import {
  budget,
  cashFlow,
  spendingByCategory,
  monthlyIncome,
  monthlyOutflow,
  netCashFlow,
  givingRate,
  checkingBalance,
} from "@/lib/mock-data";

export const metadata: Metadata = { title: "Cash Flow" };

export default function CashFlowPage() {
  // Simple forward projection: average net of last 6 months added to current.
  const avgNet =
    cashFlow.reduce((s, m) => s + (m.income - m.expenses), 0) / cashFlow.length;
  const projectedEndBalance = checkingBalance + avgNet;
  const incomeSources = budget.filter((b) => b.group === "Income");

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Cash Flow"
        subtitle="Not just what you spent — what you'll have left."
        range="This month"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <FlowStat label="Income this month" value={<IncomeCountUp base={monthlyIncome} />} icon={ArrowUpRight} tone="up" />
        <FlowStat label="Money out this month" value={<OutflowCountUp base={monthlyOutflow} />} icon={ArrowDownRight} tone="down" />
        <FlowStat label="Net cash flow" value={<NetCashFlowCountUp base={netCashFlow} />} icon={TrendingUp} tone="up" />
      </div>

      <div className="mt-6">
        <CashflowTabs
          cashflow={
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Where your money flowed</CardTitle>
                </CardHeader>
                <CardContent>
                  <SankeyFlow />
                </CardContent>
              </Card>

              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Income vs. expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CashFlowBars data={cashFlow} height={240} />
                  </CardContent>
                </Card>

                <Card className="bg-brand-50">
                  <CardHeader>
                    <CardTitle>End-of-month forecast</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-evergreen-700">
                      Based on your recurring income and bills, here&apos;s what
                      we project you&apos;ll have left in checking:
                    </p>
                    <p className="mt-4 font-display text-3xl font-semibold text-evergreen-900">
                      {formatCurrency(projectedEndBalance)}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-evergreen-600">
                      <ArrowUpRight className="h-4 w-4" /> Comfortable margin
                    </p>
                    <div className="mt-5 rounded-xl border border-brand-200 bg-card p-3 text-xs text-evergreen-700">
                      💡 You&apos;re averaging {formatCurrency(avgNet)} surplus
                      per month. Consider directing it toward your Generosity
                      Fund.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          }
          spending={
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Where the money went</CardTitle>
                </CardHeader>
                <CardContent>
                  <SpendingDonut items={spendingByCategory} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Month in review</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-evergreen-700">
                  <ReviewRow label="Top category" value={spendingByCategory[0]?.name ?? "—"} />
                  <ReviewRow label="Biggest win" value="Under on groceries" />
                  <ReviewRow label="Watch out" value="Over on shopping" />
                  <ReviewRow label="Giving" value={`${formatPercent(givingRate, 1)} of income`} />
                </CardContent>
              </Card>
            </div>
          }
          income={
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Income sources</CardTitle>
                </CardHeader>
                <CardContent className="divide-y divide-border">
                  {incomeSources.map((s) => (
                    <div key={s.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <CategoryIcon category={s.name} className="h-9 w-9" iconClassName="h-[18px] w-[18px]" />
                        <p className="text-sm font-medium text-evergreen-900">{s.name}</p>
                      </div>
                      <span className="text-sm font-semibold tabular-nums text-evergreen-900">
                        {formatCurrency(s.actual)}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-3">
                    <p className="text-sm font-semibold text-evergreen-900">Total income</p>
                    <span className="text-sm font-semibold tabular-nums text-evergreen-900">
                      {formatCurrency(monthlyIncome)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-evergreen-50/60">
                <CardHeader>
                  <CardTitle>Every good gift</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed text-evergreen-700">
                  &ldquo;Every good and perfect gift is from above.&rdquo;
                  <span className="mt-1 block text-xs text-evergreen-600">— James 1:17</span>
                  <p className="mt-4">
                    Income is provision before it&apos;s a paycheck. The flow
                    view shows how this month&apos;s provision was put to work.
                  </p>
                </CardContent>
              </Card>
            </div>
          }
        />
      </div>
    </div>
  );
}

function FlowStat({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  icon: typeof TrendingUp;
  tone: "up" | "down";
}) {
  return (
    <Card className="shadow-soft transition-shadow hover:shadow-lift">
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone === "up" ? "bg-evergreen-50 text-evergreen-600" : "bg-brand-50 text-brand-600"}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
          <p className="font-display text-xl font-semibold tabular-nums leading-none text-evergreen-900">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-evergreen-900">{value}</span>
    </div>
  );
}
