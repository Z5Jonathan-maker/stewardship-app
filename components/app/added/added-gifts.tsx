"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useHousehold, GIVING_CATEGORIES } from "@/components/app/household-store";
import { GiftRow } from "@/components/app/gift-row";

const spring = { type: "spring" as const, stiffness: 420, damping: 32 };

/** User-logged gifts, springing in at the top of the recent-gifts list. */
export function AddedGifts() {
  const { transactions } = useHousehold();
  const gifts = transactions.filter((t) => GIVING_CATEGORIES.includes(t.category));
  return (
    <AnimatePresence initial={false}>
      {gifts.map((t) => (
        <motion.div
          key={t.id}
          layout
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={spring}
          style={{ overflow: "hidden" }}
        >
          <GiftRow t={t} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
