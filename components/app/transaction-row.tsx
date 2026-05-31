import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateShort } from "@/lib/utils";
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
      className={`flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-cream-50 ${
        highlight ? "bg-brand-50/60" : ""
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-evergreen-700">
          {t.merchant[0]}
        </div>
        <div className="min-w-0">
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
      </div>

      <div className="hidden sm:block">
        <Badge variant="default">{t.category}</Badge>
      </div>

      <div className="w-20 shrink-0 text-right text-xs text-muted-foreground">
        {formatDateShort(t.date)}
      </div>

      <div
        className={`w-28 shrink-0 text-right text-sm font-semibold ${
          t.amount > 0 ? "text-evergreen-600" : "text-evergreen-900"
        }`}
      >
        {formatCurrency(t.amount, { signed: true })}
      </div>
    </div>
  );
}
