import { useId } from 'react';
import { MARKETS, MARKET_ORDER } from '../data/markets';
import { cx } from './ui';

export const APP_TITLE = 'Global AI Regulatory Development Tracker';
export const APP_SUBTITLE = 'Developed by LCD Compliance for internal information purposes only';

/** App emblem: a globe with an orbiting "tracking" satellite. */
export function Emblem({ className }: { className?: string }) {
  // Unique per instance: a gradient defined inside a hidden copy would not paint the visible one.
  const gradientId = `emblem-bg-${useId().replace(/:/g, '')}`;
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="13" fill={`url(#${gradientId})`} />
      <rect x="0.75" y="0.75" width="46.5" height="46.5" rx="12.25" fill="none" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1.5" />
      {/* Globe */}
      <g fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="24" cy="24" r="11" />
        <ellipse cx="24" cy="24" rx="4.8" ry="11" />
        <line x1="13" y1="24" x2="35" y2="24" />
        <line x1="14.6" y1="18.4" x2="33.4" y2="18.4" strokeOpacity="0.7" />
        <line x1="14.6" y1="29.6" x2="33.4" y2="29.6" strokeOpacity="0.7" />
      </g>
      {/* Orbit and satellite (rotates slowly when motion is allowed) */}
      <ellipse cx="24" cy="24" rx="19" ry="7" fill="none" stroke="#bae6fd" strokeOpacity="0.75" strokeWidth="1.2" transform="rotate(-28 24 24)" />
      <g className="emblem-orbit">
        <g transform="rotate(-28 24 24)">
          <circle cx="43" cy="24" r="2.6" fill="#ffffff" />
          <circle cx="43" cy="24" r="4.4" fill="#ffffff" fillOpacity="0.25" />
        </g>
      </g>
    </svg>
  );
}

/** Decorative globe-and-network line art placed behind the header block. */
function HeaderArt({ className }: { className?: string }) {
  const nodes: [number, number][] = [
    [30, 40], [70, 22], [112, 46], [150, 28], [96, 86], [140, 104], [58, 112], [172, 70],
  ];
  const links: [number, number][] = [[0, 1], [1, 2], [2, 3], [2, 4], [4, 5], [4, 6], [3, 7], [5, 7], [0, 6]];
  return (
    <svg viewBox="0 0 200 140" className={className} aria-hidden="true">
      <g fill="none" stroke="#7dd3fc" strokeWidth="1">
        <circle cx="150" cy="70" r="62" strokeOpacity="0.16" />
        <ellipse cx="150" cy="70" rx="28" ry="62" strokeOpacity="0.12" />
        <ellipse cx="150" cy="70" rx="50" ry="62" strokeOpacity="0.1" />
        <line x1="88" y1="70" x2="212" y2="70" strokeOpacity="0.12" />
        <ellipse cx="150" cy="70" rx="62" ry="22" strokeOpacity="0.1" />
      </g>
      <g stroke="#bae6fd" strokeOpacity="0.22" strokeWidth="0.8">
        {links.map(([a, b], i) => (
          <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} />
        ))}
      </g>
      <g fill="#e0f2fe">
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2 : 1.4} fillOpacity={i % 3 === 0 ? 0.55 : 0.35} />
        ))}
      </g>
    </svg>
  );
}

function MarketStrip() {
  return (
    <div className="grid grid-cols-5 gap-1.5" aria-label={`Tracking ${MARKET_ORDER.length} markets`}>
      {MARKET_ORDER.map((id) => (
        <span
          key={id}
          title={MARKETS[id].name}
          className="flex h-7 items-center justify-center rounded-md bg-white/10 text-sm leading-none ring-1 ring-white/10"
        >
          {MARKETS[id].flag}
        </span>
      ))}
    </div>
  );
}

/** Full brand block for the desktop sidebar. */
export function BrandHeader() {
  return (
    <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0e3478] via-[#0a2559] to-[#071d49] p-4 ring-1 ring-white/10">
      <HeaderArt className="pointer-events-none absolute -right-10 -top-4 h-40 w-56" />
      <div className="relative">
        <Emblem className="h-11 w-11 drop-shadow-[0_4px_12px_rgba(56,189,248,0.35)]" />
        <h1 className="mt-3 text-[15px] font-extrabold leading-snug tracking-tight text-white text-balance">{APP_TITLE}</h1>
        <p className="mt-1.5 text-[11px] leading-snug text-sky-200/85">{APP_SUBTITLE}</p>
        <div className="mt-3 border-t border-white/10 pt-3">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-300/80">
            Tracking {MARKET_ORDER.length} markets
          </p>
          <MarketStrip />
        </div>
      </div>
    </header>
  );
}

/** Compact brand row for the mobile top bar. */
export function BrandCompact({ className }: { className?: string }) {
  return (
    <div className={cx('relative flex min-w-0 items-center gap-2.5', className)}>
      <Emblem className="h-10 w-10 shrink-0" />
      <div className="min-w-0">
        <p className="text-sm font-extrabold leading-tight tracking-tight text-white">{APP_TITLE}</p>
        <p className="mt-0.5 text-[10px] leading-snug text-sky-200/85">{APP_SUBTITLE}</p>
      </div>
    </div>
  );
}
