// Uses an isolated localhost origin. No live classroom state is read or written.
import { renderBestiary } from '../js/bestiary.js';
import { animals } from '../js/data.js';
import { renderCollection } from '../js/collection.js';
import { writeCollection, readCollection } from '../js/collection-store.js';
import { element, button } from '../js/ui.js';
import { codexSections, descriptionCriteria } from '../js/research.js';
import { initLayout } from '../js/layout.js';
import { appendBookOption } from '../js/book-chrome.js';
if (!['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) throw new Error('Nur lokal ausführen');
const dialog = document.querySelector('#view-dialog');
const content = document.querySelector('#view-content');
initLayout();
const classroom = { id: 'development-book-layout', unlockedBestiaryEntries: animals.map(a => a.id) };
const original = animals[0].textContent;
const pause = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
async function settle() {
  await document.fonts.ready;
  await Promise.all([...dialog.querySelectorAll('img')].map(i => i.decode().catch(() => {})));
  for (let i = 0; i < 4; i++) await pause();
}
function render(id, detail, action = true) {
  dialog.querySelector('.book-tools')?.remove();
  dialog.className = 'book-dialog';
  const navigate = async (_, entry, section) => { render(entry, section, action); await settle(); return true; };
  renderBestiary(content, classroom, id, detail, navigate);
  const tools = element('div', '', 'book-tools');
  const back = content.querySelector('.bestiary-back');
  if (back) tools.append(back);
  if (action) tools.append(button('Vidi · Forschungsregeln eintragen', () => {}, 'presentation-action'));
  if (action) appendBookOption(content, tools);
  if (!dialog.open) dialog.showModal();
}
function audit() {
  const errors = [];
  const bounds = node => node.getBoundingClientRect();
  if (dialog.scrollHeight > dialog.clientHeight + 1) errors.push('Dialog-Scrollbar');
  for (const node of dialog.querySelectorAll('.bestiary-spread, .creature-spread, .text-pagination, .entry-turn')) {
    const r = bounds(node);
    if (r.top < -1 || r.left < -1 || r.bottom > innerHeight + 1 || r.right > innerWidth + 1) errors.push('Außerhalb des Viewports: ' + node.className);
  }
  for (const area of dialog.querySelectorAll('[data-page-count], .safe-book-copy, .creature-description')) {
    if (area.dataset.layoutPending) errors.push('Kein lesbarer Textplatz');
    const r = bounds(area);
    if (area.scrollHeight > area.clientHeight + 1 || area.scrollWidth > area.clientWidth + 1) errors.push('Text-Overflow');
    const walker = document.createTreeWalker(area, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const range = document.createRange(); range.selectNodeContents(node);
      for (const line of range.getClientRects()) {
        if (line.width && (line.bottom > r.bottom + 1 || line.top < r.top - 1 || line.right > r.right + 1 || line.left < r.left - 1)) errors.push(`Text außerhalb der sicheren Fläche (${area.className}, Seite ${area.dataset.pageIndex}, ${node.textContent.slice(0, 20)}, ${line.bottom}/${r.bottom}, ${line.right}/${r.right})`);
      }
    }
  }
  return errors;
}
async function readAllPages() {
  await settle();
  if (content.querySelector('.book-edge-right')) {
    const previous = content.querySelector('.book-edge-left'), next = content.querySelector('.book-edge-right');
    const numbers = () => content.querySelector('.book-position').textContent.match(/Seite (\d+) von (\d+)/).slice(1).map(Number);
    while (numbers()[0] > 1) previous.click();
    let text = '';
    for (let page = 0; page < 500; page++) {
      const errors = audit(); if (errors.length) throw new Error(errors.join(', '));
      const selector = content.querySelector('.safe-book-copy') ? '.safe-book-copy' : content.querySelector('.creature-description') ? '.creature-description' : '[data-page-count]';
      text += [...content.querySelectorAll(selector)].map(p => p.textContent).join('');
      if (numbers()[0] === numbers()[1]) break; next.click();
    }
    while (numbers()[0] > 1) previous.click();
    return [text];
  }
  const output = [];
  const areas = [...dialog.querySelectorAll('[data-page-count]')];
  const controls = [...dialog.querySelectorAll('.text-pagination')];
  for (let i = 0; i < areas.length; i++) {
    const area = areas[i], nav = controls[i];
    while (!nav.firstElementChild.disabled) nav.firstElementChild.click();
    let text = '';
    for (let page = 0; page < Number(area.dataset.pageCount); page++) {
      const errors = audit();
      if (errors.length) throw new Error(errors.join(', '));
      text += area.textContent;
      if (page < Number(area.dataset.pageCount) - 1) nav.lastElementChild.click();
    }
    output.push(text);
    while (!nav.firstElementChild.disabled) nav.firstElementChild.click();
  }
  return output;
}
const fixture = { id: 'development-creature', name: 'ENTWICKLUNGSBEISPIEL', researcher: 'TEST', visible: true,
  first: { description: ('Sehr langer Absatz mit grünen Blättern, Pfoten und einer Schnauze. ').repeat(35) + '\n\nZweiter Absatz.\n' + 'Ungetrennt'.repeat(60), image: null, note: 'Testnotiz', phase: '' },
  revised: { description: 'Überarbeitete Fassung. '.repeat(60), image: null, note: 'Zweite Notiz', phase: 'Überarbeitet' } };
window.bookTests = {
  render, settle, audit, readAllPages,
  expected(id) { const entry = animals.find(a => a.id === id); return entry.textContent.map(s => s.heading + ': ' + s.text).join('\n\n'); },
  expectedCodex(detail) {
    if (detail === 'check') return [descriptionCriteria.join('')];
    const section = codexSections.find(s => s.id === detail);
    return [section.items.map(item => `• ${item}`).join('\n\n')];
  },
  longSection(on) { animals[0].textContent = on ? [{ heading: 'Langer Abschnitt', text: 'Einzelner langer Absatz mit allen Details. '.repeat(65) + 'Ungetrennt'.repeat(60) }] : original; },
  async collection() {
    dialog.querySelector('.book-tools')?.remove(); dialog.className = 'collection-dialog';
    document.querySelector('#view-title').textContent = 'Das Buch der unentdeckten Wesen';
    const canvas = document.createElement('canvas'); canvas.width = 200; canvas.height = 100;
    canvas.getContext('2d').fillRect(0, 0, 200, 100); fixture.first.image = canvas.toDataURL();
    await writeCollection(classroom.id, [fixture, { ...fixture, id: 'development-other', name: 'ZWEITES WESEN' }]);
    await renderCollection(content, classroom.id);
    [...content.querySelectorAll('.creature-card')][0].click();
    if (!dialog.open) dialog.showModal(); await settle();
  },
  async unchanged() { return JSON.stringify((await readCollection(classroom.id))[0]) === JSON.stringify(fixture); },
  fixture
};
render('niffler');
await settle();
document.documentElement.dataset.ready = 'true';
