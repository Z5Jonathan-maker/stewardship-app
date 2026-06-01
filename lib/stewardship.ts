import {
  monthlyIncome,
  monthlyGiving,
  monthlySpending,
  monthlySaving,
  netWorth,
  accounts,
  goals,
} from "@/lib/mock-data";
import { clamp } from "@/lib/utils";

/**
 * The Stewardship Roadmap — a staged maturity path translated from the
 * principles of covenant stewardship (firstfruits, margin, debt cancellation,
 * strategic sowing, building an inheritance). Each stage's status is DERIVED
 * from the household's real numbers, not self-reported. The "current focus" is
 * the lowest-numbered stage not yet met; every stage also shows its own true
 * status so progress already made elsewhere is visible.
 */

export interface StageDeltas {
  /** Extra giving logged this session (from the household store). */
  addedGiving?: number;
  /** Net-worth change from connected accounts this session. */
  addedNetWorth?: number;
  /** Liabilities added this session (negative balances → debt). */
  addedDebt?: number;
  /** Liquid savings added this session. */
  addedBuffer?: number;
}

export interface Stage {
  id: number;
  key: string;
  title: string;
  principle: string; // the practical teaching
  scripture: { text: string; ref: string };
  met: boolean;
  progress: number; // 0–1
  status: string; // short live status line
  nextAction: string; // the one concrete next step
}

const TITHE_TARGET = 0.1; // a full tithe
const SOW_TARGET = 0.15; // strategic giving aspiration
const SOW_MET = 0.12; // giving meaningfully past the tithe
const LEGACY_TARGET = 1_000_000; // "build & multiply" horizon

const MORTGAGE_TYPES = new Set(["property"]);

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(n)));
}

export function deriveStages(d: StageDeltas = {}): Stage[] {
  const income = monthlyIncome;
  const giving = monthlyGiving + (d.addedGiving ?? 0);
  const givingRate = income > 0 ? giving / income : 0;

  // Liquid buffer = balances in savings accounts (+ any added this session).
  const buffer =
    accounts
      .filter((a) => a.type === "savings")
      .reduce((s, a) => s + a.balance, 0) + (d.addedBuffer ?? 0);
  const monthlyExpenses = monthlySpending || 1;
  const bufferMonths = buffer / monthlyExpenses;

  // Non-mortgage debt = credit + loan balances (a mortgage on the home is
  // treated as covenant-neutral, not bondage). Connected liabilities add in.
  const baseDebt = accounts
    .filter(
      (a) =>
        a.balance < 0 &&
        !MORTGAGE_TYPES.has(a.type) &&
        a.name.toLowerCase() !== "mortgage"
    )
    .reduce((s, a) => s + Math.abs(a.balance), 0);
  const debt = baseDebt + (d.addedDebt ?? 0);

  // Debt-payoff progress from any "debt-free" goals (saved vs target).
  const debtGoals = goals.filter((g) => /debt|free/i.test(g.name));
  const goalSaved = debtGoals.reduce((s, g) => s + g.saved, 0);
  const goalTarget = debtGoals.reduce((s, g) => s + g.target, 0);
  const debtProgress = debt <= 0 ? 1 : goalTarget > 0 ? clamp(goalSaved / goalTarget) : 0.05;

  const worth = netWorth + (d.addedNetWorth ?? 0);
  const investing = monthlySaving > 0;
  const hasInvestments = accounts.some((a) => a.type === "investment");

  const stages: Stage[] = [
    {
      id: 1,
      key: "honor",
      title: "Honor God First",
      principle: "Put the firstfruits — the tithe — off the top of every dollar that comes in.",
      scripture: { text: "Honor the Lord with your wealth, with the firstfruits of all your crops.", ref: "Proverbs 3:9" },
      met: givingRate >= TITHE_TARGET - 0.005,
      progress: clamp(givingRate / TITHE_TARGET),
      status:
        givingRate >= TITHE_TARGET - 0.005
          ? `Tithing faithfully — ${(givingRate * 100).toFixed(1)}% of income`
          : `Currently giving ${(givingRate * 100).toFixed(1)}% — ${fmt(income * TITHE_TARGET - giving)} from a full tithe`,
      nextAction: `Set your giving to a full ${fmt(income * TITHE_TARGET)} (10%) this month`,
    },
    {
      id: 2,
      key: "margin",
      title: "Build Margin",
      principle: "Create a buffer so an emergency never becomes a crisis — at least one month of expenses.",
      scripture: { text: "The wise store up choice food and olive oil.", ref: "Proverbs 21:20" },
      met: bufferMonths >= 1,
      progress: clamp(bufferMonths),
      status:
        bufferMonths >= 1
          ? `${bufferMonths.toFixed(1)} months of expenses set aside`
          : `${fmt(buffer)} saved — building toward ${fmt(monthlyExpenses)} (one month)`,
      nextAction: `Save a one-month buffer of ${fmt(monthlyExpenses)}`,
    },
    {
      id: 3,
      key: "freedom",
      title: "Break the Bondage",
      principle: "Cancel consumer and lender debt on a schedule — give every debt a finish line.",
      scripture: { text: "The borrower is slave to the lender.", ref: "Proverbs 22:7" },
      met: debt <= 0,
      progress: debtProgress,
      status:
        debt <= 0
          ? "Free from non-mortgage debt"
          : `${fmt(debt)} of debt to cancel — ${Math.round(debtProgress * 100)}% of the way`,
      nextAction: debt <= 0 ? "Stay debt-free" : `Attack the smallest balance first — ${fmt(debt)} remaining`,
    },
    {
      id: 4,
      key: "sow",
      title: "Sow Strategically",
      principle: "Grow your giving past the tithe — become a channel money flows through, not just to.",
      scripture: { text: "Whoever sows generously will also reap generously.", ref: "2 Corinthians 9:6" },
      met: givingRate >= SOW_MET,
      progress: clamp(givingRate / SOW_TARGET),
      status:
        givingRate >= SOW_MET
          ? `Sowing ${(givingRate * 100).toFixed(1)}% — beyond the tithe`
          : `At ${(givingRate * 100).toFixed(1)}% — room to grow toward 12–15%`,
      nextAction: "Raise your giving one point past the tithe this quarter",
    },
    {
      id: 5,
      key: "multiply",
      title: "Build & Multiply",
      principle: "Invest consistently and build wealth that outlives you — an inheritance for the next generations.",
      scripture: { text: "A good person leaves an inheritance for their children's children.", ref: "Proverbs 13:22" },
      met: investing && hasInvestments && worth > 0,
      progress: clamp(worth / LEGACY_TARGET),
      status:
        worth > 0
          ? `${fmt(worth)} net worth${investing ? " · investing monthly" : ""}`
          : "Build positive net worth, then invest for the long term",
      nextAction: "Automate monthly investing toward a lasting inheritance",
    },
  ];

  return stages;
}

/** The lowest-numbered stage not yet met = the current focus. */
export function currentStage(stages: Stage[]): Stage {
  return stages.find((s) => !s.met) ?? stages[stages.length - 1];
}

export function allMet(stages: Stage[]): boolean {
  return stages.every((s) => s.met);
}
