import { LOCALE } from '../config.js';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const titleFmt = new Intl.DateTimeFormat(LOCALE, { month: 'long', year: 'numeric' });

// Current month only, Monday first.
export function renderCalendar(now) {
  const y = now.getFullYear();
  const m = now.getMonth();
  document.getElementById('cal-title').textContent = titleFmt.format(now);

  const cells = WEEKDAYS.map((d) => cell('dow', d));

  const offset = (new Date(y, m, 1).getDay() + 6) % 7; // Monday = 0
  const days = new Date(y, m + 1, 0).getDate();
  for (let i = 0; i < offset; i++) cells.push(document.createElement('div'));
  for (let d = 1; d <= days; d++) {
    const dow = (offset + d - 1) % 7;
    const cls = 'day' + (dow >= 5 ? ' weekend' : '') + (d === now.getDate() ? ' today' : '');
    cells.push(cell(cls, d));
  }
  document.getElementById('cal-grid').replaceChildren(...cells);
}

function cell(className, text) {
  const el = document.createElement('div');
  el.className = className;
  el.textContent = text;
  return el;
}
