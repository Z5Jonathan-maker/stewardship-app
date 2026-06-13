import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import type { PlaidApi } from "plaid";
import { getDb } from "@/lib/data/client";
import { getPlaidClient } from "@/lib/plaid";
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
 * The body is trusted only after verifying Plaid's `Plaid-Verification` JWT
 * (ES256) against the body's SHA-256 — otherwise anyone who learns the URL
 * could trigger sync work. Verification needs a configured Plaid client (to
 * fetch the rotating verification key), so we reject when Plaid is absent.
 */

// Small in-process cache of verification keys by kid. Plaid rotates keys
// rarely; caching avoids a key fetch on every webhook.
const keyCache = new Map<string, crypto.KeyObject>();

function b64urlJson(segment: string): Record<string, unknown> {
  return JSON.parse(Buffer.from(segment, "base64url").toString("utf8"));
}

/**
 * Verify a Plaid webhook per https://plaid.com/docs/api/webhooks/webhook-verification.
 * Returns true only when the JWT is a fresh ES256 signature over a payload whose
 * `request_body_sha256` matches the raw body.
 */
async function verifyPlaidWebhook(
  rawBody: string,
  jwt: string | null,
  plaid: PlaidApi
): Promise<boolean> {
  if (!jwt) return false;
  const parts = jwt.split(".");
  if (parts.length !== 3) return false;
  const [headerB64, payloadB64, sigB64] = parts;

  let header: Record<string, unknown>;
  try {
    header = b64urlJson(headerB64);
  } catch {
    return false;
  }
  if (header.alg !== "ES256" || typeof header.kid !== "string") return false;
  const kid = header.kid;

  let publicKey = keyCache.get(kid);
  if (!publicKey) {
    const resp = await plaid.webhookVerificationKeyGet({ key_id: kid });
    const jwk = resp.data.key;
    if (jwk.expired_at !== null) return false; // rotated-out key — reject
    publicKey = crypto.createPublicKey({
      key: { kty: jwk.kty, crv: jwk.crv, x: jwk.x, y: jwk.y } as JsonWebKey,
      format: "jwk",
    });
    keyCache.set(kid, publicKey);
  }

  // ES256 JWT signatures are raw r||s (IEEE P1363), not DER.
  const valid = crypto.verify(
    "sha256",
    Buffer.from(`${headerB64}.${payloadB64}`),
    { key: publicKey, dsaEncoding: "ieee-p1363" },
    Buffer.from(sigB64, "base64url")
  );
  if (!valid) return false;

  let payload: Record<string, unknown>;
  try {
    payload = b64urlJson(payloadB64);
  } catch {
    return false;
  }
  // Reject stale tokens (replay window): Plaid recommends <= 5 minutes.
  if (typeof payload.iat !== "number" || Date.now() / 1000 - payload.iat > 300) {
    return false;
  }
  const expected = String(payload.request_body_sha256 ?? "");
  const computed = crypto.createHash("sha256").update(rawBody).digest("hex");
  if (expected.length !== computed.length) return false;
  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(expected));
}

export async function POST(request: Request) {
  // Read the raw body once — the SHA-256 check must run over the exact bytes
  // Plaid signed, so we parse from the same string rather than request.json().
  const rawBody = await request.text();
  let body: { webhook_type?: string; webhook_code?: string; item_id?: string };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const plaid = getPlaidClient();
  if (!plaid) {
    // Without Plaid configured there's no key to verify against — and no real
    // Plaid webhook can exist — so refuse rather than trust an unsigned body.
    return NextResponse.json({ error: "plaid_unavailable" }, { status: 503 });
  }

  const verified = await verifyPlaidWebhook(
    rawBody,
    request.headers.get("plaid-verification"),
    plaid
  ).catch(() => false);
  if (!verified) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  const db = getDb();
  if (!db) return NextResponse.json({ ok: true, note: "no db" });

  if (body.webhook_type === "TRANSACTIONS" && body.item_id) {
    // Resolve Plaid's item_id to our row via the stored plaid_item_id, then
    // hand the long-running sync to Inngest keyed by our own id.
    const [item] = await db
      .select({ id: t.plaidItems.id })
      .from(t.plaidItems)
      .where(eq(t.plaidItems.plaidItemId, body.item_id))
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
