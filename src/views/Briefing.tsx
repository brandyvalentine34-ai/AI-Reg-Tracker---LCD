import { useMemo, useState } from 'react';
import { Copy, Download, Printer } from 'lucide-react';
import type { Development } from '../types';
import { useWorkspace } from '../state/workspace';
import { MARKETS } from '../data/markets';
import { APPLICABILITY, IMPACTS, STATUSES, THEMES } from '../lib/taxonomy';
import { collectMilestones, sortDevelopments } from '../lib/filters';
import { addDays, formatDate } from '../lib/dates';
import { IS_PREVIEW, briefingMarkdown, downloadFile } from '../lib/export';
import { Button, Card, EmptyState, PageHeader, cx } from '../components/ui';
import { Flag } from '../components/Flag';

const PERIODS: { days: number; label: string }[] = [
  { days: 30, label: 'Last 30 days' },
  { days: 90, label: 'Last 90 days' },
  { days: 180, label: 'Last 6 months' },
  { days: 365, label: 'Last 12 months' },
];

export function Briefing({ scoped }: { scoped: Development[] }) {
  const ws = useWorkspace();
  const [days, setDays] = useState(90);
  const [title, setTitle] = useState('AI regulatory update');
  const [copied, setCopied] = useState(false);

  const items = useMemo(() => {
    const since = addDays(ws.today, -days);
    return sortDevelopments(scoped.filter((d) => d.lastUpdated >= since), 'impact', ws.today);
  }, [scoped, days, ws.today]);

  const upcoming = useMemo(() => collectMilestones(items, ws.today, addDays(ws.today, 180)), [items, ws.today]);
  const markdown = () => briefingMarkdown(items, { title, today: ws.today, upcoming });
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
              {!IS_PREVIEW && (
                <>
                  <Button disabled={!items.length} onClick={() => downloadFile('ai-regulatory-briefing.md', markdown(), 'text/markdown;charset=utf-8')}>
                    <Download className="h-4 w-4" /> Download .md
                  </Button>
                  <Button variant="primary" disabled={!items.length} onClick={() => window.print()}>
                    <Printer className="h-4 w-4" /> Print / PDF
                  </Button>
                </>
              )}
            </>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Card className="no-print h-fit space-y-4 p-4">
          <div>
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">Include</p>
            <p className="mb-1.5 text-xs text-slate-500">Developments updated in the</p>
            <div className="space-y-1" role="radiogroup" aria-label="Period">
              {PERIODS.map((p) => (
                <label key={p.days} className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-sm text-slate-700 hover:bg-slate-50">
                  <input type="radio" name="period" checked={days === p.days} onChange={() => setDays(p.days)} className="accent-[#071d49]" />
                  {p.label}
                </label>
              ))}
            </div>
          </div>
          <label className="block">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
          </label>
        </Card>

        {items.length === 0 ? (
          <EmptyState title="No developments updated in this period" body="Choose a longer period." />
        ) : (
          <article className="print-area rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
            <header className="border-b border-slate-200 pb-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-700">Internal briefing · Confidential</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
              <p className="mt-1 text-sm text-slate-500">
                Prepared {formatDate(ws.today)} · {PERIODS.find((p) => p.days === days)?.label} · {items.length} developments · {high.length} high impact
              </p>
            </header>

            <section className="mt-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Key messages</h3>
              <ul className="mt-3 space-y-2">
                {(high.length ? high : items.slice(0, 3)).map((d) => (
                  <li key={d.id} className="text-sm leading-relaxed text-slate-700">
                    <span className="font-semibold text-slate-900">
                      <Flag market={d.market} /> {MARKETS[d.market].shortName} – {d.title}:
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
                    <Flag market={d.market} size="md" className="mr-1.5" />
                    {d.title}
                  </h4>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {d.regulator} · {STATUSES[d.status].label} · {IMPACTS[d.impact].label} · {APPLICABILITY[d.applicability].label} · Updated {formatDate(d.lastUpdated)}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700"><span className="font-semibold text-slate-900">Latest: </span>{d.latestUpdate}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-700"><span className="font-semibold text-slate-900">What it means for us: </span>{d.buySideImpact}</p>
                  <p className="mt-1.5 text-xs text-slate-500">Themes: {d.themes.map((t) => THEMES[t].short).join(', ')}</p>
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
