import { element, button } from './ui.js';
import { readCollection } from './collection-store.js';
import { paginateText } from './text-pages.js';
export const collectionTitle = 'Das Buch der unentdeckten Wesen';
export const invitation = 'In unserem Archiv liegt ein besonderes Buch. Es wartet auf Wesen, die bisher niemand erforscht hat. Eure ersten Beschreibungen machen sie sichtbar. Mit jeder Entdeckung und jeder genaueren Beobachtung wächst unser Wissen.';
export function creatureSpread(entry, version = 'first') {
  const data = entry[version] || entry.first;
  const spread = element('article', '', 'creature-spread');
  const art = element('section', '', 'creature-leaf creature-art');
  if (data.image) { const img = element('img'); img.src = data.image; img.alt = `Darstellung von ${entry.name}`; art.append(img); }
  else art.append(element('div', '✧', 'creature-sigil'), element('p', 'Dieses Wesen wartet noch auf sein Bild.'));
  const words = element('section', '', 'creature-leaf creature-words');
  words.append(element('p', data.phase || (version === 'first' ? 'Erste Idee' : 'Überarbeitet'), 'creature-phase'), element('h3', entry.name));
  if (entry.researcher) words.append(element('p', `Entdeckt von ${entry.researcher}`, 'creature-credit'));
  words.append(element('p', data.description, 'creature-description'));
  if (data.note) words.append(element('p', data.note, 'creature-note'));
  spread.append(art, words);
  return spread;
}
export async function renderCollection(content, classId) {
  const root = element('div', '', 'creature-book');
  content.replaceChildren(root);
  root.append(element('p', 'Das Archiv wird geöffnet …', 'intro'));
  try {
    const entries = (await readCollection(classId)).filter(e => e.visible);
    if (!root.isConnected) return;
    let selected = null, version = 'first', view = 'both', fontSize = 32, question = -1, offset = 0, pages = [], page = 0;
    let frame, settingsOpen = false, indexPage = 0;
    const questions = ['Welche Merkmale erkennst du wieder?', 'Welche Angaben fehlen noch?', 'Was zeigt das Bild, das im Text gar nicht beschrieben wurde?'];
    const sizes = [24, 28, 32, 36, 42, 48];
    function change(action) { action(); render(); focus(); }
    function turn(direction) {
      if (view !== 'image' && pages[page + direction]) {
        page += direction; offset = pages[page].start; showPage();
      } else if (entries[selected + direction]) change(() => { selected += direction; version = 'first'; offset = 0; });
    }
    function showPage() {
      const paragraph = root.querySelector('.creature-description');
      if (paragraph && pages[page]) paragraph.textContent = pages[page].text;
      const label = root.querySelector('.text-page-label');
      if (label) label.textContent = `Textseite ${page + 1} von ${pages.length}`;
      const previous = root.querySelector('[data-text-previous]'), next = root.querySelector('[data-text-next]');
      if (previous) previous.disabled = page === 0;
      if (next) next.disabled = page === pages.length - 1;
      const combinedLabel = root.querySelector('.reader-combined-label');
      if (combinedLabel) combinedLabel.textContent = `Wesen ${selected + 1} / ${entries.length}${view !== 'image' ? ` · Text ${page + 1} / ${pages.length}` : ''}`;
      const back = root.querySelector('[data-reader-back]'), forward = root.querySelector('[data-reader-forward]');
      if (back) back.disabled = !(view !== 'image' && page > 0) && selected === 0;
      if (forward) forward.disabled = !(view !== 'image' && page < pages.length - 1) && selected === entries.length - 1;
    }
    function layout() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!root.isConnected || selected === null) return;
        const spread = root.querySelector('.creature-spread');
        const footer = root.querySelector('.creature-reader-footer');
        const prompts = root.querySelector('.creature-question');
        const height = Math.max(200, content.getBoundingClientRect().bottom - spread.getBoundingClientRect().top - footer.offsetHeight - (prompts?.offsetHeight || 0) - 24);
        spread.style.setProperty('--reader-height', `${height}px`);
        const paragraph = spread.querySelector('.creature-description');
        if (!paragraph) { pages = []; page = 0; showPage(); return; }
        const words = spread.querySelector('.creature-words');
        const bottomPadding = parseFloat(getComputedStyle(words).paddingBottom);
        paragraph.style.height = `${Math.max(fontSize * 2, words.getBoundingClientRect().bottom - bottomPadding - paragraph.getBoundingClientRect().top)}px`;
        pages = paginateText(entries[selected][version].description, paragraph);
        page = Math.max(0, pages.findIndex(p => p.end > offset)); showPage();
      });
    }
    // Listeners belong to this root, and are released on navigation/class changes.
    const controller = new AbortController();
    const cleanup = new MutationObserver(() => { if (!root.isConnected) { controller.abort(); cleanup.disconnect(); cancelAnimationFrame(frame); } });
    cleanup.observe(content, { childList: true });
    window.addEventListener('resize', () => { if (selected === null && root.isConnected) render(); else layout(); }, { signal: controller.signal });
    window.addEventListener('presentation-change', layout, { signal: controller.signal });
    document.addEventListener('fullscreenchange', layout, { signal: controller.signal });
    content.addEventListener('surface-resize', layout, { signal: controller.signal });
    document.addEventListener('keydown', event => {
      if (!root.isConnected || selected === null || !['ArrowLeft', 'ArrowRight'].includes(event.key) || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;
      const modal = root.closest('dialog');
      if (modal && (!modal.open || [...document.querySelectorAll('dialog[open]')].some(d => d !== modal))) return;
      event.preventDefault(); turn(event.key === 'ArrowLeft' ? -1 : 1);
    }, { signal: controller.signal });
    function render() {
      root.replaceChildren();
      root.classList.toggle('creature-reader', selected !== null);
      const subtitle = element('p', 'Entdeckungen unserer Forschungsgruppe', 'creature-subtitle');
      root.append(subtitle);
      if (selected === null) {
        const intro = element('article', '', 'creature-spread creature-welcome');
        const left = element('section', '', 'creature-leaf');
        left.append(element('p', 'Vidi öffnet das Archiv', 'creature-phase'), element('h3', collectionTitle), element('p', invitation));
        const right = element('section', '', 'creature-leaf');
        right.append(element('div', '✧', 'creature-sigil'), element('h3', entries.length ? 'Unsere Entdeckungen' : 'Hier beginnt eure Sammlung'), element('p', 'Erfinde ein Tierwesen und beschreibe es so genau, dass andere es sich vorstellen können.'), element('p', 'Erste Ideen sind willkommen. Eure Beschreibungen dürfen mit euch wachsen.'));
        intro.append(left, right);
        if (!entries.length) root.append(intro);
        else root.append(element('h3', 'Unsere Entdeckungen'));
        const grid = element('div', '', 'creature-grid');
        const perPage = innerHeight < 750 ? 4 : 8;
        indexPage = Math.min(indexPage, Math.max(0, Math.ceil(entries.length / perPage) - 1));
        entries.slice(indexPage * perPage, (indexPage + 1) * perPage).forEach((entry, localIndex) => {
          const index = indexPage * perPage + localIndex;
          const open = button('', () => change(() => { selected = index; version = 'first'; offset = 0; }), 'creature-card');
          if (entry.first.image) { const img = element('img'); img.src = entry.first.image; img.alt = ''; open.append(img); }
          else open.append(element('span', '✧', 'creature-sigil'));
          open.append(element('span', entry.name)); grid.append(open);
        });
        root.append(grid);
        if (entries.length > perPage) {
          const turns = element('nav', '', 'collection-index-turns');
          const before = button('‹ Übersicht', () => change(() => { indexPage--; })); before.disabled = indexPage === 0;
          const after = button('Übersicht ›', () => change(() => { indexPage++; })); after.disabled = (indexPage + 1) * perPage >= entries.length;
          turns.append(before, element('span', `${indexPage + 1} / ${Math.ceil(entries.length / perPage)}`), after); root.append(turns);
        }
        return;
      }
      const entry = entries[selected];
      const tools = element('nav', '', 'actions creature-tools'); tools.setAttribute('aria-label', 'Buchansicht');
      tools.append(button('Zur Übersicht', () => change(() => { selected = null; })));
      const views = element('div', '', 'reader-views'); views.setAttribute('role', 'group'); views.setAttribute('aria-label', 'Darstellung');
      for (const [key, label] of [['both', 'Bild und Text'], ['image', 'Nur Bild'], ['text', 'Nur Text']]) {
        const toggle = button(label, () => change(() => { view = key; })); toggle.setAttribute('aria-pressed', String(view === key)); views.append(toggle);
      }
      tools.append(views);
      const settings = element('details', '', 'reader-settings'); settings.open = settingsOpen;
      settings.append(element('summary', 'Schrift & Fassung'));
      const options = element('div', '', 'reader-options'); settings.append(options);
      settings.addEventListener('toggle', () => { settingsOpen = settings.open; layout(); });
      for (const [key, label] of [['first', 'Erste Idee'], ['revised', 'Überarbeitet']]) {
        if (key === 'revised' && !entry.revised) continue;
        const toggle = button(label, () => change(() => { version = key; offset = 0; })); toggle.setAttribute('aria-pressed', String(key === version)); options.append(toggle);
      }
      const smaller = button('A− Schrift kleiner', () => change(() => { fontSize = sizes[sizes.indexOf(fontSize) - 1]; })); smaller.disabled = fontSize === sizes[0];
      const larger = button('A+ Schrift größer', () => change(() => { fontSize = sizes[sizes.indexOf(fontSize) + 1]; })); larger.disabled = fontSize === sizes.at(-1);
      options.append(smaller, element('span', `${fontSize} px`, 'reader-font-label'), larger);
      const data = entry[version];
      if (entry.researcher) options.append(element('p', `Entdeckt von ${entry.researcher}`, 'reader-extra'));
      if (data.phase) options.append(element('p', data.phase, 'reader-extra'));
      if (data.note) options.append(element('p', data.note, 'reader-extra'));
      tools.append(settings);
      const spread = creatureSpread(entry, version);
      spread.dataset.readerView = view;
      spread.style.setProperty('--reader-font', `${fontSize}px`);
      spread.querySelectorAll('.creature-phase, .creature-credit, .creature-note').forEach(node => node.remove());
      if (view === 'image') spread.querySelector('.creature-words').remove();
      if (view === 'text') spread.querySelector('.creature-art').remove();
      const title = element('h3', entry.name, 'reader-entry-name');
      if (view === 'image') spread.querySelector('.creature-art').prepend(title);
      root.append(tools, spread);
      if (question >= 0) root.append(element('p', questions[question], 'creature-question'));
      const footer = element('div', '', 'creature-reader-footer');
      const combined = element('nav', '', 'reader-presentation-turns'); combined.setAttribute('aria-label', 'Präsentation blättern');
      const back = button('‹ Zurück', () => turn(-1)); back.dataset.readerBack = '';
      const forward = button('Weiter ›', () => turn(1)); forward.dataset.readerForward = '';
      combined.append(back, element('span', '', 'reader-combined-label'), forward); footer.append(combined);
      const reading = element('nav', '', 'reader-text-controls'); reading.setAttribute('aria-label', 'Textseiten');
      if (view !== 'image') {
        const previous = button('‹ Textseite', () => { if (!pages[page - 1]) return; page--; offset = pages[page].start; showPage(); }); previous.dataset.textPrevious = ''; previous.disabled = true;
        const next = button('Textseite ›', () => { if (!pages[page + 1]) return; page++; offset = pages[page].start; showPage(); }); next.dataset.textNext = ''; next.disabled = true;
        reading.append(previous, element('span', '', 'text-page-label'), next); footer.append(reading);
      }
      const prompts = element('div', '', 'reader-question-controls');
      prompts.append(button(question < 0 ? 'Forschungsfrage zeigen' : 'Nächste Frage', () => change(() => { question = (question + 1) % questions.length; })));
      if (question >= 0) prompts.append(button('Frage ausblenden', () => change(() => { question = -1; })));
      footer.append(prompts);
      const turns = element('nav', '', 'actions creature-turns'); turns.setAttribute('aria-label', 'Blättern');
      [-1, 1].forEach(direction => { const next = button(direction < 0 ? '‹ Wesen' : 'Wesen ›', () => change(() => { selected += direction; version = 'first'; offset = 0; })); next.disabled = !entries[selected + direction]; turns.append(next); });
      turns.insertBefore(element('span', `${selected + 1} / ${entries.length}`), turns.lastChild); footer.append(turns); root.append(footer);
      layout();
    }
    function focus() { root.tabIndex = -1; root.focus({ preventScroll: true }); const dialog = root.closest('dialog'); if (dialog) dialog.scrollTop = 0; }
    render();
  } catch (error) { root.replaceChildren(element('p', error.message, 'dialog-notice'), button('Erneut versuchen', () => renderCollection(content, classId))); }
}
