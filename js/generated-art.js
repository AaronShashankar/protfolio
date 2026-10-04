/* Procedurally generated bars for project card #2 */
import { $ } from './utils.js';

export function initGeneratedArt() {
  const bars = $('#bars');
  for (let i = 0; i < 18; i++) {
    const b = document.createElement('i');
    b.style.setProperty('--k', i);
    b.style.setProperty('--d', (1.1 + (Math.sin(i * 1.7) + 1) * 0.5).toFixed(2) + 's');
    b.style.setProperty('--m', (0.45 + (Math.cos(i * 0.9) + 1) * 0.27).toFixed(2));
    bars.appendChild(b);
  }
}
