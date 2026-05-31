import type { Metadata } from "next";
import { BudgetClient } from "@/components/app/budget-client";

export const metadata: Metadata = { title: "Budget" };

export default function BudgetPage() {
  return <BudgetClient />;
}
