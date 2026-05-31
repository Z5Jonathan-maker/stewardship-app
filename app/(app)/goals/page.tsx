import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/page-header";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { goals } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Goals" };

function monthsUntil(iso: string) {
  const now = new Date("2026-05-31");
  const target = new Date(iso + "T00:00:00");
  const months =
    (target.getFullYear() - now.getFullYear()) * 12 +
    (target.getMonth() - now.getMonth());
  return Math.max(0, months);
}

export default function GoalsPage() {
  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Goals"
        subtitle={`${formatCurrency(totalSaved)} saved toward ${formatCurrency(totalTarget)} across ${goals.length} goals`}
        action={
          <Button size="sm">
            <Plus className="h-4 w-4" /> New goal
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {goals.map((g) => {
          const ratio = g.saved / g.target;
          const remaining = g.target - g.saved;
          const months = monthsUntil(g.targetDate);
          return (
            <Card key={g.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cream-100 text-2xl">
                      {g.emoji}
                    </div>
                    <div>
                      <h2 className="font-display text-base font-semibold leading-tight text-evergreen-900">
                        {g.name}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(g.monthly)}/mo · {months} months to go
                      </p>
                    </div>
                  </div>
                  <span className="font-display text-lg font-semibold text-brand-600">
                    {formatPercent(ratio)}
                  </span>
                </div>

                <div className="mt-5">
                  <Progress value={ratio} className="h-2.5" />
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-evergreen-900">
                      {formatCurrency(g.saved)}
                    </span>
                    <span className="text-muted-foreground">
                      {formatCurrency(remaining)} to go
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
