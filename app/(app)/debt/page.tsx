import type { Metadata } from "next";
import { PageHeader } from "@/components/app/page-header";
import { DebtPlanner } from "@/components/app/debt-planner";

export const metadata: Metadata = { title: "Debt Freedom" };

export default function DebtPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Debt Freedom"
        subtitle="Give every debt a finish line — then watch the chains come off."
      />
      <DebtPlanner />
    </div>
  );
}
