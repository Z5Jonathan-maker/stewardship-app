import type { Metadata } from "next";
import { HandHeart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/app/page-header";
import { GiftRow } from "@/components/app/gift-row";
import { LogGiftButton } from "@/components/app/forms/log-gift-button";
import { AddedGifts } from "@/components/app/added/added-gifts";
import { GivenThisMonth } from "@/components/app/given-this-month";
import { formatCurrency, formatPercent } from "@/lib/utils";
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
        action={<LogGiftButton />}
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
        <MiniCard label="Given this month" value={<GivenThisMonth base={totalGiving} />} />
        <MiniCard label="Giving rate" value={formatPercent(givingRate, 1)} />
        <MiniCard label="Income this month" value={formatCurrency(monthlyIncome)} />
      </div>

      {/* Recent gifts */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Recent gifts</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <AddedGifts />
          {givingTxns.map((t) => (
            <GiftRow key={t.id} t={t} />
          ))}
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Unite keeps a tidy record of your giving for year-end tax statements.
      </p>
    </div>
  );
}

function MiniCard({ label, value }: { label: string; value: React.ReactNode }) {
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
