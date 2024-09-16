const API_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=47.5056&longitude=8.7241&current=temperature_2m,is_day,weather_code&timezone=Europe%2FBerlin";
const WEATHER_CODE_MAPPING = {
	"0": "assets/weather/sun.svg",
	"1,2,3": "assets/weather/partly_cloud.svg",
	"45,48": "assets/weather/cloud.svg",
	"51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99": "assets/weather/rain.svg",
	"71,73,75,77,85,86": "assets/weather/snow.svg",
}

export function getWeather() {
	fetch(API_URL)
		.then((response) => response.json())
		.then(json => populateWeather(json));
}

function populateWeather(apiResponse) {
	const WEATHER_ICON_ELEMENT = document.getElementById("weather-icon");
	const TEMPERATURE_ELEMENT = document.getElementById("weather-temperature");

	const isDay = apiResponse.current.is_day;
	const temperature = apiResponse.current.temperature_2m;
	const weatherCode = apiResponse.current.weather_code.toString();

	WEATHER_ICON_ELEMENT.src = getWeatherIcon(weatherCode);
	TEMPERATURE_ELEMENT.innerHTML = `${Math.round(temperature)} °C`;
	console.log(isDay, temperature, weatherCode);
}

function getWeatherIcon(code, isDay) {
	if (!isDay) return "assets/weather/night.svg";

	let objKey = '';
	Object.keys(WEATHER_CODE_MAPPING).forEach(key => {
		const keys = key.split(',');
		if (keys.includes(code)) {
			objKey = key
		}
	});
	return WEATHER_CODE_MAPPING[objKey];
}