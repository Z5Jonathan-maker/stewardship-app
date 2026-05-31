import { NextResponse } from "next/server";
import type { AccountBase } from "plaid";
import { getPlaidClient } from "@/lib/plaid";
import type { Account, AccountType } from "@/lib/mock-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Map Plaid's account taxonomy onto our AccountType. */
function mapType(a: AccountBase): AccountType {
  const t = a.type;
  const sub = a.subtype ?? "";
  if (t === "credit") return "credit";
  if (t === "loan") return "loan";
  if (t === "investment") return "investment";
  if (t === "depository") return sub === "savings" ? "savings" : "checking";
  return "checking";
}

export async function POST(request: Request) {
  const client = getPlaidClient();
  if (!client) {
    return NextResponse.json({ error: "plaid_unavailable" }, { status: 503 });
  }

  let publicToken: string;
  let institution = "Bank";
  try {
    const body = await request.json();
    publicToken = String(body?.public_token ?? "");
    if (body?.institution) institution = String(body.institution);
    if (!publicToken) throw new Error("missing public_token");
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    // Exchange the short-lived public token for a long-lived access token.
    // NOTE: in production this access_token is a secret and must be stored
    // server-side (DB), keyed to the authenticated user — never sent to the
    // browser. For this keyless demo we use it immediately and discard it.
    const exchange = await client.itemPublicTokenExchange({ public_token: publicToken });
    const accessToken = exchange.data.access_token;

    const accountsResp = await client.accountsGet({ access_token: accessToken });
    const accounts: Account[] = accountsResp.data.accounts.map((a) => {
      const type = mapType(a);
      const isLiability = type === "credit" || type === "loan";
      const balance =
        (isLiability
          ? -(a.balances.current ?? 0)
          : a.balances.available ?? a.balances.current ?? 0) || 0;
      return {
        id: `plaid_${a.account_id}`,
        name: a.name,
        institution,
        type,
        mask: a.mask ?? "0000",
        balance,
      };
    });

    return NextResponse.json({ accounts });
  } catch (err) {
    console.error("Plaid exchange failed:", err);
    return NextResponse.json({ error: "plaid_error" }, { status: 502 });
  }
}
