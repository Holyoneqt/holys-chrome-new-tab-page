import { getBackgroundImage } from './components/background.js';
import { initLinks } from './components/links.js';
import { startTimeInterval } from './components/time.js';
import { getWeather } from './components/weather.js';

window.onload = () => {
	// Set Background-Image
	document.getElementById('background-image').src = getBackgroundImage();

	// Init Links functionality
	initLinks();

	// Start Interval to update Time every 3 Seconds
	startTimeInterval();

	// Call Weather Api and display Weather
	getWeather();
}