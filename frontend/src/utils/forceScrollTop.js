/**
 * Scroll the primary viewport to the top. Resets document scroll and common
 * layout wrappers (main, #root) after route changes.
 */
export function forceWindowScrollTop() {
  if (typeof window === 'undefined') return;

  const html = document.documentElement;
  const body = document.body;
  const root = document.getElementById('root');

  const prevHtmlSb = html.style.scrollBehavior;
  const prevBodySb = body.style.scrollBehavior;
  const prevRootSb = root ? root.style.scrollBehavior : '';
  html.style.scrollBehavior = 'auto';
  body.style.scrollBehavior = 'auto';
  if (root) root.style.scrollBehavior = 'auto';

  const se = document.scrollingElement || html;
  if (se) {
    se.scrollTop = 0;
    se.scrollLeft = 0;
    if (typeof se.scrollTo === 'function') {
      se.scrollTo(0, 0);
    }
  }
  window.scrollTo(0, 0);
  html.scrollTop = 0;
  html.scrollLeft = 0;
  body.scrollTop = 0;
  body.scrollLeft = 0;
  if (root) {
    root.scrollTop = 0;
    root.scrollLeft = 0;
    if (typeof root.scrollTo === 'function') {
      root.scrollTo(0, 0);
    }
  }

  document.querySelectorAll('main').forEach((el) => {
    try {
      el.scrollTop = 0;
    } catch (_) {
      /* ignore */
    }
  });

  html.style.scrollBehavior = prevHtmlSb;
  body.style.scrollBehavior = prevBodySb;
  if (root) root.style.scrollBehavior = prevRootSb;
}
