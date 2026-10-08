import { useMemo, useState } from 'react';
import { CheckCheck, Search, SlidersHorizontal, X } from 'lucide-react';
import type { Development, Filters, SortKey, Theme } from '../types';
import { useWorkspace } from '../state/workspace';
import { MARKETS, MARKET_ORDER } from '../data/markets';
import {
  APPLICABILITY,
  APPLICABILITY_ORDER,
  IMPACTS,
  IMPACT_ORDER,
  STATUSES,
  STATUS_ORDER,
  THEMES,
  THEME_ORDER,
  TYPES,
  TYPE_ORDER,
} from '../lib/taxonomy';
import { EMPTY_FILTERS, activeFilterCount, matchesFilters, sortDevelopments } from '../lib/filters';
import { DevelopmentRow } from '../components/DevelopmentRow';
import { Button, EmptyState, PageHeader, cx } from '../components/ui';

type ListKey = 'markets' | 'themes' | 'statuses' | 'impacts' | 'applicability' | 'types';

function FacetGroup<K extends string>({
  title,
  options,
  selected,
  label,
  count,
  onToggle,
}: {
  title: string;
  options: K[];
  selected: K[];
  label: (k: K) => React.ReactNode;
  count: (k: K) => number;
  onToggle: (k: K) => void;
}) {
  return (
    <fieldset className="space-y-1">
      <legend className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">{title}</legend>
      {options.map((k) => {
        const n = count(k);
        const on = selected.includes(k);
        return (
          <label
            key={k}
            className={cx(
              'flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-xs hover:bg-slate-50',
              n === 0 && !on && 'opacity-40',
            )}
          >
            <input type="checkbox" checked={on} onChange={() => onToggle(k)} className="accent-[#071d49]" />
            <span className="flex-1 text-slate-700">{label(k)}</span>
            <span className="text-[11px] text-slate-400 tabular">{n}</span>
          </label>
        );
      })}
    </fieldset>
  );
}

