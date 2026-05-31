import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/app/category-icon";
import { categoryMeta } from "@/lib/categories";
import { formatCurrency, clamp } from "@/lib/utils";
import {
  budget,
  monthlyIncome,
  monthlyBudgeted,
  unallocated,
  type BudgetCategory,
} from "@/lib/mock-data";

export const metadata: Metadata = { title: "Budget" };

const groupOrder: BudgetCategory["group"][] = [
  "Giving",
  "Fixed",
  "Flexible",
  "Savings",
];

const groupMeta: Record<string, { label: string; note: string }> = {
  Giving: { label: "Giving — First Fruits", note: "Honor the Lord with the first of everything." },
  Fixed: { label: "Fixed Costs", note: "The essentials that keep the home running." },
  Flexible: { label: "Flexible Spending", note: "Day-to-day life — give every dollar a job." },
  Savings: { label: "Saving & Investing", note: "Build margin for the future." },
};

export default function BudgetPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="May Budget"
        subtitle="Tithe-first budgeting. Give every dollar a purpose."
        action={<Button size="sm">Edit budget</Button>}
      />

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Expected income" value={formatCurrency(monthlyIncome)} tone="income" />
        <SummaryCard label="Budgeted" value={formatCurrency(monthlyBudgeted)} tone="neutral" />
        <SummaryCard label="Left to budget" value={formatCurrency(unallocated)} tone="accent" />
      </div>

      {/* Groups */}
      <div className="mt-6 space-y-6">
        {groupOrder.map((group) => {
          const items = budget.filter((b) => b.group === group);
          const budgeted = items.reduce((s, b) => s + b.budgeted, 0);
          const actual = items.reduce((s, b) => s + b.actual, 0);
          return (
            <Card key={group}>
              <CardContent className="p-5">
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-evergreen-900">
                      {groupMeta[group].label}
                    </h2>
                    <p className="text-xs text-muted-foreground">{groupMeta[group].note}</p>
                  </div>
                  <p className="text-sm text-evergreen-700">
                    <span className="font-semibold text-evergreen-900">{formatCurrency(actual)}</span>{" "}
                    of {formatCurrency(budgeted)}
                  </p>
                </div>
                <div className="space-y-4">
                  {items.map((b) => {
                    const ratio = b.actual / b.budgeted;
                    const over = ratio > 1;
                    return (
                      <div key={b.id} className="flex items-center gap-3">
                        <CategoryIcon
                          category={b.name}
                          className="h-9 w-9"
                          iconClassName="h-[18px] w-[18px]"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="mb-1.5 flex items-center justify-between text-sm">
                            <span className="truncate font-medium text-evergreen-800">
                              {b.name}
                            </span>
                            <span className={`shrink-0 pl-2 tabular-nums ${over ? "font-semibold text-destructive" : "text-evergreen-700"}`}>
                              {formatCurrency(b.actual)} / {formatCurrency(b.budgeted)}
                            </span>
                          </div>
                          <Progress
                            value={clamp(ratio)}
                            aria-label={`${b.name} budget used`}
                            indicatorColor={over ? "#d64545" : categoryMeta(b.name).color}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "income" | "neutral" | "accent";
}) {
  const toneClass =
    tone === "accent"
      ? "bg-brand-50"
      : tone === "income"
        ? "bg-evergreen-50"
        : "";
  return (
    <Card className={toneClass}>
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
