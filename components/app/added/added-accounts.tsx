"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useHousehold } from "@/components/app/household-store";
import { AccountRow } from "@/components/app/account-row";

const spring = { type: "spring" as const, stiffness: 380, damping: 30 };

/** Connected (Plaid/mock) accounts, springing in above the seed accounts.
 * `kind` filters to assets or liabilities to match the section. */
export function AddedAccounts({ kind }: { kind: "asset" | "liability" }) {
  const { accounts } = useHousehold();
  const items = accounts.filter((a) =>
    kind === "liability" ? a.balance < 0 : a.balance >= 0
  );
  if (items.length === 0) return null;
  return (
    <AnimatePresence initial={false}>
      {items.map((a) => (
        <motion.div
          key={a.id}
          layout
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={spring}
          style={{ overflow: "hidden" }}
        >
          <AccountRow account={a} highlight />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
