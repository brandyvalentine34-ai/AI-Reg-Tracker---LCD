import { useMemo, useState } from 'react';
import { ArrowUpRight, Briefcase, Cpu, Lock, Scale, Search } from 'lucide-react';
import type { NewsCategory, NewsItem } from '../types';
import { NEWS, NEWS_CATEGORIES, NEWS_CATEGORY_ORDER } from '../data/news';
import { formatDate } from '../lib/dates';
import { Flag } from '../components/Flag';
import { Card, EmptyState, PageHeader, cx } from '../components/ui';

const CATEGORY_STYLE: Record<NewsCategory, { icon: typeof Scale; tint: string }> = {
  legal: { icon: Scale, tint: 'bg-indigo-50 text-indigo-700' },
  business: { icon: Briefcase, tint: 'bg-emerald-50 text-emerald-700' },
  technology: { icon: Cpu, tint: 'bg-sky-50 text-sky-700' },
};

type Tab = NewsCategory | 'all';

function matches(n: NewsItem, q: string) {
  if (!q) return true;
  const text = `${n.title} ${n.publisher}`.toLowerCase();
  return q.split(/\s+/).every((t) => text.includes(t));
}

function NewsRow({ n }: { n: NewsItem }) {
  return (
    <li className="py-3.5 first:pt-0 last:pb-0">
      {n.url ? (
        <a
          href={n.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline text-[15px] font-semibold leading-snug text-slate-900 hover:text-blue-700"
        >
          {n.title}
          <ArrowUpRight className="ml-0.5 inline h-3.5 w-3.5 align-[-0.1em] text-slate-400 group-hover:text-blue-700" aria-hidden />
        </a>
      ) : (
        <span className="text-[15px] font-semibold leading-snug text-slate-900">{n.title}</span>
      )}
      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
        <time dateTime={n.date} className="font-medium text-slate-600 tabular">{formatDate(n.date)}</time>
        <span aria-hidden>·</span>
        <span>{n.publisher}</span>
        {n.subscription && (
          <span className="inline-flex items-center gap-1 text-amber-700" title="This outlet usually needs a subscription">
            <Lock className="h-3 w-3" aria-hidden />
            Subscription
          </span>
        )}
        {n.markets.length > 0 && (
          <span className="inline-flex items-center gap-1">
            {n.markets.map((m) => (
              <Flag key={m} market={m} size="xs" decorative={false} />
            ))}
          </span>
        )}
        {!n.url && <span className="italic">Link not available</span>}
        {n.via && <span className="text-slate-400">via {n.via}</span>}
      </div>
    </li>
  );
}

export function News() {
  const [tab, setTab] = useState<Tab>('all');
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const byCategory = useMemo(() => {
    const out = Object.fromEntries(NEWS_CATEGORY_ORDER.map((c) => [c, [] as NewsItem[]])) as Record<NewsCategory, NewsItem[]>;
    for (const n of NEWS) if (matches(n, q)) out[n.category].push(n);
    return out;
  }, [q]);

  const latest = NEWS[0]?.date;
  const earliest = NEWS.at(-1)?.date;
  const shown = tab === 'all' ? NEWS_CATEGORY_ORDER : [tab];
  const total = shown.reduce((sum, c) => sum + byCategory[c].length, 0);

  return (
    <div className="space-y-5">
      <PageHeader
        title="AI News"
        description={
          <>
            Legal and litigation, business and technology news on AI, linked to the original public reporting.
            {latest && earliest && (
              <span className="mt-1 block text-xs text-slate-400">
                {NEWS.length} headlines · {formatDate(earliest)} to {formatDate(latest)}
              </span>
            )}
          </>
        }
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="inline-flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1" role="tablist" aria-label="News category">
          {(['all', ...NEWS_CATEGORY_ORDER] as Tab[]).map((t) => {
            const count = t === 'all' ? NEWS_CATEGORY_ORDER.reduce((s, c) => s + byCategory[c].length, 0) : byCategory[t].length;
            return (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={cx(
                  'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                  tab === t ? 'bg-[#071d49] text-white' : 'text-slate-600 hover:bg-slate-100',
                )}
              >
                {t === 'all' ? 'All' : NEWS_CATEGORIES[t].label}
                <span className={cx('ml-1.5 tabular', tab === t ? 'text-sky-200' : 'text-slate-400')}>{count}</span>
              </button>
            );
          })}
        </div>
        <div className="relative sm:ml-auto sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="news-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search headlines or sources"
            aria-label="Search news"
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {total === 0 ? (
        <EmptyState title="No headlines match" body="Try another word or switch back to All." />
      ) : (
        <div className={cx('grid grid-cols-1 gap-5', tab === 'all' && 'xl:grid-cols-3')}>
          {shown.map((c) => {
            const items = byCategory[c];
            const { icon: Icon, tint } = CATEGORY_STYLE[c];
            return (
              <Card key={c} className="min-w-0">
                <header className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                  <span className={cx('rounded-lg p-2', tint)}>
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-slate-900">{NEWS_CATEGORIES[c].label}</h2>
                    <p className="text-xs text-slate-500">{NEWS_CATEGORIES[c].description}</p>
                  </div>
                  <span className="ml-auto text-xs font-semibold text-slate-400 tabular">{items.length}</span>
                </header>
                {items.length ? (
                  <ul className="divide-y divide-slate-100 px-5 py-4">
                    {items.map((n) => (
                      <NewsRow key={n.id} n={n} />
                    ))}
                  </ul>
                ) : (
                  <p className="px-5 py-6 text-sm text-slate-500">No headlines in this section.</p>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <p className="text-xs text-slate-500">
        Headlines link to the original reporting. Some outlets need a subscription. Stories marked “via Ropes &amp; Gray AI newsletter”
        were picked up from that newsletter.
      </p>
    </div>
  );
}
