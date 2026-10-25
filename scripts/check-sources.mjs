#!/usr/bin/env node
// Checks which regulator websites this environment can read, and rewrites:
//   sources/ACCESS.md           - human-readable report (what works, what to add)
//   sources/allowed-domains.txt - every host to put in the environment's Allowed domains
// The site list is sources/regulator-domains.json plus every host used in a sourceUrl
// in src/data/developments.json, so new sources are picked up automatically.
//
// Usage: bun run check:sources   (or: node scripts/check-sources.mjs)
// Optional: SOURCE_CHECK_USER_AGENT="Company Name contact@company.com" — the SEC refuses
// requests that do not identify themselves with a name and contact email.

import { execFile } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_STATUS, buildSiteList, classifyProbe, hostsToAllow, siteStatus } from './source-check-lib.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const USER_AGENT = process.env.SOURCE_CHECK_USER_AGENT || 'LCD-Compliance AI-Reg-Tracker compliance@example.com';
const TIMEOUT_S = 20;
const CONCURRENCY = 12;

const MARKET_NAMES = {
  eu: 'European Union', uk: 'United Kingdom', us: 'United States', sg: 'Singapore', hk: 'Hong Kong',
  jp: 'Japan', au: 'Australia', cn: 'Mainland China', kr: 'South Korea', global: 'Global standard-setters',
};

function probe(host) {
  const args = ['-sSL', '-o', '/dev/null', '-w', '%{http_code} %{url_effective}', '--max-time', String(TIMEOUT_S), '-A', USER_AGENT, `https://${host}/`];
  return new Promise((resolve) => {
    execFile('curl', args, (err, stdout, stderr) => {
      resolve(classifyProbe({ host, exitCode: err ? err.code ?? 1 : 0, stdout: String(stdout), stderr: String(stderr) }));
    });
  });
}

async function probeAll(hosts) {
  const results = new Map();
  const queue = [...hosts];
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (queue.length) {
        const h = queue.shift();
        results.set(h, await probe(h));
      }
    }),
  );
  return results;
}

const curated = JSON.parse(readFileSync(join(root, 'sources/regulator-domains.json'), 'utf8'));
const developments = JSON.parse(readFileSync(join(root, 'src/data/developments.json'), 'utf8'));
const sites = buildSiteList(curated, developments);
const allHosts = Object.values(sites).flatMap((list) => list.flatMap((s) => s.hosts));

console.log(`Checking ${allHosts.length} hosts…`);
const probes = await probeAll(allHosts);

const now = new Date();
const rows = [];
const neededNow = new Set();
const alsoRecommended = new Set();
const counts = Object.fromEntries(Object.keys(SITE_STATUS).map((k) => [k, 0]));

for (const [market, list] of Object.entries(sites)) {
  for (const site of list) {
    const ps = site.hosts.map((h) => probes.get(h));
    const status = siteStatus(ps);
    counts[status] += 1;
    const missing = hostsToAllow(ps);
    for (const h of missing) (status === 'readable' ? alsoRecommended : neededNow).add(h);
    const detail = ps
      .map((p) => {
        if (p.kind === 'ok') return `\`${p.host}\` ok`;
        if (p.kind === 'blocked') return `\`${p.host}\` not allowed`;
        if (p.kind === 'redirect-blocked') return `\`${p.host}\` → \`${p.finalHost}\` not allowed`;
        if (p.kind === 'site-refused') return `\`${p.host}\` HTTP ${p.code}`;
        return `\`${p.host}\` no response`;
      })
      .join('; ');
    rows.push({ market, site, status, detail });
  }
}
for (const h of neededNow) alsoRecommended.delete(h);

const total = rows.length;
const L = [];
L.push('# Primary-source access check', '');
L.push(`_Generated ${now.toISOString().slice(0, 16).replace('T', ' ')} UTC by \`bun run check:sources\`. Do not edit by hand; re-run the command instead._`, '');
L.push(
  `**${counts.readable} of ${total} sites readable.** ` +
    Object.entries(SITE_STATUS)
      .filter(([k]) => k !== 'readable' && counts[k])
      .map(([k, s]) => `${s.icon} ${counts[k]} ${s.label.toLowerCase()}`)
      .join(' · '),
  '',
);
L.push('## Add to the environment\'s Allowed domains', '');
L.push('Cloud environment menu → **Edit** → **Network access** → **Allowed domains**. Keep **Allow package managers** ticked.', '');
if (neededNow.size) {
  L.push(`**Needed to read sites that are blocked now (${neededNow.size}):**`, '', '```', ...[...neededNow].sort(), '```', '');
} else {
  L.push('Nothing is blocking a site right now.', '');
}
if (alsoRecommended.size) {
  L.push(
    `**Also recommended (${alsoRecommended.size}):** other host names of sites that already work, so links using either form keep working.`,
    '',
    '```',
    ...[...alsoRecommended].sort(),
    '```',
    '',
  );
}
L.push('The complete list of hosts is in [`allowed-domains.txt`](allowed-domains.txt).', '');

L.push('## By market', '');
L.push('| Status | Meaning |', '| --- | --- |');
for (const s of Object.values(SITE_STATUS)) L.push(`| ${s.icon} | ${s.label} |`);
L.push('');
for (const market of Object.keys(sites)) {
  const mrows = rows.filter((r) => r.market === market);
  if (!mrows.length) continue;
  L.push(`### ${MARKET_NAMES[market] ?? market}`, '', '| Site | Status | Hosts |', '| --- | --- | --- |');
  for (const r of mrows) {
    L.push(`| ${r.site.name}${r.site.fromSources ? ' _(from tracker sources)_' : ''} | ${SITE_STATUS[r.status].icon} | ${r.detail} |`);
  }
  L.push('');
}
L.push(
  '## Notes',
  '',
  '- ⚠️ sites answer, but turn away automated readers (for example a bot check). Adding domains will not fix these; the refresh falls back to search results for them.',
  '- Some sites only answer requests that identify themselves. The SEC requires a name and contact email; set `SOURCE_CHECK_USER_AGENT` to change the one used.',
  '- New domains used in `sourceUrl` fields of `src/data/developments.json` are added to this check automatically. To add a regulator with no tracked item yet, edit `regulator-domains.json`.',
  '',
);

writeFileSync(join(root, 'sources/ACCESS.md'), L.join('\n'));
writeFileSync(join(root, 'sources/allowed-domains.txt'), [...new Set(allHosts)].sort().join('\n') + '\n');

console.log(`${counts.readable}/${total} sites readable; ${neededNow.size} hosts needed, ${alsoRecommended.size} also recommended.`);
console.log('Wrote sources/ACCESS.md and sources/allowed-domains.txt');
