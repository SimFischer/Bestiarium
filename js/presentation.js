import { button, element } from './ui.js';

export async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch {
    const message = document.querySelector('#presentation-status');
    if (message) message.textContent = 'Vollbild ist in diesem Browser nicht verfügbar.';
  }
}
export function initPresentation() {
  // Books are the classroom view by default; there is no second presentation mode.
  document.body.classList.remove('presentation-mode');
  const status = element('p', '', 'presentation-status'); status.id = 'presentation-status'; status.setAttribute('role', 'status');
  document.querySelector('#view-dialog .dialog-heading').after(status);
  for (const parent of [document.querySelector('.topbar'), document.querySelector('#view-dialog .dialog-heading')]) {
    if (!document.fullscreenEnabled) continue;
    const tools = element('div', '', 'presentation-controls');
    const full = button('Vollbild', toggleFullscreen); full.dataset.presentationFullscreen = '';
    const sync = () => { const active = Boolean(document.fullscreenElement); full.textContent = active ? 'Vollbild verlassen' : 'Vollbild'; full.setAttribute('aria-pressed', String(active)); };
    document.addEventListener('fullscreenchange', sync); sync(); tools.append(full); parent.append(tools);
  }
}
