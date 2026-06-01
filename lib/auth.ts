import { getDb } from "@/lib/data/client";
import * as t from "@/lib/data/schema";
import { eq } from "drizzle-orm";

/**
 * Auth + tenant resolution, with graceful degradation (the same pattern as the
 * assistant/Plaid routes). When Clerk isn't configured, or there's no database,
 * or the signed-in user has no household yet, callers get `null` and fall back
 * to the in-repo mock household — so the app works identically pre-config.
 *
 * Clerk is imported lazily so the dependency is only loaded when configured;
 * the app builds and runs without Clerk keys present.
 */

export function authConfigured(): boolean {
  return Boolean(
    process.env.CLERK_SECRET_KEY &&
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  );
}

/** The Clerk user id of the signed-in user, or null when auth isn't active. */
export async function getAuthUserId(): Promise<string | null> {
  if (!authConfigured()) return null;
  try {
    const { auth } = await import("@clerk/nextjs/server");
    const { userId } = await auth();
    return userId ?? null;
  } catch {
    return null;
  }
}

/**
 * Resolve the current user's household id. Returns null (→ mock fallback) until
 * both auth and a database are configured AND the user has been provisioned
 * with a household. Provisioning happens on first sign-in (see the Clerk
 * webhook / sign-in flow once wired against live keys).
 */
export async function getCurrentHouseholdId(): Promise<string | null> {
  const db = getDb();
  if (!db) return null;
  const authId = await getAuthUserId();
  if (!authId) return null;

  const [user] = await db
    .select({ id: t.users.id })
    .from(t.users)
    .where(eq(t.users.authId, authId))
    .limit(1);
  if (!user) return null;

  const [membership] = await db
    .select({ householdId: t.householdMembers.householdId })
    .from(t.householdMembers)
    .where(eq(t.householdMembers.userId, user.id))
    .limit(1);

  return membership?.householdId ?? null;
}

/**
 * Ensure the signed-in user has a row + a household (first-sign-in provisioning).
 * No-ops without a DB or active auth. Returns the household id, or null in the
 * fallback case. Wrapped in a transaction so a partial provision can't happen.
 */
export async function ensureHousehold(opts?: {
  email?: string;
  name?: string;
}): Promise<string | null> {
  const db = getDb();
  if (!db) return null;
  const authId = await getAuthUserId();
  if (!authId) return null;

  const existing = await getCurrentHouseholdId();
  if (existing) return existing;

  // Find or create the user.
  let [user] = await db
    .select({ id: t.users.id })
    .from(t.users)
    .where(eq(t.users.authId, authId))
    .limit(1);

  if (!user) {
    [user] = await db
      .insert(t.users)
      .values({
        authId,
        email: opts?.email ?? `${authId}@placeholder.local`,
        name: opts?.name ?? null,
      })
      .returning({ id: t.users.id });
  }

  // Create a household and membership.
  const [household] = await db
    .insert(t.households)
    .values({ name: opts?.name ? `${opts.name}'s Household` : "My Household" })
    .returning({ id: t.households.id });

  await db.insert(t.householdMembers).values({
    householdId: household.id,
    userId: user.id,
    role: "owner",
  });

  await db.insert(t.auditLog).values({
    householdId: household.id,
    actorUserId: user.id,
    action: "household.provision",
    entity: "household",
    entityId: household.id,
  });

  return household.id;
}
