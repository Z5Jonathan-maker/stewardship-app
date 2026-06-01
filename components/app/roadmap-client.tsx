"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/app/page-header";
import { useHousehold } from "@/components/app/household-store";
import { deriveStages, currentStage, allMet, type Stage } from "@/lib/stewardship";
import { cn } from "@/lib/utils";

export function RoadmapClient() {
  const { addedGiving, addedNetWorth } = useHousehold();
  const stages = deriveStages({ addedGiving, addedNetWorth });
  const focus = currentStage(stages);
  const complete = allMet(stages);
  const metCount = stages.filter((s) => s.met).length;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Stewardship Roadmap"
        subtitle={`${metCount} of ${stages.length} stages reached — a practical path to faithful stewardship`}
      />

      {/* Current focus hero */}
      <Card className="overflow-hidden border-0 bg-evergreen-900 text-cream-50">
        <CardContent className="p-7">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-brand-300">
            <Sparkles className="h-4 w-4" />
            {complete ? "Full stewardship" : `Your current focus · Stage ${focus.id}`}
          </div>
          <h2 className="mt-2 font-display text-2xl font-semibold">
            {complete ? "You're walking it out" : focus.title}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-cream-100/80">
            {complete
              ? "Every stage is met — keep sowing, keep building, and keep leaving a legacy."
              : focus.principle}
          </p>

          {!complete && (
            <>
              <div className="mt-5 max-w-md">
                <Progress
                  value={focus.progress}
                  aria-label={`${focus.title} progress`}
                  className="h-2.5 bg-evergreen-700"
                  indicatorColor="#6285fb"
                />
                <p className="mt-2 text-xs text-cream-100/70">{focus.status}</p>
              </div>
              <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-cream-100/15 bg-cream-50/5 px-4 py-2.5 text-sm font-medium">
                <ArrowRight className="h-4 w-4 text-brand-300" />
                {focus.nextAction}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* The full ladder */}
      <ol className="relative mt-8 space-y-4">
        {stages.map((s, i) => (
          <motion.li
            key={s.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <StageRow stage={s} isFocus={!complete && s.id === focus.id} />
          </motion.li>
        ))}
      </ol>

      <p className="mt-8 text-center text-sm italic text-muted-foreground">
        “Moreover it is required in stewards, that a man be found faithful.” — 1 Corinthians 4:2
      </p>
    </div>
  );
}

function StageRow({ stage: s, isFocus }: { stage: Stage; isFocus: boolean }) {
  return (
    <Card
      className={cn(
        "transition-shadow",
        isFocus ? "ring-2 ring-brand-400" : s.met ? "" : "opacity-95"
      )}
    >
      <CardContent className="flex gap-4 p-5">
        {/* Stage badge */}
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-base font-semibold",
            s.met
              ? "bg-evergreen-600 text-cream-50"
              : isFocus
                ? "bg-brand-500 text-white"
                : "bg-muted text-muted-foreground"
          )}
        >
          {s.met ? <Check className="h-5 w-5" /> : s.id}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-base font-semibold text-evergreen-900">
              {s.title}
            </h3>
            {s.met && (
              <span className="rounded-full bg-evergreen-50 px-2 py-0.5 text-[11px] font-medium text-evergreen-700">
                Reached
              </span>
            )}
            {isFocus && (
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700">
                Current focus
              </span>
            )}
          </div>
          <p className="mt-1 text-sm leading-relaxed text-evergreen-700">{s.principle}</p>

          <div className="mt-3">
            <Progress
              value={s.progress}
              aria-label={`${s.title} progress`}
              indicatorColor={s.met ? "#33745c" : "#3b63f0"}
            />
            <p className="mt-1.5 text-xs text-muted-foreground">{s.status}</p>
          </div>

          {!s.met && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-brand-600">
              <ArrowRight className="h-3.5 w-3.5" /> {s.nextAction}
            </p>
          )}

          <p className="mt-3 flex items-start gap-2 border-t border-border pt-3 text-xs italic text-evergreen-700">
            <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" />
            “{s.scripture.text}” —{" "}
            <span className="font-semibold not-italic">{s.scripture.ref}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
