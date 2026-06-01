import { eq, inArray } from "drizzle-orm";
import { getDb } from "@/lib/data/client";
import * as t from "@/lib/data/schema";

/**
 * GDPR / CCPA hard-delete (Phase 1, step 8). Removes a user, the households
 * they solely own, and all child data. FKs are ON DELETE CASCADE, so deleting
 * a household removes its accounts/transactions/budgets/goals/seeds/plaid_items;
 * we additionally purge plaintext-free audit rows and the user record.
 *
 * Returns a summary for the deletion receipt. No-op (null) without a database.
 */
export async function deleteUserAndData(authId: string): Promise<{
  userId: string;
  householdsDeleted: number;
} | null> {
  const db = getDb();
  if (!db) return null;

  const [user] = await db
    .select({ id: t.users.id })
    .from(t.users)
    .where(eq(t.users.authId, authId))
    .limit(1);
  if (!user) return null;

  // Households where this user is the sole owner are deleted entirely;
  // households shared with others only lose this membership.
  const memberships = await db
    .select({ householdId: t.householdMembers.householdId, role: t.householdMembers.role })
    .from(t.householdMembers)
    .where(eq(t.householdMembers.userId, user.id));

  const ownedHouseholdIds: string[] = [];
  for (const m of memberships) {
    const members = await db
      .select({ userId: t.householdMembers.userId })
      .from(t.householdMembers)
      .where(eq(t.householdMembers.householdId, m.householdId));
    const soleOwner = m.role === "owner" && members.length === 1;
    if (soleOwner) ownedHouseholdIds.push(m.householdId);
  }

  if (ownedHouseholdIds.length > 0) {
    // Cascade removes all child rows; also clear audit history for these.
    await db.delete(t.auditLog).where(inArray(t.auditLog.householdId, ownedHouseholdIds));
    await db.delete(t.households).where(inArray(t.households.id, ownedHouseholdIds));
  }

  // Remove remaining memberships, then the user.
  await db.delete(t.householdMembers).where(eq(t.householdMembers.userId, user.id));
  await db.delete(t.users).where(eq(t.users.id, user.id));

  return { userId: user.id, householdsDeleted: ownedHouseholdIds.length };
}
