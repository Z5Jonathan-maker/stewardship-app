"use client";

import { useState } from "react";
import { Sprout } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  Field,
  fieldInputClass,
} from "@/components/ui/dialog";
import { useHousehold } from "@/components/app/household-store";

/**
 * Sow a seed — a gift logged with intent: where it went, what you're
 * believing for, and the scripture you're standing on. Also records it as a
 * giving transaction so it counts toward generosity. This is a faith journal,
 * not a return-on-giving calculator.
 */
export function SowSeedButton({
  variant = "primary",
  label = "Sow a seed",
}: {
  variant?: ButtonProps["variant"];
  label?: string;
}) {
  const { addSeed, addTransaction } = useHousehold();
  const [open, setOpen] = useState(false);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [believingFor, setBelievingFor] = useState("");
  const [scripture, setScripture] = useState("");

  function reset() {
    setTo("");
    setAmount("");
    setBelievingFor("");
    setScripture("");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!to.trim() || !value || value <= 0 || !believingFor.trim()) return;
    addSeed({
      to: to.trim(),
      amount: value,
      believingFor: believingFor.trim(),
      scripture: scripture.trim(),
    });
    // A seed is also generosity — record it so it counts toward giving.
    addTransaction({
      merchant: to.trim(),
      category: "Charitable Giving",
      account: "Everyday Checking",
      amount: -value,
    });
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={variant}>
          <Sprout className="h-4 w-4" /> {label}
        </Button>
      </DialogTrigger>
      <DialogContent
        title="Sow a seed"
        description="Record a gift sown in faith — name what you're believing for and the word you're standing on."
      >
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Sown into">
              <input
                autoFocus
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="e.g. Missions fund"
                className={fieldInputClass}
              />
            </Field>
            <Field label="Amount">
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100.00"
                className={fieldInputClass}
              />
            </Field>
          </div>
          <Field label="Believing for">
            <input
              value={believingFor}
              onChange={(e) => setBelievingFor(e.target.value)}
              placeholder="e.g. Provision for the next semester"
              className={fieldInputClass}
            />
          </Field>
          <Field label="Standing on (scripture, optional)">
            <input
              value={scripture}
              onChange={(e) => setScripture(e.target.value)}
              placeholder="e.g. Philippians 4:19"
              className={fieldInputClass}
            />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Sow this seed</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
