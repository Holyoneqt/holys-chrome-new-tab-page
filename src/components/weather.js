import { store } from '../storage.js';

const WEATHER_TTL = 15 * 60 * 1000; // refresh weather at most every 15 min

// Inline SVG icons; colors come from the i-* classes in style/components/weather.css.
const CLOUD_HIGH = '<path class="i-cloud" d="M14 30h22a8 8 0 0 0 0-16 11 11 0 0 0-21 2 7 7 0 0 0-1 14z"/>';
const ICONS = {
  sun: '<svg viewBox="0 0 48 48"><circle class="i-sun" cx="24" cy="24" r="9"/><path class="i-sun-ray" stroke-width="3" stroke-linecap="round" d="M24 5v5M24 38v5M5 24h5M38 24h5M10.6 10.6l3.5 3.5M33.9 33.9l3.5 3.5M10.6 37.4l3.5-3.5M33.9 14.1l3.5-3.5"/></svg>',
  moon: '<svg viewBox="0 0 48 48"><path class="i-moon" d="M31 8a16 16 0 1 0 9 26A14 14 0 0 1 31 8z"/></svg>',
  partly: '<svg viewBox="0 0 48 48"><circle class="i-sun" cx="18" cy="17" r="8"/><path class="i-cloud" d="M16 38h20a7 7 0 0 0 0-14 10 10 0 0 0-19 2 6 6 0 0 0-1 12z"/></svg>',
  cloud: '<svg viewBox="0 0 48 48"><path class="i-cloud" d="M14 36h22a8 8 0 0 0 0-16 11 11 0 0 0-21 2 7 7 0 0 0-1 14z"/></svg>',
  fog: '<svg viewBox="0 0 48 48"><path class="i-fog" stroke-width="3" stroke-linecap="round" d="M10 18h28M6 25h36M12 32h24"/></svg>',
  rain: `<svg viewBox="0 0 48 48">${CLOUD_HIGH}<path class="i-rain" stroke-width="3" stroke-linecap="round" d="M17 35l-2 5M25 35l-2 5M33 35l-2 5"/></svg>`,
  snow: `<svg viewBox="0 0 48 48">${CLOUD_HIGH}<g class="i-snow"><circle cx="16" cy="38" r="2"/><circle cx="24" cy="41" r="2"/><circle cx="32" cy="38" r="2"/></g></svg>`,
  storm: `<svg viewBox="0 0 48 48">${CLOUD_HIGH}<path class="i-sun" d="M25 31l-5 8h5l-3 7 8-10h-5l3-5z"/></svg>`,
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

// Shows cached weather immediately; only hits the network when the cache is older than WEATHER_TTL.
export function loadWeather() {
  const cached = store.get('weather', null);
  if (cached) showWeather(cached);
  if (cached && Date.now() - cached.at < WEATHER_TTL) return;

  if (!('geolocation' in navigator)) {
    if (!cached) showWeatherError('No location');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude.toFixed(2);
      const lon = pos.coords.longitude.toFixed(2);
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
