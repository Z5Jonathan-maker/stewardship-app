import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/app/page-header";
import { TransactionRow } from "@/components/app/transaction-row";
import { DateHeader } from "@/components/app/date-header";
import { AddTransactionButton } from "@/components/app/forms/add-transaction-button";
import { AddedTransactions } from "@/components/app/added/added-transactions";
import { formatCurrency, groupByDay } from "@/lib/utils";
import { transactions } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Transactions" };

export default function TransactionsPage() {
  const spent = transactions.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0);
  const income = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const groups = groupByDay(transactions);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Transactions"
        subtitle={`${transactions.length} transactions · ${formatCurrency(income)} in · ${formatCurrency(spent)} out`}
        action={<AddTransactionButton />}
      />

      <Card className="overflow-hidden">
        <AddedTransactions />
        {groups.map((g) => (
          <div key={g.date}>
            <DateHeader>{g.label}</DateHeader>
            <div className="divide-y divide-border">
              {g.items.map((t) => (
                <TransactionRow key={t.id} t={t} />
              ))}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
