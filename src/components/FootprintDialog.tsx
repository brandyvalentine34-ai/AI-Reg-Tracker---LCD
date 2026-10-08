import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { MarketId } from '../types';
import { MARKETS, MARKET_ORDER } from '../data/markets';
import { useWorkspace } from '../state/workspace';
import { Button, cx } from './ui';

const SELECTABLE = MARKET_ORDER.filter((m) => m !== 'global');

const PRESETS: { label: string; markets: MarketId[] }[] = [
  { label: 'All markets', markets: SELECTABLE },
  { label: 'Europe', markets: ['eu', 'uk', 'ch'] },
  { label: 'US & Canada', markets: ['us', 'ca'] },
  { label: 'Asia-Pacific', markets: ['sg', 'hk', 'jp', 'au', 'cn', 'kr'] },
  { label: 'Global UCITS distributor', markets: ['eu', 'uk', 'ch', 'sg', 'hk'] },
];

export function FootprintDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ws = useWorkspace();
  const [draft, setDraft] = useState<MarketId[]>(ws.footprint);

  useEffect(() => {
    if (!open) return;
    setDraft(ws.footprint);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, ws.footprint, onClose]);

  if (!open) return null;
  const toggle = (m: MarketId) => setDraft((d) => (d.includes(m) ? d.filter((x) => x !== m) : [...d, m]));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-labelledby="fp-title">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-slate-900/40" />
      <div className="relative w-full max-w-lg rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 id="fp-title" className="text-base font-bold text-slate-900">Your market footprint</h2>
            <p className="mt-1 text-xs text-slate-500">
              Choose where your firm is licensed, manages money or distributes funds. Overview, horizon, action plan and briefings
              focus on these markets. Global standard-setters are always included.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setDraft(p.markets)}
              className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SELECTABLE.map((id) => {
            const m = MARKETS[id];
            const on = draft.includes(id);
            return (
              <label
                key={id}
                className={cx(
                  'flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors',
                  on ? 'border-blue-600 bg-blue-50 text-slate-900' : 'border-slate-200 text-slate-600 hover:bg-slate-50',
                )}
              >
                <input type="checkbox" checked={on} onChange={() => toggle(id)} className="accent-blue-600" />
                <span aria-hidden>{m.flag}</span>
                <span className="font-medium">{m.shortName}</span>
              </label>
            );
          })}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            disabled={draft.length === 0}
            onClick={() => {
              ws.setFootprint(SELECTABLE.filter((m) => draft.includes(m)));
              onClose();
            }}
          >
            Save footprint
          </Button>
        </div>
      </div>
    </div>
  );
}
