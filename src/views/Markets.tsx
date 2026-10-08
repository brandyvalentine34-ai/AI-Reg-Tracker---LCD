import { ArrowLeft, Building2, CalendarClock, Check, Plus } from 'lucide-react';
import type { Development, MarketId } from '../types';
import { useWorkspace } from '../state/workspace';
import { MARKETS, MARKET_ORDER } from '../data/markets';
import { collectMilestones, sortDevelopments } from '../lib/filters';
import { formatDate } from '../lib/dates';
import { DevelopmentRow } from '../components/DevelopmentRow';
import { Button, Card, PageHeader, cx } from '../components/ui';

function MarketCard({ id, items, onSelect }: { id: MarketId; items: Development[]; onSelect: () => void }) {
  const ws = useWorkspace();
  const m = MARKETS[id];
  const high = items.filter((d) => d.impact === 'high').length;
  const direct = items.filter((d) => d.applicability === 'direct').length;
  const next = collectMilestones(items, ws.today)[0];
  const inScope = id === 'global' || ws.footprint.includes(id);
  const unread = items.filter(ws.isUnread).length;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cx(
        'flex flex-col rounded-2xl border bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md',
        inScope ? 'border-slate-200' : 'border-dashed border-slate-300 opacity-75',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl leading-none" aria-hidden>{m.flag}</span>
          <div>
            <p className="text-sm font-bold text-slate-900">{m.name}</p>
            <p className="text-[11px] text-slate-500">{m.region}</p>
          </div>
        </div>
        {inScope ? (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">In footprint</span>
        ) : (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">Not in footprint</span>
        )}
      </div>
      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-600">{m.approach}</p>
      <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-center">
        <div>
          <dt className="text-[10px] font-semibold uppercase text-slate-500">Tracked</dt>
          <dd className="text-lg font-bold text-slate-900 tabular">{items.length}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase text-slate-500">High</dt>
          <dd className={cx('text-lg font-bold tabular', high ? 'text-rose-600' : 'text-slate-300')}>{high}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase text-slate-500">Direct</dt>
          <dd className="text-lg font-bold text-slate-900 tabular">{direct}</dd>
        </div>
      </dl>
      <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-slate-500">
        <span className="inline-flex min-w-0 items-center gap-1">
          <CalendarClock className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{next ? `Next: ${formatDate(next.date)}` : 'No scheduled milestones'}</span>
        </span>
        {unread > 0 && <span className="shrink-0 font-semibold text-blue-700">{unread} unread</span>}
      </div>
    </button>
  );
}

export function Markets({
  all,
  selected,
  onSelect,
  onOpen,
}: {
  all: Development[];
  selected: MarketId | null;
  onSelect: (m: MarketId | null) => void;
  onOpen: (id: string) => void;
}) {
  const ws = useWorkspace();

  if (selected) {
    const m = MARKETS[selected];
    const items = sortDevelopments(all.filter((d) => d.market === selected), 'impact', ws.today);
    const inScope = selected === 'global' || ws.footprint.includes(selected);
    return (
      <div className="space-y-5">
        <button type="button" onClick={() => onSelect(null)} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800">
          <ArrowLeft className="h-3.5 w-3.5" /> All markets
        </button>
        <PageHeader
          title={`${m.flag} ${m.name}`}
          description={m.approach}
          actions={
            selected !== 'global' && (
              <Button
                onClick={() =>
                  ws.setFootprint(inScope ? ws.footprint.filter((x) => x !== selected) : MARKET_ORDER.filter((x) => x === selected || ws.footprint.includes(x)))
                }
              >
                {inScope ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Plus className="h-3.5 w-3.5" />}
                {inScope ? 'In my footprint' : 'Add to footprint'}
              </Button>
            )
          }
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="p-5 lg:col-span-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Buy-side posture</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{m.posture}</p>
          </Card>
          <Card className="p-5">
            <h2 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <Building2 className="h-3.5 w-3.5" /> Key authorities
            </h2>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
              {m.keyRegulators.map((r) => (
                <li key={r} className="flex gap-2">
                  <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                  {r}
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <h2 className="pt-2 text-sm font-bold text-slate-900">{items.length} tracked developments</h2>
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {items.map((d) => (
            <DevelopmentRow key={d.id} d={d} onOpen={onOpen} />
          ))}
        </div>
      </div>
    );
  }

  const ordered = [
    ...MARKET_ORDER.filter((id) => id === 'global' || ws.footprint.includes(id)),
    ...MARKET_ORDER.filter((id) => id !== 'global' && !ws.footprint.includes(id)),
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="Markets" description="Regulatory posture and exposure by market. Markets in your footprint are listed first." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ordered.map((id) => (
          <MarketCard key={id} id={id} items={all.filter((d) => d.market === id)} onSelect={() => onSelect(id)} />
        ))}
      </div>
    </div>
  );
}
