import { describe, expect, it } from 'vitest';
import {
  buildSiteList,
  classifyProbe,
  hostsFromDevelopments,
  hostsToAllow,
  siteStatus,
} from '../../scripts/source-check-lib.mjs';
import curated from '../../sources/regulator-domains.json';
import developments from '../data/developments.json';

describe('source access check', () => {
  it('classifies curl results', () => {
    const base = { host: 'www.fca.org.uk', exitCode: 0, stderr: '' };
    expect(classifyProbe({ ...base, stdout: '200 https://www.fca.org.uk/' }).kind).toBe('ok');
    expect(classifyProbe({ ...base, stdout: '403 https://www.fca.org.uk/' }).kind).toBe('site-refused');
    expect(classifyProbe({ ...base, exitCode: 28, stdout: '000 https://www.fca.org.uk/' }).kind).toBe('no-response');
    expect(
      classifyProbe({ ...base, exitCode: 56, stdout: '000 https://www.fca.org.uk/', stderr: 'curl: (56) CONNECT tunnel failed, response 403' }).kind,
    ).toBe('blocked');
    const redirect = classifyProbe({
      host: 'fca.org.uk',
      exitCode: 56,
      stdout: '000 https://www.fca.org.uk/',
      stderr: 'curl: (56) CONNECT tunnel failed, response 403',
    });
    expect(redirect).toMatchObject({ kind: 'redirect-blocked', finalHost: 'www.fca.org.uk' });
  });

  it('summarises a site and lists hosts to allow', () => {
    const ok = { host: 'ico.org.uk', kind: 'ok', code: 200, finalHost: 'ico.org.uk' } as const;
    const blocked = { host: 'www.ico.org.uk', kind: 'blocked', code: 0, finalHost: 'www.ico.org.uk' } as const;
    const redir = { host: 'fca.org.uk', kind: 'redirect-blocked', code: 0, finalHost: 'www.fca.org.uk' } as const;
    expect(siteStatus([ok, blocked])).toBe('readable');
    expect(siteStatus([redir])).toBe('redirect-blocked');
    expect(siteStatus([blocked])).toBe('not-allowed');
    expect(hostsToAllow([ok, blocked, redir])).toEqual(['www.fca.org.uk', 'www.ico.org.uk']);
  });

  it('adds hosts from tracker sources without duplicating curated ones', () => {
    const devs = [
      { market: 'uk', sourceUrl: 'https://www.fca.org.uk/news' },
      { market: 'jp', sourceUrl: 'https://www.newregulator.go.jp/x' },
      { market: 'jp', sourceUrl: 'not a url' },
    ];
    expect([...hostsFromDevelopments(devs).get('jp')!]).toEqual(['www.newregulator.go.jp', 'newregulator.go.jp']);
    const list = buildSiteList({ markets: { uk: [{ name: 'FCA', hosts: ['www.fca.org.uk', 'fca.org.uk'] }] } }, devs);
    expect(list.uk).toHaveLength(1);
    expect(list.jp).toEqual([{ name: 'newregulator.go.jp', hosts: ['newregulator.go.jp', 'www.newregulator.go.jp'], fromSources: true }]);
  });

  it('covers every market in the tracker and lists each host once', () => {
    const list = buildSiteList(curated, developments);
    const hosts = Object.values(list).flatMap((sites) => sites.flatMap((s) => s.hosts));
    expect(new Set(hosts).size).toBe(hosts.length);
    for (const d of developments) expect(list[d.market]?.length, d.market).toBeGreaterThan(0);
  });
});
