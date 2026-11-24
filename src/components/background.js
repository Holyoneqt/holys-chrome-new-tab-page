import { store } from '../storage.js';

const BACKGROUND_COUNT = 7; // matches the .bg-N classes in style/components/background.css

// Pick a random CSS gradient background, never the same one twice in a row.
export function pickBackground() {
  const last = store.get('bg', -1);
  let n;
  do {
    n = Math.floor(Math.random() * BACKGROUND_COUNT);
  } while (n === last && BACKGROUND_COUNT > 1);
  store.set('bg', n);
  document.body.classList.add('bg-' + n);
}
