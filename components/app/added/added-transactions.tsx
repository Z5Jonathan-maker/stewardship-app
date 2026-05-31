"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useHousehold } from "@/components/app/household-store";
import { TransactionRow } from "@/components/app/transaction-row";

const spring = { type: "spring" as const, stiffness: 420, damping: 32 };

/** User-added transactions, springing in at the top of the ledger. */
export function AddedTransactions({ limit }: { limit?: number }) {
  const { transactions } = useHousehold();
  const items = limit ? transactions.slice(0, limit) : transactions;
  return (
    <AnimatePresence initial={false}>
      {items.map((t) => (
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
  );
}
