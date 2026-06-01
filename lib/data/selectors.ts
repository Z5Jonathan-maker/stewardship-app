import { eq } from "drizzle-orm";
import { getDb } from "@/lib/data/client";
import * as t from "@/lib/data/schema";
import { fromCents } from "@/lib/utils";
import {
  accounts as mockAccounts,
  transactions as mockTransactions,
  goals as mockGoals,
  type Account,
  type Transaction,
  type Goal,
} from "@/lib/mock-data";

/**
 * The seam between the UI and the data source. Returns the SAME shapes the
 * mock-data module exports (dollars, not cents), so pages and stewardship
 * features are unchanged whether reading from Postgres or the seed.
 *
 * When DATABASE_URL is unset, every selector falls back to the in-repo mock
 * household — so the app builds and runs with no database, exactly as today.
 */

export interface HouseholdSnapshot {
  accounts: Account[];
  transactions: Transaction[];
  goals: Goal[];
}

const MOCK_SNAPSHOT: HouseholdSnapshot = {
  accounts: mockAccounts,
  transactions: mockTransactions,
  goals: mockGoals,
};

/** Map DB account rows (cents) to the UI Account shape (dollars). */
function rowToAccount(r: typeof t.accounts.$inferSelect): Account {
  return {
    id: r.id,
    name: r.name,
    institution: r.institution,
    type: r.type as Account["type"],
    mask: r.mask ?? "",
    balance: fromCents(r.balanceCents),
  };
}

function rowToTransaction(r: typeof t.transactions.$inferSelect): Transaction {
  return {
    id: r.id,
    date: r.date,
    merchant: r.merchant,
    category: r.category,
    account: r.accountId,
    amount: fromCents(r.amountCents),
    pending: r.pending,
  };
}

function rowToGoal(r: typeof t.goals.$inferSelect): Goal {
  return {
    id: r.id,
    name: r.name,
    emoji: r.emoji ?? "",
    target: fromCents(r.targetCents),
    saved: fromCents(r.savedCents),
    monthly: fromCents(r.monthlyCents),
    targetDate: r.targetDate ?? "",
  };
}

/**
 * Load a household's accounts, transactions, and goals. Falls back to the mock
 * household when there is no database (or the household has no rows yet).
 */
export async function getHouseholdSnapshot(
  householdId?: string
): Promise<HouseholdSnapshot> {
  const db = getDb();
  if (!db || !householdId) return MOCK_SNAPSHOT;

  const [acctRows, txnRows, goalRows] = await Promise.all([
    db.select().from(t.accounts).where(eq(t.accounts.householdId, householdId)),
    db.select().from(t.transactions).where(eq(t.transactions.householdId, householdId)),
    db.select().from(t.goals).where(eq(t.goals.householdId, householdId)),
  ]);

  if (acctRows.length === 0 && txnRows.length === 0) return MOCK_SNAPSHOT;

  return {
    accounts: acctRows.map(rowToAccount),
    transactions: txnRows.map(rowToTransaction),
    goals: goalRows.map(rowToGoal),
  };
}
