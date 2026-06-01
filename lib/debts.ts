import { accounts } from "@/lib/mock-data";

/**
 * Debt-cancellation engine. We don't widen the shared Account type — instead
 * we attach payoff metadata (APR, minimum payment) by account id here, and
 * compute snowball/avalanche schedules. A debt has a finish line.
 */

export interface Debt {
  id: string;
  name: string;
  institution: string;
  balance: number; // positive amount owed
  apr: number; // annual %, e.g. 22.9
  minPayment: number;
  /** A declaration to speak over this debt as it's cancelled. */
  declaration: string;
}

// Payoff metadata for the seeded debts (mortgage excluded — covenant-neutral,
// a separate long-horizon concern, not bondage to attack first).
const META: Record<string, { apr: number; minPayment: number; declaration: string }> = {
  a3: {
    apr: 22.9,
    minPayment: 55,
    declaration: "This card is cancelled. I am the lender, not the borrower.",
  },
  a6: {
    apr: 6.4,
    minPayment: 295,
    declaration: "This loan has a finish line, and I am walking to freedom.",
  },
};

export type Method = "snowball" | "avalanche";

/** The active (non-mortgage) debts, as positive balances with payoff meta. */
export function getDebts(): Debt[] {
  return accounts
    .filter(
      (a) =>
        a.balance < 0 &&
        a.name.toLowerCase() !== "mortgage" &&
        a.type !== "property"
    )
    .map((a) => {
      const m = META[a.id] ?? {
        apr: 0,
        minPayment: Math.max(25, Math.round(Math.abs(a.balance) * 0.02)),
        declaration: "This debt has a finish line.",
      };
      return {
        id: a.id,
        name: a.name,
        institution: a.institution,
        balance: Math.abs(a.balance),
        apr: m.apr,
        minPayment: m.minPayment,
        declaration: m.declaration,
      };
    });
}

export interface PayoffLine {
  id: string;
  name: string;
  order: number;
  monthsToPayoff: number;
  payoffDate: string;
  interestPaid: number;
}

export interface PayoffPlan {
  method: Method;
  monthlyTotal: number; // total monthly dollars toward debt
  totalMonths: number;
  debtFreeDate: string;
  totalInterest: number;
  lines: PayoffLine[];
}

function addMonths(base: Date, months: number): string {
  const d = new Date(base);
  d.setMonth(d.getMonth() + Math.max(0, months));
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/**
 * Simulate paying off all debts month-by-month. `extra` is added on top of the
 * combined minimums and rolls onto the focus debt; as each debt clears, its
 * payment rolls into the next (the snowball/avalanche effect).
 */
export function buildPlan(method: Method, extra: number, from = new Date("2026-06-01")): PayoffPlan {
  const order = [...getDebts()].sort((a, b) =>
    method === "snowball" ? a.balance - b.balance : b.apr - a.apr
  );

  const monthlyTotal = order.reduce((s, d) => s + d.minPayment, 0) + Math.max(0, extra);

  // Mutable simulation state.
  const sim = order.map((d) => ({ ...d, bal: d.balance, interest: 0, months: 0 }));
  let month = 0;
  const MAX = 600; // 50-year guard

  while (sim.some((d) => d.bal > 0.005) && month < MAX) {
    month++;
    let pool = monthlyTotal;

    // 1) accrue interest, pay minimums on every still-open debt
    for (const d of sim) {
      if (d.bal <= 0.005) continue;
      const interest = (d.bal * (d.apr / 100)) / 12;
      d.bal += interest;
      d.interest += interest;
      const pay = Math.min(d.minPayment, d.bal, pool);
      d.bal -= pay;
      pool -= pay;
    }
    // 2) throw everything left at the first open debt (focus), rolling over
    for (const d of sim) {
      if (pool <= 0) break;
      if (d.bal <= 0.005) continue;
      const pay = Math.min(d.bal, pool);
      d.bal -= pay;
      pool -= pay;
    }
    // 3) stamp payoff month for any debt that just cleared
    for (const d of sim) {
      if (d.bal <= 0.005 && d.months === 0) d.months = month;
    }
  }

  const lines: PayoffLine[] = sim.map((d, i) => ({
    id: d.id,
    name: d.name,
    order: i + 1,
    monthsToPayoff: d.months,
    payoffDate: addMonths(from, d.months),
    interestPaid: d.interest,
  }));

  const totalMonths = Math.max(...lines.map((l) => l.monthsToPayoff), 0);

  return {
    method,
    monthlyTotal,
    totalMonths,
    debtFreeDate: addMonths(from, totalMonths),
    totalInterest: sim.reduce((s, d) => s + d.interest, 0),
    lines,
  };
}

export const totalDebt = (): number =>
  getDebts().reduce((s, d) => s + d.balance, 0);

export const totalMinPayments = (): number =>
  getDebts().reduce((s, d) => s + d.minPayment, 0);
