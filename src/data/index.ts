import raw from './developments.json';
import type { Development } from '../types';
import { normaliseDevelopment, validateDevelopment, type RawDevelopment } from './schema';

const entries = raw as unknown as RawDevelopment[];

if (import.meta.env.DEV) {
  const problems = entries.flatMap(validateDevelopment);
  if (problems.length) console.warn('[dataset] validation problems:\n' + problems.join('\n'));
}

export const DEVELOPMENTS: Development[] = entries.map(normaliseDevelopment);

export const DEVELOPMENTS_BY_ID: Record<string, Development> = Object.fromEntries(
  DEVELOPMENTS.map((d) => [d.id, d]),
);

/** Date the dataset was last reviewed against primary sources. Bump when refreshing developments.json. */
export const DATA_REVIEWED_ON = '2026-10-08';

/** Most recent development date in the dataset. */
export const LATEST_DEVELOPMENT = DEVELOPMENTS.reduce((max, d) => (d.lastUpdated > max ? d.lastUpdated : max), '0000-00-00');
