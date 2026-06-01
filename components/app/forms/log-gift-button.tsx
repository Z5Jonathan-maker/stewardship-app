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
import { useHousehold, GIVING_CATEGORIES } from "@/components/app/household-store";

export function LogGiftButton() {
  const { addTransaction } = useHousehold();
  const [open, setOpen] = useState(false);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(GIVING_CATEGORIES[0]);

  function reset() {
    setTo("");
    setAmount("");
    setCategory(GIVING_CATEGORIES[0]);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!to.trim() || !value || value <= 0) return;
    addTransaction({
      merchant: to.trim(),
      category,
      account: "Everyday Checking",
      amount: -value,
    });
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" /> Log a gift
        </Button>
      </DialogTrigger>
      <DialogContent
        title="Log a gift"
        description="Record your generosity — it counts toward this month and your year-end statement."
      >
        <form onSubmit={submit} className="space-y-4">
          <Field label="Given to">
            <input
              autoFocus
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="e.g. Grace Community Church"
              className={fieldInputClass}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
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
            <Field label="Type">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={fieldInputClass}
              >
                {GIVING_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Log gift</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
