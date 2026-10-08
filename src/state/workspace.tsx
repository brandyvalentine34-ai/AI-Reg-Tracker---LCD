import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import type { ActionProgress, Development, MarketId } from '../types';
import { usePersistentState } from '../lib/storage';
import { MARKET_ORDER } from '../data/markets';
import { todayISO } from '../lib/dates';

interface Workspace {
  today: string;
  /** Markets the firm operates or distributes in. Global items are always in scope. */
  footprint: MarketId[];
  setFootprint: (m: MarketId[]) => void;
  inFootprint: (d: Development) => boolean;

  watchlist: string[];
  isWatched: (id: string) => boolean;
  toggleWatch: (id: string) => void;

  isUnread: (d: Development) => boolean;
  markRead: (d: Development) => void;
  markAllRead: (list: Development[]) => void;

  progress: Record<string, ActionProgress>;
  updateAction: (actionId: string, patch: Partial<ActionProgress>) => void;
  resetWorkspace: () => void;
}

const WorkspaceContext = createContext<Workspace | null>(null);

const DEFAULT_FOOTPRINT: MarketId[] = MARKET_ORDER;
const EMPTY_LIST: string[] = [];
const EMPTY_MAP = {};

export function WorkspaceProvider({ children, today = todayISO() }: { children: ReactNode; today?: string }) {
  const [footprint, setFootprint, resetFootprint] = usePersistentState<MarketId[]>('footprint', DEFAULT_FOOTPRINT);
  const [watchlist, setWatchlist, resetWatchlist] = usePersistentState<string[]>('watchlist', EMPTY_LIST);
  // Maps development id -> the lastUpdated value the user has seen.
  const [readMap, setReadMap, resetRead] = usePersistentState<Record<string, string>>('read', EMPTY_MAP);
  const [progress, setProgress, resetProgress] = usePersistentState<Record<string, ActionProgress>>('actions', EMPTY_MAP);

  const toggleWatch = useCallback(
    (id: string) => setWatchlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id])),
    [setWatchlist],
  );

  const isUnread = useCallback((d: Development) => readMap[d.id] !== d.lastUpdated, [readMap]);

  const markRead = useCallback(
    (d: Development) => setReadMap((m) => (m[d.id] === d.lastUpdated ? m : { ...m, [d.id]: d.lastUpdated })),
    [setReadMap],
  );

  const markAllRead = useCallback(
    (list: Development[]) =>
      setReadMap((m) => ({ ...m, ...Object.fromEntries(list.map((d) => [d.id, d.lastUpdated])) })),
    [setReadMap],
  );

  const updateAction = useCallback(
    (actionId: string, patch: Partial<ActionProgress>) =>
      setProgress((p) => ({
        ...p,
        [actionId]: {
          ...(p[actionId] ?? { status: 'not_started' }),
          ...patch,
          updatedAt: new Date().toISOString(),
        },
      })),
    [setProgress],
  );

  const value = useMemo<Workspace>(
    () => ({
      today,
      footprint,
      setFootprint,
      inFootprint: (d) => d.market === 'global' || footprint.includes(d.market),
      watchlist,
      isWatched: (id) => watchlist.includes(id),
      toggleWatch,
      isUnread,
      markRead,
      markAllRead,
      progress,
      updateAction,
      resetWorkspace: () => {
        resetFootprint();
        resetWatchlist();
        resetRead();
        resetProgress();
      },
    }),
    [
      today, footprint, setFootprint, watchlist, toggleWatch, isUnread, markRead, markAllRead,
      progress, updateAction, resetFootprint, resetWatchlist, resetRead, resetProgress,
    ],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): Workspace {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspace must be used inside <WorkspaceProvider>');
  return ctx;
}
