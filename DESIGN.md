# DESIGN.md — UniFi

Visual identity spec. The source of truth for tokens is the code
(`app/globals.css` for CSS variables, `tailwind.config.ts` for named scales) —
this document explains the *intent* so design decisions stay coherent. When
code and this doc disagree, the code wins; update this doc to match.

## North star

Inspired by **Monarch** (monarch.com) — the current design leader in personal
finance — and deliberately borrowing its structure and polish: clean layout,
generous whitespace, real UI (never stock art), subtle color-coding, confident
typography. The rule of thumb for any decision is **"what would Monarch do?"** —
then apply our own brand. We differ on two axes:

1. **Brand/color** — Monarch's warm orange accent is replaced by a **blue**
   accent. Primary ink is **evergreen**; the canvas is **cream**.
2. **Mission** — a stewardship lens: giving/tithe is a first-class feature, debt
   has a finish line, and Scripture appears throughout — calm, never preachy.

## Color

Three brand scales plus semantic tokens. Components consume **semantic** tokens
(`bg-background`, `text-foreground`, `bg-primary`, …), not raw brand steps, so
light/dark resolve automatically.

| Brand scale | Role | Anchor |
|---|---|---|
| `evergreen-*` (50→900) | Ink / dark surfaces / `secondary` | `evergreen-900` `#0c211c` = foreground |
| `brand-*` (50→900) | **Blue accent** (replaces Monarch's orange) / `primary` | `brand-500` `#3b63f0` |
| `cream-*` (50→300) | Warm canvas | `cream-50` `#fdfcf8` = background |

Semantic tokens (HSL CSS vars, defined for `:root` and `.dark` in
`app/globals.css`): `background`, `foreground`, `card`, `muted`, `accent`,
`primary` (= blue), `secondary` (= evergreen), `success`, `destructive`,
`border`, `input`, `ring`.

- Light: cream-50 canvas, evergreen-900 ink, blue-500 primary, blue ring.
- Dark (the signature feature): deep evergreen canvas (`165 40% 7%`), cream text,
  brightened blue primary (`brand` at 66% L). Dark mode is class-based
  (`darkMode: ["class"]`); avoid the flash — theme is set before paint.

Use `success` for positive cash flow / on-track, `destructive` for spend /
over-budget / liabilities. Category color+icon coding lives in
`components/app/category-icon.tsx` — reuse it, don't invent per-screen colors.

## Typography

- **Sora** → `font-display` (headings), loaded via `next/font` (`--font-display`).
- **Inter** → `font-sans` (body), via `next/font` (`--font-sans`).
- Financial figures use **tabular** numerals for column alignment.
- Money always renders through `formatCurrency` / `formatPercent` in
  `lib/utils.ts` — never hand-format numbers in components.

## Shape, depth, motion

- Radius is generous: `--radius: 0.875rem` (`lg`); `md`/`sm` derive from it.
  **Buttons are pill-shaped.**
- Two shadows only: `shadow-soft` (resting cards) and `shadow-lift` (raised /
  hover). Both tinted with evergreen, not neutral black.
- Motion is subtle and purposeful (Framer Motion). Signature entrance:
  `animate-fade-up` — `cubic-bezier(0.16, 1, 0.3, 1)`, 0.6s, translateY(12px)→0.
  Respect `prefers-reduced-motion` (already wired).
- Charts are real (Recharts), color-coded to the semantic palette — not
  decorative.

## Layout

App Router route groups: `(marketing)`, `(auth)`, `(app)`. Container centers at
`2xl: 1200px` with `1.5rem` padding. Prefer the `ui/` primitives and existing
`app/` / `marketing/` components over new one-off markup.

## Do / Don't

- **Do** read from `lib/mock-data.ts` selectors (and the `lib/data` layer once
  the DB is live) — never hardcode financial numbers in components.
- **Do** keep Scripture calm and contextual.
- **Don't** use stock photography or emoji as UI chrome.
- **Don't** reach for raw brand-scale steps when a semantic token exists.
- **Don't** add a third shadow or a one-off easing curve.
