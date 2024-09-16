let HOURS_ELEMENT;
let DATE_ELEMENT;
const DAYS = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
];
const MONTHS = [
	"Januar",
	"Februar",
	"März",
	"April",
	"Mai",
	"Juni",
	"Juli",
	"August",
	"September",
	"Oktober",
	"November",
	"Dezember",
];

export function startTimeInterval() {
  HOURS_ELEMENT = document.getElementById("time-hours");
  DATE_ELEMENT = document.getElementById("time-date");

  updateAll();
  setInterval(() => updateAll(), 3000);
}

function updateAll() {
  HOURS_ELEMENT.innerHTML = getCurrentTimeString();
  DATE_ELEMENT.innerHTML = getCurrentDateString();
}

function getCurrentTimeString() {
  const date = new Date();
  const hour = date.getHours().toString();
  const minutes = date.getMinutes().toString();

  return `${prependWithZero(hour)}:${prependWithZero(minutes)}`;
}

function getCurrentDateString() {
	const date = new Date();
	const weekDay = DAYS[date.getDay()];
	const dayOfMonth = date.getDate();
	const month = MONTHS[date.getMonth()];
	const year = date.getFullYear();
  return `${weekDay}, ${dayOfMonth}. ${month} ${year}`;
}

function prependWithZero(num) {
  if (num.length > 1) return num;
  return `0${num}`;
}
