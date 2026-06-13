import { NextResponse } from "next/server";
import { CountryCode, Products } from "plaid";
import { getPlaidClient } from "@/lib/plaid";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const client = getPlaidClient();
  if (!client) {
    // No credentials configured — the client falls back to the mock flow.
    return NextResponse.json({ error: "plaid_unavailable" }, { status: 503 });
  }

  try {
    const resp = await client.linkTokenCreate({
      user: { client_user_id: "demo-household" }, // per-user id once auth lands
      client_name: "uniFi",
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: "en",
    });
    return NextResponse.json({ link_token: resp.data.link_token });
  } catch (err) {
    console.error("Plaid linkTokenCreate failed:", err);
    return NextResponse.json({ error: "plaid_error" }, { status: 502 });
  }
}
