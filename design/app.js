'use strict';

/* ---------- Settings ---------- */
const LOCALE = 'en-GB';            // date wording; 24h time
const BACKGROUND_COUNT = 7;        // matches .bg-N classes in style.css
const WEATHER_TTL = 15 * 60 * 1000; // refresh weather at most every 15 min

const DEFAULT_LINKS = [
  { name: 'Gmail',    url: 'https://mail.google.com/' },
  { name: 'Maps',     url: 'https://maps.google.com/' },
  { name: 'Calendar', url: 'https://calendar.google.com/' },
  { name: 'Drive',    url: 'https://drive.google.com/' },
  { name: 'YouTube',  url: 'https://www.youtube.com/' },
];

/* ---------- Storage (localStorage is fine for a new tab page) ---------- */
const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
};

/* ---------- Random background ---------- */
(function pickBackground() {
  const last = store.get('bg', -1);
  let n;
  do { n = Math.floor(Math.random() * BACKGROUND_COUNT); } while (n === last && BACKGROUND_COUNT > 1);
  store.set('bg', n);
  document.body.classList.add('bg-' + n);
})();

/* ---------- Quick links ---------- */
function faviconUrl(url) {
  // Chrome's built-in favicon cache (needs the "favicon" permission). No network request.
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
    const u = new URL(chrome.runtime.getURL('/_favicon/'));
    u.searchParams.set('pageUrl', url);
    u.searchParams.set('size', '32');
    return u.toString();
  }
  return null;
}

function linkTile(link, onDelete) {
  const a = document.createElement('a');
  a.className = 'link';
  a.href = link.url;
  a.title = link.url;

  const ico = document.createElement('div');
  ico.className = 'ico';
  const letter = () => {
    const s = document.createElement('span');
    s.textContent = link.name.charAt(0).toUpperCase();
    ico.replaceChildren(s);
  };
  const src = faviconUrl(link.url);
  if (src) {
    const img = document.createElement('img');
    img.alt = '';
    img.src = src;
    img.onerror = letter;
    ico.append(img);
  } else {
    letter();
  }

  const label = document.createElement('div');
  label.className = 'label';
  label.textContent = link.name;
  a.append(ico, label);

  if (onDelete) {
    const del = document.createElement('button');
    del.className = 'del';
    del.title = 'Remove';
    del.textContent = '×';
    del.addEventListener('click', (e) => { e.preventDefault(); onDelete(); });
    a.append(del);
  }
  return a;
}

function renderLinks() {
  const main = document.getElementById('links-main');
  const extraGrid = document.getElementById('links-extra');
  const extra = store.get('extraLinks', []);

  main.replaceChildren(...DEFAULT_LINKS.map((l) => linkTile(l)));

  const tiles = extra.map((l, i) => linkTile(l, () => {
    extra.splice(i, 1);
    store.set('extraLinks', extra);
    renderLinks();
  }));

  const add = document.createElement('button');
  add.className = 'link add-tile';
  add.innerHTML = '<div class="ico">+</div><div class="label">Add</div>';
  add.addEventListener('click', () => {
    const form = document.getElementById('add-form');
    form.hidden = !form.hidden;
    if (!form.hidden) document.getElementById('add-name').focus();
  });
  extraGrid.replaceChildren(...tiles, add);

  document.querySelector('#toggle-more span').textContent =
    extra.length ? `More (${extra.length})` : 'More';
}

document.getElementById('toggle-more').addEventListener('click', (e) => {
  const btn = e.currentTarget;
  const more = document.getElementById('links-more');
  more.hidden = !more.hidden;
  btn.setAttribute('aria-expanded', String(!more.hidden));
  store.set('moreOpen', !more.hidden);
});

document.getElementById('add-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('add-name').value.trim();
  let url = document.getElementById('add-url').value.trim();
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  try { new URL(url); } catch { return; }
  const extra = store.get('extraLinks', []);
  extra.push({ name, url });
  store.set('extraLinks', extra);
  e.target.reset();
  e.target.hidden = true;
  renderLinks();
});

renderLinks();
if (store.get('moreOpen', false)) document.getElementById('toggle-more').click();

/* ---------- Clock ---------- */
const timeFmt = new Intl.DateTimeFormat(LOCALE, { hour: '2-digit', minute: '2-digit', hour12: false });
const dateFmt = new Intl.DateTimeFormat(LOCALE, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

function tick() {
  const now = new Date();
  document.getElementById('time').textContent = timeFmt.format(now);
  document.getElementById('date').textContent = dateFmt.format(now);
  // re-render the calendar when the day changes
  const key = now.toDateString();
  if (tick.day !== key) { tick.day = key; renderCalendar(now); }
  setTimeout(tick, 1000 - now.getMilliseconds() + 5);
}

/* ---------- Calendar (current month only, Monday first) ---------- */
function renderCalendar(now) {
  const y = now.getFullYear(), m = now.getMonth();
  document.getElementById('cal-title').textContent =
    new Intl.DateTimeFormat(LOCALE, { month: 'long', year: 'numeric' }).format(now);

  const grid = document.getElementById('cal-grid');
  const cells = [];
  ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].forEach((d) => {
    const el = document.createElement('div');
    el.className = 'dow';
    el.textContent = d;
    cells.push(el);
  });

  const offset = (new Date(y, m, 1).getDay() + 6) % 7; // Monday = 0
  const days = new Date(y, m + 1, 0).getDate();
  for (let i = 0; i < offset; i++) cells.push(document.createElement('div'));
  for (let d = 1; d <= days; d++) {
    const el = document.createElement('div');
    const dow = (offset + d - 1) % 7;
    el.className = 'day' + (dow >= 5 ? ' weekend' : '') + (d === now.getDate() ? ' today' : '');
    el.textContent = d;
    cells.push(el);
  }
  grid.replaceChildren(...cells);
}

