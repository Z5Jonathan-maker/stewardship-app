"use client";

import { useHousehold, GIVING_CATEGORIES } from "@/components/app/household-store";
import { GiftRow } from "@/components/app/gift-row";

/** User-logged gifts, rendered at the top of the recent-gifts list. */
export function AddedGifts() {
  const { transactions } = useHousehold();
  const gifts = transactions.filter((t) => GIVING_CATEGORIES.includes(t.category));
  if (gifts.length === 0) return null;
  return (
    <>
      {gifts.map((t) => (
        <GiftRow key={t.id} t={t} />
      ))}
    </>
  );
}
