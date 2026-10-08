import { CalendarClock, CheckCircle2 } from 'lucide-react';
import type { Development, Theme } from '../types';
import { useWorkspace } from '../state/workspace';
import { nextMilestone } from '../lib/filters';
import { daysBetween, formatDate, relativeDays } from '../lib/dates';
import { DevelopmentMeta, ImpactBadge, StatusBadge, ThemeChip, UnreadDot, WatchButton, cx } from './ui';

export function actionCompletion(d: Development, progress: ReturnType<typeof useWorkspace>['progress']) {
  const relevant = d.actions.filter((a) => progress[a.id]?.status !== 'not_applicable');
  const done = relevant.filter((a) => progress[a.id]?.status === 'done').length;
  return { done, total: relevant.length };
}

export function DevelopmentRow({
  d,
  onOpen,
  onTheme,
  dense,
}: {
  d: Development;
  onOpen: (id: string) => void;
  onTheme?: (t: Theme) => void;
  dense?: boolean;
}) {
  const ws = useWorkspace();
  const next = nextMilestone(d, ws.today);
  const unread = ws.isUnread(d);
  const { done, total } = actionCompletion(d, ws.progress);

  return (
    <article
      className={cx(
        'group relative rounded-xl border bg-white transition-shadow hover:shadow-md',
        unread ? 'border-slate-200' : 'border-slate-200/70',
        dense ? 'p-3.5' : 'p-4',
      )}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <DevelopmentMeta d={d} />
            <span className="shrink-0 text-[11px] text-slate-400 tabular">{formatDate(d.lastUpdated)}</span>
          </div>
          <h3 className="mt-1.5 flex items-start gap-2 text-sm font-bold leading-snug text-slate-900">
            <span className="mt-1.5"><UnreadDot show={unread} /></span>
            <button
              type="button"
              onClick={() => onOpen(d.id)}
              className="text-left after:absolute after:inset-0 after:content-[''] hover:text-blue-700 focus-visible:outline-none"
            >
              {d.title}
            </button>
          </h3>
          <p className={cx('mt-1 text-xs leading-relaxed text-slate-600', dense ? 'line-clamp-2' : 'line-clamp-3')}>
            {d.latestUpdate}
          </p>

          <div className="relative z-10 mt-3 flex flex-wrap items-center gap-1.5">
            <ImpactBadge impact={d.impact} />
            <StatusBadge status={d.status} />
            {!dense && d.themes.slice(0, 3).map((t) => <ThemeChip key={t} theme={t} onClick={onTheme ? () => onTheme(t) : undefined} />)}
          </div>

          {!dense && (next || total > 0) && (
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-100 pt-2.5 text-[11px] text-slate-500">
              {next && (
                <span className="flex min-w-0 max-w-full items-center gap-1" title={next.label}>
                  <CalendarClock className="h-3.5 w-3.5 shrink-0" />
                  <span className="shrink-0 whitespace-nowrap font-semibold text-slate-700">{formatDate(next.date)}</span>
                  <span className="shrink-0 whitespace-nowrap">({relativeDays(daysBetween(ws.today, next.date))})</span>
                  <span className="hidden min-w-0 truncate sm:inline">– {next.label}</span>
                </span>
              )}
              {total > 0 && (
                <span className="inline-flex shrink-0 items-center gap-1">
                  <CheckCircle2 className={cx('h-3.5 w-3.5', done === total && 'text-emerald-600')} />
                  {done}/{total} actions
                </span>
              )}
            </div>
          )}
        </div>
        <div className="relative z-10 -mr-1 -mt-1">
          <WatchButton watched={ws.isWatched(d.id)} onToggle={() => ws.toggleWatch(d.id)} />
        </div>
      </div>
    </article>
  );
}
