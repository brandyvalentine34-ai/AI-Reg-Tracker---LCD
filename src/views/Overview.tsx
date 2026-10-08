import { useMemo } from 'react';
import { ArrowRight, BellDot, CalendarClock, Flame, Grid3X3, ListChecks, Star } from 'lucide-react';
import type { Development, Filters, MarketId, Theme, ViewId } from '../types';
import { useWorkspace } from '../state/workspace';
import { MARKETS, MARKET_ORDER } from '../data/markets';
import { THEMES, THEME_ORDER } from '../lib/taxonomy';
import { collectMilestones, sortDevelopments } from '../lib/filters';
import { addDays, daysBetween, formatDate, relativeDays } from '../lib/dates';
import { DevelopmentRow } from '../components/DevelopmentRow';
import { Button, Card, CardHeader, ImpactBadge, PageHeader, cx } from '../components/ui';
import { DATA_REVIEWED_ON } from '../data';

/** Sequential single-hue (blue) ramp: lightest = fewest. Text flips to white on dark steps. */
const HEAT_STEPS = [
  { bg: '#cde2fb', fg: '#0f172a' },
  { bg: '#9ec5f4', fg: '#0f172a' },
  { bg: '#6da7ec', fg: '#0f172a' },
  { bg: '#3987e5', fg: '#ffffff' },
  { bg: '#256abf', fg: '#ffffff' },
];

function heatStyle(n: number) {
  if (n === 0) return undefined;
  const s = HEAT_STEPS[Math.min(n, HEAT_STEPS.length) - 1];
  return { backgroundColor: s.bg, color: s.fg };
}

function Kpi({
  label,
  value,
  hint,
  icon: Icon,
  onClick,
  tone = 'slate',
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: typeof Flame;
  onClick?: () => void;
  tone?: 'slate' | 'rose' | 'blue' | 'amber' | 'emerald';
}) {
  const toneCls = {
    slate: 'bg-slate-100 text-slate-600',
    rose: 'bg-rose-50 text-rose-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  }[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-shadow enabled:hover:shadow-md disabled:cursor-default"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">{label}</span>
        <span className={cx('rounded-lg p-1.5', toneCls)}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 tabular">{value}</p>
      {hint && <p className="mt-0.5 text-[11px] text-slate-500">{hint}</p>}
    </button>
  );
}

