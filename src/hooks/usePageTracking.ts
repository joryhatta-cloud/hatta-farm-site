import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

function getOrCreateSessionId(): string {
  const key = 'hf_sid';
  let sid = sessionStorage.getItem(key);
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(key, sid);
  }
  return sid;
}

/**
 * Tracks page views to /api/analytics/track on every route change.
 * Fire-and-forget — never throws or blocks rendering.
 */
export function usePageTracking() {
  const location = useLocation();
  const lastPath = useRef<string>('');

  useEffect(() => {
    const path = location.pathname;
    if (path === lastPath.current) return;
    lastPath.current = path;

    const payload = {
      path,
      referrer: document.referrer || undefined,
      sessionId: getOrCreateSessionId(),
    };

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {/* silent */});
  }, [location.pathname]);
}
