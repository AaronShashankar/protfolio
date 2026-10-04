/* Entry point: initialises modules and runs the animation loop */
import { $, clamp, lerp, reduce } from './utils.js';
import { pointer, layout } from './state.js';
import { initTextSplit } from './text-split.js';
import { initGeneratedArt } from './generated-art.js';
import { initSkillsRing, updateRing } from './skills-ring.js';
import { initLayout, measure, hs, track, hsfill } from './layout.js';
import { initCounters } from './counters.js';
import { initPointer, updateCursor } from './pointer.js';
import { initScene, renderScene } from './scene.js';

/* ---------- setup (order matters: DOM prep → layout → interactions → scene) ---------- */
const { statement, wordEls } = initTextSplit();
initGeneratedArt();
initSkillsRing();
initLayout();
initCounters();
initPointer();
initScene();

/* ---------- main loop ---------- */
const marquee = $('#marquee');
const progress = $('#progress');
let last = performance.now(), T = 0, lastY = scrollY, smoothY = scrollY, hp = 0, skew = 0;

function frame(now) {
  requestAnimationFrame(frame);
  if (document.hidden) { last = now; return; }

  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  T += dt * (reduce ? 0.15 : 1);
  const y = scrollY, vel = y - lastY; lastY = y;
  smoothY = lerp(smoothY, y, reduce ? 1 : 0.085);
  pointer.mxs = lerp(pointer.mxs, pointer.mx, 0.06);
  pointer.mys = lerp(pointer.mys, pointer.my, 0.06);

  const { vh, hsDist } = layout;

  // scroll progress bar
  progress.style.transform = `scaleX(${clamp(y / Math.max(1, document.documentElement.scrollHeight - vh), 0, 1).toFixed(4)})`;

  // horizontal pinned work section
  const hr = hs.getBoundingClientRect();
  const p = clamp(-hr.top / Math.max(1, hs.offsetHeight - vh), 0, 1);
  hp = lerp(hp, p, reduce ? 1 : 0.12);
  track.style.transform = `translate3d(${(-hp * hsDist).toFixed(1)}px,0,0)`;
  hsfill.style.transform = `scaleX(${hp.toFixed(4)})`;

  // statement word-by-word reveal
  const sr = statement.getBoundingClientRect();
  const sp = clamp((vh * 0.85 - sr.top) / (vh * 0.4 + sr.height), 0, 1);
  const n = wordEls.length;
  for (let i = 0; i < n; i++) {
    const f = clamp(sp * (n + 5) - i, 0, 1);
    wordEls[i].style.opacity = (0.14 + 0.86 * f).toFixed(3);
  }

  // marquee skew by scroll velocity
  skew = lerp(skew, clamp(vel * 0.12, -9, 9), 0.1);
  if (!reduce) marquee.style.transform = `skewY(${(-2 + skew).toFixed(2)}deg)`;

  updateRing(T, smoothY);
  updateCursor();
  renderScene(dt, T, smoothY);
}
requestAnimationFrame(frame);

/* ---------- intro ---------- */
const start = () => requestAnimationFrame(() => { measure(); document.body.classList.add('loaded'); });
(document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(start);
setTimeout(() => document.body.classList.add('loaded'), 2500);
