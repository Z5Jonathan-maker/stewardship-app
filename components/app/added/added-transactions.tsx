"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useHousehold } from "@/components/app/household-store";
import { TransactionRow } from "@/components/app/transaction-row";
import { DateHeader } from "@/components/app/date-header";

const spring = { type: "spring" as const, stiffness: 420, damping: 32 };

/** User-added transactions (all dated today), shown as a "Today" group at the
 * top of the ledger, springing in. */
export function AddedTransactions() {
  const { transactions } = useHousehold();
  if (transactions.length === 0) return null;
  return (
    <div>
      <DateHeader>Today</DateHeader>
      <div className="divide-y divide-border">
        <AnimatePresence initial={false}>
          {transactions.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={spring}
              style={{ overflow: "hidden" }}
            >
              <TransactionRow t={t} highlight />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
