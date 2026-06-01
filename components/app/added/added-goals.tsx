"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useHousehold } from "@/components/app/household-store";
import { GoalCard } from "@/components/app/goal-card";

const spring = { type: "spring" as const, stiffness: 380, damping: 30 };

/** User-added goals, springing into the goals grid before the seed goals. */
export function AddedGoals() {
  const { goals } = useHousehold();
  return (
    <AnimatePresence initial={false}>
      {goals.map((g) => (
        <motion.div
          key={g.id}
          layout
          initial={{ opacity: 0, y: -10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={spring}
        >
          <GoalCard goal={g} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
