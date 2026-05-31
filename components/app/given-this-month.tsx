"use client";

import { useHousehold } from "@/components/app/household-store";
import { formatCurrency } from "@/lib/utils";

/** "Given this month" — the seed total plus any gifts logged this session. */
export function GivenThisMonth({ base }: { base: number }) {
  const { addedGiving } = useHousehold();
  return <>{formatCurrency(base + addedGiving)}</>;
}
