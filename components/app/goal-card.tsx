import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CategoryIcon } from "@/components/app/category-icon";
import { formatCurrency, formatPercent } from "@/lib/utils";
import type { Goal } from "@/lib/mock-data";

function monthsUntil(iso: string) {
  const now = new Date("2026-05-31");
  const target = new Date(iso + "T00:00:00");
  const months =
    (target.getFullYear() - now.getFullYear()) * 12 +
    (target.getMonth() - now.getMonth());
  return Math.max(0, months);
}

export function GoalCard({ goal: g }: { goal: Goal }) {
  const ratio = g.target > 0 ? g.saved / g.target : 0;
  const remaining = Math.max(0, g.target - g.saved);
  const months = monthsUntil(g.targetDate);

  return (
    <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <CategoryIcon category={g.name} className="h-12 w-12" iconClassName="h-6 w-6" />
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
          <Progress value={ratio} className="h-2.5" aria-label={`${g.name} progress`} />
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
}
