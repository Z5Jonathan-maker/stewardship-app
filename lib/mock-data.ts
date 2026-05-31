/**
 * Mock financial data for Unite Financial.
 * Everything the app renders is derived from this module so the UI is fully
 * demonstrable before real Plaid wiring lands. Replace these with live data
 * sources (Plaid + DB) without touching the components.
 */

export type AccountType =
  | "checking"
  | "savings"
  | "credit"
  | "investment"
  | "loan";

export interface Account {
  id: string;
  name: string;
  institution: string;
  type: AccountType;
  mask: string;
  balance: number; // negative for liabilities
}

export interface Transaction {
  id: string;
  date: string; // ISO
  merchant: string;
  category: string;
  account: string;
  amount: number; // negative = spend, positive = income
  pending?: boolean;
}

export interface BudgetCategory {
  id: string;
  name: string;
  group: "Income" | "Giving" | "Fixed" | "Flexible" | "Savings";
  emoji: string;
  budgeted: number;
  actual: number;
}

export interface Goal {
  id: string;
  name: string;
  emoji: string;
  target: number;
  saved: number;
  monthly: number;
  targetDate: string;
}

export const household = {
  name: "The Carter Household",
  members: ["Jonathan", "Grace"],
  verseOfDay: {
    text: "Each of you should use whatever gift you have received to serve others, as faithful stewards of God's grace in its various forms.",
    ref: "1 Peter 4:10",
  },
};

export const accounts: Account[] = [
  { id: "a1", name: "Everyday Checking", institution: "Chase", type: "checking", mask: "4821", balance: 8420.16 },
  { id: "a2", name: "Joint Savings", institution: "Ally", type: "savings", mask: "0093", balance: 21750.0 },
  { id: "a3", name: "Sapphire Card", institution: "Chase", type: "credit", mask: "1180", balance: -1840.55 },
  { id: "a4", name: "Roth IRA", institution: "Fidelity", type: "investment", mask: "7702", balance: 64310.42 },
  { id: "a5", name: "401(k)", institution: "Vanguard", type: "investment", mask: "5521", balance: 138905.7 },
  { id: "a6", name: "Auto Loan", institution: "Capital One", type: "loan", mask: "3340", balance: -12480.0 },
  { id: "a7", name: "Mortgage", institution: "Rocket", type: "loan", mask: "8890", balance: -284300.0 },
];

export const transactions: Transaction[] = [
  { id: "t1", date: "2026-05-30", merchant: "Trader Joe's", category: "Groceries", account: "Everyday Checking", amount: -86.42 },
  { id: "t2", date: "2026-05-30", merchant: "Grace Community Church", category: "Tithe & Offering", account: "Everyday Checking", amount: -650.0 },
  { id: "t3", date: "2026-05-29", merchant: "Shell", category: "Gas & Fuel", account: "Sapphire Card", amount: -52.18 },
  { id: "t4", date: "2026-05-29", merchant: "Acme Corp Payroll", category: "Paycheck", account: "Everyday Checking", amount: 4180.55, },
  { id: "t5", date: "2026-05-28", merchant: "Netflix", category: "Subscriptions", account: "Sapphire Card", amount: -15.49 },
  { id: "t6", date: "2026-05-28", merchant: "Chipotle", category: "Dining Out", account: "Sapphire Card", amount: -27.31 },
  { id: "t7", date: "2026-05-27", merchant: "PG&E", category: "Utilities", account: "Everyday Checking", amount: -142.07 },
  { id: "t8", date: "2026-05-26", merchant: "Amazon", category: "Shopping", account: "Sapphire Card", amount: -63.94, pending: true },
  { id: "t9", date: "2026-05-25", merchant: "Compassion Intl.", category: "Charitable Giving", account: "Everyday Checking", amount: -45.0 },
  { id: "t10", date: "2026-05-24", merchant: "Costco", category: "Groceries", account: "Sapphire Card", amount: -211.76 },
  { id: "t11", date: "2026-05-23", merchant: "Starbucks", category: "Coffee", account: "Sapphire Card", amount: -6.75 },
  { id: "t12", date: "2026-05-22", merchant: "Rocket Mortgage", category: "Housing", account: "Everyday Checking", amount: -1980.0 },
  { id: "t13", date: "2026-05-21", merchant: "Vanguard", category: "Investments", account: "Joint Savings", amount: -800.0 },
  { id: "t14", date: "2026-05-20", merchant: "Acme Corp Payroll", category: "Paycheck", account: "Everyday Checking", amount: 4180.55 },
  { id: "t15", date: "2026-05-19", merchant: "Target", category: "Shopping", account: "Sapphire Card", amount: -98.12 },
  { id: "t16", date: "2026-05-18", merchant: "Verizon", category: "Phone", account: "Everyday Checking", amount: -90.0 },
  { id: "t17", date: "2026-05-17", merchant: "Local Food Bank", category: "Charitable Giving", account: "Everyday Checking", amount: -100.0 },
  { id: "t18", date: "2026-05-16", merchant: "Whole Foods", category: "Groceries", account: "Sapphire Card", amount: -74.55 },
];

