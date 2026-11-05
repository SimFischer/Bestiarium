import { animals, classBestiaryPages, bestiaryConfig } from './data.js';
import { bookUnlocked } from './state.js';
import { element, button, asset } from './ui.js';
import { renderCodex } from './research.js';
import { addBookReader } from './book-reader.js';
import { paginateBook } from './book-layout.js';
import { bookChrome, bookEdges } from './book-chrome.js';

export const availableBooks = classroom => bestiaryConfig.order.map(id => animals.find(entry => entry.id === id)).filter(entry => entry && bookUnlocked(classroom, entry));

function renderIndex(content, books, navigate) {
  const spread = element('article', '', 'bestiary-spread bestiary-index');
  asset(spread, bestiaryConfig.indexAsset, 'Aufgeschlagenes Bestiarium', 'index-art');
  const pages = element('div', '', 'index-pages');
  const discoveries = element('section', '', 'index-leaf');
  const chapters = element('section', '', 'index-leaf');
  discoveries.append(element('h3', 'Unsere Entdeckungen'));
  const addEntries = (page, entries) => {
    const list = element('ol', '', 'index-list');
    entries.forEach(entry => {
      const item = element('li');
      const open = button('', () => navigate('bestiary', entry.id), 'index-entry');
      open.dataset.entryId = entry.id;
      open.setAttribute('aria-label', `${entry.name} öffnen`);
      const rule = element('span', '', 'index-rule');
      rule.setAttribute('aria-hidden', 'true');
      const number = element('span', String(books.indexOf(entry) + 1), 'index-number');
      number.setAttribute('aria-hidden', 'true');
      open.append(element('span', entry.type === 'class' ? 'Entdeckungen unserer Klasse' : entry.name), rule, number);
      item.append(open);
      list.append(item);
    });
    page.append(list);
  };
  const creatures = books.filter(entry => entry.type === 'animal');
  if (creatures.length) addEntries(discoveries, creatures);
  else discoveries.append(element('p', 'Hier beginnt unser Forschungsbuch. Wir beobachten genau und halten unsere Entdeckungen fest.', 'index-intro'));
  const special = books.filter(entry => entry.type !== 'animal');
  if (special.length) { chapters.append(element('h3', 'Forschernotizen')); addEntries(chapters, special); }
  chapters.append(element('p', 'Je genauer wir beobachten und\nbeschreiben, desto mehr können wir\nentdecken.', 'index-motto'));
  pages.append(discoveries, chapters);
  spread.append(pages);
  const stage = element('div', '', 'book-stage');
  const pagers = [];
  const position = element('p', '', 'book-position');
  let indexPage = 0;
  const edges = bookEdges(stage, direction => { indexPage += direction; pagers.forEach(p => p.show(Math.min(indexPage, p.count - 1))); sync(); });
  function sync() {
    const count = Math.max(1, ...pagers.map(p => p.count));
    indexPage = Math.min(indexPage, count - 1);
    edges.previous.disabled = indexPage <= 0; edges.next.disabled = indexPage >= count - 1;
    position.textContent = `Inhaltsverzeichnis · Seite ${indexPage + 1} von ${count}`;
  }
  for (const [index, leaf] of [discoveries, chapters].entries()) {
    const blocks = [...leaf.children].flatMap(node => node.matches('ol') ? [...node.children] : [node]);
    leaf.addEventListener('click', event => { const id = event.target.closest('[data-entry-id]')?.dataset.entryId; if (id) navigate('bestiary', id); });
    const controls = element('nav');
    pagers.push(paginateBook(leaf, blocks, controls, index ? 'Rechts' : 'Links', sync));
  }
  stage.append(spread); content.append(stage, position); bookChrome(content); sync();
}
export function renderBestiary(content, classroom, entryId, detailId, navigate) {
  const heading = document.querySelector('#view-title');
  content.replaceChildren();
  const books = availableBooks(classroom);
  const entry = books.find(book => book.id === entryId);
  if (!entry) {
    heading.textContent = 'Bestiarium';
    renderIndex(content, books, navigate);
    return;
  }
  heading.textContent = `Bestiarium · ${entry.name}`;
  if (entry.type === 'codex' && detailId === 'check') {
    renderCodex(content, null, classroom, detailId, navigate);
    return;
  }
  const stage = element('div', '', 'book-stage');
  const spread = element('article', '', `bestiary-spread book-${entry.type}`);
  const preparedPage = entry.type === 'class' ? classBestiaryPages.find(page => page.id === detailId) : null;
  asset(spread, entry.type === 'codex' ? bestiaryConfig.indexAsset : preparedPage?.asset || entry.pageAsset, `Vollständige Bestiariums-Doppelseite: ${entry.name}`, 'book-art');
  stage.append(spread);
  content.append(stage);
  if (entry.type === 'codex') {
    const index = books.indexOf(entry);
    renderCodex(content, spread, classroom, detailId, navigate, {
      previous: books[index - 1] ? tail => navigate('bestiary', books[index - 1].id, tail) : null,
      next: books[index + 1] ? () => navigate('bestiary', books[index + 1].id) : null,
      index: () => navigate('bestiary'), startLast: detailId === 'last'
    });
    return;
  } else if (entry.type === 'class') {
    if (preparedPage) {
      heading.textContent = preparedPage.title;
      content.append(button('Zur Klassenübersicht', () => navigate('bestiary', entry.id), 'bestiary-back'));
    } else renderClassPages(spread, id => navigate('bestiary', entry.id, id));
  } else {
    const index = books.indexOf(entry);
    addBookReader(content, spread, {
      id: entry.id, title: entry.name,
      text: entry.textContent.map(section => `${section.heading}: ${section.text}`).join('\n\n'),
      previous: books[index - 1] ? tail => navigate('bestiary', books[index - 1].id, tail) : null,
      next: books[index + 1] ? () => navigate('bestiary', books[index + 1].id) : null,
      index: () => navigate('bestiary'), startLast: detailId === 'last'
    });
    return;
  }
  const index = books.indexOf(entry);
  for (const direction of [-1, 1]) {
    const target = books[index + direction];
    if (!target) continue;
    const navClass = direction < 0 ? 'book-previous' : 'book-next';
    const turn = button(direction < 0 ? '‹' : '›', async () => {
      if (!await navigate('bestiary', target.id)) return;
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        content.querySelector('.bestiary-spread')?.animate([{ opacity: .35, transform: `translateX(${direction * 8}px)` }, { opacity: 1, transform: 'translateX(0)' }], { duration: 220, easing: 'ease-out' });
      }
      (content.querySelector(`.${navClass}`) || content.querySelector('.bestiary-back'))?.focus();
    }, `book-turn ${navClass}`);
    turn.setAttribute('aria-label', `${direction < 0 ? 'Vorherige' : 'Nächste'} Buchseite: ${target.name}`);
    stage.append(turn);
  }
}
function renderClassPages(spread, open) {
  const text = element('section', '', 'class-book-text');
  text.append(element('h3', 'Unsere Entdeckungen'));
  if (!classBestiaryPages.length) {
    text.append(element('p', 'Hier sammeln wir später die fertigen Tierwesenseiten unserer Klasse. Noch wartet dieser zweite Band auf eure Entdeckungen!'));
  } else {
    const list = element('ul', '', 'class-entry-list');
    classBestiaryPages.forEach(page => { const item = element('li'); item.append(button(page.title, () => open(page.id))); list.append(item); });
    text.append(list);
  }
  spread.append(text);
}
