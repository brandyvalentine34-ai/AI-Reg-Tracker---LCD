import { useMemo, useState } from 'react';
import { CalendarPlus, History } from 'lucide-react';
import type { Development, Impact, MarketId } from '../types';
import { useWorkspace } from '../state/workspace';
import { MARKETS, MARKET_ORDER } from '../data/markets';
import { IMPACTS } from '../lib/taxonomy';
import { collectMilestones, type MilestoneEntry } from '../lib/filters';
import { addDays, daysBetween, formatDate, formatMonth, quarterKey, relativeDays } from '../lib/dates';
import { IS_PREVIEW, exportFile, milestonesICS } from '../lib/export';
import { Button, Card, EmptyState, ImpactBadge, PageHeader, cx } from '../components/ui';

const RANGES = [
  { label: '3 months', days: 92 },
  { label: '6 months', days: 183 },
  { label: '12 months', days: 366 },
  { label: '24 months', days: 731 },
  { label: 'All future', days: 0 },
];

export function Horizon({ scoped, onOpen }: { scoped: Development[]; onOpen: (id: string) => void }) {
  const ws = useWorkspace();
  const [range, setRange] = useState(366);
  const [showPast, setShowPast] = useState(false);
  const [markets, setMarkets] = useState<MarketId[]>([]);
  const [minImpact, setMinImpact] = useState<Impact | 'all'>('all');
  const [confirmedOnly, setConfirmedOnly] = useState(false);

  const available = MARKET_ORDER.filter((m) => scoped.some((d) => d.market === m));

  const entries = useMemo(() => {
    const from = showPast ? addDays(ws.today, -365) : ws.today;
    const to = range ? addDays(ws.today, range) : undefined;
    return collectMilestones(scoped, from, to).filter(
      (m) =>
        (markets.length === 0 || markets.includes(m.development.market)) &&
        (minImpact === 'all' || IMPACTS[m.development.impact].rank >= IMPACTS[minImpact].rank) &&
        (!confirmedOnly || m.confirmed),
    );
  }, [scoped, ws.today, range, showPast, markets, minImpact, confirmedOnly]);

  const grouped = useMemo(() => {
    const out: { quarter: string; months: { month: string; items: MilestoneEntry[] }[] }[] = [];
    for (const e of entries) {
      const q = quarterKey(e.date);
      const mo = formatMonth(e.date);
      let qg = out.at(-1);
      if (!qg || qg.quarter !== q) out.push((qg = { quarter: q, months: [] }));
      let mg = qg.months.at(-1);
      if (!mg || mg.month !== mo) qg.months.push((mg = { month: mo, items: [] }));
      mg.items.push(e);
    }
    return out;
  }, [entries]);

  const toggleMarket = (m: MarketId) => setMarkets((p) => (p.includes(m) ? p.filter((x) => x !== m) : [...p, m]));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Horizon & deadlines"
        description="Implementation dates, consultation closes and expected next steps across your footprint. Hollow markers are indicative dates not yet fixed."
        actions={
          <Button
            variant="primary"
            disabled={entries.length === 0}
            onClick={() => exportFile('ai-regulatory-deadlines.ics', milestonesICS(entries.filter((e) => e.date >= ws.today)), 'text/calendar')}
          >
            <CalendarPlus className="h-4 w-4" /> {IS_PREVIEW ? 'Copy calendar (.ics)' : 'Add to calendar (.ics)'}
          </Button>
        }
      />

      <Card className="space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Window</span>
          {RANGES.map((r) => (
            <button
              key={r.label}
              type="button"
              onClick={() => setRange(r.days)}
              aria-pressed={range === r.days}
              className={cx(
                'rounded-full px-3 py-1 text-xs font-semibold',
                range === r.days ? 'bg-[#071d49] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
              )}
            >
              {r.label}
            </button>
          ))}
          <label className="ml-auto inline-flex cursor-pointer items-center gap-1.5 text-xs text-slate-600">
            <input type="checkbox" checked={showPast} onChange={(e) => setShowPast(e.target.checked)} className="accent-[#071d49]" />
            <History className="h-3.5 w-3.5" /> Include last 12 months
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">Markets</span>
          {available.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => toggleMarket(m)}
              aria-pressed={markets.includes(m)}
              className={cx(
                'rounded-full border px-2.5 py-1 text-xs font-medium',
                markets.includes(m) ? 'border-[#071d49] bg-[#071d49] text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50',
              )}
            >
              <span aria-hidden>{MARKETS[m].flag}</span> {MARKETS[m].shortName}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
          <label className="inline-flex items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Impact</span>
            <select value={minImpact} onChange={(e) => setMinImpact(e.target.value as Impact | 'all')} className="rounded-md border border-slate-200 px-2 py-1">
              <option value="all">All</option>
              <option value="medium">Medium and above</option>
              <option value="high">High only</option>
            </select>
          </label>
          <label className="inline-flex cursor-pointer items-center gap-1.5">
            <input type="checkbox" checked={confirmedOnly} onChange={(e) => setConfirmedOnly(e.target.checked)} className="accent-[#071d49]" />
            Confirmed dates only
          </label>
          <span className="ml-auto text-slate-500">{entries.length} milestones</span>
        </div>
      </Card>

      {grouped.length === 0 ? (
        <EmptyState title="No milestones in this window" body="Widen the window or clear the market filter." />
      ) : (
        <div className="space-y-8">
          {grouped.map((q) => (
            <section key={q.quarter}>
              <h2 className="sticky top-0 z-10 -mx-1 bg-[#f6f7f9]/95 px-1 py-2 text-sm font-bold text-slate-900 backdrop-blur lg:top-0">{q.quarter}</h2>
              <div className="space-y-5">
                {q.months.map((mg) => (
                  <div key={mg.month} className="grid grid-cols-1 gap-3 sm:grid-cols-[110px_minmax(0,1fr)]">
                    <p className="pt-3 text-xs font-bold uppercase tracking-wider text-slate-500">{mg.month}</p>
                    <ol className="relative space-y-2 border-l border-slate-200 pl-5">
                      {mg.items.map((e, i) => {
                        const days = daysBetween(ws.today, e.date);
                        const past = days < 0;
                        return (
                          <li key={i} className="relative">
                            <span
                              aria-hidden
                              className={cx(
                                'absolute -left-[26px] top-4 h-2.5 w-2.5 rounded-full ring-4 ring-[#f6f7f9]',
                                past ? 'bg-slate-300' : e.confirmed ? IMPACTS[e.development.impact].bar : 'border-2 border-slate-400 bg-white',
                              )}
                            />
                            <button
                              type="button"
                              onClick={() => onOpen(e.development.id)}
                              className={cx(
                                'w-full rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition-shadow hover:shadow-md',
                                past && 'opacity-60',
                              )}
                            >
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                                <span className="font-bold text-slate-800 tabular">{formatDate(e.date)}</span>
                                <span>· {relativeDays(days)}</span>
                                {!e.confirmed && <span className="italic">· indicative</span>}
                                <span className="ml-auto">
                                  <ImpactBadge impact={e.development.impact} />
                                </span>
                              </div>
                              <p className="mt-1 text-sm font-semibold text-slate-900">{e.label}</p>
                              <p className="mt-0.5 text-xs text-slate-500">
                                <span aria-hidden>{MARKETS[e.development.market].flag}</span> {e.development.title} · {e.development.regulator}
                              </p>
                            </button>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
