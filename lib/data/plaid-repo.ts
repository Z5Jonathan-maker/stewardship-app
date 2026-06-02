import { eq, sql } from "drizzle-orm";
import { getDb } from "@/lib/data/client";
import * as t from "@/lib/data/schema";
import { encryptSecret, decryptSecret } from "@/lib/crypto";
import { toCents } from "@/lib/utils";
import type { AccountType } from "@/lib/mock-data";

/**
 * Persistence for Plaid items, accounts, and transactions. Every write is
 * household-scoped and idempotent (upsert on the Plaid id) so webhook
 * redelivery can't double-apply. The access token is stored only as a KMS
 * envelope; the plaintext is decrypted on demand inside server-side sync.
 */

export interface NormalizedAccount {
  plaidAccountId: string;
  name: string;
  institution: string;
  type: AccountType;
  mask: string | null;
  balanceDollars: number;
}

export interface NormalizedTransaction {
  plaidTransactionId: string;
  plaidAccountId: string;
  merchant: string;
  category: string;
  amountDollars: number; // negative = spend, positive = income
  date: string; // yyyy-mm-dd
  pending: boolean;
}

/** Store a freshly-linked Plaid item with its encrypted access token. */
export async function savePlaidItem(args: {
  householdId: string;
  plaidItemId: string;
  institution: string;
  accessToken: string;
  syncCursor?: string;
}): Promise<string | null> {
  const db = getDb();
  if (!db) return null;
  const env = encryptSecret(args.accessToken);
  const [row] = await db
    .insert(t.plaidItems)
    .values({
      householdId: args.householdId,
      plaidItemId: args.plaidItemId,
      institution: args.institution,
      accessTokenCiphertext: env.ciphertext,
      encryptedDek: env.wrappedDek,
      syncCursor: args.syncCursor ?? null,
    })
    .returning({ id: t.plaidItems.id });

  await db.insert(t.auditLog).values({
    householdId: args.householdId,
    action: "plaid.item.linked",
    entity: "plaid_item",
    entityId: row.id,
    metadata: { institution: args.institution },
  });
  return row.id;
}

/** Decrypt and return a Plaid item's access token (server-side only). */
export async function getAccessToken(plaidItemId: string): Promise<string | null> {
  const db = getDb();
  if (!db) return null;
  const [row] = await db
    .select({
      ciphertext: t.plaidItems.accessTokenCiphertext,
      dek: t.plaidItems.encryptedDek,
    })
    .from(t.plaidItems)
    .where(eq(t.plaidItems.id, plaidItemId))
    .limit(1);
  if (!row) return null;
  return decryptSecret({ ciphertext: row.ciphertext, wrappedDek: row.dek });
}

export async function setSyncCursor(plaidItemId: string, cursor: string) {
  const db = getDb();
  if (!db) return;
  await db
    .update(t.plaidItems)
    .set({ syncCursor: cursor })
    .where(eq(t.plaidItems.id, plaidItemId));
}

/**
 * Upsert accounts for a household, returning a map of plaidAccountId -> our id.
 * Idempotent on plaid_account_id (unique).
 */
export async function upsertAccounts(
  householdId: string,
  plaidItemId: string,
  accts: NormalizedAccount[]
): Promise<Map<string, string>> {
  const db = getDb();
  const map = new Map<string, string>();
  if (!db) return map;

  for (const a of accts) {
    const [row] = await db
      .insert(t.accounts)
      .values({
        householdId,
        plaidItemId,
        plaidAccountId: a.plaidAccountId,
        name: a.name,
        institution: a.institution,
        type: a.type,
        mask: a.mask,
        balanceCents: toCents(a.balanceDollars),
      })
      .onConflictDoUpdate({
        target: t.accounts.plaidAccountId,
        set: {
          balanceCents: toCents(a.balanceDollars),
          name: a.name,
          updatedAt: sql`now()`,
        },
      })
      .returning({ id: t.accounts.id });
    map.set(a.plaidAccountId, row.id);
  }
  return map;
}

/** Upsert transactions; idempotent on plaid_transaction_id (unique). */
export async function upsertTransactions(
  householdId: string,
  accountIdByPlaid: Map<string, string>,
  txns: NormalizedTransaction[]
): Promise<number> {
  const db = getDb();
  if (!db) return 0;
  let applied = 0;
  for (const tx of txns) {
    const accountId = accountIdByPlaid.get(tx.plaidAccountId);
    if (!accountId) continue;
    await db
      .insert(t.transactions)
      .values({
        householdId,
        accountId,
        plaidTransactionId: tx.plaidTransactionId,
        merchant: tx.merchant,
        category: tx.category,
        amountCents: toCents(tx.amountDollars),
        date: tx.date,
        pending: tx.pending,
      })
      .onConflictDoUpdate({
        target: t.transactions.plaidTransactionId,
        set: {
          amountCents: toCents(tx.amountDollars),
          pending: tx.pending,
          merchant: tx.merchant,
          category: tx.category,
        },
      });
    applied++;
  }
  return applied;
}
