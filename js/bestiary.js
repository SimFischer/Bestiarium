import { animals, classBestiaryPages } from './data.js';
import { bookUnlocked } from './state.js';
import { element, button, asset, position } from './ui.js';

export function renderBestiary(content, classroom, entryId, detailId, navigate) {
  const heading = document.querySelector('#view-title');
  content.replaceChildren();
  const entry = animals.find(a => a.id === entryId);
  if (!entry) {
    heading.textContent = 'Bestiarium';
    content.append(element('p', 'Unsere Tierwesen, Forschungsregeln und Entdeckungen.', 'intro'));
    const list = element('div', '', 'card-grid');
    animals.forEach(book => {
      const item = element('article', '', 'entry');
      item.append(element('h3', book.name), element('p', bookUnlocked(classroom, book) ? 'Freigeschaltet' : 'Noch verschlossen', 'status'), button(`${book.name} öffnen`, () => navigate('bestiary', book.id)));
      list.append(item);
    });
    content.append(list);
    return;
  }
  heading.textContent = `Bestiarium · ${entry.name}`;
  content.append(button('Zur Bestiariumsübersicht', () => navigate('bestiary'), 'bestiary-back'));
  if (!bookUnlocked(classroom, entry)) {
    const locked = element('section', '', 'locked-page');
    locked.append(element('h3', 'Diese Buchseite wartet noch auf euch.'), element('p', `Der Eintrag „${entry.name}“ ist noch verschlossen. Eure Lehrkraft kann ihn freischalten.`));
    content.append(locked);
    return;
  }
  const spread = element('article', '', `bestiary-spread book-${entry.type}`);
  const preparedPage = entry.type === 'class' ? classBestiaryPages.find(page => page.id === detailId) : null;
  asset(spread, preparedPage?.asset || entry.pageAsset, `Vollständige Bestiariums-Doppelseite: ${entry.name}`, 'book-art');
  if (entry.type === 'codex') {
    entry.textContent.forEach(section => {
      const text = element('section', '', 'codex-text');
      position(text, section);
      text.append(element('h3', section.heading), element('p', section.text));
      spread.append(text);
    });
  } else if (entry.type === 'class') {
    if (preparedPage) {
      heading.textContent = preparedPage.title;
      content.append(button('Zur Klassenübersicht', () => navigate('bestiary', entry.id), 'bestiary-back'));
    } else renderClassPages(spread, id => navigate('bestiary', entry.id, id));
  } else {
    const text = element('div', '', 'bestiary-page-text');
    text.append(element('h3', entry.name));
    entry.textContent.forEach(section => {
      const paragraph = element('p');
      paragraph.append(element('strong', `${section.heading}: `), document.createTextNode(section.text));
      text.append(paragraph);
    });
    spread.append(text);
  }
  content.append(spread);
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