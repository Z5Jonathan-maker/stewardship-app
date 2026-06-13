# UniFi — Backend Architecture

> Status: **blueprint / not yet implemented.** This is the design of record for
> the backend (Phase 1). Review before scaffolding. The frontend it sits under
> is already built and reads everything through `lib/mock-data.ts` selectors and
> the client `household-store` — the backend's job is to satisfy those exact
> shapes against real data, so the UI and every stewardship feature (Roadmap,
> Seed & Harvest, Debt Freedom, Firstfruits) keep working unchanged.

## Guiding principle

A **modular monolith on portable, standards-based primitives**, with clean
internal seams. Scaling means swapping infrastructure *under stable interfaces*,
never rewriting product code. We avoid both failure modes: the magic box you
can't leave (Firestore) and premature microservices nobody needs. Stripe and
Notion ran monoliths past millions of users; we scale the database and the
workers, not the architecture diagram.

## The stack

| Layer | Choice | Rationale |
|---|---|---|
| Database | **PostgreSQL** | Money is relational; ledgers need ACID. Never a document store for transactions. |
| DB host | **Neon** (serverless Postgres) | Pure Postgres = zero lock-in; DB branching per PR; scales to zero. Lift-and-shift to Aurora/RDS later with no code change. |
| ORM | **Drizzle** | SQL-first, serverless/edge-friendly, end-to-end type-safe with our TS. Migrations in version control (Drizzle Kit). |
| Auth | **Clerk** | MFA, session hardening, device mgmt done correctly. Our own `users` table stays source of truth (keyed by `auth_id`) so Clerk is replaceable via data migration, not rewrite. |
| Jobs / webhooks | **Inngest** | Plaid pushes updates via webhooks; sync is long-running and serverless functions time out. Durable, retryable, scheduled functions without running a queue. |
| Secret encryption | **Envelope encryption (KMS)** | Plaid `access_token` is a bank credential — encrypted at rest, never plaintext, never sent to the browser. |
| App hosting | **Vercel** | Natural for Next.js now; portable stack means we can leave later if costs bite. |

Everything lives **inside the Next.js app** (server actions + route handlers) as
a modular monolith. No separate backend service until a proven reason to split
the sync engine out (Phase 3).

## Non-negotiables (true regardless of vendor)

1. **Money is integer cents (`bigint`), never floats.** The current mock data
   uses floats (`8420.16`) — demo-only. Real columns store cents (`842016`).
   Formatting divides by 100 at the edge. This is the #1 silent fintech bug.
2. **Plaid `access_token` encrypted at rest** (KMS envelope encryption). Never a
   plaintext column; never returned to the client.
3. **Webhook-driven sync with idempotency keys.** Plaid redelivers events;
   every money mutation must be idempotent (`plaid_sync_cursor` + dedupe on
   `plaid_transaction_id`).
4. **Append-only audit trail** (`audit_log`) for every money-affecting change.
   Think ledger, not CRUD.
5. **Hard tenant isolation** — `household_id` on every domain row, enforced in
   the data-access layer and Postgres Row-Level Security. A leaked household is
   an extinction event.
6. **Real data-deletion path** (GDPR/CCPA) + PII handling from day one.
7. **SOC 2 *posture* early** — not the audit, the habits: audit logs, least
   privilege, encrypted secrets, no secrets in client bundles.

## Data model (Phase 1)

All money columns are `bigint` **cents**. All tables carry `household_id` except
`users`/`households` themselves. `created_at`/`updated_at` on everything.

```
users
  id              uuid pk
  auth_id         text unique         -- Clerk user id; our table is source of truth
  email           text unique
  name            text
  created_at      timestamptz

households                            -- the tenant boundary
  id              uuid pk
  name            text
  created_at      timestamptz

household_members                     -- many-to-many (couples, shared finances)
  household_id    uuid fk -> households
  user_id         uuid fk -> users
  role            text                -- owner | member
  primary key (household_id, user_id)

plaid_items                           -- one per connected institution login
  id              uuid pk
  household_id    uuid fk
  institution     text
  access_token_ciphertext  bytea      -- KMS-envelope-encrypted; never plaintext
  encrypted_dek            bytea      -- wrapped data-encryption key
  sync_cursor     text                -- Plaid transactions sync cursor
  status          text                -- active | error | revoked
  created_at      timestamptz

accounts
  id              uuid pk
  household_id    uuid fk
  plaid_item_id   uuid fk (nullable)  -- null = manually added
  plaid_account_id text unique (nullable)
  name            text
  institution     text
  type            text                -- checking|savings|credit|investment|loan|property
  mask            text
  balance_cents   bigint
  updated_at      timestamptz

transactions
  id              uuid pk
  household_id    uuid fk
  account_id      uuid fk
  plaid_transaction_id text unique (nullable)  -- dedupe key for sync idempotency
  merchant        text
  category        text
  amount_cents    bigint              -- negative = spend, positive = income
  date            date
  pending         boolean
  created_at      timestamptz

budgets                               -- per household per month
  id              uuid pk
  household_id    uuid fk
  category        text
  group           text                -- Income|Giving|Fixed|Flexible|Savings
  budgeted_cents  bigint
  month           date                -- first of month

goals
  id, household_id, name, emoji, target_cents, saved_cents, monthly_cents,
  target_date, created_at

seeds                                 -- Seed & Harvest journal
  id, household_id, date, sown_into, amount_cents, believing_for,
  scripture, harvest text null, harvest_date date null

audit_log                             -- append-only
  id              bigserial pk
  household_id    uuid
  actor_user_id   uuid
  action          text                -- e.g. transaction.create, plaid.link
  entity          text
  entity_id       uuid
  metadata        jsonb
  created_at      timestamptz
```

