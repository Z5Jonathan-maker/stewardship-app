"use client";

import { useHousehold } from "@/components/app/household-store";
import { CountUp } from "@/components/app/count-up";
import { formatCurrency, formatPercent } from "@/lib/utils";

/**
 * Live stat components: combine a server-computed base (from mock-data
 * selectors) with the client-side deltas in the household store, so user
 * additions (connected accounts, logged gifts, added transactions) flow
 * into every total — not just their own row. Each renders the base verbatim
 * on first paint (SSR-safe) and updates once the store hydrates.
 */

export function GivenThisMonth({ base }: { base: number }) {
  const { addedGiving } = useHousehold();
  return <>{formatCurrency(base + addedGiving)}</>;
}

export function LiveNetWorth({ base, compact = false }: { base: number; compact?: boolean }) {
  const { addedNetWorth } = useHousehold();
  return <>{formatCurrency(base + addedNetWorth, { compact })}</>;
}

export function LiveAssets({ base }: { base: number }) {
  const { addedAssets } = useHousehold();
  return <>{formatCurrency(base + addedAssets)}</>;
}

export function LiveLiabilities({ base }: { base: number }) {
  const { addedLiabilities } = useHousehold();
  return <>{formatCurrency(base + addedLiabilities)}</>;
}

export function LiveSpending({ base }: { base: number }) {
  const { addedSpending } = useHousehold();
  return <>{formatCurrency(base + addedSpending)}</>;
}

/** "{n} accounts connected" subtitle that counts session-connected accounts. */
export function LiveAccountCount({ base }: { base: number }) {
  const { addedAccountCount } = useHousehold();
  const n = base + addedAccountCount;
  return <>{n} accounts connected</>;
}

/** Live giving rate = (base giving + added) / income. */
export function LiveGivingRate({ givingBase, income }: { givingBase: number; income: number }) {
  const { addedGiving } = useHousehold();
  const rate = income > 0 ? (givingBase + addedGiving) / income : 0;
  return <>{formatPercent(rate, 1)} of income</>;
}

/* --- Count-up variants (animate the live total) --- */

export function NetWorthCountUp({ base }: { base: number }) {
  const { addedNetWorth } = useHousehold();
  return <CountUp value={base + addedNetWorth} />;
}

export function IncomeCountUp({ base }: { base: number }) {
  const { addedIncome } = useHousehold();
  return <CountUp value={base + addedIncome} />;
}

export function OutflowCountUp({ base }: { base: number }) {
  const { addedOutflow } = useHousehold();
  return <CountUp value={base + addedOutflow} />;
}

export function NetCashFlowCountUp({ base }: { base: number }) {
  const { addedIncome, addedOutflow } = useHousehold();
  return <CountUp value={base + addedIncome - addedOutflow} format="currency-signed" />;
}

export function SpendingCountUp({ base }: { base: number }) {
  const { addedSpending } = useHousehold();
  return <CountUp value={base + addedSpending} />;
}

/** Transactions header: "{count} transactions · {in} in · {out} out",
 * including session-added transactions. */
export function LiveTransactionsSummary({
  count,
  income,
  spent,
}: {
  count: number;
  income: number;
  spent: number; // negative
}) {
  const { transactions } = useHousehold();
  const addedIn = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const addedOut = transactions.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0);
  return (
    <>
      {count + transactions.length} transactions · {formatCurrency(income + addedIn)} in ·{" "}
      {formatCurrency(spent + addedOut)} out
    </>
  );
}
