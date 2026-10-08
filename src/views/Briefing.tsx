import { useMemo, useState } from 'react';
import { Copy, Download, Printer } from 'lucide-react';
import type { Development } from '../types';
import { useWorkspace } from '../state/workspace';
import { MARKETS } from '../data/markets';
import { APPLICABILITY, IMPACTS, STATUSES, THEMES } from '../lib/taxonomy';
import { collectMilestones, sortDevelopments } from '../lib/filters';
import { addDays, formatDate } from '../lib/dates';
import { briefingMarkdown, downloadFile } from '../lib/export';
import { Button, Card, EmptyState, PageHeader, cx } from '../components/ui';

type Scope = 'recent' | 'high' | 'watched' | 'all';

const SCOPES: { id: Scope; label: string }[] = [
  { id: 'recent', label: 'Updated recently' },
  { id: 'high', label: 'High impact' },
  { id: 'watched', label: 'Watchlist' },
  { id: 'all', label: 'Everything in footprint' },
];

export function Briefing({ scoped }: { scoped: Development[] }) {
  const ws = useWorkspace();
  const [scope, setScope] = useState<Scope>('recent');
  const [days, setDays] = useState(90);
  const [title, setTitle] = useState('AI regulatory update');
  const [preparedFor, setPreparedFor] = useState('Risk & Compliance Committee');
  const [includeActions, setIncludeActions] = useState(true);
  const [copied, setCopied] = useState(false);

  const items = useMemo(() => {
    const since = addDays(ws.today, -days);
    const list = scoped.filter((d) =>
      scope === 'recent' ? d.lastUpdated >= since : scope === 'high' ? d.impact === 'high' : scope === 'watched' ? ws.isWatched(d.id) : true,
    );
    return sortDevelopments(list, 'impact', ws.today);
  }, [scoped, scope, days, ws]);

  const upcoming = useMemo(() => collectMilestones(items, ws.today, addDays(ws.today, 180)), [items, ws.today]);
  const markdown = () => briefingMarkdown(items, { title, preparedFor, today: ws.today, includeActions, upcoming });
  const high = items.filter((d) => d.impact === 'high');

  const inputCls = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="space-y-5">
      <div className="no-print">
        <PageHeader
          title="Briefing pack"
          description="Turn tracked developments into a committee-ready update. Copy it into an email, download Markdown, or print to PDF."
          actions={
            <>
              <Button
                disabled={!items.length}
                onClick={() =>
                  navigator.clipboard
                    ?.writeText(markdown())
                    .then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1800);
                    })
                    .catch(() => {})
                }
              >
                <Copy className="h-4 w-4" /> {copied ? 'Copied' : 'Copy Markdown'}
              </Button>
              <Button disabled={!items.length} onClick={() => downloadFile('ai-regulatory-briefing.md', markdown(), 'text/markdown;charset=utf-8')}>
                <Download className="h-4 w-4" /> Download .md
              </Button>
              <Button variant="primary" disabled={!items.length} onClick={() => window.print()}>
                <Printer className="h-4 w-4" /> Print / PDF
              </Button>
            </>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Card className="no-print h-fit space-y-4 p-4">
          <div>
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">Include</p>
            <div className="space-y-1">
              {SCOPES.map((s) => (
                <label key={s.id} className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-sm text-slate-700 hover:bg-slate-50">
                  <input type="radio" name="scope" checked={scope === s.id} onChange={() => setScope(s.id)} className="accent-[#071d49]" />
                  {s.label}
                </label>
              ))}
            </div>
            {scope === 'recent' && (
              <select value={days} onChange={(e) => setDays(Number(e.target.value))} className={cx(inputCls, 'mt-2')} aria-label="Lookback window">
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
                <option value={180}>Last 6 months</option>
                <option value={365}>Last 12 months</option>
              </select>
            )}
          </div>
          <label className="block">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Prepared for</span>
            <input value={preparedFor} onChange={(e) => setPreparedFor(e.target.value)} className={inputCls} />
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={includeActions} onChange={(e) => setIncludeActions(e.target.checked)} className="accent-[#071d49]" />
            Include recommended actions
          </label>
        </Card>

        {items.length === 0 ? (
          <EmptyState title="No developments in this selection" body="Choose a wider window or another scope." />
        ) : (
          <article className="print-area rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
            <header className="border-b border-slate-200 pb-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-700">Internal briefing · Confidential</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
              <p className="mt-1 text-sm text-slate-500">
                Prepared {formatDate(ws.today)}
                {preparedFor && <> for {preparedFor}</>} · {items.length} developments · {high.length} high impact
              </p>
            </header>

            <section className="mt-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Key messages</h3>
              <ul className="mt-3 space-y-2">
                {(high.length ? high : items.slice(0, 3)).map((d) => (
                  <li key={d.id} className="text-sm leading-relaxed text-slate-700">
                    <span className="font-semibold text-slate-900">
                      {MARKETS[d.market].flag} {MARKETS[d.market].shortName} – {d.title}:
                    </span>{' '}
                    {d.latestUpdate}
                  </li>
                ))}
              </ul>
            </section>

            {upcoming.length > 0 && (
              <section className="mt-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Deadlines in the next 6 months</h3>
                <table className="mt-3 w-full text-left text-sm">
                  <tbody className="divide-y divide-slate-100">
                    {upcoming.map((m, i) => (
                      <tr key={i}>
                        <td className="w-28 whitespace-nowrap py-2 pr-3 font-semibold text-slate-800 tabular">{formatDate(m.date)}</td>
                        <td className="w-24 py-2 pr-3 text-slate-500">{MARKETS[m.development.market].shortName}</td>
                        <td className="py-2 text-slate-700">
                          {m.label}
                          {!m.confirmed && <span className="ml-1 text-xs italic text-slate-400">(indicative)</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            <section className="mt-8 space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Developments</h3>
              {items.map((d) => (
                <div key={d.id} className="break-inside-avoid border-l-4 pl-4" style={{ borderColor: d.impact === 'high' ? '#e11d48' : d.impact === 'medium' ? '#fbbf24' : '#cbd5e1' }}>
                  <h4 className="text-base font-bold text-slate-900">
                    {MARKETS[d.market].flag} {d.title}
                  </h4>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {d.regulator} · {STATUSES[d.status].label} · {IMPACTS[d.impact].label} · {APPLICABILITY[d.applicability].label} · Updated {formatDate(d.lastUpdated)}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700"><span className="font-semibold text-slate-900">Latest: </span>{d.latestUpdate}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-700"><span className="font-semibold text-slate-900">What it means for us: </span>{d.buySideImpact}</p>
                  <p className="mt-1.5 text-xs text-slate-500">Themes: {d.themes.map((t) => THEMES[t].short).join(', ')}</p>
                  {includeActions && (
                    <ul className="mt-2 space-y-1">
                      {d.actions.map((a) => {
                        const st = ws.progress[a.id]?.status;
                        return (
                          <li key={a.id} className="flex gap-2 text-sm text-slate-700">
                            <span aria-hidden className="mt-0.5 font-mono text-xs text-slate-400">{st === 'done' ? '[x]' : st === 'not_applicable' ? '[–]' : '[ ]'}</span>
                            <span>
                              {a.text} <span className="text-xs text-slate-400">({ws.progress[a.id]?.owner ?? a.owner})</span>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  <p className="mt-2 break-all text-xs text-blue-700">{d.sourceUrl}</p>
                </div>
              ))}
            </section>

            <footer className="mt-10 border-t border-slate-200 pt-4 text-[11px] text-slate-500">
              For internal information purposes only. Not legal advice. Verify against primary sources before relying on any item.
            </footer>
          </article>
        )}
      </div>
    </div>
  );
}
