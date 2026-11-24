import { store } from '../storage.js';

const ICONS = 'assets/icons/';

const MAIN_LINKS = [
  { name: 'Gmail',    url: 'https://mail.google.com/',     icon: 'Gmail.png' },
  { name: 'Maps',     url: 'https://maps.google.com/',     icon: 'Google_Maps.svg' },
  { name: 'Calendar', url: 'https://calendar.google.com/', icon: 'Google_Calendar.png' },
  { name: 'Drive',    url: 'https://drive.google.com/',    icon: 'Google_Drive.png' },
  { name: 'YouTube',  url: 'https://www.youtube.com/',     icon: 'YouTube.svg' },
];

const MORE_LINKS = [
  { name: 'Strava',    url: 'https://www.strava.com/dashboard',   icon: 'Strava.svg' },
  { name: 'Garmin',    url: 'https://connect.garmin.com/modern/', icon: 'Garmin.webp' },
  { name: 'Twitch',    url: 'https://www.twitch.tv/directory',    icon: 'Twitch.svg' },
  { name: 'Keystones', url: 'https://holyoneqt.github.io/mythicplus-key-checker/index.html', icon: 'Keystone_Checker.png' },
  { name: 'SwissTopo', url: 'https://map.geo.admin.ch/#/map?lang=de&center=2699127.86,1262787.72&z=4&topic=ech&layers=ch.swisstopo.swissalti3d-reliefschattierung,f;ch.bav.haltestellen-oev,f;ch.astra.wanderland-sperrungen_umleitungen,f;ch.swisstopo.swisstlm3d-wanderwege,f&bgLayer=ch.swisstopo.pixelkarte-farbe&catalogNodes=457', icon: 'GeoAdmin_Map.png' },
];

export function initLinks() {
  const toggle = document.getElementById('toggle-more');
  const more = document.getElementById('links-more');

  document.getElementById('links-main').replaceChildren(...MAIN_LINKS.map(linkTile));
  document.getElementById('links-extra').replaceChildren(...MORE_LINKS.map(linkTile));

  const setOpen = (open) => {
    more.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    store.set('moreOpen', open);
  };

  toggle.addEventListener('click', () => setOpen(!more.classList.contains('is-open')));
  setOpen(store.get('moreOpen', false));
}

function linkTile(link) {
  const a = document.createElement('a');
  a.className = 'link';
  a.href = link.url;
  a.title = link.name;

  const ico = document.createElement('div');
  ico.className = 'ico';
  const img = document.createElement('img');
  img.alt = '';
  img.src = ICONS + link.icon;
  ico.append(img);

  const label = document.createElement('div');
  label.className = 'label';
  label.textContent = link.name;

  a.append(ico, label);
  return a;
}
