"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  fieldInputClass,
} from "@/components/ui/dialog";
import { CategoryIcon } from "@/components/app/category-icon";
import { useHousehold } from "@/components/app/household-store";
import { PageHeader } from "@/components/app/page-header";
import { categoryMeta } from "@/lib/categories";
import { formatCurrency, clamp } from "@/lib/utils";
import { budget, monthlyIncome, type BudgetCategory } from "@/lib/mock-data";

const groupOrder: BudgetCategory["group"][] = ["Giving", "Fixed", "Flexible", "Savings"];
const groupMeta: Record<string, { label: string; note: string }> = {
  Giving: { label: "Giving — First Fruits", note: "Honor the Lord with the first of everything." },
  Fixed: { label: "Fixed Costs", note: "The essentials that keep the home running." },
  Flexible: { label: "Flexible Spending", note: "Day-to-day life — give every dollar a job." },
  Savings: { label: "Saving & Investing", note: "Build margin for the future." },
};

const editable = budget.filter((b) => b.group !== "Income");

export function BudgetClient() {
  const { budgetOverrides, setBudgetAmount } = useHousehold();
  const budgeted = (b: BudgetCategory) => budgetOverrides[b.id] ?? b.budgeted;

  const budgetedTotal = editable.reduce((s, b) => s + budgeted(b), 0);
  const leftToBudget = monthlyIncome - budgetedTotal;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="May Budget"
        subtitle="Tithe-first budgeting. Give every dollar a purpose."
        action={<EditBudgetDialog budgeted={budgeted} onSave={setBudgetAmount} />}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Expected income" value={formatCurrency(monthlyIncome)} tone="income" />
        <SummaryCard label="Budgeted" value={formatCurrency(budgetedTotal)} tone="neutral" />
        <SummaryCard label="Left to budget / spend" value={formatCurrency(leftToBudget)} tone="accent" />
      </div>

      <div className="mt-6 space-y-6">
        {groupOrder.map((group) => {
          const items = budget.filter((b) => b.group === group);
          const groupBudgeted = items.reduce((s, b) => s + budgeted(b), 0);
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
                    <span className="font-semibold tabular-nums text-evergreen-900">
                      {formatCurrency(actual)}
                    </span>{" "}
                    of {formatCurrency(groupBudgeted)}
                  </p>
                </div>
                <div className="space-y-4">
                  {items.map((b) => {
                    const bud = budgeted(b);
                    const ratio = bud > 0 ? b.actual / bud : 0;
                    const over = ratio > 1;
                    return (
                      <div key={b.id} className="flex items-center gap-3">
                        <CategoryIcon category={b.name} className="h-9 w-9" iconClassName="h-[18px] w-[18px]" />
                        <div className="min-w-0 flex-1">
                          <div className="mb-1.5 flex items-center justify-between text-sm">
                            <span className="truncate font-medium text-evergreen-800">{b.name}</span>
                            <span className={`shrink-0 pl-2 tabular-nums ${over ? "font-semibold text-destructive" : "text-evergreen-700"}`}>
                              {formatCurrency(b.actual)} / {formatCurrency(bud)}
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

function EditBudgetDialog({
  budgeted,
  onSave,
}: {
  budgeted: (b: BudgetCategory) => number;
  onSave: (id: string, amount: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});

  function openDialog(next: boolean) {
    setOpen(next);
    if (next) {
      setDraft(Object.fromEntries(editable.map((b) => [b.id, String(budgeted(b))])));
    }
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    for (const b of editable) {
      const n = Number(draft[b.id]);
      if (!Number.isNaN(n) && n >= 0) onSave(b.id, n);
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={openDialog}>
      <DialogTrigger asChild>
        <Button size="sm">Edit budget</Button>
      </DialogTrigger>
      <DialogContent title="Edit budget" description="Adjust how much each category is allotted this month.">
        <form onSubmit={save} className="space-y-3">
          <div className="max-h-[55vh] space-y-2 overflow-y-auto pr-1">
            {editable.map((b) => (
              <div key={b.id} className="flex items-center gap-3">
                <CategoryIcon category={b.name} className="h-8 w-8 rounded-lg" iconClassName="h-4 w-4" />
                <label htmlFor={`bud-${b.id}`} className="min-w-0 flex-1 truncate text-sm text-evergreen-800">
                  {b.name}
                </label>
                <div className="relative w-32">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                  <input
                    id={`bud-${b.id}`}
                    type="number"
                    min="0"
                    value={draft[b.id] ?? ""}
                    onChange={(e) => setDraft((d) => ({ ...d, [b.id]: e.target.value }))}
                    className={`${fieldInputClass} h-10 pl-7 text-right tabular-nums`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save budget</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
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
  return (
    <Card className={tone === "accent" ? "bg-brand-50" : tone === "income" ? "bg-evergreen-50" : ""}>
      <CardContent className="p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-evergreen-900">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
