# Monarch deep-study — what we rip, and how it lands in UniFi

Captured 2026-06-12 from monarch.com (marketing + product screenshots).
Reference captures archived during the session; re-capture with
`npx playwright` against monarch.com when this goes stale.

## Monarch's design language (2026)

### Marketing site

1. **Editorial serif display headings** over a clean sans body. This is the
   single biggest "premium" signal on the site ("Your home base for money
   clarity", "Everything you need, all in one app").
2. **Eyebrow labels** — tiny letterspaced small-caps in the accent color
   (TRACK / BUDGET / NET WORTH / TRANSACTIONS) above every section headline.
3. **Warm paper canvas** (#F5F2EE-ish), white cards, one hot accent
   (coral-orange) used *sparingly* — eyebrows, CTAs, active tab text.
4. **Lifestyle photography hero** with floating product chips (mini UI cards
   overlaid on the photo: "Flex Spending", "Fixed — Spent $2,431").
5. **Press-badge strip** — star rating + WSJ / Forbes / CNBC badges framed in
   laurel marks, directly under the hero.
6. **Product-truth screenshots** — big, real app UI in a browser/phone frame,
   never abstract illustration.
7. **2×2 feature grid around a centered phone** (Track / Collaborate / Budget /
   Plan), each cell: eyebrow → bold claim → 2-3 lines → soft pill CTA.
8. **Floating proof details** — avatar pairs for collaboration, masked account
   numbers (•••• 9701), "1 min ago" sync freshness, "5 need review" chips.
9. **Dark evergreen footer** with a full-bleed orange CTA band above it.

### Product UI

1. **Sankey cash-flow diagram** as the hero visualization of the Reports/Cash
   Flow surface — pastel category ribbons, per-node labels with $ and %.
2. **Segmented control tabs** (Cash Flow / Spending / Income) with the active
   tab in accent color text — not underlines, not pills.
3. **Stat-tile row** above the viz: small-caps label, big number, semantic
   color (income green, expenses red, savings neutral).
4. **Emoji-prefixed categories** (🏠 Mortgage, 💰 Savings) — instant scan-ability.
5. **Pastel category color system** — every category has a soft hue used
   consistently in ribbons, dots, and progress bars.
6. **Date-range chip + Filters** top-right of every data surface ("This month").
7. Sidebar: plain text + icon, subtle active pill, Advice/Help anchored bottom.

## The UniFi translation (orange → green/navy, faith-forward)

| Monarch pattern | UniFi landing |
|---|---|
| Serif display headings (marketing) | Add a display serif via next/font for `(marketing)` headings; keep Sora in-app |
| Coral-orange accent | Brand green `#27705A` text / `#58A888` graphics; navy `#04265E` ink |
| Eyebrow small-caps | Green eyebrows above every marketing section |
| Press-badge strip | Keep structure; swap content for testimony/verse + ratings when real |
| Sankey cash flow | Pure-SVG Sankey on Cash Flow page from mock-data selectors |
| Segmented tabs | Shared `SegmentedTabs` component, active = green text |
| Emoji categories | Add emoji to category mock data + render in budget/transactions |
| Pastel category palette | Token-ize 8 pastel category hues in globals.css |
| Date-range chip | "This month" chip on dashboard/cashflow/budget headers |

## Anti-goals

- Do NOT copy Monarch copywriting or photography. Structure and patterns, not
  content. Our voice stays stewardship-first.
- No orange. The warmth comes from cream + green + photography.
- Keep the Scripture moments — Monarch has nothing like them; they're ours.
