import { animals } from './data.js';
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
  asset(spread, entry.pageAsset, `Vollständige Bestiariums-Doppelseite: ${entry.name}`, 'book-art');
  if (entry.type === 'codex') {
    entry.textContent.forEach(section => {
      const text = element('section', '', 'codex-text');
      position(text, section);
      text.append(element('h3', section.heading), element('p', section.text));
      spread.append(text);
    });
  } else if (entry.type === 'class') {
    renderClassEntries(spread, classroom.classEntries, detailId, id => navigate('bestiary', entry.id, id));
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
function renderClassEntries(spread, entries, detailId, open) {
  const text = element('section', '', 'class-book-text');
  const detail = entries.find(entry => entry.id === detailId);
  text.append(element('h3', detail ? detail.name : 'Unsere Entdeckungen'));
  if (detail) {
    text.append(button('Zur Klassenübersicht', () => open(null)), element('p', detail.description, 'class-description'));
    if (detail.mainImage) {
      const frame = element('div', '', 'class-main-image');
      asset(frame, detail.mainImage, detail.name);
      spread.append(frame);
    }
    const details = element('div', '', 'class-detail-images');
    detail.detailImages.forEach((path, index) => {
      const frame = element('div', '', 'class-detail-image');
      asset(frame, path, `Detail ${index + 1} von ${detail.name}`);
      details.append(frame);
    });
    spread.append(details);
  } else if (!entries.length) {
    text.append(element('p', 'Hier sammeln wir später die Tierwesen und Entdeckungen unserer Klasse. Noch warten die Seiten auf eure Ideen!'));
  } else {
    const list = element('ul', '', 'class-entry-list');
    entries.forEach(entry => { const item = element('li'); item.append(button(entry.name, () => open(entry.id))); list.append(item); });
    text.append(list);
  }
  spread.append(text);
}
