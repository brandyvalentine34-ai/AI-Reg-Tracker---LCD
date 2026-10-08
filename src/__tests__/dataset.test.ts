import { describe, expect, it } from 'vitest';
import raw from '../data/developments.json';
import { validateDevelopment, type RawDevelopment } from '../data/schema';
import { DEVELOPMENTS } from '../data';
import { MARKET_ORDER } from '../data/markets';

const entries = raw as unknown as RawDevelopment[];

describe('developments dataset', () => {
  it('every entry passes schema validation', () => {
    expect(entries.flatMap(validateDevelopment)).toEqual([]);
  });

  it('has unique ids and unique action ids', () => {
    const ids = DEVELOPMENTS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
    const actionIds = DEVELOPMENTS.flatMap((d) => d.actions.map((a) => a.id));
    expect(new Set(actionIds).size).toBe(actionIds.length);
  });

  it('covers every market', () => {
    for (const m of MARKET_ORDER) expect(DEVELOPMENTS.some((d) => d.market === m), m).toBe(true);
  });

  it('every entry has requirements, actions and a milestone', () => {
    for (const d of DEVELOPMENTS) {
      expect(d.keyRequirements.length, d.id).toBeGreaterThan(0);
      expect(d.actions.length, d.id).toBeGreaterThan(0);
      expect(d.milestones.length, d.id).toBeGreaterThan(0);
    }
  });

  it('lastUpdated is not before datePublished', () => {
    for (const d of DEVELOPMENTS) expect(d.lastUpdated >= d.datePublished, d.id).toBe(true);
  });
});
