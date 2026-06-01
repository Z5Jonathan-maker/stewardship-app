import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/lib/data/schema";

/**
 * Lazily-constructed Drizzle client over Neon's HTTP driver. Returns null when
 * DATABASE_URL isn't set, so the app builds and runs against the mock-data
 * fallback (same graceful-degradation pattern as the assistant/Plaid routes).
 * Real data flows the moment DATABASE_URL is configured.
 */
export type DB = NeonHttpDatabase<typeof schema>;

let cached: DB | null = null;

export function getDb(): DB | null {
  if (cached) return cached;
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  cached = drizzle(neon(url), { schema });
  return cached;
}

/** True when a live database is configured. */
export function hasDb(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export { schema };
