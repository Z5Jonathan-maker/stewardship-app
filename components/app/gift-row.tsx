import { CategoryIcon, CategoryChip } from "@/components/app/category-icon";
import { formatCurrency, formatDateLong } from "@/lib/utils";
import type { Transaction } from "@/lib/mock-data";

export function GiftRow({ t }: { t: Transaction }) {
  return (
    <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <CategoryIcon category={t.category} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-evergreen-900">{t.merchant}</p>
        <p className="text-xs text-muted-foreground">{formatDateLong(t.date)}</p>
      </div>
      <CategoryChip category={t.category} className="hidden sm:inline-flex" />
      <span className="w-24 text-right text-sm font-semibold tabular-nums text-evergreen-900">
        {formatCurrency(t.amount)}
      </span>
    </div>
  );
}
