import type { Metadata } from "next";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/app/page-header";
import { TransactionRow } from "@/components/app/transaction-row";
import { AddTransactionButton } from "@/components/app/forms/add-transaction-button";
import { AddedTransactions } from "@/components/app/added/added-transactions";
import { formatCurrency } from "@/lib/utils";
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
        action={<AddTransactionButton />}
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
          <AddedTransactions />
          {transactions.map((t) => (
            <TransactionRow key={t.id} t={t} />
          ))}
        </div>
      </Card>
    </div>
  );
}
