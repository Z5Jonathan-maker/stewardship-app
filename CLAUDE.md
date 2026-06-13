# CLAUDE.md — uniFi

Guidance for working in this repo.

## What this is

uniFi is a Christ-centered personal-finance app. It is **inspired by
Monarch** (monarch.com) — the current design leader in the space — and
deliberately borrows Monarch's structure and polish while differentiating on:

1. **Brand/color** — Monarch's warm orange accent is replaced by a **blue
   accent** (`brand-*` scale). Primary ink is **evergreen**; canvas is **cream**.
2. **Mission** — a stewardship lens: giving/tithe is a first-class feature,
   debt has a finish line, and Scripture appears throughout (calm, never preachy).

When making design decisions, the rule of thumb is: **"what would Monarch do?"**
— clean layout, generous whitespace, real UI (never stock art), subtle
color-coding, confident typography — then apply our cream/evergreen/blue brand.

## Design system (source of truth)

- Tokens live in `app/globals.css` (CSS variables, light + `.dark`) and
  `tailwind.config.ts` (named scales).
- Brand scales: `evergreen-*` (ink/dark), `brand-*` (blue accent), `cream-*`
  (canvas). Semantic tokens: `background`, `foreground`, `card`, `primary`
  (= blue), `secondary` (= evergreen), `muted`, `accent`, `success`,
  `destructive`, `border`, `ring`.
- Fonts: **Sora** (`font-display`, headings) + **Inter** (`font-sans`, body)
  via `next/font`.
- Radius is generous (`--radius: 0.875rem`); buttons are pill-shaped.
- Prefer the `ui/` primitives and existing `app/`/`marketing/` components over
  new one-off markup.

## Data

Everything renders from `lib/mock-data.ts` (typed accounts, transactions,
budget, goals, cash flow, giving + derived selectors). **Keep components
reading from these selectors** so swapping in real Plaid/DB data later is a
drop-in. Do not hardcode financial numbers inside components.

## Conventions

- App Router with route groups: `(marketing)`, `(auth)`, `(app)`.
- Server components by default; add `"use client"` only when needed (e.g.
  sidebar active-link, the assistant).
- Money formatting goes through `formatCurrency` / `formatPercent` in
  `lib/utils.ts`.

## Commands

```bash
npm run dev      # local dev
npm run build    # must pass before pushing
```

## Ask uniFi (live Claude integration)

"Ask uniFi" is wired to Claude. The client (`app/(app)/assistant/page.tsx`)
POSTs the conversation to the server route `app/api/assistant/route.ts`, which
calls `claude-opus-4-8` via the official `@anthropic-ai/sdk`, grounded in a
deterministic financial snapshot built from `lib/mock-data.ts` (see
`lib/assistant-context.ts`). The system prompt + snapshot are sent as cached
system blocks (prompt caching). Set `ANTHROPIC_API_KEY` (see `.env.example`);
without it, the route returns 503 and the client falls back to the local
keyword `answer()` mock so the demo still works. When real per-household data
lands, swap `buildFinancialContext()` to read it — the route is unchanged.

## Not yet built (intentionally)

Real auth, real Plaid, and a backend/DB. See README roadmap.
