import type { Metadata } from "next";
import { HandHeart, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/app/page-header";
import { formatCurrency, formatPercent, formatDateLong } from "@/lib/utils";
import {
  transactions,
  monthlyIncome,
  totalGiving,
  givingRate,
  givingYtd,
  givingAnnualGoal,
  givingYtdRate,
} from "@/lib/mock-data";

export const metadata: Metadata = { title: "Giving" };

const givingCategories = ["Tithe & Offering", "Charitable Giving"];

export default function GivingPage() {
  const givingTxns = transactions.filter((t) =>
    givingCategories.includes(t.category)
  );

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Giving"
        subtitle="“Give, and it will be given to you.” — Luke 6:38"
        action={
          <Button size="sm">
            <Plus className="h-4 w-4" /> Log a gift
          </Button>
        }
      />

      {/* Hero giving card */}
      <Card className="overflow-hidden border-0 bg-evergreen-900 text-cream-50">
        <CardContent className="p-7">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-medium text-brand-300">
                <HandHeart className="h-4 w-4" /> Generosity this year
              </div>
              <p className="mt-2 font-display text-4xl font-semibold">
                {formatCurrency(givingYtd)}
              </p>
              <p className="mt-1 text-sm text-cream-100/70">
                {formatPercent(givingYtdRate, 1)} of your income, given away with
                joy.
              </p>
            </div>
            <div className="w-full max-w-xs">
              <div className="mb-1.5 flex items-center justify-between text-sm text-cream-100/80">
                <span>Annual giving goal</span>
                <span>{formatPercent(givingYtd / givingAnnualGoal)}</span>
              </div>
              <Progress
                value={givingYtd / givingAnnualGoal}
                aria-label="Annual giving goal progress"
                className="h-3 bg-evergreen-700"
                indicatorClassName="bg-brand-400"
              />
              <p className="mt-2 text-xs text-cream-100/60">
                {formatCurrency(givingAnnualGoal - givingYtd)} to reach your{" "}
                {formatCurrency(givingAnnualGoal)} goal
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* This month stats */}
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <MiniCard label="Given this month" value={formatCurrency(totalGiving)} />
        <MiniCard label="Giving rate" value={formatPercent(givingRate, 1)} />
        <MiniCard label="Income this month" value={formatCurrency(monthlyIncome)} />
      </div>

      {/* Recent gifts */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Recent gifts</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {givingTxns.map((t) => (
            <div key={t.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <HandHeart className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-evergreen-900">{t.merchant}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateLong(t.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="brand">{t.category}</Badge>
                <span className="w-24 text-right text-sm font-semibold text-evergreen-900">
                  {formatCurrency(t.amount)}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Unite keeps a tidy record of your giving for year-end tax statements.
      </p>
    </div>
  );
}

function MiniCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-1.5 font-display text-2xl font-semibold text-evergreen-900">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
