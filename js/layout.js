/* Layout measurement for the pinned horizontal-scroll section and section offsets */
import { $, $$ } from './utils.js';
import { layout } from './state.js';
import { measureRing } from './skills-ring.js';

export const hs = $('#hs');
export const track = $('#track');
export const hsfill = $('#hsfill');
const secs = $$('[data-sec]');

export function measure() {
  layout.vw = innerWidth;
  layout.vh = innerHeight;
  layout.hsDist = Math.max(0, track.offsetWidth - layout.vw);
  hs.style.height = (layout.hsDist + layout.vh) + 'px';
  layout.tops = secs.map(s => s.getBoundingClientRect().top + scrollY);
  measureRing();
}

export function initLayout() {
  addEventListener('resize', measure);
  addEventListener('load', measure);
  measure();
}
