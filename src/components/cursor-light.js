// Soft glow that follows the mouse. Position is written at most once per frame.
export function initCursorLight() {
  const light = document.getElementById('cursor-light');
  let x = 0;
  let y = 0;
  let queued = false;

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX;
    y = e.clientY;
    light.classList.add('is-on');
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      light.style.transform = `translate(${x}px, ${y}px)`;
    });
  }, { passive: true });

  document.documentElement.addEventListener('mouseleave', () => light.classList.remove('is-on'));
}
