import { Globe2 } from 'lucide-react';
import type { MarketId } from '../types';
import { MARKETS } from '../data/markets';
// Flag artwork from flag-icons (MIT). Imported as raw SVG and embedded as data URIs so flags render
// on every platform: Windows does not draw country-flag emoji and shows letter pairs instead.
import eu from 'flag-icons/flags/4x3/eu.svg?raw';
import gb from 'flag-icons/flags/4x3/gb.svg?raw';
import us from 'flag-icons/flags/4x3/us.svg?raw';
import sg from 'flag-icons/flags/4x3/sg.svg?raw';
import hk from 'flag-icons/flags/4x3/hk.svg?raw';
import jp from 'flag-icons/flags/4x3/jp.svg?raw';
import au from 'flag-icons/flags/4x3/au.svg?raw';
import cn from 'flag-icons/flags/4x3/cn.svg?raw';
import kr from 'flag-icons/flags/4x3/kr.svg?raw';

const cx = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ');

const svgUri = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

const FLAG_SRC: Record<Exclude<MarketId, 'global'>, string> = {
  eu: svgUri(eu),
  uk: svgUri(gb),
  us: svgUri(us),
  sg: svgUri(sg),
  hk: svgUri(hk),
  jp: svgUri(jp),
  au: svgUri(au),
  cn: svgUri(cn),
  kr: svgUri(kr),
};

/** 4:3 boxes; the size names match the text sizes they sit beside. */
const SIZES = {
  xs: 'h-[9px] w-3',
  sm: 'h-3 w-4',
  md: 'h-[15px] w-5',
  lg: 'h-6 w-8',
};

export function Flag({
  market,
  size = 'sm',
  className,
  decorative = true,
}: {
  market: MarketId;
  size?: keyof typeof SIZES;
  className?: string;
  /** false when the flag is the only label for the market */
  decorative?: boolean;
}) {
  const label = decorative ? undefined : MARKETS[market].name;
  const box = cx('inline-block shrink-0 rounded-[2px] align-[-0.125em]', SIZES[size], className);
  if (market === 'global') {
    return (
      <span
        className={cx(box, 'inline-flex items-center justify-center bg-sky-600 text-white')}
        role={label ? 'img' : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
      >
        <Globe2 className="h-[85%] w-[85%]" strokeWidth={2.25} />
      </span>
    );
  }
  return (
    <img
      src={FLAG_SRC[market]}
      alt={label ?? ''}
      aria-hidden={label ? undefined : true}
      className={cx(box, 'object-cover shadow-[0_0_0_0.5px_rgba(15,23,42,0.25)]')}
      draggable={false}
    />
  );
}
