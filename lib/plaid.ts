import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

/**
 * Returns a configured Plaid client, or null when credentials aren't set
 * (e.g. the public demo). Callers return 503 on null so the UI falls back to
 * the local mock connect flow — the same graceful-degradation pattern as the
 * assistant route.
 *
 * Set PLAID_CLIENT_ID + PLAID_SECRET (and optionally PLAID_ENV=sandbox|
 * production) to enable the real flow. See .env.example.
 */
export function getPlaidClient(): PlaidApi | null {
  const clientId = process.env.PLAID_CLIENT_ID;
  const secret = process.env.PLAID_SECRET;
  if (!clientId || !secret) return null;

  const env = (process.env.PLAID_ENV ?? "sandbox") as keyof typeof PlaidEnvironments;
  const configuration = new Configuration({
    basePath: PlaidEnvironments[env] ?? PlaidEnvironments.sandbox,
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": clientId,
        "PLAID-SECRET": secret,
      },
    },
  });
  return new PlaidApi(configuration);
}
