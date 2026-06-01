import { Badge } from "@/components/ui/badge";
import { CategoryIcon, CategoryChip } from "@/components/app/category-icon";
import { formatCurrency } from "@/lib/utils";
import type { Transaction } from "@/lib/mock-data";

export function TransactionRow({
  t,
  highlight = false,
}: {
  t: Transaction;
  /** Subtle accent for freshly-added rows. */
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-cream-50 ${
        highlight ? "bg-brand-50/50" : ""
      }`}
    >
      <CategoryIcon category={t.category} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-evergreen-900">
            {t.merchant}
          </span>
          {t.pending && (
            <Badge variant="outline" className="shrink-0">Pending</Badge>
          )}
        </div>
        <p className="truncate text-xs text-muted-foreground">{t.account}</p>
      </div>

      <CategoryChip category={t.category} className="hidden shrink-0 md:inline-flex" />

      <div
        className={`w-24 shrink-0 text-right text-sm font-semibold tabular-nums ${
          t.amount > 0 ? "text-evergreen-600" : "text-evergreen-900"
        }`}
      >
        {formatCurrency(t.amount, { signed: true })}
      </div>
    </div>
  );
}
