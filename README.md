# UniFi

**Faithful stewardship of every dollar.**

UniFi is a Christ-centered personal finance app — budgeting, cash flow,
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
cp .env.example .env.local   # add ANTHROPIC_API_KEY to enable "Ask UniFi"
npm run dev      # http://localhost:3000
npm run build    # production build
npm run test:e2e # Playwright: a11y + behavior across every route
```

### "Ask UniFi" assistant

The assistant (`/assistant`) is wired to Claude (`claude-opus-4-8`) via a
server route (`app/api/assistant`) using the official `@anthropic-ai/sdk`.
It answers grounded in a deterministic snapshot of the household's finances
(`lib/assistant-context.ts`, built from `lib/mock-data.ts`) with prompt
caching on the system+context prefix. Set `ANTHROPIC_API_KEY` to enable it;
without a key the route returns 503 and the UI gracefully falls back to a
local stewardship mock, so the demo always works.

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

- [x] Wire "Ask UniFi" to the Claude API, grounded in account data
- [ ] Real Plaid Link integration (sandbox → production)
- [ ] Auth + per-household database (swap the mock snapshot for real data)
- [ ] Streaming responses for the assistant
- [ ] Recurring/bills detection, year-end giving statements
- [ ] Dark mode toggle (tokens already in place)
