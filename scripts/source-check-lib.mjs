// Pure helpers for scripts/check-sources.mjs (kept separate so they can be unit-tested).

/** @typedef {{ market: string, sourceUrl: string }} SourceRef */
/** @typedef {{ name: string, hosts: string[] }} CuratedSite */
/** @typedef {{ name: string, hosts: string[], fromSources: boolean }} Site */
/** @typedef {{ host: string, kind: 'ok' | 'blocked' | 'redirect-blocked' | 'site-refused' | 'no-response', code: number, finalHost: string }} Probe */

/**
 * Hosts found in the tracker's sourceUrl fields, grouped by market. A www. host also brings its bare form.
 * @param {SourceRef[]} developments
 * @returns {Map<string, Set<string>>}
 */
export function hostsFromDevelopments(developments) {
  /** @type {Map<string, Set<string>>} */
  const byMarket = new Map();
  for (const d of developments) {
    let host;
    try {
      host = new URL(d.sourceUrl).hostname.toLowerCase();
    } catch {
      continue;
    }
    const set = byMarket.get(d.market) ?? new Set();
    set.add(host);
    if (host.startsWith('www.')) set.add(host.slice(4));
    byMarket.set(d.market, set);
  }
  return byMarket;
}

/**
 * Merge the curated list with hosts used by the tracker's sources.
 * Every host appears once.
 * @param {{ markets: Record<string, CuratedSite[]> }} curated
 * @param {SourceRef[]} developments
 * @returns {Record<string, Site[]>}
 */
export function buildSiteList(curated, developments) {
  const seen = new Set();
  /** @type {Record<string, Site[]>} */
  const out = {};
  for (const [market, sites] of Object.entries(curated.markets)) {
    out[market] = sites.map((s) => {
      const hosts = s.hosts.map((h) => h.toLowerCase()).filter((h) => !seen.has(h));
      hosts.forEach((h) => seen.add(h));
      return { name: s.name, hosts, fromSources: false };
    });
  }
  for (const [market, hosts] of hostsFromDevelopments(developments)) {
    const extra = [...hosts].filter((h) => !seen.has(h)).sort();
    if (!extra.length) continue;
    extra.forEach((h) => seen.add(h));
    // Group www./bare pairs into one site.
    /** @type {Map<string, string[]>} */
    const groups = new Map();
    for (const h of extra) {
      const key = h.replace(/^www\./, '');
      groups.set(key, [...(groups.get(key) ?? []), h]);
    }
    out[market] = [
      ...(out[market] ?? []),
      ...[...groups.entries()].map(([key, hs]) => ({ name: key, hosts: hs, fromSources: true })),
    ];
  }
  return out;
}

/**
 * Classify one curl probe.
 * @param {{ host: string, exitCode: number, stdout: string, stderr: string }} r
 *   stdout is curl's write-out "<http_code> <url_effective>".
 * @returns {Probe}
 */
export function classifyProbe(r) {
  const [codeStr = '000', finalUrl = ''] = r.stdout.trim().split(/\s+/);
  const code = Number(codeStr) || 0;
  let finalHost = r.host;
  try {
    finalHost = new URL(finalUrl).hostname.toLowerCase();
  } catch {
    // keep the probed host
  }
  if (/CONNECT tunnel failed/i.test(r.stderr)) {
    return finalHost !== r.host
      ? { host: r.host, kind: 'redirect-blocked', code, finalHost }
      : { host: r.host, kind: 'blocked', code, finalHost };
  }
  if (code >= 200 && code < 400) return { host: r.host, kind: 'ok', code, finalHost };
  if (code >= 400) return { host: r.host, kind: 'site-refused', code, finalHost };
  return { host: r.host, kind: 'no-response', code, finalHost };
}

export const SITE_STATUS = {
  readable: { icon: '✅', label: 'Readable' },
  'site-refuses': { icon: '⚠️', label: 'Allowed, but the site refuses automated access' },
  'redirect-blocked': { icon: '↪️', label: 'Allowed, but redirects to a host that is not allowed' },
  'no-response': { icon: '⏳', label: 'Allowed, but no response' },
  'not-allowed': { icon: '⛔', label: 'Not allowed' },
};

/**
 * Overall status for a site from its host probes, best outcome first.
 * @param {Probe[]} probes
 * @returns {keyof typeof SITE_STATUS}
 */
export function siteStatus(probes) {
  const kinds = new Set(probes.map((p) => p.kind));
  if (kinds.has('ok')) return 'readable';
  if (kinds.has('site-refused')) return 'site-refuses';
  if (kinds.has('redirect-blocked')) return 'redirect-blocked';
  if (kinds.has('no-response')) return 'no-response';
  return 'not-allowed';
}

/**
 * Hosts that need adding to Allowed domains: refused outright, or redirected to but refused.
 * @param {Probe[]} probes
 * @returns {string[]}
 */
export function hostsToAllow(probes) {
  const missing = new Set();
  for (const p of probes) {
    if (p.kind === 'blocked') missing.add(p.host);
    if (p.kind === 'redirect-blocked') missing.add(p.finalHost);
  }
  return [...missing].sort();
}