export function Overview({
  scoped,
  onOpen,
  onNavigate,
  onBrowse,
}: {
  scoped: Development[];
  onOpen: (id: string) => void;
  onNavigate: (v: ViewId) => void;
  onBrowse: (f: Partial<Filters>) => void;
}) {
  const ws = useWorkspace();
  const horizonEnd = addDays(ws.today, 90);

  const latest = useMemo(() => sortDevelopments(scoped, 'latest', ws.today).slice(0, 6), [scoped, ws.today]);
  const upcoming = useMemo(() => collectMilestones(scoped, ws.today), [scoped, ws.today]);
  const next90 = upcoming.filter((m) => m.date <= horizonEnd);
  const high = scoped.filter((d) => d.impact === 'high');
  const unread = scoped.filter(ws.isUnread);
  const watched = scoped.filter((d) => ws.isWatched(d.id));

  const actionIds = scoped.flatMap((d) => d.actions.map((a) => a.id));
  const applicable = actionIds.filter((id) => ws.progress[id]?.status !== 'not_applicable');
  const doneCount = applicable.filter((id) => ws.progress[id]?.status === 'done').length;
  const pct = applicable.length ? Math.round((doneCount / applicable.length) * 100) : 0;

  const markets = MARKET_ORDER.filter((m) => scoped.some((d) => d.market === m));
  const matrix = useMemo(() => {
    const out: Record<string, number> = {};
    for (const d of scoped) for (const t of d.themes) out[`${d.market}:${t}`] = (out[`${d.market}:${t}`] ?? 0) + 1;
    return out;
  }, [scoped]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI regulatory overview"
        description={
          <>
            What has changed, what is coming and where your firm stands, across {markets.length} markets in your footprint.
            Content reviewed {formatDate(DATA_REVIEWED_ON)}.
          </>
        }
        actions={
          <>
            <Button onClick={() => onNavigate('briefing')}>Build briefing pack</Button>
            <Button variant="primary" onClick={() => onNavigate('developments')}>
              Browse developments <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Kpi label="Developments tracked" value={scoped.length} hint={`${markets.length} markets`} icon={Grid3X3} onClick={() => onBrowse({})} />
        <Kpi label="High impact" value={high.length} hint="for asset managers" icon={Flame} tone="rose" onClick={() => onBrowse({ impacts: ['high'] })} />
        <Kpi label="Unread updates" value={unread.length} hint="since you last looked" icon={BellDot} tone="blue" onClick={() => onBrowse({ unreadOnly: true })} />
        <Kpi label="Deadlines ≤ 90 days" value={next90.length} hint={`to ${formatDate(horizonEnd)}`} icon={CalendarClock} tone="amber" onClick={() => onNavigate('horizon')} />
        <Kpi label="Action plan" value={`${pct}%`} hint={`${doneCount} of ${applicable.length} actions done`} icon={ListChecks} tone="emerald" onClick={() => onNavigate('actions')} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader
            title="Latest developments"
            subtitle="Most recent regulatory movements in your footprint"
            action={
              <Button variant="ghost" onClick={() => onNavigate('developments')}>
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            }
          />
          <div className="space-y-2.5 p-4">
            {latest.map((d) => (
              <DevelopmentRow key={d.id} d={d} onOpen={onOpen} dense />
            ))}
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader
            title="Upcoming deadlines"
            subtitle="Next milestones, earliest first"
            action={
              <Button variant="ghost" onClick={() => onNavigate('horizon')}>
                Horizon <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            }
          />
          <ol className="divide-y divide-slate-100">
            {upcoming.slice(0, 8).map((m, i) => {
              const days = daysBetween(ws.today, m.date);
              return (
                <li key={i}>
                  <button type="button" onClick={() => onOpen(m.development.id)} className="flex w-full gap-3 px-5 py-3 text-left hover:bg-slate-50">
                    <div className="w-14 shrink-0 text-center">
                      <p className="text-[10px] font-bold uppercase text-slate-500">{formatDate(m.date).split(' ').slice(1).join(' ')}</p>
                      <p className="text-lg font-bold leading-none text-slate-900 tabular">{formatDate(m.date).split(' ')[0]}</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-500">
                        <span aria-hidden>{MARKETS[m.development.market].flag}</span> {MARKETS[m.development.market].shortName} ·{' '}
                        <span className={cx(days <= 30 ? 'font-semibold text-rose-600' : '')}>{relativeDays(days)}</span>
                        {!m.confirmed && <span className="italic"> · indicative</span>}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-sm font-medium text-slate-800">{m.label}</p>
                      <p className="truncate text-[11px] text-slate-500">{m.development.title}</p>
                    </div>
                  </button>
                </li>
              );
            })}
            {upcoming.length === 0 && <li className="px-5 py-8 text-center text-xs text-slate-500">No upcoming milestones in scope.</li>}
          </ol>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Exposure heatmap"
          subtitle="Number of developments by market and theme. Select a cell to see them."
          icon={<Grid3X3 className="h-4 w-4" />}
        />
        <div className="overflow-x-auto p-4">
          <table className="w-full min-w-[760px] border-separate border-spacing-[2px] text-xs">
            <thead>
              <tr>
                <th className="w-32 text-left font-semibold text-slate-500" scope="col">Market</th>
                {THEME_ORDER.map((t) => (
                  <th key={t} scope="col" className="px-1 pb-1 text-center align-bottom text-[10px] font-semibold leading-tight text-slate-500" title={THEMES[t].label}>
                    {THEMES[t].short}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {markets.map((m: MarketId) => (
                <tr key={m}>
                  <th scope="row" className="whitespace-nowrap pr-2 text-left font-semibold text-slate-700">
                    <button type="button" onClick={() => onBrowse({ markets: [m] })} className="hover:text-blue-700">
                      <span aria-hidden>{MARKETS[m].flag}</span> {MARKETS[m].shortName}
                    </button>
                  </th>
                  {THEME_ORDER.map((t: Theme) => {
                    const n = matrix[`${m}:${t}`] ?? 0;
                    return (
                      <td key={t} className="p-0">
                        <button
                          type="button"
                          disabled={n === 0}
                          onClick={() => onBrowse({ markets: [m], themes: [t] })}
                          title={`${MARKETS[m].shortName} · ${THEMES[t].label}: ${n} development${n === 1 ? '' : 's'}`}
                          style={heatStyle(n)}
                          className={cx(
                            'h-9 w-full rounded font-semibold tabular transition-[outline] enabled:hover:outline-2 enabled:hover:outline-[#071d49]',
                            n === 0 && 'bg-slate-50 text-slate-300',
                          )}
                        >
                          {n || '·'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
            <span>Fewer</span>
            {HEAT_STEPS.map((s, i) => (
              <span key={i} className="h-3 w-6 rounded-sm" style={{ backgroundColor: s.bg }} />
            ))}
            <span>More</span>
          </div>
        </div>
      </Card>

      {watched.length > 0 && (
        <Card>
          <CardHeader title="Your watchlist" subtitle={`${watched.length} starred developments`} icon={<Star className="h-4 w-4" />} />
          <ul className="divide-y divide-slate-100">
            {sortDevelopments(watched, 'latest', ws.today).map((d) => (
              <li key={d.id}>
                <button type="button" onClick={() => onOpen(d.id)} className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-slate-50">
                  <span aria-hidden>{MARKETS[d.market].flag}</span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">{d.title}</span>
                  <ImpactBadge impact={d.impact} />
                  <span className="hidden text-[11px] text-slate-500 sm:inline">Updated {formatDate(d.lastUpdated)}</span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
