import { element, button } from './ui.js';

// A single header for all books. Settings never take space from the book.
const mounted = new WeakMap();
export function clearBookChrome(content) { mounted.get(content)?.dispose(); }
export function appendBookOption(content, node) { mounted.get(content)?.addOption(node); }
export function bookChrome(content, { index, views, options = [], open = false, onToggle = () => {} } = {}) {
  clearBookChrome(content);
  const dialog = content.closest('dialog');
  let heading = dialog?.querySelector('.dialog-heading');
  let local = false;
  if (!heading) { heading = element('nav', '', 'dialog-heading'); content.prepend(heading); local = true; }
  heading.classList.add('quiet-book-heading');
  const nav = element('nav', '', 'book-chrome'); nav.setAttribute('aria-label', 'Buchbedienung');
  const contents = button('Inhaltsverzeichnis', index || (() => {})); contents.disabled = !index; nav.append(contents);
  if (views) {
    const group = element('div', '', 'book-view-switch'); group.setAttribute('role', 'group'); group.setAttribute('aria-label', 'Buchansicht');
    for (const [id, label] of [['both', 'Bild + Text'], ['image', 'Bild'], ['text', 'Text']]) {
      const choice = button(label, () => views.change(id)); choice.setAttribute('aria-pressed', String(views.value === id)); group.append(choice);
    }
    nav.append(group);
  }
  heading.append(nav);
  let details;
  function placeOptions() {
    if (!details?.open) return;
    const panel = details.querySelector('.book-options-panel');
    const arrow = content.querySelector('.book-edge-right')?.getBoundingClientRect();
    const position = content.querySelector('.book-position')?.getBoundingClientRect();
    // Keep the popup to the left of the actual right edge, even for narrow raster books.
    panel.style.right = `${arrow ? innerWidth - arrow.left + 12 : 78}px`;
    panel.style.maxHeight = `${Math.max(120, (position?.top || innerHeight - 20) - 75)}px`;
  }
  function ensureOptions() {
    if (details) return;
    details = element('details', '', 'book-options'); details.open = open;
    const summary = element('summary', '⋯'); summary.setAttribute('aria-label', 'Weitere Optionen'); summary.title = 'Weitere Optionen';
    const panel = element('div', '', 'book-options-panel');
    panel.append(element('h3', 'Weitere Optionen'), button('Schließen', () => { details.open = false; summary.focus(); }));
    panel.append(...options); details.append(summary, panel); heading.append(details);
    details.addEventListener('toggle', () => { onToggle(details.open); requestAnimationFrame(placeOptions); });
  }
  if (options.length) ensureOptions();
  const controller = new AbortController();
  content.addEventListener('surface-resize', placeOptions, { signal: controller.signal });
  window.addEventListener('resize', placeOptions, { signal: controller.signal });
  document.addEventListener('pointerdown', event => { if (details?.open && !details.contains(event.target)) details.open = false; }, { signal: controller.signal });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && details?.open) { event.preventDefault(); event.stopImmediatePropagation(); details.open = false; details.querySelector('summary').focus(); }
  }, { capture: true, signal: controller.signal });
  const close = heading.querySelector('[data-close]');
  if (close) { close.textContent = 'Zur Station'; close.classList.add('book-station'); }
  const api = { get details() { return details; }, addOption(node) { ensureOptions(); details.querySelector('.book-options-panel').append(node); }, dispose() { controller.abort(); nav.remove(); details?.remove(); heading.classList.remove('quiet-book-heading'); if (local) heading.remove(); mounted.delete(content); } };
  mounted.set(content, api); return api;
}
export function bookEdges(stage, turn) {
  stage.classList.add('book-edge-host');
  const previous = button('‹', () => turn(-1), 'book-edge book-edge-left');
  const next = button('›', () => turn(1), 'book-edge book-edge-right');
  previous.setAttribute('aria-label', 'Zurückblättern'); next.setAttribute('aria-label', 'Weiterblättern');
  previous.disabled = true; next.disabled = true;
  stage.append(previous, next);
  return { previous, next };
}
export function fontOptions(smaller, larger, size) {
  const group = element('div', '', 'book-font-options'); group.append(element('span', 'Schriftgröße'));
  group.append(button('Kleiner', smaller), element('span', size, 'book-font-value'), button('Größer', larger)); return group;
}
