import { describe, expect, it } from 'vitest';
import type { NewsItem } from '../types';
import { NEWS, NEWS_CATEGORY_ORDER, NEWS_RAW, validateNews } from '../data/news';

const item = (over: Partial<NewsItem>): NewsItem => ({
  id: 'x',
  category: 'legal',
  title: 'Headline',
  date: '2026-10-01',
  publisher: 'Reuters',
  url: 'https://example.com/a',
  subscription: false,
  markets: [],
  via: null,
  ...over,
});

describe('AI news data', () => {
  it('every item passes validation', () => {
    expect(validateNews(NEWS_RAW)).toEqual([]);
  });

  it('has items in every category, newest first', () => {
    for (const c of NEWS_CATEGORY_ORDER) expect(NEWS.some((n) => n.category === c), c).toBe(true);
    for (let i = 1; i < NEWS.length; i++) expect(NEWS[i - 1].date >= NEWS[i].date).toBe(true);
  });

  it('flags bad entries', () => {
    const errs = validateNews([
      item({ id: 'a' }),
      item({ id: 'a' }),
      item({ id: 'b', category: 'sport' as NewsItem['category'] }),
      item({ id: 'c', date: '1 Oct 2026', url: 'http://insecure.example' }),
      item({ id: 'd', markets: ['xx' as NewsItem['markets'][number]] }),
    ]);
    expect(errs).toEqual([
      'a: duplicate id',
      'b: unknown category "sport"',
      'c: date must be YYYY-MM-DD',
      'c: url must be https or null',
      'd: unknown market "xx"',
    ]);
  });
});
