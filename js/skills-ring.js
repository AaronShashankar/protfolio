/* 3D rotating skills ring */
import { $ } from './utils.js';

const SKILLS = ['React', 'Node.js', 'Django', 'REST APIs', 'PostgreSQL', 'TypeScript', 'Docker', 'System design'];

let items = [];
let R = 320;

export function initSkillsRing() {
  const ring = $('#ring');
  items = SKILLS.map(t => {
    const d = document.createElement('div');
    d.className = 'it';
    d.textContent = t;
    ring.appendChild(d);
    return d;
  });
}

export function measureRing() {
  const mw = Math.max(...items.map(i => i.offsetWidth));
  R = Math.max(200, (mw + 28) / 2 / Math.tan(Math.PI / items.length));
}

export function updateRing(t, y) {
  const base = t * 9 + y * 0.12;
  items.forEach((it, i) => {
    const a = base + i * 360 / items.length;
    const c = Math.cos(a * Math.PI / 180);
    it.style.transform = `translate(-50%,-50%) rotateY(${a}deg) translateZ(${R}px)`;
    it.style.opacity = (0.1 + 0.9 * (c + 1) / 2).toFixed(3);
  });
}
