"use client";

import { Church, Flame, Check, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useHousehold } from "@/components/app/household-store";
import { formatCurrency, formatPercent, clamp } from "@/lib/utils";
import { monthlyIncome, monthlyGiving } from "@/lib/mock-data";

/**
 * Firstfruits engine: put the tithe off the top — on the gross — before any
 * dollar is allocated. Shows whether the full tithe is honored this month, the
 * faithfulness streak, and what (if anything) remains to reach a full 10%.
 * Counts gifts logged this session via the household store.
 */
const TITHE_RATE = 0.1;
// Months of consecutive faithful tithing for the demo household (would be
// derived from real history once the backend lands).
const BASE_STREAK = 11;

export function FirstfruitsCard() {
  const { addedGiving } = useHousehold();
  const giving = monthlyGiving + addedGiving;
  const titheTarget = monthlyIncome * TITHE_RATE;
  const tithed = clamp(giving / titheTarget);
  const honored = giving >= titheTarget - 0.005;
  const remaining = Math.max(0, titheTarget - giving);
  const streak = honored ? BASE_STREAK + 1 : BASE_STREAK;

  return (
    <Card
      className={
        honored
          ? "overflow-hidden border-0 bg-evergreen-900 text-cream-50"
          : "border-brand-200 bg-brand-50"
      }
    >
      <CardContent className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div
              className={`inline-flex items-center gap-2 text-sm font-medium ${
                honored ? "text-brand-300" : "text-brand-700"
              }`}
            >
              <Church className="h-4 w-4" /> Firstfruits — the tithe, off the top
            </div>
            <p
              className={`mt-2 font-display text-3xl font-semibold tabular-nums ${
                honored ? "text-cream-50" : "text-evergreen-900"
              }`}
            >
              {formatPercent(monthlyIncome > 0 ? giving / monthlyIncome : 0, 1)}
            </p>
            <p
              className={`mt-1 text-sm ${
                honored ? "text-cream-100/70" : "text-evergreen-700"
              }`}
            >
              {honored
                ? `Full tithe honored — ${formatCurrency(giving)} on ${formatCurrency(monthlyIncome)} gross`
                : `${formatCurrency(remaining)} from a full tithe of ${formatCurrency(titheTarget)}`}
            </p>
          </div>

          {/* Faithfulness streak */}
          <div
            className={`flex items-center gap-2 rounded-xl px-3 py-2 ${
              honored ? "bg-cream-50/10" : "bg-card"
            }`}
          >
            <Flame className={honored ? "h-5 w-5 text-brand-300" : "h-5 w-5 text-brand-500"} />
            <div>
              <p className={`font-display text-lg font-semibold leading-none tabular-nums ${honored ? "text-cream-50" : "text-evergreen-900"}`}>
                {streak}
              </p>
              <p className={`text-[11px] ${honored ? "text-cream-100/60" : "text-muted-foreground"}`}>
                month streak
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Progress
            value={tithed}
            aria-label="Tithe progress"
            className={honored ? "h-2 bg-evergreen-700" : "h-2"}
            indicatorColor={honored ? "#6285fb" : "#3b63f0"}
          />
        </div>

        <div
          className={`mt-4 flex items-start gap-2 rounded-xl p-3 text-xs ${
            honored ? "bg-cream-50/10 text-cream-100/80" : "border border-brand-200 bg-card text-evergreen-700"
          }`}
        >
          {honored ? (
            <>
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-300" />
              You honored God first this month. “Bring the whole tithe into the
              storehouse… and see if I will not throw open the floodgates.” — Malachi 3:10
            </>
          ) : (
            <>
              <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" />
              Set aside {formatCurrency(remaining)} more to honor the full tithe —
              put it first, before anything else is allocated.
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
