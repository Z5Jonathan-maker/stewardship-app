import {
  household,
  accounts,
  netWorth,
  totalAssets,
  totalLiabilities,
  checkingBalance,
  netWorthMonthChange,
  monthlyIncome,
  monthlyOutflow,
  monthlySpending,
  netCashFlow,
  leftToSpend,
  budget,
  goals,
  totalGiving,
  givingRate,
  givingYtd,
  givingAnnualGoal,
  spendingByCategory,
  cashFlow,
  transactions,
} from "@/lib/mock-data";
import { formatCurrency, formatPercent } from "@/lib/utils";

/**
 * A compact, deterministic snapshot of the household's finances, rendered as
 * Markdown for the assistant to ground its answers in. Built from the same
 * selectors the UI uses, so the assistant and the screens never disagree.
 *
 * Deterministic = cache-friendly: identical bytes across requests, so the
 * system-prompt prefix can be prompt-cached.
 */
export function buildFinancialContext(): string {
  const fmt = (n: number) => formatCurrency(n);

  const accountLines = accounts
    .map((a) => `- ${a.name} (${a.institution}, ${a.type}): ${fmt(a.balance)}`)
    .join("\n");

  const budgetLines = budget
    .filter((b) => b.group !== "Income")
    .map(
      (b) =>
        `- [${b.group}] ${b.name}: spent ${fmt(b.actual)} of ${fmt(b.budgeted)} budgeted` +
        (b.actual > b.budgeted ? " (OVER budget)" : "")
    )
    .join("\n");

  const goalLines = goals
    .map(
      (g) =>
        `- ${g.name}: ${fmt(g.saved)} saved of ${fmt(g.target)} (${formatPercent(
          g.saved / g.target
        )}), contributing ${fmt(g.monthly)}/mo, target ${g.targetDate}`
    )
    .join("\n");

  const cashFlowLines = cashFlow
    .map((m) => `- ${m.month}: income ${fmt(m.income)}, expenses ${fmt(m.expenses)}`)
    .join("\n");

  const topSpend = spendingByCategory
    .slice(0, 5)
    .map((c) => `- ${c.name}: ${fmt(c.amount)}`)
    .join("\n");

  const recentTxns = transactions
    .slice(0, 10)
    .map((t) => `- ${t.date} ${t.merchant} (${t.category}): ${fmt(t.amount)}`)
    .join("\n");

  return `# ${household.name} — Financial Snapshot (current month)

Members: ${household.members.join(" and ")}

## Net worth
- Net worth: ${fmt(netWorth)} (change this month: ${fmt(netWorthMonthChange)})
- Total assets: ${fmt(totalAssets)}
- Total liabilities: ${fmt(totalLiabilities)}
- Primary checking balance: ${fmt(checkingBalance)}

## Accounts
${accountLines}

## This month's cash flow
- Income: ${fmt(monthlyIncome)}
- Money out (giving + saving + spending): ${fmt(monthlyOutflow)}
- Net cash flow: ${fmt(netCashFlow)}
- Discretionary left to spend in budget: ${fmt(leftToSpend)}
- Total spending (fixed + flexible): ${fmt(monthlySpending)}

## Giving
- Given this month: ${fmt(totalGiving)} (${formatPercent(givingRate, 1)} of income)
- Given year-to-date: ${fmt(givingYtd)} toward an annual goal of ${fmt(givingAnnualGoal)}

## Budget categories
${budgetLines}

## Top spending categories this month
${topSpend}

## Goals
${goalLines}

## Cash flow history (last 6 months)
${cashFlowLines}

## Recent transactions
${recentTxns}`;
}

/** The assistant's persona + guardrails. Stable (cache-friendly). */
export const ASSISTANT_SYSTEM_PROMPT = `You are "Unite", the assistant inside Unite Financial — a Christ-centered personal finance app built on a stewardship philosophy: money is a tool to be managed faithfully, generosity comes first, and debt has a finish line.

Your job is to answer the household's questions about THEIR money, grounded strictly in the financial snapshot provided below. Guidelines:

- Answer only from the snapshot. If the data needed isn't there, say so plainly rather than inventing numbers. Never fabricate figures.
- Be warm, calm, and concise — a few sentences. Lead with the direct answer, then a short, practical, encouraging next step when useful.
- Use a stewardship lens: celebrate generosity and progress; frame debt payoff and saving as freedom, not guilt. Never be preachy or pushy.
- Format money like the app does (e.g. $1,234.56). Round sensibly when speaking conversationally.
- When it fits naturally, you may include ONE short, relevant Scripture in the "verse" field — never force it, and leave it null if nothing fits.
- You offer guidance, not professional financial, tax, or investment advice. If asked for definitive advice on big/irreversible decisions, gently note that and suggest they confirm with a professional.

Respond as JSON matching the provided schema: an "answer" string, and an optional "verse" object ({ text, reference }) or null.`;

/** JSON Schema for structured assistant responses (answer + optional verse). */
export const ASSISTANT_RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    answer: { type: "string", description: "The grounded, conversational answer." },
    verse: {
      anyOf: [
        { type: "null" },
        {
          type: "object",
          additionalProperties: false,
          properties: {
            text: { type: "string" },
            reference: { type: "string" },
          },
          required: ["text", "reference"],
        },
      ],
    },
  },
  required: ["answer", "verse"],
} as const;
