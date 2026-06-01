/**
 * Seed the database with the demo household (the same data the app shows from
 * mock-data), converted to integer cents. Run after migrating:
 *
 *   DATABASE_URL=... npx tsx scripts/seed.ts
 *
 * Idempotent-ish: it creates one demo household and its rows. Re-running adds
 * another; intended for a fresh database / Neon branch.
 */
import { getDb } from "@/lib/data/client";
import * as t from "@/lib/data/schema";
import { toCents } from "@/lib/utils";
import {
  accounts as mockAccounts,
  transactions as mockTransactions,
  goals as mockGoals,
  budget as mockBudget,
  household as mockHousehold,
} from "@/lib/mock-data";

async function main() {
  const db = getDb();
  if (!db) {
    console.error("DATABASE_URL is not set — nothing to seed.");
    process.exit(1);
  }

  const [household] = await db
    .insert(t.households)
    .values({ name: mockHousehold.name })
    .returning();
  const householdId = household.id;
  console.log(`Created household ${householdId} (${household.name})`);

  // Accounts — keep a map from mock id -> new uuid so transactions can link.
  const acctIdMap = new Map<string, string>();
  for (const a of mockAccounts) {
    const [row] = await db
      .insert(t.accounts)
      .values({
        householdId,
        name: a.name,
        institution: a.institution,
        type: a.type,
        mask: a.mask,
        balanceCents: toCents(a.balance),
      })
      .returning();
    acctIdMap.set(a.id, row.id);
  }
  console.log(`Inserted ${mockAccounts.length} accounts`);

  // Transactions — link to the seeded accounts by name fallback.
  let txnCount = 0;
  for (const tx of mockTransactions) {
    const accountId =
      acctIdMap.get(tx.account) ??
      [...acctIdMap.entries()].find(
        ([mockId]) => mockAccounts.find((a) => a.id === mockId)?.name === tx.account
      )?.[1] ??
      acctIdMap.values().next().value;
    if (!accountId) continue;
    await db.insert(t.transactions).values({
      householdId,
      accountId,
      merchant: tx.merchant,
      category: tx.category,
      amountCents: toCents(tx.amount),
      date: tx.date,
      pending: tx.pending ?? false,
    });
    txnCount++;
  }
  console.log(`Inserted ${txnCount} transactions`);

  // Goals
  for (const g of mockGoals) {
    await db.insert(t.goals).values({
      householdId,
      name: g.name,
      emoji: g.emoji,
      targetCents: toCents(g.target),
      savedCents: toCents(g.saved),
      monthlyCents: toCents(g.monthly),
      targetDate: g.targetDate,
    });
  }
  console.log(`Inserted ${mockGoals.length} goals`);

  // Budgets (current month)
  const month = "2026-06-01";
  for (const b of mockBudget) {
    await db.insert(t.budgets).values({
      householdId,
      category: b.name,
      group: b.group,
      budgetedCents: toCents(b.budgeted),
      month,
    });
  }
  console.log(`Inserted ${mockBudget.length} budget lines`);

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
