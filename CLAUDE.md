# Minimal New Tab

A Chrome new tab page (Manifest V3 extension) that works as a minimalist dashboard.

## Core principle

**Keep it as simple as possible to minimize loading time.** Every change should be judged by whether it keeps the page instant to open.

- Use only plain **HTML, CSS and JavaScript**. No frameworks, no libraries, no build step, no npm, no TypeScript, no bundlers.
- No web fonts, no image files for backgrounds, no external CSS or JS. Use the system font stack.
- Backgrounds are pure CSS gradients, picked at random on each tab. Add a new one by adding a `--bg-N` variable in `style/variables.css`, a matching `.bg-N` class in `style/components/background.css`, and bumping `BACKGROUND_COUNT` in `src/components/background.js`.
- Quick link icons are local files in `assets/icons/`. All other icons (weather, chevron) are inline SVG.
- Network calls are only for weather, and they are cached in `localStorage` (15 min) so most tabs make zero requests.
- Animations are CSS only and animate `transform`/`opacity` where possible. Respect `prefers-reduced-motion`.
- Prefer deleting code over adding it. If a feature needs a dependency, it probably doesn't belong here.

## Files

- `index.html` is the page markup. `manifest.json` registers it as the new tab page.
- `src/index.js` initializes the page by calling each component.
- `src/components/` holds one ES module per feature: `background`, `cursor-light`, `links`, `time`, `calendar`, `weather`.
- `src/config.js` holds shared settings (`LOCALE`); `src/storage.js` is the safe `localStorage` JSON wrapper.
- `style/index.css` imports `reset.css`, `variables.css`, `layout.css` and `components/index.css`, which imports one CSS file per component (`background`, `fog`, `cursor-light`, `card`, `links`, `weather`, `calendar`, `time`, `intro`).

## Styling rules

- **No hard-coded values outside `style/variables.css`.** Colors, sizes, spacing, radii, shadows, durations, easings and gradients are all variables. The only exception is media query breakpoints, which can't use variables.
- Inline SVG colors are set via CSS classes (e.g. `.i-sun`), not `fill`/`stroke` attributes.
- New components get their own JS file in `src/components/` and CSS file in `style/components/`.

## Layout

- Top left: quick links card, 5 per row (Gmail, Maps, Calendar, Drive, YouTube). More links (Strava, Garmin, Twitch, Keystones, SwissTopo) sit in an animated expandable "More" section; the links are hard-coded in `links.js`, only the open/closed state is saved in `localStorage`.
- Top right: weather card (current temperature and condition for the browser's location, via Open-Meteo, no API key).
- Bottom left: calendar showing only the current month, Monday first.
- Bottom right: large clock (24h) with the date below.
- Effects: drifting fog layers in the background, a soft light following the cursor, a calm intro animation on load, and a subtle popout when hovering a card.

## Conventions

- User is in Switzerland: Celsius, 24-hour time, weeks start on Monday.
- Vanilla DOM APIs only; build elements with `createElement`/`textContent`.
- Keep the page working with no network (cached or fallback weather states).
