import raw from './news.json';
import type { NewsCategory, NewsItem } from '../types';
import { MARKETS } from './markets';

export const NEWS_CATEGORIES: Record<NewsCategory, { label: string; description: string }> = {
  legal: { label: 'Legal & litigation', description: 'Lawsuits, rulings, investigations and enforcement involving AI' },
  business: { label: 'Business', description: 'Deals, funding, partnerships and corporate moves in AI' },
  technology: { label: 'Technology', description: 'Model and product releases, safety and security incidents' },
};
export const NEWS_CATEGORY_ORDER: NewsCategory[] = ['legal', 'business', 'technology'];

const ISO = /^\d{4}-\d{2}-\d{2}$/;

/** Problems with the news file; an empty list means it is well-formed. */
export function validateNews(items: NewsItem[]): string[] {
  const errs: string[] = [];
  const ids = new Set<string>();
  for (const n of items) {
    const at = (m: string) => errs.push(`${n.id}: ${m}`);
    if (!/^[a-z0-9-]+$/.test(n.id)) at('id must be kebab-case');
    if (ids.has(n.id)) at('duplicate id');
    ids.add(n.id);
    if (!(n.category in NEWS_CATEGORIES)) at(`unknown category "${n.category}"`);
    if (!n.title?.trim() || !n.publisher?.trim()) at('title and publisher are required');
    if (!ISO.test(n.date)) at('date must be YYYY-MM-DD');
    if (n.url !== null && !/^https:\/\//.test(n.url)) at('url must be https or null');
    if (typeof n.subscription !== 'boolean') at('subscription must be true or false');
    for (const m of n.markets ?? []) if (!(m in MARKETS)) at(`unknown market "${m}"`);
  }
  return errs;
}

const items = raw as unknown as NewsItem[];

/** Newest first; items on the same day keep their file order. */
export const NEWS: NewsItem[] = items
  .map((n, i) => ({ n, i }))
  .sort((a, b) => b.n.date.localeCompare(a.n.date) || a.i - b.i)
  .map(({ n }) => n);

export const NEWS_RAW = items;
