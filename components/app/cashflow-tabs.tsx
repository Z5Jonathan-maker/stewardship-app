"use client";

import { useState } from "react";
import { SegmentedTabs } from "@/components/app/segmented-tabs";

/**
 * Tabbed Cash Flow surface (Monarch Reports pattern). The tab panels arrive
 * as server-rendered nodes so the data work stays on the server.
 */
export function CashflowTabs({
  cashflow,
  spending,
  income,
}: {
  cashflow: React.ReactNode;
  spending: React.ReactNode;
  income: React.ReactNode;
}) {
  const TABS = ["Cash flow", "Spending", "Income"];
  const [tab, setTab] = useState(TABS[0]);
  return (
    <div>
      <SegmentedTabs tabs={TABS} active={tab} onChange={setTab} className="mb-4" />
      <div role="tabpanel">
        {tab === "Cash flow" && cashflow}
        {tab === "Spending" && spending}
        {tab === "Income" && income}
      </div>
    </div>
  );
}
