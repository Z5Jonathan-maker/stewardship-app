# SESSION-HANDOFF.md — UniFi

Rolling state for the next session. Update the top section each time.

## Current state — 2026-06-01

**Phase 1 backend is complete and merged** (Drizzle schema, Neon, cents seam,
seed, selectors, Clerk auth + household provisioning, KMS envelope encryption,
Inngest sync, RLS, GDPR delete, e2e/integration tests). Frontend is full and
polished (dashboard, accounts, transactions, budget, cashflow, goals, giving,
debt, roadmap, settings, marketing + pricing). "Ask UniFi" streams from
`claude-opus-4-8`. Vercel deploy is wired (framework pinned to Next.js).

`npm run build` / `typecheck` / `lint` all pass on `main`.

### Just shipped (this session)

- **PR #3 (merged)** — secured the Plaid webhook: real `Plaid-Verification`
  JWT (ES256) verification via Node crypto, fixed the item lookup (added
  `plaid_item_id`, persisted on exchange, resolved by it), and closed the CSP
  gap that would have blocked Clerk in prod.

### Open threads (from the `/audit`, by priority)

- ✅ **Next.js 14 → 15 + React 18 → 19** — done (this branch). Next 15.5,
  React 19.2, eslint-config-next 15 (clears the `glob` high), react-plaid-link 4,
  recharts 3 (custom tooltip retyped to `TooltipContentProps`). All 4 highs
  cleared; build + typecheck + lint + 115 e2e all pass. Note: `next lint` now
  warns it's removed in Next 16 — migrate to the ESLint CLI when going to 16.
- 🟢 **Remaining outdated majors** — Clerk 6→7, Tailwind 3→4 (config rewrite,
  do last), @anthropic-ai/sdk 0.69→0.100, framer-motion 11→12, typescript 5→6,
  eslint 8→9 (flat config). Staged, tested — not `audit fix --force`.
- 🟢 **8 moderate advisories remain** (down from 4 high + 5 moderate) — mostly
  dev-only transitive (esbuild/postcss via tooling).
- ✅ `engines` field + DESIGN.md / AGENTS.md / SESSION-HANDOFF.md — done.

### Not wired yet (needs the user's accounts — see SETUP.md)

- Neon DATABASE_URL, Clerk keys, Plaid keys. Until then the app runs on mock
  data / demo flows by design. Nothing is live, so schema changes are free.

## How to resume

1. `git checkout main && git pull`
2. `npm install`
3. Read `ARCHITECTURE.md` (backend) + `DESIGN.md` (visual) + `CLAUDE.md` (brand).
4. Pick the top open thread (the Next 15 upgrade).
