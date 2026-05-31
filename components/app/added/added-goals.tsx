"use client";

import { useHousehold } from "@/components/app/household-store";
import { GoalCard } from "@/components/app/goal-card";

/** Renders user-added goals as cards, slotting into the goals grid before the
 * seed goals. Renders nothing until added items exist. */
export function AddedGoals() {
  const { goals } = useHousehold();
  if (goals.length === 0) return null;
  return (
    <>
      {goals.map((g) => (
        <GoalCard key={g.id} goal={g} />
      ))}
    </>
  );
}
