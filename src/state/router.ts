import { useCallback, useEffect, useState } from 'react';
import type { ViewId } from '../types';

const VIEWS: ViewId[] = ['overview', 'developments', 'horizon', 'markets', 'actions', 'briefing'];

export interface Route {
  view: ViewId;
  params: URLSearchParams;
}

export function parseHash(hash: string): Route {
  const [path, query = ''] = hash.replace(/^#\/?/, '').split('?');
  const view = (VIEWS as string[]).includes(path) ? (path as ViewId) : 'overview';
  return { view, params: new URLSearchParams(query) };
}

export function buildHash(view: ViewId, params?: Record<string, string | undefined>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params ?? {})) if (v) q.set(k, v);
  const qs = q.toString();
  return `#/${view}${qs ? `?${qs}` : ''}`;
}

/** Minimal hash router so views and open items are linkable and work with back/forward. */
export function useHashRoute() {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((view: ViewId, params?: Record<string, string | undefined>) => {
    const next = buildHash(view, params);
    if (next !== window.location.hash) window.location.hash = next;
  }, []);

  return { route, navigate };
}
