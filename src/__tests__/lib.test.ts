import { describe, expect, it } from 'vitest';
import type { Development } from '../types';
import { EMPTY_FILTERS, activeFilterCount, collectMilestones, matchesFilters, nextMilestone, sortDevelopments } from '../lib/filters';
import { actionPlanCSV, briefingMarkdown, milestonesICS, toCSV } from '../lib/export';
import { addDays, daysBetween, formatDate, quarterKey, relativeDays } from '../lib/dates';
import { parseHash, buildHash } from '../state/router';

function dev(over: Partial<Development>): Development {
  return {
    id: 'x',
    market: 'eu',
    title: 'Test',
    officialTitle: 'Test official',
    regulator: 'ESMA',
    instrumentType: 'supervisory_guidance',
    status: 'in_force',
    datePublished: '2025-01-01',
    effectiveDate: null,
    lastUpdated: '2025-06-01',
    latestUpdate: 'Latest',
    impact: 'medium',
    applicability: 'direct',
    themes: ['governance'],
    summary: 'Summary',
    buySideImpact: 'Impact',
    keyRequirements: ['Req'],
    actions: [{ id: 'x-a1', text: 'Do, "the" thing', owner: 'Compliance' }],
    milestones: [],
    sourceUrl: 'https://example.com',
    sourceLabel: 'Example',
    confidence: 'high',
    ...over,
  };
}

const ctx = { watchlist: [] as string[], isUnread: () => false };

describe('filters', () => {
  const a = dev({ id: 'a', market: 'eu', impact: 'high', themes: ['genai'], lastUpdated: '2026-01-01', title: 'GPAI code' });
  const b = dev({ id: 'b', market: 'us', impact: 'low', themes: ['disclosure_marketing'], lastUpdated: '2026-03-01', title: 'AI washing' });

  it('matches by market, theme and impact', () => {
    expect(matchesFilters(a, { ...EMPTY_FILTERS, markets: ['eu'] }, ctx)).toBe(true);
    expect(matchesFilters(b, { ...EMPTY_FILTERS, markets: ['eu'] }, ctx)).toBe(false);
    expect(matchesFilters(a, { ...EMPTY_FILTERS, themes: ['genai', 'conduct'] }, ctx)).toBe(true);
    expect(matchesFilters(b, { ...EMPTY_FILTERS, impacts: ['high'] }, ctx)).toBe(false);
  });

  it('search requires every term', () => {
    expect(matchesFilters(b, { ...EMPTY_FILTERS, query: 'ai washing' }, ctx)).toBe(true);
    expect(matchesFilters(b, { ...EMPTY_FILTERS, query: 'washing gpai' }, ctx)).toBe(false);
  });

  it('watchlist and unread toggles use context', () => {
    expect(matchesFilters(a, { ...EMPTY_FILTERS, watchedOnly: true }, { ...ctx, watchlist: ['a'] })).toBe(true);
    expect(matchesFilters(b, { ...EMPTY_FILTERS, watchedOnly: true }, { ...ctx, watchlist: ['a'] })).toBe(false);
    expect(matchesFilters(a, { ...EMPTY_FILTERS, unreadOnly: true }, { ...ctx, isUnread: () => true })).toBe(true);
  });

  it('counts active filters', () => {
    expect(activeFilterCount(EMPTY_FILTERS)).toBe(0);
    expect(activeFilterCount({ ...EMPTY_FILTERS, markets: ['eu', 'uk'], query: ' x ', watchedOnly: true })).toBe(4);
  });

  it('sorts by latest, impact and next deadline', () => {
    expect(sortDevelopments([a, b], 'latest', '2026-01-01').map((d) => d.id)).toEqual(['b', 'a']);
    expect(sortDevelopments([b, a], 'impact', '2026-01-01').map((d) => d.id)).toEqual(['a', 'b']);
    const c = dev({ id: 'c', milestones: [{ date: '2026-05-01', label: 'x', confirmed: true }] });
    const d = dev({ id: 'd', milestones: [{ date: '2026-02-01', label: 'y', confirmed: true }] });
    expect(sortDevelopments([c, a, d], 'next_deadline', '2026-01-15').map((x) => x.id)).toEqual(['d', 'c', 'a']);
  });

  it('finds the next milestone and collects a window', () => {
    const d = dev({
      milestones: [
        { date: '2025-01-01', label: 'past', confirmed: true },
        { date: '2026-06-01', label: 'future', confirmed: false },
      ],
    });
    expect(nextMilestone(d, '2026-01-01')?.label).toBe('future');
    expect(collectMilestones([d], '2024-12-31', '2025-12-31').map((m) => m.label)).toEqual(['past']);
  });
});

describe('dates', () => {
  it('formats and diffs dates without timezone drift', () => {
    expect(formatDate('2026-10-08')).toBe('8 Oct 2026');
    expect(formatDate(null)).toBe('—');
    expect(daysBetween('2026-10-08', '2026-10-18')).toBe(10);
    expect(addDays('2026-12-30', 3)).toBe('2027-01-02');
    expect(quarterKey('2026-11-15')).toBe('2026 Q4');
    expect(relativeDays(-1)).toBe('yesterday');
    expect(relativeDays(120)).toBe('in 4 months');
  });
});

describe('exports', () => {
  it('escapes CSV cells', () => {
    expect(toCSV([['a', 'b,c', 'say "hi"']])).toBe('a,"b,c","say ""hi"""');
  });

  it('builds an action plan CSV with saved progress', () => {
    const csv = actionPlanCSV([dev({})], { 'x-a1': { status: 'done', owner: 'Legal', notes: 'ok' } });
    const lines = csv.split('\r\n');
    expect(lines).toHaveLength(2);
    expect(lines[1]).toContain('"Do, ""the"" thing",Legal,Done');
  });

  it('builds a valid ICS calendar', () => {
    const d = dev({ milestones: [{ date: '2027-08-02', label: 'Deadline; big', confirmed: true }] });
    const ics = milestonesICS(collectMilestones([d]), new Date('2026-10-08T00:00:00Z'));
    expect(ics).toMatch(/^BEGIN:VCALENDAR/);
    expect(ics).toContain('DTSTART;VALUE=DATE:20270802');
    expect(ics).toContain('SUMMARY:[EU] Deadline\; big');
    expect(ics.trim().endsWith('END:VCALENDAR')).toBe(true);
  });

  it('builds a markdown briefing', () => {
    const md = briefingMarkdown([dev({ impact: 'high' })], { title: 'Update', today: '2026-10-08', includeActions: true, upcoming: [] });
    expect(md).toContain('# Update');
    expect(md).toContain('## Key messages');
    expect(md).toContain('- [ ] Do, "the" thing _(Compliance)_');
  });
});

describe('router', () => {
  it('round-trips views and params', () => {
    const r = parseHash(buildHash('markets', { market: 'eu', item: 'eu-ai-act' }));
    expect(r.view).toBe('markets');
    expect(r.params.get('market')).toBe('eu');
    expect(r.params.get('item')).toBe('eu-ai-act');
    expect(parseHash('#/nonsense').view).toBe('overview');
  });
});