export const budget: BudgetCategory[] = [
  { id: "b0", name: "Take-home Income", group: "Income", emoji: "💵", budgeted: 8360, actual: 8361.1 },
  { id: "b1", name: "Tithe (10%)", group: "Giving", emoji: "⛪", budgeted: 836, actual: 650 },
  { id: "b2", name: "Generosity & Offerings", group: "Giving", emoji: "🤲", budgeted: 200, actual: 145 },
  { id: "b3", name: "Housing", group: "Fixed", emoji: "🏠", budgeted: 1980, actual: 1980 },
  { id: "b4", name: "Utilities", group: "Fixed", emoji: "💡", budgeted: 320, actual: 232.07 },
  { id: "b5", name: "Phone & Internet", group: "Fixed", emoji: "📱", budgeted: 150, actual: 90 },
  { id: "b6", name: "Groceries", group: "Flexible", emoji: "🛒", budgeted: 700, actual: 449.49 },
  { id: "b7", name: "Dining & Coffee", group: "Flexible", emoji: "🍽️", budgeted: 250, actual: 161.06 },
  { id: "b8", name: "Transportation", group: "Flexible", emoji: "⛽", budgeted: 220, actual: 52.18 },
  { id: "b9", name: "Shopping", group: "Flexible", emoji: "🛍️", budgeted: 300, actual: 425.06 },
  { id: "b10", name: "Emergency Fund", group: "Savings", emoji: "🛟", budgeted: 500, actual: 500 },
  { id: "b11", name: "Investments", group: "Savings", emoji: "📈", budgeted: 800, actual: 800 },
];

export const goals: Goal[] = [
  { id: "g1", name: "Emergency Fund (6 months)", emoji: "🛟", target: 30000, saved: 21750, monthly: 500, targetDate: "2027-04-01" },
  { id: "g2", name: "Missions Trip — Guatemala", emoji: "✈️", target: 4500, saved: 2800, monthly: 300, targetDate: "2026-11-01" },
  { id: "g3", name: "Debt-Free: Auto Loan", emoji: "🚗", target: 12480, saved: 6200, monthly: 450, targetDate: "2027-02-01" },
  { id: "g4", name: "Generosity Fund", emoji: "🎁", target: 5000, saved: 1650, monthly: 200, targetDate: "2026-12-01" },
];

/** 6-month cash flow history + this month projection. */
export const cashFlow = [
  { month: "Dec", income: 8360, expenses: 6890 },
  { month: "Jan", income: 8360, expenses: 7240 },
  { month: "Feb", income: 8360, expenses: 6510 },
  { month: "Mar", income: 9120, expenses: 7020 },
  { month: "Apr", income: 8360, expenses: 6680 },
  { month: "May", income: 8361, expenses: 5446 },
];

/**
 * Net worth trend (last 6 months), in dollars. A household steadily paying
 * down a mortgage + auto loan: net worth climbs ~$7.8k as debt shrinks,
 * ending at the live `netWorth` figure below.
 */
export const netWorthTrend = [
  { month: "Dec", value: -73000 },
  { month: "Jan", value: -71200 },
  { month: "Feb", value: -70100 },
  { month: "Mar", value: -68500 },
  { month: "Apr", value: -67000 },
  { month: "May", value: -65234 },
];

/** Net worth gained over the trend window (used for the dashboard delta). */
export const netWorthGain =
  netWorthTrend[netWorthTrend.length - 1].value - netWorthTrend[0].value;

// ---- Derived selectors -------------------------------------------------

export const assets = accounts.filter((a) => a.balance >= 0);
export const liabilities = accounts.filter((a) => a.balance < 0);

export const totalAssets = assets.reduce((s, a) => s + a.balance, 0);
export const totalLiabilities = liabilities.reduce((s, a) => s + a.balance, 0);
export const netWorth = totalAssets + totalLiabilities;

export const monthlyIncome = budget
  .filter((b) => b.group === "Income")
  .reduce((s, b) => s + b.actual, 0);

export const monthlySpending = budget
  .filter((b) => b.group !== "Income")
  .reduce((s, b) => s + b.actual, 0);

export const monthlyBudgeted = budget
  .filter((b) => b.group !== "Income")
  .reduce((s, b) => s + b.budgeted, 0);

export const leftToSpend = monthlyBudgeted - monthlySpending;

export const totalGiving = budget
  .filter((b) => b.group === "Giving")
  .reduce((s, b) => s + b.actual, 0);

export const givingRate = monthlyIncome > 0 ? totalGiving / monthlyIncome : 0;

export const spendingByCategory = budget
  .filter((b) => b.group !== "Income" && b.actual > 0)
  .map((b) => ({ name: b.name, emoji: b.emoji, amount: b.actual, group: b.group }))
  .sort((a, b) => b.amount - a.amount);