Indexes: `(household_id, date)` on transactions; `unique(plaid_transaction_id)`;
`(household_id, month)` on budgets. RLS policy on every domain table keyed to the
current household.

## The seam strategy (why this is low-risk)

The UI never imports the DB. It depends on **selector functions** with the shapes
already defined in `lib/mock-data.ts`. We introduce a data-access layer:

```
lib/data/                      -- new: the only thing that touches the DB
  schema.ts                    -- Drizzle tables (the model above)
  households.ts, accounts.ts, transactions.ts, ...   -- repository fns
  selectors.ts                 -- returns the SAME shapes as today's mock-data
lib/mock-data.ts               -- stays as the seed/demo source + types
```

Pages call `getNetWorth(householdId)` etc. Today those resolve from mock data;
after the swap they resolve from Postgres — **identical return shapes**, so
dashboard/roadmap/debt/giving code is untouched. The `household-store` (optimistic
client state) stays for instant UI, reconciled against server data on load.

Money flows as cents internally; `formatCurrency` already exists at the edge —
we add a single `centsToDollars` boundary so the UI keeps receiving the numbers
it expects during migration, then tighten types.

## Plaid sync flow (Inngest)

1. `POST /api/plaid/exchange` → exchange public_token → **encrypt** access_token
   via KMS → store `plaid_items` row → emit `plaid/item.linked` event.
2. Inngest function on `plaid/item.linked`: initial `transactionsSync`, page
   through cursor, upsert accounts + transactions (idempotent on
   `plaid_transaction_id`), persist `sync_cursor`, write `audit_log`.
3. Plaid `SYNC_UPDATES_AVAILABLE` webhook → verify signature → emit event →
   same Inngest sync function. Idempotency keys prevent double-apply on
   redelivery.
4. Scheduled Inngest cron as a backstop reconcile.

Access tokens are decrypted **only** inside server-side sync functions, used, and
never logged or returned.

## Phased path

- **Phase 1 (now → ~10k users):** Neon + Drizzle + Clerk + Inngest in the Next.js
  monolith on Vercel. Schema above, cents, encrypted tokens, household RLS, audit
  log. Plaid Sandbox → Production.
- **Phase 2 (scale):** Neon pooler + read replicas; move heavy sync workers off
  Vercel if measured need (trivial — portable Postgres + standard TS); add
  Redis/Upstash caching where profiled.
- **Phase 3 (only if proven):** extract the sync engine to its own service;
  evaluate Aurora. Not before real load demands it.

## Build order (Phase 1 checklist)

1. Drizzle schema + Drizzle Kit migrations; Neon connection (pooled + direct).
2. Seed script that loads today's mock household into Postgres (in cents).
3. `lib/data/selectors.ts` matching current shapes; flip pages one at a time.
4. Clerk: middleware, `users`/`households` provisioning on first sign-in, real
   `/login` `/signup`, replace the demo auth.
5. KMS envelope encryption util; encrypt Plaid tokens; persist `plaid_items`.
6. Inngest: item-linked + webhook sync functions, idempotent upserts, audit log.
7. RLS policies + a data-access guard asserting `household_id` on every query.
8. GDPR delete path; e2e + integration tests against a Neon branch in CI.

## Required secrets (Phase 1)

`DATABASE_URL` (Neon pooled) · `DATABASE_URL_UNPOOLED` (migrations) ·
`CLERK_SECRET_KEY` + `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` ·
`PLAID_CLIENT_ID` / `PLAID_SECRET` (already wired) ·
`INNGEST_EVENT_KEY` / `INNGEST_SIGNING_KEY` ·
`KMS_KEY_ID` (+ cloud creds) or a managed KMS binding.
