import { element, button } from './ui.js';


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
export { renderCollection } from './collection-reader.js';