tick();

/* ---------- Weather (Open-Meteo, no API key) ---------- */
const ICONS = {
  sun: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="9" fill="#FFD166"/><g stroke="#FFD166" stroke-width="3" stroke-linecap="round"><path d="M24 5v5M24 38v5M5 24h5M38 24h5M10.6 10.6l3.5 3.5M33.9 33.9l3.5 3.5M10.6 37.4l3.5-3.5M33.9 14.1l3.5-3.5"/></g></svg>',
  moon: '<svg viewBox="0 0 48 48"><path d="M31 8a16 16 0 1 0 9 26A14 14 0 0 1 31 8z" fill="#E8E6F0"/></svg>',
  partly: '<svg viewBox="0 0 48 48"><circle cx="18" cy="17" r="8" fill="#FFD166"/><path d="M16 38h20a7 7 0 0 0 0-14 10 10 0 0 0-19 2 6 6 0 0 0-1 12z" fill="#fff"/></svg>',
  cloud: '<svg viewBox="0 0 48 48"><path d="M14 36h22a8 8 0 0 0 0-16 11 11 0 0 0-21 2 7 7 0 0 0-1 14z" fill="#fff"/></svg>',
  fog: '<svg viewBox="0 0 48 48"><g stroke="#fff" stroke-width="3" stroke-linecap="round"><path d="M10 18h28M6 25h36M12 32h24"/></g></svg>',
  rain: '<svg viewBox="0 0 48 48"><path d="M14 30h22a8 8 0 0 0 0-16 11 11 0 0 0-21 2 7 7 0 0 0-1 14z" fill="#fff"/><g stroke="#7FC8F8" stroke-width="3" stroke-linecap="round"><path d="M17 35l-2 5M25 35l-2 5M33 35l-2 5"/></g></svg>',
  snow: '<svg viewBox="0 0 48 48"><path d="M14 30h22a8 8 0 0 0 0-16 11 11 0 0 0-21 2 7 7 0 0 0-1 14z" fill="#fff"/><g fill="#fff"><circle cx="16" cy="38" r="2"/><circle cx="24" cy="41" r="2"/><circle cx="32" cy="38" r="2"/></g></svg>',
  storm: '<svg viewBox="0 0 48 48"><path d="M14 30h22a8 8 0 0 0 0-16 11 11 0 0 0-21 2 7 7 0 0 0-1 14z" fill="#fff"/><path d="M25 31l-5 8h5l-3 7 8-10h-5l3-5z" fill="#FFD166"/></svg>',
};

// WMO weather codes -> [description, icon]
function describe(code, isDay) {
  if (code === 0) return ['Clear', isDay ? 'sun' : 'moon'];
  if (code <= 2) return [code === 1 ? 'Mostly clear' : 'Partly cloudy', isDay ? 'partly' : 'cloud'];
  if (code === 3) return ['Overcast', 'cloud'];
  if (code <= 48) return ['Fog', 'fog'];
  if (code <= 57) return ['Drizzle', 'rain'];
  if (code <= 67) return ['Rain', 'rain'];
  if (code <= 77) return ['Snow', 'snow'];
  if (code <= 82) return ['Showers', 'rain'];
  if (code <= 86) return ['Snow showers', 'snow'];
  return ['Thunderstorm', 'storm'];
}

function showWeather(w) {
  const [desc, icon] = describe(w.code, w.isDay);
  document.getElementById('w-icon').innerHTML = ICONS[icon];
  document.getElementById('w-temp').textContent = Math.round(w.temp) + '°';
  document.getElementById('w-desc').textContent = desc;
  document.getElementById('w-place').textContent = w.place || '';
}

function showWeatherError(msg) {
  document.getElementById('w-icon').innerHTML = ICONS.cloud;
  document.getElementById('w-desc').textContent = msg;
}

async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    '&current=temperature_2m,weather_code,is_day&temperature_unit=celsius&timezone=auto';
  const res = await fetch(url);
  if (!res.ok) throw new Error('weather ' + res.status);
  const c = (await res.json()).current;

  let place = '';
  try {
    const g = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client' +
      `?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    const j = await g.json();
    place = j.city || j.locality || '';
  } catch {}

  return { temp: c.temperature_2m, code: c.weather_code, isDay: !!c.is_day, place, at: Date.now() };
}

function loadWeather() {
  const cached = store.get('weather', null);
  if (cached) showWeather(cached);
  if (cached && Date.now() - cached.at < WEATHER_TTL) return;

  if (!('geolocation' in navigator)) return showWeatherError('No location');
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude.toFixed(2), lon = pos.coords.longitude.toFixed(2);
      try {
        const w = await fetchWeather(lat, lon);
        store.set('weather', w);
        showWeather(w);
      } catch {
        if (!cached) showWeatherError('Unavailable');
      }
    },
    () => { if (!cached) showWeatherError('Location off'); },
    { maximumAge: 30 * 60 * 1000, timeout: 10000 }
  );
}

loadWeather();
