import type { ActionProgress, Development } from '../types';
import { MARKETS } from '../data/markets';
import { ACTION_STATUSES, APPLICABILITY, IMPACTS, STATUSES, THEMES } from './taxonomy';
import { formatDate } from './dates';
import type { MilestoneEntry } from './filters';

function csvCell(value: string | number | undefined | null): string {
  const s = value == null ? '' : String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCSV(rows: (string | number | undefined | null)[][]): string {
  return rows.map((r) => r.map(csvCell).join(',')).join('\r\n');
}

export function actionPlanCSV(list: Development[], progress: Record<string, ActionProgress>): string {
  const header = [
    'Market',
    'Development',
    'Regulator',
    'Impact',
    'Action',
    'Owner',
    'Status',
    'Due',
    'Notes',
    'Source',
  ];
  const rows = list.flatMap((d) =>
    d.actions.map((a) => {
      const p = progress[a.id];
      return [
        MARKETS[d.market].shortName,
        d.title,
        d.regulator,
        IMPACTS[d.impact].label,
        a.text,
        p?.owner ?? a.owner,
        ACTION_STATUSES[p?.status ?? 'not_started'].label,
        p?.due ?? '',
        p?.notes ?? '',
        d.sourceUrl,
      ];
    }),
  );
  return toCSV([header, ...rows]);
}

export interface BriefingOptions {
  title: string;
  preparedFor?: string;
  today: string;
  includeActions: boolean;
  upcoming: MilestoneEntry[];
}

export function briefingMarkdown(list: Development[], opts: BriefingOptions): string {
  const out: string[] = [];
  out.push(`# ${opts.title}`, '');
  out.push(`_Prepared ${formatDate(opts.today)}${opts.preparedFor ? ` for ${opts.preparedFor}` : ''}. ${list.length} developments._`, '');

  const high = list.filter((d) => d.impact === 'high');
  out.push('## Key messages', '');
  if (high.length === 0) out.push('- No high-impact developments in scope.');
  for (const d of high) out.push(`- **${MARKETS[d.market].shortName} – ${d.title}:** ${d.latestUpdate}`);
  out.push('');

  if (opts.upcoming.length) {
    out.push('## Upcoming deadlines', '');
    for (const m of opts.upcoming) {
      out.push(`- ${formatDate(m.date)} – [${MARKETS[m.development.market].shortName}] ${m.label}${m.confirmed ? '' : ' _(indicative)_'}`);
    }
    out.push('');
  }

  out.push('## Developments', '');
  for (const d of list) {
    out.push(`### [${MARKETS[d.market].shortName}] ${d.title}`);
    out.push(
      `${d.regulator} · ${STATUSES[d.status].label} · ${IMPACTS[d.impact].label} · ${APPLICABILITY[d.applicability].label} · Updated ${formatDate(d.lastUpdated)}`,
      '',
    );
    out.push(`**Latest:** ${d.latestUpdate}`, '');
    out.push(`**What it means for us:** ${d.buySideImpact}`, '');
    out.push(`**Themes:** ${d.themes.map((t) => THEMES[t].short).join(', ')}`, '');
    if (opts.includeActions && d.actions.length) {
      out.push('**Recommended actions:**');
      for (const a of d.actions) out.push(`- [ ] ${a.text} _(${a.owner})_`);
      out.push('');
    }
    out.push(`Source: ${d.sourceUrl}`, '');
  }
  out.push('---', '_For internal information purposes only. Not legal advice. Verify against primary sources before relying on any item._');
  return out.join('\n');
}

/**
 * Preview builds (VITE_PREVIEW=true) run inside a sandboxed frame that blocks
 * file downloads and the print dialog, so exports copy to the clipboard instead.
 */
export const IS_PREVIEW = import.meta.env.VITE_PREVIEW === 'true';

/** Download a file, or copy its contents to the clipboard in preview builds. */
export function exportFile(filename: string, content: string, mime: string): void {
  if (IS_PREVIEW) {
    navigator.clipboard?.writeText(content).catch(() => {});
    return;
  }
  downloadFile(filename, content, mime);
}

export function downloadFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
