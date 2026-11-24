# Minimal New Tab

A Chrome new tab page (Manifest V3 extension) that works as a minimalist dashboard.

## Core principle

**Keep it as simple as possible to minimize loading time.** Every change should be judged by whether it keeps the page instant to open.

- Use only plain **HTML, CSS and JavaScript**. No frameworks, no libraries, no build step, no npm, no TypeScript, no bundlers.
- No web fonts, no image files for backgrounds, no external CSS or JS. Use the system font stack.
- Backgrounds are pure CSS gradients (`.bg-N` classes in `style.css`), picked at random on each tab. Add a new one by adding a class and bumping `BACKGROUND_COUNT` in `app.js`.
- Icons are inline SVG or Chrome's built-in favicon cache (`/_favicon/`), never downloaded image assets.
- Network calls are only for weather, and they are cached in `localStorage` (15 min) so most tabs make zero requests.
- Prefer deleting code over adding it. If a feature needs a dependency, it probably doesn't belong here.

## Files

- Use the files inside the design folder as reference.
- `newtab.html` is the page markup.
- `style.css` holds layout, glass cards and backgrounds.
- `app.js` handles background choice, quick links, clock, calendar and weather.

## Layout

- Top left: quick links, 5 per row (Gmail, Maps, Calendar, Drive, YouTube). Extra user links live in an expandable "More" section, saved in `localStorage`.
- Top right: weather card (current temperature and condition for the browser's location, via Open-Meteo, no API key).
- Bottom left: calendar showing only the current month, Monday first.
- Bottom right: large clock (24h) with the date below.

## Conventions

- User is in Switzerland: Celsius, 24-hour time, weeks start on Monday.
- Vanilla DOM APIs only; build elements with `createElement`/`textContent` for user data.
- Keep the page working with no network (cached or fallback weather states).

## Migration

The App already exists. Replace the design completely with the one provided inside design folder. you can replace all files that currently exist if needed (but make sure the index.html stays). make sure to follow the file pattern as it is now (components are split into seperate files, index.js initializes that page, styling remains based on variables, no hard coded values outside of variables.css). when done migration, let me check everything, when everything looks good, you can delete all unused files.