# SESSION-HANDOFF.md — Unite Financial

Rolling state for the next session. Update the top section each time.

## Current state — 2026-06-01

**Phase 1 backend is complete and merged** (Drizzle schema, Neon, cents seam,
seed, selectors, Clerk auth + household provisioning, KMS envelope encryption,
Inngest sync, RLS, GDPR delete, e2e/integration tests). Frontend is full and
polished (dashboard, accounts, transactions, budget, cashflow, goals, giving,
debt, roadmap, settings, marketing + pricing). "Ask Unite" streams from
`claude-opus-4-8`. Vercel deploy is wired (framework pinned to Next.js).

`npm run build` / `typecheck` / `lint` all pass on `main`.

### Just shipped (this session)

- **PR #3 (merged)** — secured the Plaid webhook: real `Plaid-Verification`
  JWT (ES256) verification via Node crypto, fixed the item lookup (added
  `plaid_item_id`, persisted on exchange, resolved by it), and closed the CSP
  gap that would have blocked Clerk in prod.

### Open threads (from the `/audit`, by priority)

- 🟡 **Next.js 14.2.35 → 15+** — four advisories (RSC DoS, image-optimizer DoS,
  rewrite smuggling, image cache) with no fix in the 14.x line. The async-API
  migration surface here is tiny (no `cookies()`/`headers()`, no dynamic route
  params, no `[...]` segments; Clerk `auth()` already awaited), so the upgrade is
  lower-risk than usual. Bundle the `eslint-config-next` bump (clears the `glob`
  high) and React 19.
- 🟢 **18 outdated majors** — staged, tested upgrades (not `audit fix --force`).
  Suggested order: Anthropic SDK → Clerk 7 → React 19 + Next 15 → Tailwind 4 last.
- ✅ `engines` field + DESIGN.md / AGENTS.md / SESSION-HANDOFF.md — done (this branch).

### Not wired yet (needs the user's accounts — see SETUP.md)

- Neon DATABASE_URL, Clerk keys, Plaid keys. Until then the app runs on mock
  data / demo flows by design. Nothing is live, so schema changes are free.

## How to resume

1. `git checkout main && git pull`
2. `npm install`
3. Read `ARCHITECTURE.md` (backend) + `DESIGN.md` (visual) + `CLAUDE.md` (brand).
4. Pick the top open thread (the Next 15 upgrade).
