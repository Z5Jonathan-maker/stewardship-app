"use client";

import * as React from "react";
import type { Transaction, Goal, Account } from "@/lib/mock-data";

/** Giving categories — a transaction in one of these counts as a gift. */
export const GIVING_CATEGORIES = ["Tithe & Offering", "Charitable Giving"];

export interface NewTransaction {
  merchant: string;
  category: string;
  amount: number; // negative = spend, positive = income
  account: string;
}

export interface NewGoal {
  name: string;
  emoji: string;
  target: number;
  monthly: number;
  targetDate: string;
}

interface HouseholdState {
  /** User-added transactions this session (the seed ledger stays server-rendered). */
  transactions: Transaction[];
  /** User-added goals. */
  goals: Goal[];
  /** Per-category budgeted-amount overrides (keyed by budget category id). */
  budgetOverrides: Record<string, number>;
  /** Accounts the user connected this session (via Plaid or the mock flow). */
  accounts: Account[];
}

interface HouseholdContextValue extends HouseholdState {
  addTransaction: (t: NewTransaction) => void;
  addGoal: (g: NewGoal) => void;
  setBudgetAmount: (id: string, amount: number) => void;
  addAccounts: (a: Account[]) => void;
  /** Sum of gifts added this session (for live "given this month"). */
  addedGiving: number;
  ready: boolean;
}

const STORAGE_KEY = "unite-household-v1";

const HouseholdContext = React.createContext<HouseholdContextValue | null>(null);

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function HouseholdProvider({ children }: { children: React.ReactNode }) {
  // Start empty on both server and first client render (deterministic — no
  // hydration mismatch); hydrate from localStorage after mount.
  const [state, setState] = React.useState<HouseholdState>({
    transactions: [],
    goals: [],
    budgetOverrides: {},
    accounts: [],
  });
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<HouseholdState>;
        setState({
          transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
          goals: Array.isArray(parsed.goals) ? parsed.goals : [],
          budgetOverrides:
            parsed.budgetOverrides && typeof parsed.budgetOverrides === "object"
              ? parsed.budgetOverrides
              : {},
          accounts: Array.isArray(parsed.accounts) ? parsed.accounts : [],
        });
      }
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota / private mode */
    }
  }, [state, ready]);

  const addTransaction = React.useCallback((t: NewTransaction) => {
    setState((s) => ({
      ...s,
      transactions: [
        { id: uid("t"), date: today(), ...t },
        ...s.transactions,
      ],
    }));
  }, []);

  const addGoal = React.useCallback((g: NewGoal) => {
    setState((s) => ({
      ...s,
      goals: [{ id: uid("g"), saved: 0, ...g }, ...s.goals],
    }));
  }, []);

  const setBudgetAmount = React.useCallback((id: string, amount: number) => {
    setState((s) => ({
      ...s,
      budgetOverrides: { ...s.budgetOverrides, [id]: amount },
    }));
  }, []);

  const addAccounts = React.useCallback((a: Account[]) => {
    setState((s) => {
      const seen = new Set(s.accounts.map((x) => x.id));
      const fresh = a.filter((x) => !seen.has(x.id));
      return { ...s, accounts: [...fresh, ...s.accounts] };
    });
  }, []);

  const addedGiving = React.useMemo(
    () =>
      state.transactions
        .filter((t) => GIVING_CATEGORIES.includes(t.category))
        .reduce((sum, t) => sum + Math.abs(t.amount), 0),
    [state.transactions]
  );

  const value: HouseholdContextValue = {
    ...state,
    addTransaction,
    addGoal,
    setBudgetAmount,
    addAccounts,
    addedGiving,
    ready,
  };

  return (
    <HouseholdContext.Provider value={value}>
      {children}
    </HouseholdContext.Provider>
  );
}

export function useHousehold() {
  const ctx = React.useContext(HouseholdContext);
  if (!ctx) {
    throw new Error("useHousehold must be used within a HouseholdProvider");
  }
  return ctx;
}
