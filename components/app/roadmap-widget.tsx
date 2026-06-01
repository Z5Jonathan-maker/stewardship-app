"use client";

import Link from "next/link";
import { ArrowRight, Check, Compass } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHousehold } from "@/components/app/household-store";
import { deriveStages, currentStage, allMet } from "@/lib/stewardship";

/** Compact dashboard view of the Stewardship Roadmap: stage pips + the
 * current focus and its next action. Links to the full page. */
export function RoadmapWidget() {
  const { addedGiving, addedNetWorth } = useHousehold();
  const stages = deriveStages({ addedGiving, addedNetWorth });
  const focus = currentStage(stages);
  const complete = allMet(stages);

  return (
    <>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-brand-500" /> Stewardship Roadmap
        </CardTitle>
        <Link
          href="/roadmap"
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline"
        >
          View <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {/* Stage pips */}
        <div className="flex items-center gap-2">
          {stages.map((s) => (
            <div key={s.key} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                  s.met
                    ? "bg-evergreen-600 text-cream-50"
                    : !complete && s.id === focus.id
                      ? "bg-brand-500 text-white"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {s.met ? <Check className="h-4 w-4" /> : s.id}
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.round(s.progress * 100)}%`,
                    backgroundColor: s.met ? "#33745c" : "#3b63f0",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Current focus */}
        <div className="mt-4 rounded-xl border border-border bg-cream-50 p-3">
          {complete ? (
            <p className="text-sm font-medium text-evergreen-900">
              Every stage reached — keep sowing and building. 🌱
            </p>
          ) : (
            <>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Current focus · Stage {focus.id}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-evergreen-900">{focus.title}</p>
              <p className="mt-1 inline-flex items-start gap-1.5 text-xs text-brand-600">
                <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {focus.nextAction}
              </p>
            </>
          )}
        </div>
      </CardContent>
    </>
  );
}
