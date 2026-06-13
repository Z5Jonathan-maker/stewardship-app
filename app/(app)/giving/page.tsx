import type { Metadata } from "next";
import { HandHeart, Sprout } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatTile } from "@/components/app/stat-tile";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/app/page-header";
import { GiftRow } from "@/components/app/gift-row";
import { LogGiftButton } from "@/components/app/forms/log-gift-button";
import { SowSeedButton } from "@/components/app/forms/sow-seed-button";
import { SeedJournal } from "@/components/app/seed-journal";
import { FirstfruitsCard } from "@/components/app/firstfruits-card";
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
        action={
          <div className="flex gap-2">
            <SowSeedButton variant="outline" />
            <LogGiftButton />
          </div>
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
        <MiniCard label="Given this month" value={<GivenThisMonth base={totalGiving} />} />
        <MiniCard label="Giving rate" value={formatPercent(givingRate, 1)} />
        <MiniCard label="Income this month" value={formatCurrency(monthlyIncome)} />
      </div>

      {/* Firstfruits — the tithe, off the top */}
      <div className="mt-4">
        <FirstfruitsCard />
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

      {/* Seed & Harvest journal */}
      <div className="mt-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-evergreen-900">
              <Sprout className="h-5 w-5 text-brand-500" /> Seed &amp; Harvest
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sow with intent, stand on the Word, and record the testimony when
              the harvest comes.
            </p>
          </div>
          <SowSeedButton />
        </div>
        <SeedJournal />
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        UniFi keeps a tidy record of your giving for year-end tax statements.
      </p>
    </div>
  );
}

function MiniCard({ label, value }: { label: string; value: React.ReactNode }) {
  return <StatTile label={label} value={value} />;
}
