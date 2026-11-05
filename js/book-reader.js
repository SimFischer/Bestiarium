import { element } from './ui.js';
import { paginateText } from './text-pages.js';
import { bookChrome, bookEdges, fontOptions } from './book-chrome.js';

// Rectangles refer to the original bitmap; picture, fold and frame remain free.
export const bookAreas = {
  niffler: [[54, 8, 38, 35]], pandanaflora: [[54, 8, 38, 36]],
  wolf: [[54, 8, 38, 34]], bowtruckle: [[54, 8, 38, 36]],
  wespuin: [[54, 8, 38, 36]], zuckerdornechse: [[54, 8, 38, 38]],
  codex: [[11, 16, 34, 64], [55, 16, 34, 64]]
};
let readerView = 'both', readerFont = 26;
export function addBookReader(content, spread, { id, title, text, areas = bookAreas[id], next, previous, index, startLast = false }) {
  let offset = 0, page = 0, pages = [], scheduled, columns = [], header, menuOpen = false;
  const image = spread.querySelector('img'), source = image.getAttribute('src');
  const extra = content.querySelector('.codex-navigation');
  const position = element('p', '', 'book-position'); position.setAttribute('role', 'status'); content.append(position);
  const stage = spread.parentElement, edges = bookEdges(stage, turn);
  function turn(direction) {
    if (readerView !== 'image' && pages[page + direction]) { show(page + direction); return; }
    if (direction < 0) previous?.(readerView === 'image' ? null : 'last');
    else next?.();
  }
  function show(index) {
    if (readerView !== 'image') {
      if (!pages[index]) return;
      page = index; offset = pages[page].start;
      columns.forEach((column, i) => { column.querySelector('p').textContent = pages[page].parts[i] || ''; });
    }
    position.textContent = `${title}${readerView === 'image' ? '' : ` · Seite ${page + 1} von ${pages.length}`}`;
    edges.previous.disabled = !previous && (readerView === 'image' || page === 0);
    edges.next.disabled = !next && (readerView === 'image' || page === pages.length - 1);
  }
  function render() {
    const fonts = fontOptions(() => size(-2), () => size(2), `${readerFont} px`);
    fonts.querySelectorAll('button')[0].disabled = readerFont === 22; fonts.querySelectorAll('button')[1].disabled = readerFont === 40;
    const options = [fonts]; if (extra) options.push(extra);
    header = bookChrome(content, { index, views: { value: readerView, change(value) { menuOpen = false; readerView = value; render(); } }, options, open: menuOpen, onToggle: open => { menuOpen = open; } });
    spread.querySelectorAll('.safe-book-text').forEach(n => n.remove());
    const newSource = readerView === 'text' ? 'assets/bestiary/master-bestiary.png' : source;
    if (image.getAttribute('src') !== newSource) image.src = newSource;
    const rectangles = readerView === 'image' ? [] : readerView === 'text' ? bookAreas.codex : areas;
    columns = rectangles.map(([left, top, width, height], i) => {
      const node = element('section', '', 'safe-book-text');
      Object.assign(node.style, { left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` });
      node.append(element('h3', i ? 'Fortsetzung' : title), element('p', '', 'safe-book-copy')); spread.append(node); return node;
    }); layout();
  }
  function size(step) { menuOpen = true; readerFont = Math.max(22, Math.min(40, readerFont + step)); render(); [...header.details.querySelectorAll('button')].find(b => b.textContent === (step < 0 ? 'Kleiner' : 'Größer'))?.focus(); }
  function layout() {
    cancelAnimationFrame(scheduled); scheduled = requestAnimationFrame(() => {
      if (!spread.isConnected || spread.clientHeight < 100) return;
      if (readerView === 'image') { show(0); return; }
      let start = 0; const chunks = [];
      columns.forEach(column => {
        column.style.setProperty('--book-font', `${readerFont}px`);
        const p = column.querySelector('p');
        p.style.height = `${Math.max(readerFont * 1.45, column.clientHeight - column.querySelector('h3').getBoundingClientRect().height - 10)}px`;
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
      show(startLast ? pages.length - 1 : Math.max(0, pages.findIndex(p => p.end > offset))); startLast = false;
    });
  }
  const controller = new AbortController();
  content.addEventListener('surface-resize', layout, { signal: controller.signal });
  const resize = new ResizeObserver(layout); resize.observe(spread);
  const cleanup = new MutationObserver(() => { if (!spread.isConnected) { controller.abort(); cleanup.disconnect(); resize.disconnect(); cancelAnimationFrame(scheduled); } }); cleanup.observe(content, { childList: true });
  spread.addEventListener('load', layout, true);
  document.addEventListener('keydown', event => {
    const dialog = spread.closest('dialog');
    if (!spread.isConnected || header.details?.open || (dialog && (!dialog.open || document.querySelector('#teacher-dialog[open], .vidi-dialog[open]')))) return;
    if (event.target.closest('input,textarea,select,[contenteditable="true"]') || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); turn(event.key === 'ArrowLeft' ? -1 : 1); }
  }, { signal: controller.signal });
  render();
}
