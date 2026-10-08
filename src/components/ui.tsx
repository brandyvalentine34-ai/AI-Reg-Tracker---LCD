import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Star } from 'lucide-react';
import type { Development, Impact, MarketId, Status, Theme } from '../types';
import { MARKETS } from '../data/markets';
import { IMPACTS, STATUSES, THEMES } from '../lib/taxonomy';

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

export function Pill({ className, children, title }: { className?: string; children: ReactNode; title?: string }) {
  return (
    <span
      title={title}
      className={cx(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function MarketTag({ market, compact }: { market: MarketId; compact?: boolean }) {
  const m = MARKETS[market];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700" title={m.name}>
      <span aria-hidden className="text-sm leading-none">{m.flag}</span>
      {compact ? m.shortName : m.name}
    </span>
  );
}

export function ImpactBadge({ impact }: { impact: Impact }) {
  return <Pill className={IMPACTS[impact].badge}>{IMPACTS[impact].label}</Pill>;
}

export function StatusBadge({ status }: { status: Status }) {
  const s = STATUSES[status];
  return (
    <Pill className={s.badge}>
      <span aria-hidden className={cx('h-1.5 w-1.5 rounded-full', s.dot)} />
      {s.label}
    </Pill>
  );
}

export function ThemeChip({ theme, onClick }: { theme: Theme; onClick?: () => void }) {
  const t = THEMES[theme];
  if (!onClick) return <Pill className={t.badge} title={t.description}>{t.short}</Pill>;
  return (
    <button type="button" onClick={onClick} title={`Filter by ${t.label}`} className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
      <Pill className={cx(t.badge, 'hover:brightness-95')}>{t.short}</Pill>
    </button>
  );
}

export function UnreadDot({ show }: { show: boolean }) {
  if (!show) return null;
  return <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-blue-600" title="Updated since you last opened it" aria-label="Unread" />;
}

export function WatchButton({
  watched,
  onToggle,
  size = 'sm',
}: {
  watched: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md';
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-pressed={watched}
      aria-label={watched ? 'Remove from watchlist' : 'Add to watchlist'}
      title={watched ? 'Remove from watchlist' : 'Add to watchlist'}
      className={cx(
        'inline-flex items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-blue-600',
        size === 'sm' ? 'h-7 w-7' : 'h-9 w-9',
        watched ? 'text-amber-500 hover:bg-amber-50' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600',
      )}
    >
      <Star className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} fill={watched ? 'currentColor' : 'none'} />
    </button>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cx('rounded-2xl border border-slate-200 bg-white shadow-sm', className)}>{children}</section>;
}

export function CardHeader({
  title,
  subtitle,
  icon,
  action,
}: {
  title: string;
  subtitle?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
      <div className="flex min-w-0 items-start gap-2.5">
        {icon && <span className="mt-0.5 text-slate-400">{icon}</span>}
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-slate-900">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function Button({
  variant = 'secondary',
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }) {
  return (
    <button
      type="button"
      {...rest}
      className={cx(
        'inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600',
        variant === 'primary' && 'bg-[#071d49] text-white hover:bg-[#0b2a66]',
        variant === 'secondary' && 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
        variant === 'ghost' && 'text-slate-600 hover:bg-slate-100',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function EmptyState({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <p className="text-sm font-bold text-slate-800">{title}</p>
      {body && <p className="mx-auto mt-1 max-w-md text-xs text-slate-500">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 max-w-3xl text-sm text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2 sm:shrink-0 sm:justify-end">{actions}</div>}
    </div>
  );
}

/** Compact meta line used on list rows. */
export function DevelopmentMeta({ d }: { d: Development }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-x-2 text-xs text-slate-500">
      <span className="shrink-0"><MarketTag market={d.market} compact /></span>
      <span aria-hidden>·</span>
      <span className="min-w-0 truncate" title={d.regulator}>{d.regulator}</span>
    </div>
  );
}
