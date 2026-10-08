import { useEffect, useRef } from 'react';
import { AlertTriangle, ExternalLink, Link2, ShieldCheck, X } from 'lucide-react';
import type { Development, Theme } from '../types';
import { MARKETS } from '../data/markets';
import { useWorkspace } from '../state/workspace';
import { APPLICABILITY, CONFIDENCE, TYPES } from '../lib/taxonomy';
import { daysBetween, formatDate, relativeDays } from '../lib/dates';
import { ActionRow } from './ActionRow';
import { ImpactBadge, Pill, StatusBadge, ThemeChip, WatchButton, cx } from './ui';
import { actionCompletion } from './DevelopmentRow';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{title}</h3>
      {children}
    </section>
  );
}

export function DevelopmentDrawer({
  development: d,
  onClose,
  onTheme,
}: {
  development: Development | null;
  onClose: () => void;
  onTheme: (t: Theme) => void;
}) {
  const ws = useWorkspace();
  const closeRef = useRef<HTMLButtonElement>(null);
  const { markRead } = ws;

  useEffect(() => {
    if (!d) return;
    markRead(d);
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [d, markRead, onClose]);

  if (!d) return null;
  const market = MARKETS[d.market];
  const { done, total } = actionCompletion(d, ws.progress);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
      <div className="relative flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl animate-[slideIn_.18s_ease-out]">
        {/* Header */}
        <header className="border-b border-slate-200 px-5 pb-4 pt-4 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span className="text-base leading-none" aria-hidden>{market.flag}</span>
              {market.name}
              <span className="text-slate-300">/</span>
              <span className="font-medium text-slate-500">{TYPES[d.instrumentType].label}</span>
            </div>
            <div className="flex items-center gap-1">
              <WatchButton watched={ws.isWatched(d.id)} onToggle={() => ws.toggleWatch(d.id)} size="md" />
              <button
                type="button"
                title="Copy link"
                aria-label="Copy link to this development"
                onClick={() => navigator.clipboard?.writeText(window.location.href).catch(() => {})}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <Link2 className="h-5 w-5" />
              </button>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close panel"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <h2 id="drawer-title" className="mt-2 text-lg font-bold leading-snug text-slate-900">{d.title}</h2>
          <p className="mt-1 text-xs text-slate-500">{d.officialTitle}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <ImpactBadge impact={d.impact} />
            <StatusBadge status={d.status} />
            <Pill className={APPLICABILITY[d.applicability].badge} title={APPLICABILITY[d.applicability].description}>
              {APPLICABILITY[d.applicability].label}
            </Pill>
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-6">
          <dl className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-xs sm:grid-cols-4">
            <div>
              <dt className="text-slate-500">Regulator</dt>
              <dd className="mt-0.5 font-semibold text-slate-800">{d.regulator}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Published</dt>
              <dd className="mt-0.5 font-semibold text-slate-800">{formatDate(d.datePublished)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Effective</dt>
              <dd className="mt-0.5 font-semibold text-slate-800">{formatDate(d.effectiveDate)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Last development</dt>
              <dd className="mt-0.5 font-semibold text-slate-800">{formatDate(d.lastUpdated)}</dd>
            </div>
          </dl>

          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Latest development</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-800">{d.latestUpdate}</p>
          </div>

          <Section title="Summary">
            <p className="text-sm leading-relaxed text-slate-700">{d.summary}</p>
          </Section>

          <Section title="What it means for a buy-side firm">
            <p className="border-l-2 border-[#071d49] pl-3 text-sm leading-relaxed text-slate-800">{d.buySideImpact}</p>
          </Section>

          <Section title="Key requirements & expectations">
            <ul className="space-y-1.5">
              {d.keyRequirements.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed text-slate-700">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                  {r}
                </li>
              ))}
            </ul>
          </Section>

          <Section title={`Action plan · ${done}/${total} complete`}>
            <ul className="space-y-2">
              {d.actions.map((a) => (
                <ActionRow key={a.id} action={a} />
              ))}
            </ul>
          </Section>

          <Section title="Timeline">
            <ol className="relative ml-1 space-y-3 border-l border-slate-200 pl-4">
              {d.milestones.map((m, i) => {
                const days = daysBetween(ws.today, m.date);
                const past = days < 0;
                return (
                  <li key={i} className="relative">
                    <span
                      aria-hidden
                      className={cx(
                        'absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full ring-2 ring-white',
                        past ? 'bg-slate-300' : m.confirmed ? 'bg-blue-600' : 'border border-blue-600 bg-white',
                      )}
                    />
                    <p className={cx('text-xs font-semibold', past ? 'text-slate-400' : 'text-slate-800')}>
                      {formatDate(m.date)}
                      <span className="ml-1.5 font-normal text-slate-400">{relativeDays(days)}</span>
                      {!m.confirmed && <span className="ml-1.5 font-normal italic text-slate-400">indicative</span>}
                    </p>
                    <p className={cx('text-sm', past ? 'text-slate-500' : 'text-slate-700')}>{m.label}</p>
                  </li>
                );
              })}
            </ol>
          </Section>

          <Section title="Themes">
            <div className="flex flex-wrap gap-1.5">
              {d.themes.map((t) => (
                <ThemeChip key={t} theme={t} onClick={() => onTheme(t)} />
              ))}
            </div>
          </Section>

          <div
            className={cx(
              'flex items-start gap-2.5 rounded-xl border p-3 text-xs',
              d.confidence === 'low' ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-slate-200 bg-slate-50 text-slate-600',
            )}
          >
            {d.confidence === 'low' ? <AlertTriangle className="h-4 w-4 shrink-0" /> : <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />}
            <p>
              <span className="font-semibold">{CONFIDENCE[d.confidence].label}.</span> {CONFIDENCE[d.confidence].description} This
              summary is for internal information only and is not legal advice.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-200 px-5 py-3 sm:px-6">
          <a
            href={d.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:underline"
          >
            Read the primary source ({d.sourceLabel})
            <ExternalLink className="h-4 w-4" />
          </a>
        </footer>
      </div>
    </div>
  );
}
