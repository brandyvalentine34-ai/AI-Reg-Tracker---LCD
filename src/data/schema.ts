import type { Development, Owner } from '../types';
import { MARKETS } from './markets';
import {
  APPLICABILITY,
  CONFIDENCE,
  IMPACTS,
  OWNERS,
  STATUSES,
  THEMES,
  TYPES,
} from '../lib/taxonomy';

/** Shape of an entry in developments.json (actions have no ids yet). */
export type RawDevelopment = Omit<Development, 'actions'> & {
  actions: { text: string; owner: string }[];
};

const ISO = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validate a raw dataset entry. Returns a list of human-readable problems;
 * an empty list means the entry is well-formed.
 */
export function validateDevelopment(d: RawDevelopment): string[] {
  const errs: string[] = [];
  const at = (msg: string) => errs.push(`${d.id ?? '(no id)'}: ${msg}`);

  if (!d.id || !/^[a-z0-9-]+$/.test(d.id)) at('id must be kebab-case');
  if (!(d.market in MARKETS)) at(`unknown market "${d.market}"`);
  if (!(d.instrumentType in TYPES)) at(`unknown instrumentType "${d.instrumentType}"`);
  if (!(d.status in STATUSES)) at(`unknown status "${d.status}"`);
  if (!(d.impact in IMPACTS)) at(`unknown impact "${d.impact}"`);
  if (!(d.applicability in APPLICABILITY)) at(`unknown applicability "${d.applicability}"`);
  if (!(d.confidence in CONFIDENCE)) at(`unknown confidence "${d.confidence}"`);
  if (!d.title || !d.summary || !d.buySideImpact) at('title, summary and buySideImpact are required');
  if (!ISO.test(d.datePublished)) at('datePublished must be YYYY-MM-DD');
  if (!ISO.test(d.lastUpdated)) at('lastUpdated must be YYYY-MM-DD');
  if (d.effectiveDate != null && !ISO.test(d.effectiveDate)) at('effectiveDate must be YYYY-MM-DD or null');
  if (!Array.isArray(d.themes) || d.themes.length === 0) at('at least one theme required');
  for (const t of d.themes ?? []) if (!(t in THEMES)) at(`unknown theme "${t}"`);
  for (const a of d.actions ?? []) if (!OWNERS.includes(a.owner as Owner)) at(`unknown owner "${a.owner}"`);
  for (const m of d.milestones ?? []) if (!ISO.test(m.date)) at(`milestone date "${m.date}" must be YYYY-MM-DD`);
  if (!/^https?:\/\//.test(d.sourceUrl)) at('sourceUrl must be an http(s) URL');
  return errs;
}

/** Attach stable action ids and sort milestones chronologically. */
export function normaliseDevelopment(d: RawDevelopment): Development {
  return {
    ...d,
    effectiveDate: d.effectiveDate ?? null,
    actions: d.actions.map((a, i) => ({ id: `${d.id}-a${i + 1}`, text: a.text, owner: a.owner as Owner })),
    milestones: [...d.milestones].sort((a, b) => a.date.localeCompare(b.date)),
  };
}
