import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import type { ActionStatus, Development, MarketId, Owner } from '../types';
import { useWorkspace } from '../state/workspace';
import { MARKETS, MARKET_ORDER } from '../data/markets';
import { ACTION_STATUSES, IMPACTS, OWNERS } from '../lib/taxonomy';
import { IS_PREVIEW, actionPlanCSV, exportFile } from '../lib/export';
import { ActionRow } from '../components/ActionRow';
import { Button, Card, EmptyState, ImpactBadge, PageHeader, cx } from '../components/ui';

const STATUS_KEYS = Object.keys(ACTION_STATUSES) as ActionStatus[];

export function ActionPlan({ scoped, onOpen }: { scoped: Development[]; onOpen: (id: string) => void }) {
  const ws = useWorkspace();
  const [scope, setScope] = useState<'all' | 'watched' | 'high'>('all');
  const [status, setStatus] = useState<ActionStatus | 'open' | 'any'>('open');
  const [owner, setOwner] = useState<Owner | 'any'>('any');
  const [market, setMarket] = useState<MarketId | 'any'>('any');

  const inScope = useMemo(
    () =>
      scoped
        .filter((d) => (scope === 'watched' ? ws.isWatched(d.id) : scope === 'high' ? d.impact === 'high' : true))
        .filter((d) => market === 'any' || d.market === market)
        .sort((a, b) => IMPACTS[b.impact].rank - IMPACTS[a.impact].rank || MARKET_ORDER.indexOf(a.market) - MARKET_ORDER.indexOf(b.market)),
    [scoped, scope, market, ws],
  );

  const statusOf = (id: string) => ws.progress[id]?.status ?? 'not_started';
  const ownerOf = (d: Development, id: string) => ws.progress[id]?.owner ?? d.actions.find((a) => a.id === id)!.owner;

  const groups = inScope
    .map((d) => ({
      d,
      actions: d.actions.filter((a) => {
        const s = statusOf(a.id);
        const okStatus = status === 'any' ? true : status === 'open' ? s === 'not_started' || s === 'in_progress' : s === status;
        return okStatus && (owner === 'any' || ownerOf(d, a.id) === owner);
      }),
    }))
    .filter((g) => g.actions.length > 0);

  const allActions = inScope.flatMap((d) => d.actions);
  const counts = Object.fromEntries(STATUS_KEYS.map((s) => [s, allActions.filter((a) => statusOf(a.id) === s).length])) as Record<ActionStatus, number>;
  const applicable = allActions.length - counts.not_applicable;
  const pct = applicable ? Math.round((counts.done / applicable) * 100) : 0;

  const byOwner = OWNERS.map((o) => {
    const mine = inScope.flatMap((d) => d.actions.filter((a) => ownerOf(d, a.id) === o && statusOf(a.id) !== 'not_applicable'));
    return { owner: o, total: mine.length, done: mine.filter((a) => statusOf(a.id) === 'done').length };
  }).filter((x) => x.total > 0);

  const selectCls = 'rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700';

  return (
    <div className="space-y-5">
      <PageHeader
        title="Action plan"
        description="Recommended actions from each development, ready to assign, track and evidence. Progress is saved in this browser; export to CSV to share with your committee or GRC tool."
        actions={
          <Button variant="primary" onClick={() => exportFile('ai-reg-action-plan.csv', actionPlanCSV(inScope, ws.progress), 'text/csv;charset=utf-8')}>
            <Download className="h-4 w-4" /> {IS_PREVIEW ? 'Copy CSV' : 'Export CSV'}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs font-semibold text-slate-500">Overall completion</p>
          <p className="mt-1 text-3xl font-bold text-slate-900 tabular">{pct}%</p>
          <div className="mt-3 flex h-2 gap-[2px] overflow-hidden rounded-full bg-slate-100" role="img" aria-label={`${counts.done} done, ${counts.in_progress} in progress, ${counts.not_started} not started`}>
            {counts.done > 0 && <div className="rounded-full bg-emerald-500" style={{ width: `${(counts.done / allActions.length) * 100}%` }} />}
            {counts.in_progress > 0 && <div className="rounded-full bg-amber-400" style={{ width: `${(counts.in_progress / allActions.length) * 100}%` }} />}
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-1 text-xs text-slate-600">
            <li><span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-emerald-500" />Done <b className="tabular">{counts.done}</b></li>
            <li><span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-amber-400" />In progress <b className="tabular">{counts.in_progress}</b></li>
            <li><span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-slate-200" />Not started <b className="tabular">{counts.not_started}</b></li>
            <li><span className="mr-1.5 inline-block h-2 w-2 rounded-full border border-slate-300" />N/A <b className="tabular">{counts.not_applicable}</b></li>
          </ul>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <p className="text-xs font-semibold text-slate-500">By owner</p>
          <ul className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {byOwner.map((o) => (
              <li key={o.owner}>
                <button type="button" onClick={() => setOwner(owner === o.owner ? 'any' : o.owner)} className="w-full text-left">
                  <div className="flex justify-between text-xs">
                    <span className={cx('font-medium', owner === o.owner ? 'text-blue-700' : 'text-slate-700')}>{o.owner}</span>
                    <span className="text-slate-500 tabular">{o.done}/{o.total}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(o.done / o.total) * 100}%` }} />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
          {(['all', 'high', 'watched'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setScope(s)}
              aria-pressed={scope === s}
              className={cx('rounded-md px-3 py-1 text-xs font-semibold', scope === s ? 'bg-[#071d49] text-white' : 'text-slate-600')}
            >
              {s === 'all' ? 'All in footprint' : s === 'high' ? 'High impact' : 'Watchlist'}
            </button>
          ))}
        </div>
        <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className={selectCls}>
          <option value="open">Open (not started + in progress)</option>
          <option value="any">Any status</option>
          {STATUS_KEYS.map((s) => <option key={s} value={s}>{ACTION_STATUSES[s].label}</option>)}
        </select>
        <select aria-label="Owner" value={owner} onChange={(e) => setOwner(e.target.value as typeof owner)} className={selectCls}>
          <option value="any">Any owner</option>
          {OWNERS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <select aria-label="Market" value={market} onChange={(e) => setMarket(e.target.value as typeof market)} className={selectCls}>
          <option value="any">Any market</option>
          {MARKET_ORDER.filter((m) => scoped.some((d) => d.market === m)).map((m) => (
            <option key={m} value={m}>{MARKETS[m].shortName}</option>
          ))}
        </select>
      </div>

      {groups.length === 0 ? (
        <EmptyState title="Nothing to show" body={status === 'open' ? 'No open actions for this selection – nice work.' : 'No actions match these filters.'} />
      ) : (
        <div className="space-y-4">
          {groups.map(({ d, actions }) => (
            <Card key={d.id} className="p-4">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span aria-hidden>{MARKETS[d.market].flag}</span>
                <button type="button" onClick={() => onOpen(d.id)} className="text-sm font-bold text-slate-900 hover:text-blue-700">
                  {d.title}
                </button>
                <ImpactBadge impact={d.impact} />
              </div>
              <ul className="space-y-2">
                {actions.map((a) => <ActionRow key={a.id} action={a} />)}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
