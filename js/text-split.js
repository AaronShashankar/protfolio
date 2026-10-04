/* Splits the hero name, statement and email into animatable spans */
import { $, $$ } from './utils.js';

export function initTextSplit() {
  let ci = 0;
  $$('.name .line').forEach(line => {
    const txt = line.textContent;
    line.textContent = '';
    [...txt].forEach(c => {
      const s = document.createElement('span');
      s.className = 'ch'; s.setAttribute('aria-hidden', 'true');
      s.style.setProperty('--i', ci++);
      s.textContent = c;
      line.appendChild(s);
    });
  });

  const statement = $('#statement');
  const words = statement.textContent.trim().split(/\s+/);
  statement.innerHTML = words.map(w => `<span class="w">${w}</span>`).join(' ');
  const wordEls = $$('.w', statement);

  const mail = $('#mail');
  const mailTxt = mail.textContent;
  mail.setAttribute('aria-label', mailTxt);
  mail.innerHTML = [...mailTxt].map((c, i) => `<span class="l" aria-hidden="true" style="--i:${i}">${c}</span>`).join('');

  return { statement, wordEls };
}
