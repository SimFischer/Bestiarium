import { button, element } from './ui.js';

export const isPresentation = () => document.body.classList.contains('presentation-mode');
export function setPresentation(active) {
  if (active) document.querySelector('#teacher-dialog[open]')?.close();
  document.body.classList.toggle('presentation-mode', active);
  document.querySelectorAll('[data-presentation]').forEach(node => {
    node.textContent = active ? 'Präsentation beenden' : 'Präsentationsmodus';
    node.setAttribute('aria-pressed', String(active));
  });
  window.dispatchEvent(new Event('presentation-change'));
}
export async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch {
    const message = document.querySelector('#presentation-status');
    if (message) message.textContent = 'Vollbild ist hier nicht verfügbar. Der Präsentationsmodus funktioniert weiterhin.';
  }
}
export function initPresentation() {
  const status = element('p', '', 'presentation-status'); status.id = 'presentation-status'; status.setAttribute('role', 'status');
  document.querySelector('#view-dialog .dialog-heading').after(status);
  for (const parent of [document.querySelector('.topbar'), document.querySelector('#view-dialog .dialog-heading')]) {
    const tools = element('div', '', 'presentation-controls');
    const mode = button('Präsentationsmodus', () => setPresentation(!isPresentation()));
    mode.dataset.presentation = ''; mode.setAttribute('aria-pressed', 'false'); tools.append(mode);
    if (document.fullscreenEnabled) {
      const full = button('Vollbild', toggleFullscreen); full.dataset.presentationFullscreen = '';
      const sync = () => { const active = Boolean(document.fullscreenElement); full.textContent = active ? 'Vollbild verlassen' : 'Vollbild'; full.setAttribute('aria-pressed', String(active)); };
      document.addEventListener('fullscreenchange', sync); sync(); tools.append(full);
    }
    parent.append(tools);
  }
  // Existing book arrows remain usable in the research bestiary as well.
  document.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key) || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;
    const dialog = document.querySelector('#view-dialog[open].book-dialog');
    if (!dialog || document.querySelector('#teacher-dialog[open], .vidi-dialog[open]')) return;
    if (dialog.querySelector('.book-reader-controls')) return;
    const arrow = dialog.querySelector(event.key === 'ArrowLeft' ? '.book-animal-previous, .book-previous' : '.book-animal-next, .book-next');
    if (arrow && !arrow.disabled) { event.preventDefault(); arrow.click(); }
  });
}
