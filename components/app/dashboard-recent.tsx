"use client";

import { useHousehold } from "@/components/app/household-store";
import { CategoryIcon } from "@/components/app/category-icon";
import { formatCurrency } from "@/lib/utils";
import type { Transaction } from "@/lib/mock-data";

/** Dashboard "Recent transactions": merges session-added transactions
 * (newest) ahead of the seed list, capped at `limit`. */
export function DashboardRecent({
  seed,
  limit = 5,
}: {
  seed: Transaction[];
  limit?: number;
}) {
  const { transactions } = useHousehold();
  const recent = [...transactions, ...seed].slice(0, limit);

  return (
    <>
      {recent.map((t) => (
        <div key={t.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
          <div className="flex min-w-0 items-center gap-3">
            <CategoryIcon category={t.category} className="h-9 w-9 rounded-full" iconClassName="h-[18px] w-[18px]" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-evergreen-900">{t.merchant}</p>
              <p className="truncate text-xs text-muted-foreground">{t.category}</p>
            </div>
          </div>
          <span className={`text-sm font-semibold tabular-nums ${t.amount > 0 ? "text-evergreen-600" : "text-evergreen-900"}`}>
            {formatCurrency(t.amount, { signed: true })}
          </span>
        </div>
      ))}
    </>
  );
}