export function Developments({
  all,
  filters,
  setFilters,
  sort,
  setSort,
  onOpen,
}: {
  all: Development[];
  filters: Filters;
  setFilters: (f: Filters | ((p: Filters) => Filters)) => void;
  sort: SortKey;
  setSort: (s: SortKey) => void;
  onOpen: (id: string) => void;
}) {
  const ws = useWorkspace();
  const [panelOpen, setPanelOpen] = useState(false);
  const ctx = { watchlist: ws.watchlist, isUnread: ws.isUnread };

  const results = useMemo(
    () => sortDevelopments(all.filter((d) => matchesFilters(d, filters, ctx)), sort, ws.today),
    [all, filters, sort, ws.today, ws.watchlist, ws.isUnread],
  );

  /** Facet counts reflect all other active filters (standard faceted-search behaviour). */
  const countFor = (key: ListKey, value: string) => {
    const f = { ...filters, [key]: [value] } as Filters;
    return all.filter((d) => matchesFilters(d, f, ctx)).length;
  };

  const toggle = (key: ListKey, value: string) =>
    setFilters((prev) => {
      const list = prev[key] as string[];
      return { ...prev, [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] };
    });

  const nActive = activeFilterCount(filters);
  const unreadInResults = results.filter(ws.isUnread);

  const chips: { label: string; clear: () => void }[] = [
    ...filters.markets.map((m) => ({ label: MARKETS[m].shortName, clear: () => toggle('markets', m) })),
    ...filters.themes.map((t) => ({ label: THEMES[t].short, clear: () => toggle('themes', t) })),
    ...filters.statuses.map((s) => ({ label: STATUSES[s].label, clear: () => toggle('statuses', s) })),
    ...filters.impacts.map((i) => ({ label: IMPACTS[i].label, clear: () => toggle('impacts', i) })),
    ...filters.applicability.map((a) => ({ label: APPLICABILITY[a].label, clear: () => toggle('applicability', a) })),
    ...filters.types.map((t) => ({ label: TYPES[t].label, clear: () => toggle('types', t) })),
    ...(filters.watchedOnly ? [{ label: 'Watchlist', clear: () => setFilters((p) => ({ ...p, watchedOnly: false })) }] : []),
    ...(filters.unreadOnly ? [{ label: 'Unread', clear: () => setFilters((p) => ({ ...p, unreadOnly: false })) }] : []),
  ];

  const panel = (
    <div className="space-y-5">
      <div className="space-y-1">
        <label className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50">
          <input type="checkbox" checked={filters.watchedOnly} onChange={(e) => setFilters((p) => ({ ...p, watchedOnly: e.target.checked }))} className="accent-[#071d49]" />
          Watchlist only <span className="ml-auto text-[11px] text-slate-400">{ws.watchlist.length}</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50">
          <input type="checkbox" checked={filters.unreadOnly} onChange={(e) => setFilters((p) => ({ ...p, unreadOnly: e.target.checked }))} className="accent-[#071d49]" />
          Unread only <span className="ml-auto text-[11px] text-slate-400">{all.filter(ws.isUnread).length}</span>
        </label>
      </div>
      <FacetGroup title="Impact" options={IMPACT_ORDER} selected={filters.impacts} label={(k) => IMPACTS[k].label} count={(k) => countFor('impacts', k)} onToggle={(k) => toggle('impacts', k)} />
      <FacetGroup
        title="Market"
        options={MARKET_ORDER}
        selected={filters.markets}
        label={(k) => (
          <>
            <span aria-hidden>{MARKETS[k].flag}</span> {MARKETS[k].shortName}
            {!ws.footprint.includes(k) && k !== 'global' && <span className="ml-1 text-[10px] text-slate-400">(outside footprint)</span>}
          </>
        )}
        count={(k) => countFor('markets', k)}
        onToggle={(k) => toggle('markets', k)}
      />
      <FacetGroup title="Theme" options={THEME_ORDER} selected={filters.themes} label={(k: Theme) => THEMES[k].label} count={(k) => countFor('themes', k)} onToggle={(k) => toggle('themes', k)} />
      <FacetGroup title="Status" options={STATUS_ORDER} selected={filters.statuses} label={(k) => STATUSES[k].label} count={(k) => countFor('statuses', k)} onToggle={(k) => toggle('statuses', k)} />
      <FacetGroup title="Applicability" options={APPLICABILITY_ORDER} selected={filters.applicability} label={(k) => APPLICABILITY[k].label} count={(k) => countFor('applicability', k)} onToggle={(k) => toggle('applicability', k)} />
      <FacetGroup title="Instrument" options={TYPE_ORDER} selected={filters.types} label={(k) => TYPES[k].label} count={(k) => countFor('types', k)} onToggle={(k) => toggle('types', k)} />
    </div>
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Developments"
        description="Every tracked law, rule, guidance, consultation and enforcement action, assessed for buy-side impact."
        actions={
          unreadInResults.length > 0 && (
            <Button onClick={() => ws.markAllRead(results)}>
              <CheckCheck className="h-3.5 w-3.5" /> Mark {unreadInResults.length} as read
            </Button>
          )
        }
      />

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={filters.query}
            onChange={(e) => setFilters((p) => ({ ...p, query: e.target.value }))}
            placeholder="Search e.g. “AI-washing”, “SFC”, “model risk”, “GPAI”…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            aria-label="Search developments"
          />
        </div>
        <div className="flex gap-2">
          <label className="sr-only" htmlFor="sort">Sort by</label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="latest">Latest update</option>
            <option value="impact">Impact</option>
            <option value="next_deadline">Next deadline</option>
            <option value="market">Market</option>
          </select>
          <Button className="lg:hidden" onClick={() => setPanelOpen((o) => !o)} aria-expanded={panelOpen}>
            <SlidersHorizontal className="h-4 w-4" /> Filters{nActive > 0 && ` (${nActive})`}
          </Button>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {chips.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={c.clear}
              className="inline-flex items-center gap-1 rounded-full bg-[#071d49] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#0b2a66]"
            >
              {c.label} <X className="h-3 w-3" />
            </button>
          ))}
          <button type="button" onClick={() => setFilters({ ...EMPTY_FILTERS, query: filters.query })} className="px-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-800">
            Clear all
          </button>
        </div>
      )}

      <div className="flex gap-6">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">{panel}</div>
        </aside>
        <div className="min-w-0 flex-1 space-y-3">
          {panelOpen && <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:hidden">{panel}</div>}
          <p className="text-xs text-slate-500" aria-live="polite">
            Showing <span className="font-semibold text-slate-800">{results.length}</span> of {all.length} developments
          </p>
          {results.length === 0 ? (
            <EmptyState
              title="No developments match"
              body="Try removing a filter or broadening your search."
              action={<Button onClick={() => setFilters(EMPTY_FILTERS)}>Reset filters</Button>}
            />
          ) : (
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
              {results.map((d) => (
                <DevelopmentRow key={d.id} d={d} onOpen={onOpen} onTheme={(t) => setFilters((p) => (p.themes.includes(t) ? p : { ...p, themes: [...p.themes, t] }))} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
