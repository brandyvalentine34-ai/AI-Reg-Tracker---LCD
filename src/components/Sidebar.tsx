import { CalendarRange, FileText, Globe2, LayoutDashboard, ListChecks, Newspaper, Settings2 } from 'lucide-react';
import type { ViewId } from '../types';
import { cx } from './ui';
import { formatDate } from '../lib/dates';
import { DATA_REVIEWED_ON } from '../data';

export const NAV: { id: ViewId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'developments', label: 'Developments', icon: Newspaper },
  { id: 'horizon', label: 'Horizon & deadlines', icon: CalendarRange },
  { id: 'markets', label: 'Markets', icon: Globe2 },
  { id: 'actions', label: 'Action plan', icon: ListChecks },
  { id: 'briefing', label: 'Briefing pack', icon: FileText },
];

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 text-sm font-black text-white shadow-inner">
        AI
      </div>
      <div className="leading-tight">
        <p className="text-sm font-bold text-white">AI Reg Tracker</p>
        <p className="text-[11px] font-medium text-sky-200/80">Buy-side compliance</p>
      </div>
    </div>
  );
}

export function Sidebar({
  view,
  onNavigate,
  unreadCount,
  openActions,
  footprintLabel,
  onEditFootprint,
}: {
  view: ViewId;
  onNavigate: (v: ViewId) => void;
  unreadCount: number;
  openActions: number;
  footprintLabel: string;
  onEditFootprint: () => void;
}) {
  return (
    <aside className="no-print sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-[#071d49] px-4 py-5 lg:flex">
      <Logo />
      <nav className="mt-8 space-y-1" aria-label="Main">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = view === id;
          const badge = id === 'developments' ? unreadCount : id === 'actions' ? openActions : 0;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              aria-current={active ? 'page' : undefined}
              className={cx(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active ? 'bg-white/12 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white',
              )}
            >
              <Icon className={cx('h-4 w-4', active ? 'text-sky-300' : 'text-slate-400')} />
              <span className="flex-1 text-left">{label}</span>
              {badge > 0 && (
                <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-sky-100 tabular">{badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <button
          type="button"
          onClick={onEditFootprint}
          className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-left transition-colors hover:bg-white/10"
        >
          <span className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            My footprint
            <Settings2 className="h-3.5 w-3.5" />
          </span>
          <span className="mt-1 block text-xs font-medium text-white">{footprintLabel}</span>
        </button>
        <p className="px-1 text-[11px] leading-relaxed text-slate-400">
          Content reviewed {formatDate(DATA_REVIEWED_ON)}. For internal information only – not legal advice.
        </p>
      </div>
    </aside>
  );
}

export function MobileNav({ view, onNavigate, onEditFootprint }: { view: ViewId; onNavigate: (v: ViewId) => void; onEditFootprint: () => void }) {
  return (
    <div className="no-print sticky top-0 z-40 bg-[#071d49] lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <Logo />
        <button type="button" onClick={onEditFootprint} className="rounded-lg p-2 text-slate-300 hover:bg-white/10" aria-label="Edit market footprint">
          <Settings2 className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-2" aria-label="Main">
        {NAV.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
            aria-current={view === id ? 'page' : undefined}
            className={cx(
              'whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold',
              view === id ? 'bg-white text-[#071d49]' : 'text-slate-300',
            )}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
