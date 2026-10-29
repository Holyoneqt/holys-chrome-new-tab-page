const WEEKDAY_SHORT_LABELS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

export function initCalendar() {
	const monthLabelElement = document.getElementById("calendar-month");
	const calendarGridElement = document.getElementById("calendar-grid");

	if (!monthLabelElement || !calendarGridElement) {
		return;
	}

	renderCalendar(monthLabelElement, calendarGridElement);
}

function renderCalendar(monthLabelElement, calendarGridElement) {
	const today = new Date();
	const year = today.getFullYear();
	const monthIndex = today.getMonth();
	const monthStart = new Date(year, monthIndex, 1);
	const monthEnd = new Date(year, monthIndex + 1, 0);
	const leadingDays = (monthStart.getDay() + 6) % 7;
	const totalDaysInMonth = monthEnd.getDate();
	const totalCells = Math.ceil((leadingDays + totalDaysInMonth) / 7) * 7;

	monthLabelElement.textContent = new Intl.DateTimeFormat("de-DE", {
		month: "long",
		year: "numeric",
	}).format(monthStart);

	calendarGridElement.innerHTML = "";

	for (let cellIndex = 0; cellIndex < totalCells; cellIndex += 1) {
		const dayValue = cellIndex - leadingDays + 1;
		const dayElement = document.createElement("span");
		dayElement.className = "calendar-day";

		if (cellIndex < leadingDays || dayValue > totalDaysInMonth) {
			dayElement.classList.add("is-empty");
			calendarGridElement.appendChild(dayElement);
			continue;
		}

		dayElement.textContent = String(dayValue);
		if (
			today.getDate() === dayValue &&
			today.getMonth() === monthIndex &&
			today.getFullYear() === year
		) {
			dayElement.classList.add("is-today");
		}

		calendarGridElement.appendChild(dayElement);
	}

	const weekdayRow = document.getElementById("calendar-weekdays");
	if (weekdayRow) {
		weekdayRow.innerHTML = WEEKDAY_SHORT_LABELS
			.map((label) => `<span>${label}</span>`)
			.join("");
	}
}
