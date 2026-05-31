"use client";

import { useHousehold } from "@/components/app/household-store";
import { TransactionRow } from "@/components/app/transaction-row";

/** User-added transactions, rendered at the top of the ledger (newest first).
 * `limit` caps how many show (e.g. on the dashboard's recent list). */
export function AddedTransactions({ limit }: { limit?: number }) {
  const { transactions } = useHousehold();
  if (transactions.length === 0) return null;
  const items = limit ? transactions.slice(0, limit) : transactions;
  return (
    <>
      {items.map((t) => (
        <TransactionRow key={t.id} t={t} highlight />
      ))}
    </>
  );
}
