import { Inngest } from "inngest";

/**
 * Inngest client for durable, retryable background work — chiefly Plaid
 * transaction sync, which is long-running and webhook-driven (serverless
 * request handlers time out; Inngest functions don't). Inert without
 * INNGEST_EVENT_KEY: the serve endpoint registers but has nothing to call.
 */
export const inngest = new Inngest({ id: "unite-financial" });

export function inngestConfigured(): boolean {
  return Boolean(process.env.INNGEST_EVENT_KEY && process.env.INNGEST_SIGNING_KEY);
}
