# AGENTS.md — UniFi

Operating constitution for AI agents working in this repo. Pairs with
`CLAUDE.md` (design/brand guidance), `ARCHITECTURE.md` (backend design of
record), and `DESIGN.md` (visual identity).

## Mission

A Christ-centered personal-finance app — budgeting, cash flow, goals, generous
giving, and a built-in Q&A assistant — in one calm, clear place. Monarch-grade
polish, stewardship-first mission.

## Stack

- **Next.js 14** (App Router) · **React 18** · **TypeScript** (strict)
- **Tailwind CSS** with a token-based design system (light + dark) — see DESIGN.md
- **Drizzle ORM** + **Neon** (Postgres); all money stored as integer **cents**
- **Clerk** auth · **Plaid** bank linking · **Inngest** durable sync
- **Anthropic SDK** (`claude-opus-4-8`) powers "Ask UniFi"
- **Playwright** + axe for e2e/a11y

Every external dependency **degrades gracefully**: with no keys, the app falls
back to mock data / demo flows. Preserve this — a missing key must never crash a
page.

## Commands

```bash
npm run dev        # local dev
npm run build      # MUST pass before pushing
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
npm run test:e2e   # Playwright a11y + behavior across every route
npm run db:generate / db:migrate / db:seed   # Drizzle + Neon (see SETUP.md)
```

## Required checks before any push

`npm run lint` && `npm run typecheck` && `npm run build` must all pass. CI
(`.github/workflows/ci.yml`) runs these plus Playwright on every push/PR — don't
push work that you haven't built locally.

## File ownership / where things live

- **Money formatting** → `lib/utils.ts` (`formatCurrency`/`formatPercent`/`toCents`). Never hand-format.
- **Data shapes** → `lib/mock-data.ts` (selectors) and `lib/data/` (DB repos). Components read selectors only.
- **DB schema** → `lib/data/schema.ts` is the source of truth (migrations in `drizzle/` are gitignored, regenerated via `db:generate`).
- **Design tokens** → `app/globals.css` + `tailwind.config.ts`.
- **Auth seam** → `lib/auth.ts` (`getCurrentHouseholdId`); middleware in `middleware.ts`.
- **Plaid** → `lib/plaid.ts` (client), `lib/data/plaid-repo.ts` (persistence), `app/api/plaid/*` (routes), `lib/inngest-functions.ts` (sync).

## Forbidden changes

- Don't send the Plaid `access_token` (or any decrypted secret) to the client —
  it's KMS-envelope-encrypted at rest and decrypted server-side only.
- Don't bypass the household tenant boundary — every domain query is
  `household_id`-scoped (RLS + data-access guard). No cross-household reads.
- Don't weaken the webhook signature verification or the CSP without a stated reason.
- Don't hardcode financial numbers in components.
- Don't introduce Stripe — payment processing is out of scope here.

## Model routing

`claude-opus-4-8` for "Ask UniFi" (server route `app/api/assistant/route.ts`,
prompt-cached system + financial-context prefix). Keep the context builder
(`lib/assistant-context.ts`) deterministic.

## Conventions

- Server components by default; `"use client"` only when needed.
- App Router route groups: `(marketing)` / `(auth)` / `(app)`.
- No emojis in code or commits. No comments that restate what code does.
