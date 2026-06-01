import type { Metadata } from "next";
import { PageHeader } from "@/components/app/page-header";
import { GoalCard } from "@/components/app/goal-card";
import { NewGoalButton } from "@/components/app/forms/new-goal-button";
import { AddedGoals } from "@/components/app/added/added-goals";
import { formatCurrency } from "@/lib/utils";
import { goals } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Goals" };

export default function GoalsPage() {
  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Goals"
        subtitle={`${formatCurrency(totalSaved)} saved toward ${formatCurrency(totalTarget)} in active goals`}
        action={<NewGoalButton />}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <AddedGoals />
        {goals.map((g) => (
          <GoalCard key={g.id} goal={g} />
        ))}
      </div>
    </div>
  );
}
