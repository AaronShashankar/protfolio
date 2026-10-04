/* Cursor follower, magnetic buttons and 3D card tilt */
import { $, $$, reduce } from './utils.js';
import { pointer } from './state.js';

export const cur = $('#cur');

export function initPointer() {
  addEventListener('pointermove', e => {
    pointer.mx = (e.clientX / innerWidth) * 2 - 1;
    pointer.my = (e.clientY / innerHeight) * 2 - 1;
    pointer.cx = e.clientX; pointer.cy = e.clientY;
    if (pointer.fine && !reduce) cur.classList.add('on');
  });
  document.addEventListener('pointerleave', () => cur.classList.remove('on'));

  $$('a,button,[data-magnetic]').forEach(el => {
    el.addEventListener('pointerenter', () => cur.classList.add('big'));
    el.addEventListener('pointerleave', () => cur.classList.remove('big'));
  });

  $$('[data-magnetic]').forEach(el => {
    el.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * 0.22}px,${y * 0.32}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });

  $$('.card').forEach(c => {
    c.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = c.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      c.style.setProperty('--ry', ((px - 0.5) * 14).toFixed(2) + 'deg');
      c.style.setProperty('--rx', ((0.5 - py) * 14).toFixed(2) + 'deg');
      c.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
      c.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
      c.style.setProperty('--px', (px - 0.5).toFixed(3));
      c.style.setProperty('--py', (py - 0.5).toFixed(3));
    });
    c.addEventListener('pointerleave', () => {
      ['--rx', '--ry', '--px', '--py'].forEach(p => c.style.removeProperty(p));
    });
  });
}

export function updateCursor() {
  if (pointer.fine && !reduce) {
    pointer.cxs += (pointer.cx - pointer.cxs) * 0.2;
    pointer.cys += (pointer.cy - pointer.cys) * 0.2;
    cur.style.transform = `translate3d(${pointer.cxs.toFixed(1)}px,${pointer.cys.toFixed(1)}px,0)`;
  }
}
