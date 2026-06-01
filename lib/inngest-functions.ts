import { inngest } from "@/lib/inngest";
import { getPlaidClient } from "@/lib/plaid";
import { getDb } from "@/lib/data/client";
import * as t from "@/lib/data/schema";
import { eq } from "drizzle-orm";
import {
  getAccessToken,
  setSyncCursor,
  upsertAccounts,
  upsertTransactions,
  type NormalizedAccount,
  type NormalizedTransaction,
} from "@/lib/data/plaid-repo";
import type { AccountBase, Transaction as PlaidTxn } from "plaid";
import type { AccountType } from "@/lib/mock-data";

function mapType(a: AccountBase): AccountType {
  const ty = a.type;
  const sub = a.subtype ?? "";
  if (ty === "credit") return "credit";
  if (ty === "loan") return "loan";
  if (ty === "investment") return "investment";
  if (ty === "depository") return sub === "savings" ? "savings" : "checking";
  return "checking";
}

/**
 * Durable Plaid transaction sync. Triggered on item link and on Plaid's
 * SYNC_UPDATES_AVAILABLE webhook. Pages through the transactionsSync cursor and
 * upserts accounts + transactions idempotently (so redelivery never
 * double-applies), persisting the cursor as it goes.
 */
export const syncPlaidItem = inngest.createFunction(
  {
    id: "sync-plaid-item",
    retries: 4,
    triggers: [{ event: "plaid/item.linked" }, { event: "plaid/sync.requested" }],
  },
  async ({ event, step }) => {
    const plaidItemId = event.data.plaidItemId;
    const db = getDb();
    const plaid = getPlaidClient();
    if (!db || !plaid) return { skipped: "no db or plaid" };

    const [item] = await db
      .select({ householdId: t.plaidItems.householdId, cursor: t.plaidItems.syncCursor, institution: t.plaidItems.institution })
      .from(t.plaidItems)
      .where(eq(t.plaidItems.id, plaidItemId))
      .limit(1);
    if (!item) return { skipped: "item not found" };

    const accessToken = await getAccessToken(plaidItemId);
    if (!accessToken) return { skipped: "no access token" };

    let cursor = item.cursor ?? undefined;
    let added = 0;

    // Refresh balances first.
    const accountsResp = await step.run("accounts-get", async () =>
      plaid.accountsGet({ access_token: accessToken })
    );
    const normAccts: NormalizedAccount[] = accountsResp.data.accounts.map((a) => {
      const type = mapType(a);
      const isLiab = type === "credit" || type === "loan";
      const balance =
        (isLiab ? -(a.balances.current ?? 0) : a.balances.available ?? a.balances.current ?? 0) || 0;
      return {
        plaidAccountId: a.account_id,
        name: a.name,
        institution: item.institution,
        type,
        mask: a.mask ?? null,
        balanceDollars: balance,
      };
    });
    const acctMap = await upsertAccounts(item.householdId, plaidItemId, normAccts);

    // Page through transaction updates.
    for (let page = 0; page < 50; page++) {
      const resp = await step.run(`txn-sync-${page}`, async () =>
        plaid.transactionsSync({ access_token: accessToken, cursor })
      );
      const norm: NormalizedTransaction[] = resp.data.added.map((tx: PlaidTxn) => ({
        plaidTransactionId: tx.transaction_id,
        plaidAccountId: tx.account_id,
        merchant: tx.merchant_name ?? tx.name,
        category: tx.personal_finance_category?.primary ?? "Other",
        amountDollars: -tx.amount, // Plaid: positive = money out; we invert
        date: tx.date,
        pending: tx.pending,
      }));
      added += await upsertTransactions(item.householdId, acctMap, norm);
      cursor = resp.data.next_cursor;
      await setSyncCursor(plaidItemId, cursor);
      if (!resp.data.has_more) break;
    }

    return { added, household: item.householdId };
  }
);

export const functions = [syncPlaidItem];
