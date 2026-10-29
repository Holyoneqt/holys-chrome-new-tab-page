import { getBackgroundImage } from './components/background.js';
import { initCalendar } from './components/calendar.js';
import { initLinks } from './components/links.js';
import { startTimeInterval } from './components/time.js';
import { getWeather } from './components/weather.js';

window.onload = () => {
	// Set background image
	document.getElementById('background-image').src = getBackgroundImage();

	// Init UI components
	initLinks();
	initCalendar();
	startTimeInterval();
	getWeather();
}