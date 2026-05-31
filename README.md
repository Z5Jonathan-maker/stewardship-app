# Unite Financial

**Faithful stewardship of every dollar.**

Unite is a Christ-centered personal finance app — budgeting, cash flow,
goals, generous giving, and a built-in Q&A assistant — in one calm, clear
place. The design takes deep inspiration from [Monarch](https://www.monarch.com)
(widely regarded as the best-designed money app today), reworked with our own
brand: a warm cream canvas, evergreen ink, and a confident **blue** accent in
place of Monarch's orange.

> "Each of you should use whatever gift you have received to serve others, as
> faithful stewards of God's grace in its various forms." — 1 Peter 4:10

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** with a custom, token-based design system (light + dark ready)
- **lucide-react** icons, **class-variance-authority** for component variants
- Pure-SVG/CSS charts (no heavy charting dependency yet)
- All screens run on realistic **mock data** (`lib/mock-data.ts`) — real Plaid
  + a database wire in later without touching the UI.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Routes

| Area      | Path                                          |
| --------- | --------------------------------------------- |
| Marketing | `/`, `/pricing`                               |
| Auth      | `/login`, `/signup` (demo — drops into app)   |
| App       | `/dashboard`, `/transactions`, `/budget`, `/cashflow`, `/goals`, `/giving`, `/accounts`, `/assistant` |

## Project structure

```
app/
  (marketing)/   landing page + pricing (+ site header/footer)
  (auth)/        login / signup
  (app)/         the logged-in product (sidebar + topbar shell)
components/
  brand/         logo
  ui/            shadcn-style primitives (button, card, badge, progress)
  marketing/     header, footer, hero app mockup
  app/           sidebar, topbar, page header, charts
lib/
  mock-data.ts   the single source of (mock) financial truth
  utils.ts       cn() + currency/percent formatting
```

## Roadmap

- [ ] Real Plaid Link integration (sandbox → production)
- [ ] Auth + per-household database
- [ ] Wire "Ask Unite" to the Claude API, grounded in real account data
- [ ] Recurring/bills detection, year-end giving statements
- [ ] Dark mode toggle (tokens already in place)
