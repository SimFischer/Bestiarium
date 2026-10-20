export function initFullscreen() {
  const button = document.querySelector('#fullscreen-toggle');
  const root = document.documentElement;
  if (!document.fullscreenEnabled || typeof root.requestFullscreen !== 'function') return;
  button.hidden = false;
  const sync = () => {
    const active = Boolean(document.fullscreenElement);
    button.setAttribute('aria-label', active ? 'Vollbild verlassen' : 'Vollbild starten');
    button.setAttribute('aria-pressed', String(active));
  };
  button.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await root.requestFullscreen();
    } catch { sync(); }
  });
  document.addEventListener('fullscreenchange', sync);
  document.addEventListener('fullscreenerror', sync);
  sync();
}
