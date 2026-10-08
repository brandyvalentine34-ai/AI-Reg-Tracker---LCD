import { useCallback, useMemo, useState } from 'react';
import type { Filters, MarketId, SortKey, Theme, ViewId } from './types';
import { DEVELOPMENTS, DEVELOPMENTS_BY_ID } from './data';
import { MARKETS } from './data/markets';
import { useWorkspace } from './state/workspace';
import { useHashRoute } from './state/router';
import { EMPTY_FILTERS } from './lib/filters';
import { MobileNav, Sidebar } from './components/Sidebar';
import { DevelopmentDrawer } from './components/DevelopmentDrawer';
import { FootprintDialog } from './components/FootprintDialog';
import { Overview } from './views/Overview';
import { Developments } from './views/Developments';
import { Horizon } from './views/Horizon';
import { Markets } from './views/Markets';
import { ActionPlan } from './views/ActionPlan';
import { Briefing } from './views/Briefing';

export default function App() {
  const ws = useWorkspace();
  const { route, navigate } = useHashRoute();
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortKey>('latest');
  const [footprintOpen, setFootprintOpen] = useState(false);

  const view = route.view;
  const itemId = route.params.get('item');
  const marketParam = route.params.get('market') as MarketId | null;
  const selectedMarket = marketParam && marketParam in MARKETS ? marketParam : null;
  const openItem = itemId ? DEVELOPMENTS_BY_ID[itemId] ?? null : null;

  /** Developments in the user's market footprint – drives dashboards, horizon, actions and briefings. */
  const scoped = useMemo(() => DEVELOPMENTS.filter(ws.inFootprint), [ws.inFootprint]);

  const go = useCallback((v: ViewId) => navigate(v), [navigate]);
  const onOpen = useCallback(
    (id: string) => navigate(view, { market: view === 'markets' ? selectedMarket ?? undefined : undefined, item: id }),
    [navigate, view, selectedMarket],
  );
  const closeItem = useCallback(
    () => navigate(view, { market: view === 'markets' ? selectedMarket ?? undefined : undefined }),
    [navigate, view, selectedMarket],
  );

  const browse = useCallback(
    (f: Partial<Filters>) => {
      setFilters({ ...EMPTY_FILTERS, ...f });
      navigate('developments');
    },
    [navigate],
  );
  const browseTheme = useCallback((t: Theme) => browse({ themes: [t] }), [browse]);

  const unreadCount = scoped.filter(ws.isUnread).length;
  const openActions = scoped
    .flatMap((d) => d.actions)
    .filter((a) => {
      const s = ws.progress[a.id]?.status ?? 'not_started';
      return s === 'not_started' || s === 'in_progress';
    }).length;

  const selectable = ws.footprint.filter((m) => m !== 'global');
  const footprintLabel =
    selectable.length >= Object.keys(MARKETS).length - 1
      ? 'All markets'
      : selectable.map((m) => MARKETS[m].shortName).join(', ');

  return (
    <div className="flex min-h-screen">
      <Sidebar
        view={view}
        onNavigate={go}
        unreadCount={unreadCount}
        openActions={openActions}
        footprintLabel={footprintLabel}
        onEditFootprint={() => setFootprintOpen(true)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav view={view} onNavigate={go} onEditFootprint={() => setFootprintOpen(true)} />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8" style={{ animation: 'fadeIn .2s ease-out' }} key={view}>
          {view === 'overview' && <Overview scoped={scoped} onOpen={onOpen} onNavigate={go} onBrowse={browse} />}
          {view === 'developments' && (
            <Developments all={DEVELOPMENTS} filters={filters} setFilters={setFilters} sort={sort} setSort={setSort} onOpen={onOpen} />
          )}
          {view === 'horizon' && <Horizon scoped={scoped} onOpen={onOpen} />}
          {view === 'markets' && (
            <Markets all={DEVELOPMENTS} selected={selectedMarket} onSelect={(m) => navigate('markets', { market: m ?? undefined })} onOpen={onOpen} />
          )}
          {view === 'actions' && <ActionPlan scoped={scoped} onOpen={onOpen} />}
          {view === 'briefing' && <Briefing scoped={scoped} />}
        </main>
        <footer className="no-print border-t border-slate-200 px-4 py-5 text-center text-[11px] text-slate-500 sm:px-6 lg:px-8">
          Curated by LCD Compliance for internal information purposes only. Not legal advice – always verify against the primary source.
        </footer>
      </div>

      <DevelopmentDrawer development={openItem} onClose={closeItem} onTheme={(t) => browseTheme(t)} />
      <FootprintDialog open={footprintOpen} onClose={() => setFootprintOpen(false)} />
    </div>
  );
}
