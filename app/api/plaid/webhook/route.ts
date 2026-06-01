import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/data/client";
import * as t from "@/lib/data/schema";
import { inngest } from "@/lib/inngest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Plaid webhook receiver. On SYNC_UPDATES_AVAILABLE, emit a durable
 * `plaid/sync.requested` event so the Inngest function does the (long-running)
 * transaction sync — keeping this handler fast. Idempotency lives in the
 * upserts, so redelivery is safe.
 *
 * Signature verification (Plaid-Verification JWT) belongs here before trusting
 * the body; wired once PLAID keys + the webhook secret are configured.
 */
export async function POST(request: Request) {
  let body: { webhook_type?: string; webhook_code?: string; item_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const db = getDb();
  if (!db) return NextResponse.json({ ok: true, note: "no db" });

  if (body.webhook_type === "TRANSACTIONS" && body.item_id) {
    // Map Plaid's item_id to our plaid_items row. (We store our own id; a
    // production setup also persists the Plaid item_id for this lookup.)
    const [item] = await db
      .select({ id: t.plaidItems.id })
      .from(t.plaidItems)
      .where(eq(t.plaidItems.id, body.item_id))
      .limit(1);
    if (item) {
      await inngest.send({
        name: "plaid/sync.requested",
        data: { plaidItemId: item.id },
      });
    }
  }

  return NextResponse.json({ ok: true });
}
