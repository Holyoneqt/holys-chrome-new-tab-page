import { pickBackground } from './components/background.js';
import { initCursorLight } from './components/cursor-light.js';
import { initLinks } from './components/links.js';
import { renderCalendar } from './components/calendar.js';
import { startClock } from './components/time.js';
import { loadWeather } from './components/weather.js';

pickBackground();
initCursorLight();
initLinks();
startClock(renderCalendar); // re-renders the calendar whenever the day changes
loadWeather();
