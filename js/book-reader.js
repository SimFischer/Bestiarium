import { element, button } from './ui.js';
import { paginateText } from './text-pages.js';

// Rectangles refer to the whole source bitmap, not the viewport or text size.
export const bookAreas = {
  niffler: [[54, 8, 38, 35]], pandanaflora: [[54, 8, 38, 36]],
  wolf: [[54, 8, 38, 34]], bowtruckle: [[54, 8, 38, 36]],
  wespuin: [[54, 8, 38, 36]], zuckerdornechse: [[54, 8, 38, 38]],
  codex: [[11, 16, 34, 64], [55, 16, 34, 64]]
};

export function addBookReader(content, spread, { id, title, text, areas = bookAreas[id], next, previous, previousLabel = '‹ Voriges Tier', nextLabel = 'Nächstes Tier ›' }) {
  let font = 26, offset = 0, page = 0, pages = [], scheduled;
  const columns = areas.map(([left, top, width, height], index) => {
    const node = element('section', '', 'safe-book-text');
    Object.assign(node.style, { left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` });
    node.append(element('h3', index ? 'Fortsetzung' : title), element('p', '', 'safe-book-copy'));
    spread.append(node); return node;
  });
  const footer = element('nav', '', 'book-reader-controls'); footer.setAttribute('aria-label', 'Textseiten und Tiere');
  const previousAnimal = button(previousLabel, previous || (() => {})); previousAnimal.disabled = !previous;
  const previousText = button('‹ Textseite', () => show(page - 1));
  const nextText = button('Textseite ›', () => show(page + 1));
  const label = element('span', '', 'book-page-count'); label.setAttribute('role', 'status');
  const smaller = button('A−', () => size(-2)), larger = button('A+', () => size(2));
  smaller.setAttribute('aria-label', 'Buchschrift verkleinern'); larger.setAttribute('aria-label', 'Buchschrift vergrößern');
  const nextAnimal = button(nextLabel, next || (() => {})); nextAnimal.disabled = !next;
  previousAnimal.classList.add('book-animal-previous'); nextAnimal.classList.add('book-animal-next');
  footer.append(previousAnimal, smaller, previousText, label, nextText, larger, nextAnimal);
  content.append(footer);
  function size(step) { font = Math.max(22, Math.min(40, font + step)); layout(); }
  function show(index) {
    if (!pages[index]) return;
    page = index; offset = pages[page].start;
    columns.forEach((column, index) => { column.querySelector('p').textContent = pages[page].parts[index] || ''; });
    label.textContent = `Textseite ${page + 1} / ${pages.length}`;
    previousText.disabled = page === 0; nextText.disabled = page === pages.length - 1;
    smaller.disabled = font === 22; larger.disabled = font === 40;
  }
  function layout() {
    cancelAnimationFrame(scheduled);
    scheduled = requestAnimationFrame(() => {
      if (!spread.isConnected || spread.clientHeight < 100) return;
      const chunks = [];
      let start = 0;
      columns.forEach(column => {
        column.style.setProperty('--book-font', `${font}px`);
        const p = column.querySelector('p');
        p.style.height = `${Math.max(font * 1.45, column.clientHeight - column.querySelector('h3').getBoundingClientRect().height - 10)}px`;
      });
      while (start < text.length) {
        const item = { start, parts: [] };
        for (const column of columns) {
          if (start >= text.length) { item.parts.push(''); continue; }
          const chunk = paginateText(text.slice(start), column.querySelector('p'), 1)[0].text;
          item.parts.push(chunk); start += chunk.length;
        }
        item.end = start; chunks.push(item);
      }
      pages = chunks.length ? chunks : [{ start: 0, end: 0, parts: [''] }];
      show(Math.max(0, pages.findIndex(p => p.end > offset)));
    });
  }
  const controller = new AbortController();
  content.addEventListener('surface-resize', layout, { signal: controller.signal });
  const resize = new ResizeObserver(layout); resize.observe(spread);
  const cleanup = new MutationObserver(() => { if (!spread.isConnected) { controller.abort(); cleanup.disconnect(); resize.disconnect(); cancelAnimationFrame(scheduled); } });
  cleanup.observe(content, { childList: true });
  spread.addEventListener('load', layout, true);
  document.addEventListener('keydown', event => {
    const dialog = spread.closest('dialog');
    if (!spread.isConnected || (dialog && (!dialog.open || document.querySelector('#teacher-dialog[open], .vidi-dialog[open]')))) return;
    if (event.target.closest('input,textarea,select,[contenteditable="true"]') || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'ArrowRight' && page < pages.length - 1) { event.preventDefault(); event.stopPropagation(); show(page + 1); return; }
    if (event.key === 'ArrowLeft' && page > 0) { event.preventDefault(); event.stopPropagation(); show(page - 1); }
    else if (event.key === 'ArrowLeft' && previous) { event.preventDefault(); previous(); }
    else if (event.key === 'ArrowRight' && page === pages.length - 1 && next) { event.preventDefault(); next(); }
  }, { signal: controller.signal });
  layout();
}
