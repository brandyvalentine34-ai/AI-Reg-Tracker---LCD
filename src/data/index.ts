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

/**
 * Date shown as "Content is updated as of …" in the sidebar and on the Overview.
 * Change it to the refresh date every time developments.json is refreshed.
 */
export const CONTENT_UPDATED_ON = '2026-10-25';

/** Most recent development date in the dataset. */
export const LATEST_DEVELOPMENT = DEVELOPMENTS.reduce((max, d) => (d.lastUpdated > max ? d.lastUpdated : max), '0000-00-00');
