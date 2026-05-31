import type { Metadata } from "next";
import { Search, SlidersHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/page-header";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { transactions } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Transactions" };

export default function TransactionsPage() {
  const spent = transactions.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0);
  const income = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Transactions"
        subtitle={`${transactions.length} transactions · ${formatCurrency(income)} in · ${formatCurrency(spent)} out`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4" /> Filter
            </Button>
          </div>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border p-4">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              aria-label="Search transactions"
              placeholder="Search transactions…"
              className="h-10 w-full rounded-full border border-border bg-cream-50 pl-10 pr-4 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
            />
          </div>
        </div>

        <div className="divide-y divide-border">
          {transactions.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-cream-50"
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
                  <p className="truncate text-xs text-muted-foreground">
                    {t.account}
                  </p>
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
          ))}
        </div>
      </Card>
    </div>
  );
}
