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

const CATEGORIES = [
  "Groceries",
  "Dining Out",
  "Coffee",
  "Gas & Fuel",
  "Shopping",
  "Utilities",
  "Subscriptions",
  "Housing",
  "Phone",
  "Tithe & Offering",
  "Charitable Giving",
  "Paycheck",
  "Other",
];

const ACCOUNTS = ["Everyday Checking", "Joint Savings", "Sapphire Card"];

export function AddTransactionButton() {
  const { addTransaction } = useHousehold();
  const [open, setOpen] = useState(false);
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"expense" | "income">("expense");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [account, setAccount] = useState(ACCOUNTS[0]);

  function reset() {
    setMerchant("");
    setAmount("");
    setType("expense");
    setCategory(CATEGORIES[0]);
    setAccount(ACCOUNTS[0]);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!merchant.trim() || !value || value <= 0) return;
    addTransaction({
      merchant: merchant.trim(),
      category,
      account,
      amount: type === "expense" ? -value : value,
    });
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" /> Add transaction
        </Button>
      </DialogTrigger>
      <DialogContent title="Add transaction" description="Record income or spending.">
        <form onSubmit={submit} className="space-y-4">
          <Field label="Merchant">
            <input
              autoFocus
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="e.g. Trader Joe's"
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
                placeholder="42.00"
                className={fieldInputClass}
              />
            </Field>
            <Field label="Type">
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "expense" | "income")}
                className={fieldInputClass}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={fieldInputClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Account">
              <select
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className={fieldInputClass}
              >
                {ACCOUNTS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Add transaction</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
