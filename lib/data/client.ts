import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { neon } from "@neondatabase/serverless";
import { Pool } from "pg";
import * as schema from "@/lib/data/schema";

/**
 * Lazily-constructed Drizzle client. Returns null when DATABASE_URL isn't set,
 * so the app builds and runs against the mock-data fallback (same graceful
 * degradation as the assistant/Plaid routes).
 *
 * Driver selection is by host: Neon/Vercel/Supabase pooled endpoints use the
 * HTTP driver (edge-friendly, no TCP); any other Postgres (local, RDS, plain)
 * uses node-postgres. This keeps us portable — local dev and production behave
 * identically through the same `DB` interface.
 */
/**
 * Drizzle DB type. Both drivers expose the same query builder for our usage;
 * we type against the node-postgres flavor and the Neon client is structurally
 * compatible at the call sites we use (select/insert/update/delete).
 */
export type DB = ReturnType<typeof drizzlePg<typeof schema>>;

let cached: DB | null = null;

function isNeonHost(url: string): boolean {
  return /\.neon\.tech|\.vercel-storage\.com|pooler\.supabase\.com/.test(url);
}

export function getDb(): DB | null {
  if (cached) return cached;
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  cached = (
    isNeonHost(url)
      ? drizzleNeon(neon(url), { schema })
      : drizzlePg(new Pool({ connectionString: url }), { schema })
  ) as DB;
  return cached;
}

/** True when a live database is configured. */
export function hasDb(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export { schema };
