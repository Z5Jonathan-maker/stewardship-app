import {
  pgTable,
  uuid,
  text,
  bigint,
  boolean,
  date,
  timestamp,
  bigserial,
  jsonb,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";

/**
 * Phase 1 schema (see ARCHITECTURE.md). All money columns are integer CENTS
 * (bigint, stored as JS number via { mode: "number" }). Every domain table
 * carries household_id (the tenant boundary, enforced by RLS + the data layer).
 *
 * Not yet migrated to a live database — this is the design of record the
 * `lib/data` repositories will target once DATABASE_URL is set.
 */

const cents = (name: string) => bigint(name, { mode: "number" });

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  authId: text("auth_id").unique().notNull(), // Clerk user id; our table is source of truth
  email: text("email").unique().notNull(),
  name: text("name"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const households = pgTable("households", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const householdMembers = pgTable(
  "household_members",
  {
    householdId: uuid("household_id")
      .references(() => households.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    role: text("role").notNull().default("member"), // owner | member
  },
  (t) => ({ pk: primaryKey({ columns: [t.householdId, t.userId] }) })
);

export const plaidItems = pgTable("plaid_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  householdId: uuid("household_id")
    .references(() => households.id, { onDelete: "cascade" })
    .notNull(),
  institution: text("institution").notNull(),
  // KMS envelope-encrypted access token + wrapped data-encryption key.
  // Never plaintext, never returned to the client.
  accessTokenCiphertext: text("access_token_ciphertext").notNull(),
  encryptedDek: text("encrypted_dek").notNull(),
  syncCursor: text("sync_cursor"),
  status: text("status").notNull().default("active"), // active | error | revoked
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    householdId: uuid("household_id")
      .references(() => households.id, { onDelete: "cascade" })
      .notNull(),
    plaidItemId: uuid("plaid_item_id").references(() => plaidItems.id, {
      onDelete: "set null",
    }),
    plaidAccountId: text("plaid_account_id").unique(),
    name: text("name").notNull(),
    institution: text("institution").notNull(),
    type: text("type").notNull(), // checking|savings|credit|investment|loan|property
    mask: text("mask"),
    balanceCents: cents("balance_cents").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({ byHousehold: index("accounts_household_idx").on(t.householdId) })
);

export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    householdId: uuid("household_id")
      .references(() => households.id, { onDelete: "cascade" })
      .notNull(),
    accountId: uuid("account_id")
      .references(() => accounts.id, { onDelete: "cascade" })
      .notNull(),
    plaidTransactionId: text("plaid_transaction_id").unique(), // dedupe key for sync idempotency
    merchant: text("merchant").notNull(),
    category: text("category").notNull(),
    amountCents: cents("amount_cents").notNull(), // negative = spend, positive = income
    date: date("date").notNull(),
    pending: boolean("pending").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({ byHouseholdDate: index("transactions_household_date_idx").on(t.householdId, t.date) })
);

export const budgets = pgTable(
  "budgets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    householdId: uuid("household_id")
      .references(() => households.id, { onDelete: "cascade" })
      .notNull(),
    category: text("category").notNull(),
    group: text("group").notNull(), // Income|Giving|Fixed|Flexible|Savings
    budgetedCents: cents("budgeted_cents").notNull(),
    month: date("month").notNull(), // first of month
  },
  (t) => ({ byHouseholdMonth: index("budgets_household_month_idx").on(t.householdId, t.month) })
);

export const goals = pgTable("goals", {
  id: uuid("id").primaryKey().defaultRandom(),
  householdId: uuid("household_id")
    .references(() => households.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  emoji: text("emoji"),
  targetCents: cents("target_cents").notNull(),
  savedCents: cents("saved_cents").notNull().default(0),
  monthlyCents: cents("monthly_cents").notNull().default(0),
  targetDate: date("target_date"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const seeds = pgTable("seeds", {
  id: uuid("id").primaryKey().defaultRandom(),
  householdId: uuid("household_id")
    .references(() => households.id, { onDelete: "cascade" })
    .notNull(),
  date: date("date").notNull(),
  sownInto: text("sown_into").notNull(),
  amountCents: cents("amount_cents").notNull(),
  believingFor: text("believing_for").notNull(),
  scripture: text("scripture"),
  harvest: text("harvest"),
  harvestDate: date("harvest_date"),
});

export const auditLog = pgTable("audit_log", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  householdId: uuid("household_id"),
  actorUserId: uuid("actor_user_id"),
  action: text("action").notNull(), // e.g. transaction.create, plaid.link
  entity: text("entity"),
  entityId: uuid("entity_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
