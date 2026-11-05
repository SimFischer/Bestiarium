import { element, button } from './ui.js';
import { readCollection } from './collection-store.js';
import { paginateText } from './text-pages.js';
import { creatureSpread, collectionTitle, invitation } from './collection.js';
import { bookChrome, bookEdges, fontOptions } from './book-chrome.js';

// Viewing preferences only; no change to stored works or the backup format.
const sessions = new Map();
export async function renderCollection(content, classId, { onEdit } = {}) {
  const root = element('div', '', 'creature-book'); content.replaceChildren(root);
  root.append(element('p', 'Das Archiv wird geöffnet …'));
  try {
    const entries = (await readCollection(classId)).filter(e => e.visible);
    if (!root.isConnected) return;
    const saved = sessions.get(classId) || {};
    let selected = entries.findIndex(e => e.id === saved.id);
    if (selected < 0) selected = null;
    let version = saved.version || 'first', view = saved.view || 'both', fontSize = saved.font || 32;
    let offset = saved.offset || 0, page = 0, pages = [], indexPage = 0, menuOpen = false, header, edges, position, frame;
    let question = -1, lastPage = false;
    const questions = ['Welche Merkmale erkennst du wieder?', 'Welche Angaben fehlen noch?', 'Was zeigt das Bild, das im Text gar nicht beschrieben wurde?'];
    const sizes = [24, 28, 32, 36, 42, 48];
    function remember() { sessions.set(classId, { id: entries[selected]?.id, version, view, font: fontSize, offset }); }
    function change(callback) {
      const label = document.activeElement?.textContent;
      menuOpen = header?.details?.open || false; callback(); remember(); render();
      if (menuOpen && label) [...(header.details?.querySelectorAll('button') || [])].find(b => b.textContent === label)?.focus();
      else { root.tabIndex = -1; root.focus({ preventScroll: true }); }
    }
    function turn(direction) {
      if (view !== 'image' && pages[page + direction]) { page += direction; offset = pages[page].start; showPage(); return; }
      if (!entries[selected + direction]) return;
      change(() => { selected += direction; version = 'first'; offset = 0; lastPage = direction < 0 && view !== 'image'; menuOpen = false; });
    }
    function showPage() {
      if (view !== 'image') { root.querySelector('.creature-description').textContent = pages[page]?.text || ''; offset = pages[page]?.start || 0; }
      position.textContent = `${entries[selected].name}${view === 'image' ? ` · ${selected + 1} von ${entries.length}` : ` · Seite ${page + 1} von ${pages.length}`}`;
      edges.previous.disabled = selected === 0 && (view === 'image' || page === 0);
      edges.next.disabled = selected === entries.length - 1 && (view === 'image' || page === pages.length - 1);
      remember();
    }
    function layout() {
      cancelAnimationFrame(frame); frame = requestAnimationFrame(() => {
        if (!root.isConnected || selected === null) return;
        const spread = root.querySelector('.creature-spread'), prompt = root.querySelector('.book-question');
        const height = Math.max(200, content.getBoundingClientRect().bottom - spread.getBoundingClientRect().top - position.offsetHeight - (prompt?.offsetHeight || 0) - 20);
        spread.style.setProperty('--reader-height', `${height}px`);
        const paragraph = spread.querySelector('.creature-description');
        if (paragraph) {
          const words = spread.querySelector('.creature-words');
          paragraph.style.height = `${Math.max(fontSize * 2, words.getBoundingClientRect().bottom - parseFloat(getComputedStyle(words).paddingBottom) - paragraph.getBoundingClientRect().top)}px`;
          pages = paginateText(entries[selected][version].description, paragraph);
          page = lastPage ? pages.length - 1 : Math.max(0, pages.findIndex(p => p.end > offset)); lastPage = false;
        }
        showPage();
      });
    }
    function render() {
      root.replaceChildren(); root.classList.toggle('creature-reader', selected !== null);
      if (selected === null) {
        header = bookChrome(content);
        root.append(element('p', 'Entdeckungen unserer Forschungsgruppe', 'creature-subtitle'));
        if (!entries.length) {
          const welcome = element('article', '', 'creature-spread creature-welcome');
          const left = element('section', '', 'creature-leaf'), right = element('section', '', 'creature-leaf');
          left.append(element('h3', collectionTitle), element('p', invitation));
          right.append(element('div', '✧', 'creature-sigil'), element('h3', 'Hier beginnt eure Sammlung'), element('p', 'Erfinde ein Tierwesen und beschreibe es so genau, dass andere es sich vorstellen können.'), element('p', 'Erste Ideen sind willkommen. Eure Beschreibungen dürfen mit euch wachsen.'));
          welcome.append(left, right); root.append(welcome); return;
        }
        const grid = element('div', '', 'creature-grid'), perPage = innerHeight < 750 ? 4 : 8;
        indexPage = Math.min(indexPage, Math.max(0, Math.ceil(entries.length / perPage) - 1));
        entries.slice(indexPage * perPage, (indexPage + 1) * perPage).forEach((entry, i) => {
          const open = button('', () => change(() => { selected = indexPage * perPage + i; version = 'first'; offset = 0; }), 'creature-card');
          if (entry.first.image) { const img = element('img'); img.src = entry.first.image; img.alt = ''; open.append(img); }
          else open.append(element('span', '✧', 'creature-sigil'));
          open.append(element('span', entry.name)); grid.append(open);
        }); root.append(grid);
        if (entries.length > perPage) {
          const shell = element('div', '', 'collection-index-position');
          const arrows = bookEdges(grid, direction => change(() => { indexPage += direction; }));
          arrows.previous.disabled = indexPage === 0; arrows.next.disabled = (indexPage + 1) * perPage >= entries.length;
          shell.append(element('span', `Seite ${indexPage + 1} von ${Math.ceil(entries.length / perPage)}`)); root.append(shell);
        } return;
      }
      const entry = entries[selected]; if (!entry[version]) version = 'first';
      const options = [];
      const fonts = fontOptions(() => changeFont(-1), () => changeFont(1), `${fontSize} px`);
      fonts.querySelectorAll('button')[0].disabled = fontSize === sizes[0]; fonts.querySelectorAll('button')[1].disabled = fontSize === sizes.at(-1); options.push(fonts);
      if (entry.revised) {
        const versions = element('div', '', 'book-version-options'); versions.append(element('span', 'Fassung'));
        for (const [key, label] of [['first', 'Erste Idee'], ['revised', 'Überarbeitet']]) {
          const toggle = button(label, () => change(() => { version = key; offset = 0; })); toggle.setAttribute('aria-pressed', String(version === key)); versions.append(toggle);
        } options.push(versions);
      }
      const prompts = element('div', '', 'book-question-options');
      prompts.append(button(question < 0 ? 'Forschungsfrage zeigen' : 'Nächste Forschungsfrage', () => change(() => { question = (question + 1) % questions.length; })));
      if (question >= 0) prompts.append(button('Forschungsfrage ausblenden', () => change(() => { question = -1; }))); options.push(prompts);
      if (onEdit) options.push(button('Eintrag bearbeiten', () => { header.details.open = false; onEdit(entry.id); }));
      if (entry.researcher || entry[version].note || entry[version].phase) options.push(element('p', [entry.researcher && `Entdeckt von ${entry.researcher}`, entry[version].phase, entry[version].note].filter(Boolean).join('\n'), 'book-entry-note'));
      header = bookChrome(content, { index: () => change(() => { selected = null; menuOpen = false; }), views: { value: view, change: id => change(() => { view = id; menuOpen = false; }) }, options, open: menuOpen, onToggle: open => { menuOpen = open; } });
      const shell = element('div', '', 'collection-book-shell');
      const spread = creatureSpread(entry, version); spread.dataset.readerView = view; spread.style.setProperty('--reader-font', `${fontSize}px`);
      spread.querySelectorAll('.creature-phase, .creature-credit, .creature-note').forEach(n => n.remove());
      if (view === 'image') { spread.querySelector('.creature-words').remove(); spread.querySelector('.creature-art').prepend(element('h3', entry.name, 'reader-entry-name')); }
      if (view === 'text') spread.querySelector('.creature-art').remove();
      shell.append(spread); root.append(shell); edges = bookEdges(shell, turn);
      if (question >= 0) {
        const prompt = element('aside', '', 'book-question'); prompt.append(element('p', questions[question]), button('Schließen', () => change(() => { question = -1; }))); root.append(prompt);
      }
      position = element('p', '', 'book-position'); position.setAttribute('role', 'status'); root.append(position); layout();
    }
    function changeFont(direction) { change(() => { fontSize = sizes[sizes.indexOf(fontSize) + direction]; }); }
    const controller = new AbortController();
    const cleanup = new MutationObserver(() => { if (!root.isConnected) { controller.abort(); cleanup.disconnect(); cancelAnimationFrame(frame); } }); cleanup.observe(content, { childList: true });
    window.addEventListener('resize', () => { if (selected === null && root.isConnected) render(); else layout(); }, { signal: controller.signal });
    document.addEventListener('fullscreenchange', layout, { signal: controller.signal }); content.addEventListener('surface-resize', layout, { signal: controller.signal });
    document.addEventListener('keydown', event => {
      if (!root.isConnected || selected === null || !['ArrowLeft', 'ArrowRight'].includes(event.key) || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target.closest('input,textarea,select,[contenteditable="true"]')) return;
      const modal = root.closest('dialog'); if (modal && (!modal.open || [...document.querySelectorAll('dialog[open]')].some(d => d !== modal))) return;
      if (header.details?.open) return; event.preventDefault(); turn(event.key === 'ArrowLeft' ? -1 : 1);
    }, { signal: controller.signal });
    render();
  } catch (error) { root.replaceChildren(element('p', error.message, 'dialog-notice'), button('Erneut versuchen', () => renderCollection(content, classId, { onEdit }))); }
}
