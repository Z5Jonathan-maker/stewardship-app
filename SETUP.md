# Going Live — Free Setup Guide

Get UniFi running with **real auth, a real database, and real (sandbox) bank
linking** for **$0**. Three free accounts, ~20 minutes. Each maps to a block in
`.env.local`; the app degrades to the mock/demo when a block is missing, so you
can do these one at a time and watch each light up.

> Copy `.env.example` to `.env.local` first (it's gitignored):
> ```
> cp .env.example .env.local
> ```

---

## 1. Database — Neon (free, ~5 min)

1. Go to **https://neon.tech** → **Sign up** (GitHub login is fastest).
2. **Create a project**: name it `unifi`, pick the region closest to you,
   Postgres 16. Click **Create**.
3. On the project dashboard, find **Connection string** (a "Connect" button or
   the Dashboard widget). You need **two** forms of it:
   - The **pooled** string (host contains `-pooler`) → `DATABASE_URL`
   - The **direct/unpooled** string (no `-pooler`) → `DATABASE_URL_UNPOOLED`
     (toggle "Pooled connection" off to reveal it).
   Both look like:
   `postgresql://USER:PASSWORD@ep-xxx.REGION.aws.neon.tech/neondb?sslmode=require`
4. Paste into `.env.local`:
   ```
   DATABASE_URL=<pooled string>
   DATABASE_URL_UNPOOLED=<direct string>
   ```
5. Create the schema and load the demo household (run from the project root):
   ```
   npm run db:generate     # builds migration SQL from the schema (idempotent)
   npm run db:migrate      # applies it to Neon
   npm run db:seed         # loads the demo household (in cents)
   ```
   `db:migrate`/`db:seed` use the Neon HTTP driver automatically (the client
   detects `*.neon.tech`).
6. Apply Row-Level Security (tenant isolation), once:
   ```
   psql "$DATABASE_URL_UNPOOLED" -f db/rls.sql
   ```
   (If you don't have `psql`, paste the contents of `db/rls.sql` into the Neon
   dashboard's **SQL Editor** and run it.)

✅ The app now reads accounts/transactions/goals from Neon. With no auth yet,
set a dev household so pages render real data locally:
```
# .env.local — get the id from: psql "$DATABASE_URL_UNPOOLED" -c "select id from households limit 1;"
DEV_HOUSEHOLD_ID=<that uuid>
```
(`DEV_HOUSEHOLD_ID` is ignored in production — it's a local convenience only.)

---

## 2. Auth — Clerk (free up to 10,000 users, ~5 min)

1. Go to **https://clerk.com** → **Sign up** → **Create application**.
   Name it `UniFi`, enable **Email** and **Google** sign-in (toggle whichever
   methods you want).
2. On the **API Keys** page, copy the two keys into `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```
3. Restart the dev server. Everything activates automatically when both keys
   are present (all are pass-throughs/demo without them):
   - `/login` and `/signup` render Clerk's real `<SignIn>` / `<SignUp>`,
     brand-styled. Without keys they show the demo form.
   - On the first authenticated visit to any `(app)` page, `ensureHousehold()`
     provisions the user + household + owner membership automatically.

✅ With keys set, a real user can sign up, gets a household on first load, and
every page resolves data for *their* household. (You no longer need
`DEV_HOUSEHOLD_ID` once auth is on — it's only for viewing seeded data without
signing in.)

---

## 3. Bank linking — Plaid Sandbox (free forever, ~5 min)

1. Go to **https://dashboard.plaid.com/signup**. Create an account (no card).
   You start in **Sandbox** automatically.
2. **Team Settings → Keys**: copy **client_id** and the **Sandbox** secret into
   `.env.local`:
   ```
   PLAID_CLIENT_ID=...
   PLAID_SECRET=<sandbox secret>
   PLAID_ENV=sandbox
   ```
3. Restart the dev server. **Accounts → Connect account** now opens **real Plaid
   Link**. In Sandbox, log into any institution with:
   - username **`user_good`**, password **`pass_good`**
   (any MFA code works). Plaid returns fake-but-realistic accounts +
   transactions, which flow through the encrypted-token + sync path into Neon.

✅ Linking a sandbox bank now writes a `plaid_items` row (token encrypted),
upserts accounts, and — once Inngest is set (optional, below) — syncs
transactions.

---

## 4. Optional now — Inngest, KMS, Anthropic

These aren't needed to see auth + DB + bank-linking work; add when ready.

- **Inngest** (durable transaction sync): sign up at **https://inngest.com**,
  create an app, copy `INNGEST_EVENT_KEY` + `INNGEST_SIGNING_KEY` into
  `.env.local`. For local dev you can instead run `npx inngest-cli dev` which
  auto-discovers `app/api/inngest`. Without it, account balances still sync on
  link; only the background transaction backfill waits.
- **Anthropic** (Ask UniFi live answers): `ANTHROPIC_API_KEY` from
  https://console.anthropic.com . Without it the assistant uses the local mock.
- **Real KMS** (production-grade token encryption): set `APP_ENCRYPTION_KEY` to
  a strong random value for now (`openssl rand -base64 32`). For production,
  swap `wrapDek`/`unwrapDek` in `lib/crypto.ts` for AWS KMS / GCP KMS calls
  (the seam is already isolated to those two functions).

---

## Quick reference — what each block unlocks

| Block in `.env.local` | Unlocks | Without it |
|---|---|---|
| `DATABASE_URL` (+ `_UNPOOLED`) | Real per-household data from Postgres | In-repo mock household |
| `DEV_HOUSEHOLD_ID` | Render a specific seeded household locally (no auth) | Mock household |
| Clerk keys | Real sign-in + per-user household resolution | Demo auth form |
| Plaid keys | Real Plaid Link bank connection + encrypted sync | Mock institution picker |
| `INNGEST_*` | Durable background transaction sync | Balances sync on link only |
| `ANTHROPIC_API_KEY` | Live "Ask UniFi" answers | Local stewardship mock |

## Deploying (when ready)

1. Push to GitHub; import the repo on **vercel.com** (Hobby is free to try;
   Pro $20/mo for commercial use).
2. Add every `.env.local` value in Vercel **Project → Settings → Environment
   Variables**.
3. Point Plaid's webhook (Dashboard → Team Settings → Webhooks) at
   `https://yourapp.vercel.app/api/plaid/webhook`.
4. Run `npm run db:migrate` against the production Neon branch once.

Total to launch: **$0** until you flip Vercel Pro (~$20/mo) and start linking
real banks in Plaid Production (pay-per-linked-item, no minimum).
