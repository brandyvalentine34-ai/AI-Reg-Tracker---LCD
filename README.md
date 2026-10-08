# AI Reg Tracker · Buy-Side

A regulatory-intelligence workspace for **buy-side asset managers** (UCITS/AIF managers, RIAs, licensed fund managers) to track the latest AI regulatory developments across key markets, understand what they mean for the firm, and turn them into an evidenced action plan.

Curated by LCD Compliance for internal information purposes only. Not legal advice.

## What it does

| View | Purpose |
| --- | --- |
| **Overview** | KPIs (tracked, high impact, unread, deadlines ≤ 90 days, action completion), latest developments, upcoming deadlines, a market × theme exposure heatmap, and your watchlist. |
| **Developments** | Faceted library of every tracked law, rule, guidance, consultation and enforcement action. Search, filter by market / theme / impact / status / applicability / instrument, and sort by latest, impact or next deadline. |
| **Detail panel** | Latest development, summary, *what it means for a buy-side firm*, key requirements, an editable action checklist, timeline, themes, source link and a verification-confidence note. Each item has a shareable URL (`#/developments?item=eu-ai-act`). |
| **Horizon & deadlines** | Quarter/month timeline of milestones, filterable by window, market and impact. Exports to calendar (`.ics`). Hollow markers are indicative dates. |
| **Markets** | Regulatory posture, key authorities and tracked items for each market. |
| **Action plan** | All recommended actions with status, owner, due date and notes, with completion by owner. Exports to CSV for committees or GRC tools. |
| **Briefing pack** | Generates a committee-ready briefing (key messages, deadlines, developments, actions). Copy as Markdown, download `.md`, or print to PDF. |

**My footprint** (sidebar) lets each user pick the markets where the firm is licensed or distributes. The overview, horizon, action plan and briefing focus on those markets; global standard-setters are always included.

Workspace state (footprint, watchlist, read status, action progress) is stored in the browser's `localStorage`. Export the action plan to CSV to share or archive it.

## Coverage

76 developments across 12 markets: EU, UK, US, Canada, Switzerland, Singapore, Hong Kong, Japan, Australia, Mainland China, South Korea, and global standard-setters (IOSCO, FSB, G7, OECD, Council of Europe, ISO/IEC). Content was reviewed on **8 October 2026**.

Each item has a `confidence` rating:

- **Verified**: status and dates checked against the source.
- **Partly verified**: the core facts were checked, but some dates or next steps are indicative.
- **Unverified**: confirm against the primary source before relying on it.

Always check the linked primary source before acting.

## Updating the content

All content lives in [`src/data/developments.json`](src/data/developments.json). The schema and validation rules are in [`src/data/schema.ts`](src/data/schema.ts).

1. Add or edit an entry. Bump `lastUpdated` and rewrite `latestUpdate` whenever something material changes; users will see the item as unread again.
2. Update `DATA_REVIEWED_ON` in [`src/data/index.ts`](src/data/index.ts).
3. Run `bun run test`. The dataset test checks every entry for valid enums, ISO dates, unique ids and at least one action and milestone.

Action progress is keyed by `<development id>-a<n>`. Append new actions rather than reordering existing ones, so that saved progress stays attached to the right action.

Market profiles are in [`src/data/markets.ts`](src/data/markets.ts). Taxonomy labels and colours are in [`src/lib/taxonomy.ts`](src/lib/taxonomy.ts).

## Development

Prerequisites: [Bun](https://bun.sh) (or Node 20+).

```bash
bun install
bun run dev      # http://localhost:3000
bun run test     # unit + dataset validation tests (Vitest)
bun run lint     # TypeScript type-check
bun run build    # production build to dist/
```

Stack: React 19, TypeScript, Vite, Tailwind CSS 4, lucide-react. No backend is required; the app is a static site.
