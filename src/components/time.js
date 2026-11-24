import { LOCALE } from '../config.js';

const timeFmt = new Intl.DateTimeFormat(LOCALE, { hour: '2-digit', minute: '2-digit', hour12: false });
const dateFmt = new Intl.DateTimeFormat(LOCALE, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

// Updates the clock on every second boundary and calls onDayChange(now) when the date changes.
export function startClock(onDayChange) {
  const timeEl = document.getElementById('time');
  const dateEl = document.getElementById('date');
  let day = '';

  (function tick() {
    const now = new Date();
    timeEl.textContent = timeFmt.format(now);
    dateEl.textContent = dateFmt.format(now);
    const key = now.toDateString();
    if (key !== day) {
      day = key;
      onDayChange(now);
    }
    setTimeout(tick, 1000 - now.getMilliseconds() + 5);
  })();
}
