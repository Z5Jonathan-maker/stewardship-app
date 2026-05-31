"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  Field,
  fieldInputClass,
} from "@/components/ui/dialog";
import { useHousehold } from "@/components/app/household-store";

const EMOJIS = ["🎯", "🛟", "✈️", "🚗", "🎁", "🏡", "📚", "💍"];

export function NewGoalButton() {
  const { addGoal } = useHousehold();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🎯");
  const [target, setTarget] = useState("");
  const [monthly, setMonthly] = useState("");
  const [targetDate, setTargetDate] = useState("");

  function reset() {
    setName("");
    setEmoji("🎯");
    setTarget("");
    setMonthly("");
    setTargetDate("");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const targetNum = Number(target);
    if (!name.trim() || !targetNum || targetNum <= 0) return;
    addGoal({
      name: name.trim(),
      emoji,
      target: targetNum,
      monthly: Number(monthly) || 0,
      targetDate: targetDate || "2027-01-01",
    });
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" /> New goal
        </Button>
      </DialogTrigger>
      <DialogContent
        title="New goal"
        description="What are you saving toward? Every goal has a finish line."
      >
        <form onSubmit={submit} className="space-y-4">
          <Field label="Goal name">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Family vacation"
              className={fieldInputClass}
            />
          </Field>
          <Field label="Icon">
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((em) => (
                <button
                  key={em}
                  type="button"
                  aria-label={`Choose ${em}`}
                  aria-pressed={emoji === em}
                  onClick={() => setEmoji(em)}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border text-lg transition ${
                    emoji === em
                      ? "border-brand-400 bg-brand-50"
                      : "border-border bg-card hover:bg-muted"
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Target amount">
              <input
                type="number"
                min="1"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="5000"
                className={fieldInputClass}
              />
            </Field>
            <Field label="Monthly contribution">
              <input
                type="number"
                min="0"
                value={monthly}
                onChange={(e) => setMonthly(e.target.value)}
                placeholder="250"
                className={fieldInputClass}
              />
            </Field>
          </div>
          <Field label="Target date">
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className={fieldInputClass}
            />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create goal</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
