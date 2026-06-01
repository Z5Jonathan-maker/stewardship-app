"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sprout, Sun, BookOpen, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  Field,
  fieldInputClass,
} from "@/components/ui/dialog";
import { useHousehold, type Seed } from "@/components/app/household-store";
import { formatCurrency, formatDateLong } from "@/lib/utils";

/** Illustrative seeds so the journal is never empty on first visit. These are
 * read-only examples; the user's own seeds (from the store) render above them. */
const SAMPLE_SEEDS: Seed[] = [
  {
    id: "sample-1",
    date: "2026-03-12",
    to: "Building fund",
    amount: 500,
    believingFor: "Our home to sell quickly and at the right price",
    scripture: "Luke 6:38",
    harvest: "Closed 9 days after listing — above asking. Faithful God.",
    harvestDate: "2026-04-20",
  },
  {
    id: "sample-2",
    date: "2026-05-02",
    to: "Missions — Guatemala team",
    amount: 250,
    believingFor: "Open doors for the team and provision for the trip",
    scripture: "2 Corinthians 9:8",
    harvest: null,
    harvestDate: null,
  },
];

export function SeedJournal() {
  const { seeds, recordHarvest } = useHousehold();
  const all = [...seeds, ...SAMPLE_SEEDS];
  const awaiting = all.filter((s) => !s.harvest).length;
  const testimonies = all.filter((s) => s.harvest).length;

  return (
    <div>
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <Stat label="Seeds sown" value={String(all.length)} />
        <Stat label="Believing for harvest" value={String(awaiting)} />
        <Stat label="Testimonies recorded" value={String(testimonies)} />
      </div>

      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {all.map((s) => (
            <motion.div
              key={s.id}
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            >
              <SeedCard seed={s} onHarvest={recordHarvest} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SeedCard({
  seed: s,
  onHarvest,
}: {
  seed: Seed;
  onHarvest: (id: string, harvest: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const harvested = !!s.harvest;

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    onHarvest(s.id, text.trim());
    setText("");
    setOpen(false);
  }

  return (
    <Card className={harvested ? "border-evergreen-200" : ""}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              harvested ? "bg-evergreen-50 text-evergreen-600" : "bg-brand-50 text-brand-600"
            }`}
          >
            {harvested ? <Sun className="h-5 w-5" /> : <Sprout className="h-5 w-5" />}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-display text-base font-semibold text-evergreen-900">
                {formatCurrency(s.amount)} into {s.to}
              </p>
              <span className="text-xs text-muted-foreground">{formatDateLong(s.date)}</span>
            </div>

            <p className="mt-1.5 text-sm text-evergreen-800">
              <span className="text-muted-foreground">Believing for: </span>
              {s.believingFor}
            </p>

            {s.scripture && (
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-brand-700">
                <BookOpen className="h-3.5 w-3.5" /> Standing on {s.scripture}
              </p>
            )}

            {harvested ? (
              <div className="mt-3 rounded-xl border border-evergreen-200 bg-evergreen-50 p-3">
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-evergreen-700">
                  <Check className="h-3.5 w-3.5" /> Harvest{" "}
                  {s.harvestDate && (
                    <span className="font-normal normal-case text-muted-foreground">
                      · {formatDateLong(s.harvestDate)}
                    </span>
                  )}
                </p>
                <p className="mt-1 text-sm italic text-evergreen-900">“{s.harvest}”</p>
              </div>
            ) : (
              <Dialog open={open} onOpenChange={setOpen}>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setOpen(true)}
                >
                  <Sun className="h-4 w-4" /> Record the harvest
                </Button>
                <DialogContent
                  title="Record the harvest"
                  description={`The testimony for your ${formatCurrency(s.amount)} seed into ${s.to}.`}
                >
                  <form onSubmit={save} className="space-y-4">
                    <Field label="What happened?">
                      <textarea
                        autoFocus
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={4}
                        placeholder="Tell the story of how God met this…"
                        className={`${fieldInputClass} h-auto resize-none py-2.5`}
                      />
                    </Field>
                    <div className="flex justify-end gap-2">
                      <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="submit">Save testimony</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-evergreen-900">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
