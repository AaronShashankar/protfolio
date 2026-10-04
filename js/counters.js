/* Animated number counters (triggered when scrolled into view) */
import { $$, clamp, reduce } from './utils.js';

function run(el) {
  const end = +el.dataset.to;
  if (reduce) { el.textContent = end; return; }
  const t0 = performance.now(), dur = 1700;
  (function tick(now) {
    const p = clamp((now - t0) / dur, 0, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4)));
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}

export function initCounters() {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
  }), { threshold: 0.7 });
  $$('[data-to]').forEach(el => io.observe(el));
}
