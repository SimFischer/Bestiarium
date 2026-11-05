import { element, button } from './ui.js';

// One registry also releases observers when a view is replaced by navigation.
const layouts = new Set();
new MutationObserver(() => {
  for (const layout of layouts) if (!layout.root.isConnected) layout.destroy();
}).observe(document.body, { childList: true, subtree: true });

export function fitBook(stage, spread) {
  const fit = () => {
    const image = spread.querySelector('img');
    const ratio = image?.naturalWidth / image?.naturalHeight || 1.5;
    const width = Math.min(stage.clientWidth, stage.clientHeight * ratio);
    spread.style.width = `${width}px`;
    spread.style.height = `${width / ratio}px`;
  };
  const observer = new ResizeObserver(fit);
  observer.observe(stage);
  spread.querySelector('img')?.addEventListener('load', fit, { once: true });
  const layout = { root: stage, destroy() { observer.disconnect(); layouts.delete(layout); } };
  layouts.add(layout);
  requestAnimationFrame(fit);
}

// Clone an exact text range, retaining strong/emphasis and user whitespace.
function sliceBlock(source, start, end) {
  const copy = source.cloneNode(false);
  const walker = document.createTreeWalker(source, NodeFilter.SHOW_TEXT);
  let node, offset = 0, first, last;
  while ((node = walker.nextNode())) {
    const next = offset + node.length;
    if (!first && start <= next) first = [node, Math.max(0, start - offset)];
    if (end <= next) { last = [node, Math.max(0, end - offset)]; break; }
    offset = next;
  }
  if (first && last) {
    const range = document.createRange();
    range.setStart(...first); range.setEnd(...last);
    copy.append(range.cloneContents());
  }
  return copy;
}

export function paginateBook(area, blocks, controls, label = 'Textseite', onPage = () => {}) {
  const sources = blocks.map(node => node.cloneNode(true));
  let pages = [], index = 0, frame = 0, anchor = 0;
  const previous = button('‹ Text zurück', () => show(index - 1));
  const status = element('span', '', 'text-page-status');
  status.setAttribute('role', 'status');
  const next = button('Text weiter ›', () => show(index + 1));
  controls.classList.add('text-pagination');
  controls.setAttribute('aria-label', 'Textseiten innerhalb dieses Eintrags');
  controls.append(previous, status, next);
  const fits = () => {
    const bounds = area.getBoundingClientRect();
    const inset = parseFloat(getComputedStyle(area).paddingBottom) || 0;
    if (area.scrollHeight > area.clientHeight + 1 || area.scrollWidth > area.clientWidth + 1) return false;
    return [...area.children].every(node => {
      const rect = node.getBoundingClientRect();
      return rect.bottom <= bounds.bottom - inset + .5 && rect.right <= bounds.right + .5;
    });
  };
  function show(page) {
    index = Math.max(0, Math.min(page, pages.length - 1));
    const current = pages[index];
    area.replaceChildren(...(current?.nodes || []).map(node => node.cloneNode(true)));
    onPage(area);
    anchor = current?.start || 0;
    previous.disabled = index === 0;
    next.disabled = index >= pages.length - 1;
    status.textContent = `${label} ${index + 1} / ${Math.max(1, pages.length)}`;
    area.dataset.pageCount = String(pages.length);
    area.dataset.pageIndex = String(index);
  }
  function measure() {
    frame = 0;
    if (!area.isConnected || area.clientWidth < 1 || area.clientHeight < 1) return;
    syncProbe();
    const savedAnchor = anchor;
    pages = [];
    let current = [], position = 0, pageStart = 0;
    area.replaceChildren();
    const finish = () => {
      if (current.length) pages.push({ nodes: current, start: pageStart, end: position });
      current = []; pageStart = position; area.replaceChildren();
    };
    for (const source of sources) {
      const text = source.textContent;
      if (!text.length) continue;
      let start = 0;
      // Prefer an intact section on the next page before splitting a long section.
      let candidate = source.cloneNode(true);
      area.append(candidate);
      if (fits()) { current.push(candidate); position += text.length; continue; }
      candidate.remove();
      if (current.length) {
        const existing = [...area.childNodes];
        area.replaceChildren(candidate);
        const fitsAlone = fits();
        area.replaceChildren(...existing);
        if (fitsAlone) finish();
      }
      while (start < text.length) {
        candidate = sliceBlock(source, start, text.length);
        area.append(candidate);
        if (fits()) { current.push(candidate); position += text.length - start; break; }
        candidate.remove();
        let boundaries = [...text.slice(start).matchAll(/\s+|$/gu)]
          .map(match => start + match.index + match[0].length).filter(end => end > start);
        const search = ends => {
          let low = 0, high = ends.length - 1, best = start;
          while (low <= high) {
            const middle = (low + high) >> 1;
            const probe = sliceBlock(source, start, ends[middle]);
            area.append(probe); const ok = fits(); probe.remove();
            if (ok) { best = ends[middle]; low = middle + 1; } else high = middle - 1;
          }
          return best;
        };
        let end = search(boundaries);
        if (end === start) {
          // A single unbroken word (or long pupil title) can span pages too.
          let cursor = start;
          boundaries = Array.from(text.slice(start, boundaries[0] || text.length), char => (cursor += char.length));
          end = search(boundaries);
        }
        if (end === start) {
          if (current.length) { finish(); continue; }
          // No readable line fits at all: keep the previous layout until space returns.
          area.dataset.layoutPending = 'true';
          return;
        }
        candidate = sliceBlock(source, start, end);
        area.append(candidate); current.push(candidate);
        position += end - start; start = end; finish();
      }
    }
    finish();
    delete area.dataset.layoutPending;
    const target = pages.findIndex(page => savedAnchor >= page.start && savedAnchor < page.end);
    show(target < 0 ? 0 : target);
  }
  const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
  const observer = new ResizeObserver(schedule);
  observer.observe(area);
  // A fixed safe rectangle does not resize when only its font changes.
  // This independent sample detects changed glyph metrics and line height too.
  const probe = element('span', 'MgÄ abcdefghijklmnopqrstuvwxyz', 'book-type-probe');
  probe.setAttribute('aria-hidden', 'true');
  area.after(probe);
  const syncProbe = () => {
    const style = getComputedStyle(area);
    for (const property of ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing']) probe.style[property] = style[property];
  };
  const fontChanges = new MutationObserver(() => { syncProbe(); schedule(); });
  fontChanges.observe(area, { attributes: true, attributeFilter: ['style', 'class'] });
  const rootChanges = new MutationObserver(() => { syncProbe(); schedule(); });
  rootChanges.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class'] });
  observer.observe(probe); syncProbe();
  window.addEventListener('resize', schedule);
  document.fonts.ready.then(schedule);
  document.fonts.addEventListener('loadingdone', schedule);
  const layout = { root: area, destroy() {
    observer.disconnect(); fontChanges.disconnect(); rootChanges.disconnect(); probe.remove(); cancelAnimationFrame(frame);
    window.removeEventListener('resize', schedule);
    document.fonts.removeEventListener('loadingdone', schedule);
    layouts.delete(layout);
  } };
  layouts.add(layout); schedule();
  return { refresh: schedule, destroy: layout.destroy };
}
