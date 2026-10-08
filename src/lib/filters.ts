import type { Development, Filters, Milestone, SortKey } from '../types';
import { IMPACTS } from './taxonomy';
import { MARKET_ORDER } from '../data/markets';

export const EMPTY_FILTERS: Filters = {
  query: '',
  markets: [],
  themes: [],
  statuses: [],
  impacts: [],
  applicability: [],
  types: [],
  watchedOnly: false,
  unreadOnly: false,
};

export interface FilterContext {
  watchlist: string[];
  isUnread: (d: Development) => boolean;
}

function haystack(d: Development): string {
  return [
    d.title,
    d.officialTitle,
    d.regulator,
    d.summary,
    d.buySideImpact,
    d.latestUpdate,
    ...d.keyRequirements,
  ]
    .join(' ')
    .toLowerCase();
}

export function matchesFilters(d: Development, f: Filters, ctx: FilterContext): boolean {
  if (f.markets.length && !f.markets.includes(d.market)) return false;
  if (f.themes.length && !d.themes.some((t) => f.themes.includes(t))) return false;
  if (f.statuses.length && !f.statuses.includes(d.status)) return false;
  if (f.impacts.length && !f.impacts.includes(d.impact)) return false;
  if (f.applicability.length && !f.applicability.includes(d.applicability)) return false;
  if (f.types.length && !f.types.includes(d.instrumentType)) return false;
  if (f.watchedOnly && !ctx.watchlist.includes(d.id)) return false;
  if (f.unreadOnly && !ctx.isUnread(d)) return false;
  const q = f.query.trim().toLowerCase();
  if (q) {
    const text = haystack(d);
    if (!q.split(/\s+/).every((term) => text.includes(term))) return false;
  }
  return true;
}

export function activeFilterCount(f: Filters): number {
  return (
    f.markets.length +
    f.themes.length +
    f.statuses.length +
    f.impacts.length +
    f.applicability.length +
    f.types.length +
    (f.watchedOnly ? 1 : 0) +
    (f.unreadOnly ? 1 : 0) +
    (f.query.trim() ? 1 : 0)
  );
}

/** Next milestone on or after `today`, if any. */
export function nextMilestone(d: Development, today: string): Milestone | undefined {
  return d.milestones.find((m) => m.date >= today);
}

export function sortDevelopments(list: Development[], key: SortKey, today: string): Development[] {
  const out = [...list];
  const byLatest = (a: Development, b: Development) => b.lastUpdated.localeCompare(a.lastUpdated);
  switch (key) {
    case 'latest':
      return out.sort(byLatest);
    case 'impact':
      return out.sort((a, b) => IMPACTS[b.impact].rank - IMPACTS[a.impact].rank || byLatest(a, b));
    case 'next_deadline':
      return out.sort((a, b) => {
        const na = nextMilestone(a, today)?.date ?? '9999-12-31';
        const nb = nextMilestone(b, today)?.date ?? '9999-12-31';
        return na.localeCompare(nb) || byLatest(a, b);
      });
    case 'market':
      return out.sort(
        (a, b) => MARKET_ORDER.indexOf(a.market) - MARKET_ORDER.indexOf(b.market) || byLatest(a, b),
      );
  }
}

export interface MilestoneEntry extends Milestone {
  development: Development;
}

/** Flatten milestones across developments, sorted by date. */
export function collectMilestones(list: Development[], from?: string, to?: string): MilestoneEntry[] {
  return list
    .flatMap((d) => d.milestones.map((m) => ({ ...m, development: d })))
    .filter((m) => (!from || m.date >= from) && (!to || m.date <= to))
    .sort((a, b) => a.date.localeCompare(b.date) || IMPACTS[b.development.impact].rank - IMPACTS[a.development.impact].rank);
}
