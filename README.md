# Global AI Regulatory Development Tracker

A regulatory-intelligence workspace for **buy-side asset managers** (UCITS/AIF managers, RIAs, licensed fund managers) to track the latest AI regulatory developments across key markets, understand what they mean for the firm, and turn them into an evidenced action plan.

Developed by LCD Compliance for internal information purposes only. Please refer and verify against primary source.

## What it does

| View | Purpose |
| --- | --- |
| **Overview** | KPIs (tracked, high impact, unread, deadlines ≤ 90 days, action completion), latest developments, upcoming deadlines, a market × theme exposure heatmap, and your watchlist. |
| **Developments** | Faceted library of every tracked law, rule, guidance, consultation and enforcement action. Search, filter by market / theme / impact / status / applicability / instrument, and sort by latest, impact or next deadline. |
| **Detail panel** | Latest development, summary, *what it means for a buy-side firm*, key requirements, an editable action checklist, timeline, themes, source link and a verification-confidence note. Each item has a shareable URL (`#/developments?item=eu-ai-act`). |
| **Action plan** | All recommended actions with status, owner, due date and notes, with completion by owner. Exports to CSV for committees or GRC tools. |
| **Briefing pack** | Generates a committee-ready briefing (key messages, deadlines, developments, actions). Copy as Markdown, download `.md`, or print to PDF. |

**My footprint** (sidebar) lets each user pick the markets where the firm is licensed or distributes. The overview, action plan and briefing focus on those markets; global standard-setters are always included.

Workspace state (footprint, watchlist, read status, action progress) is stored in the browser's `localStorage`. Export the action plan to CSV to share or archive it.

## Coverage

77 developments across 10 markets: EU, UK, US, Singapore, Hong Kong, Japan, Australia, Mainland China, South Korea, and global standard-setters (IOSCO, FSB, G7, OECD, Council of Europe, ISO/IEC). Content is updated as of **25 October 2026**.

Each item has a `confidence` rating:

- **Verified**: status and dates checked against the source.
- **Partly verified**: the core facts were checked, but some dates or next steps are indicative.
- **Unverified**: confirm against the primary source before relying on it.

Always check the linked primary source before acting.

## Updating the content

All content lives in [`src/data/developments.json`](src/data/developments.json). The schema and validation rules are in [`src/data/schema.ts`](src/data/schema.ts).

1. Add or edit an entry. Bump `lastUpdated` and rewrite `latestUpdate` whenever something material changes; users will see the item as unread again.
2. Change `CONTENT_UPDATED_ON` in [`src/data/index.ts`](src/data/index.ts) to the refresh date. It is shown as *Content is updated as of …* in the sidebar and on the Overview.
3. Run `bun run test`. The dataset test checks every entry for valid enums, ISO dates, unique ids and at least one action and milestone.

Action progress is keyed by `<development id>-a<n>`. Append new actions rather than reordering existing ones, so that saved progress stays attached to the right action.

Market profiles are in [`src/data/markets.ts`](src/data/markets.ts). Taxonomy labels and colours are in [`src/lib/taxonomy.ts`](src/lib/taxonomy.ts).

## Monthly refresh

Each refresh starts by checking which regulator websites the cloud environment can read, so findings are checked against primary sources wherever possible.

1. **Check source access.** Run `bun run check:sources`. It rewrites:
   - [`sources/ACCESS.md`](sources/ACCESS.md): which regulator sites are readable, and which hosts to add to the environment's **Allowed domains**
   - [`sources/allowed-domains.txt`](sources/allowed-domains.txt): the full list of hosts to allow

   The site list is [`sources/regulator-domains.json`](sources/regulator-domains.json) plus every host used in a `sourceUrl` in `developments.json`, so new sources are picked up automatically. To add a regulator that has no tracked item yet, edit `regulator-domains.json`. Allow both the bare and `www.` form of each host: many sites redirect from one to the other.
2. **Research and update.** Ask Claude Code in this repository:

   > Refresh the Global AI Regulatory Development Tracker. First run `bun run check:sources` and read `sources/ACCESS.md`. Research AI regulatory developments since the last refresh (`CONTENT_UPDATED_ON` in `src/data/index.ts`) across all 10 markets, reading primary sources with curl wherever ACCESS.md shows them as readable (send a User-Agent with a name and contact email; the SEC requires one). Update `src/data/developments.json`: add new developments and update changed ones (`lastUpdated`, `latestUpdate`, milestones, confidence). Do not change or reorder existing actions. Set `CONTENT_UPDATED_ON` to today, run `bun run check:sources` again and `bun run test`, then open a pull request listing what changed, which sources were read directly, and anything you could not verify. Do not merge it.

3. **Review and merge** the pull request. Vercel redeploys from `main`.

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
