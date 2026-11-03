import { element, button } from './ui.js';
import { readCollection } from './collection-store.js';
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
    let selected = null, version = 'first', imageVisible = true, textVisible = true, prompts = false;
    function render() {
      root.replaceChildren();
      const subtitle = element('p', 'Entdeckungen unserer Forschungsgruppe', 'creature-subtitle');
      root.append(subtitle);
      if (selected === null) {
        const intro = element('article', '', 'creature-spread creature-welcome');
        const left = element('section', '', 'creature-leaf');
        left.append(element('p', 'Vidi öffnet das Archiv', 'creature-phase'), element('h3', collectionTitle), element('p', invitation));
        const right = element('section', '', 'creature-leaf');
        right.append(element('div', '✧', 'creature-sigil'), element('h3', entries.length ? 'Unsere Entdeckungen' : 'Hier beginnt eure Sammlung'), element('p', 'Erfinde ein Tierwesen und beschreibe es so genau, dass andere es sich vorstellen können.'), element('p', 'Erste Ideen sind willkommen. Eure Beschreibungen dürfen mit euch wachsen.'));
        intro.append(left, right); root.append(intro);
        const grid = element('div', '', 'creature-grid');
        entries.forEach((entry, index) => {
          const open = button('', () => { selected = index; version = 'first'; render(); focus(); }, 'creature-card');
          if (entry.first.image) { const img = element('img'); img.src = entry.first.image; img.alt = ''; open.append(img); }
          else open.append(element('span', '✧', 'creature-sigil'));
          open.append(element('span', entry.name)); grid.append(open);
        });
        root.append(grid); return;
      }
      const entry = entries[selected];
      const tools = element('nav', '', 'actions creature-tools'); tools.setAttribute('aria-label', 'Buchansicht');
      tools.append(button('Zur Übersicht', () => { selected = null; render(); focus(); }));
      for (const [key, label] of [['first', 'Erste Idee'], ['revised', 'Überarbeitet']]) {
        if (key === 'revised' && !entry.revised) continue;
        const toggle = button(label, () => { version = key; render(); focus(); }); toggle.setAttribute('aria-pressed', String(key === version)); tools.append(toggle);
      }
      const spread = creatureSpread(entry, version);
      for (const [label, visible, callback] of [
        ['Bild', imageVisible, () => { imageVisible = !imageVisible; }], ['Beschreibung', textVisible, () => { textVisible = !textVisible; }], ['Gesprächsimpulse', prompts, () => { prompts = !prompts; }]
      ]) { const toggle = button(`${label} ${visible ? 'ausblenden' : 'einblenden'}`, () => { callback(); render(); focus(); }); toggle.setAttribute('aria-pressed', String(visible)); tools.append(toggle); }
      if (!imageVisible) spread.querySelector('.creature-art').replaceChildren(element('p', 'Das Bild bleibt noch ein Geheimnis.'));
      if (!textVisible) spread.querySelector('.creature-words').replaceChildren(element('h3', entry.name), element('p', 'Die Beschreibung bleibt noch ein Geheimnis.'));
      root.append(tools, spread);
      if (prompts) { const list = element('ul', '', 'creature-prompts'); ['Welche Merkmale erkennst du wieder?', 'Welche Angaben fehlen noch?', 'Was zeigt das Bild, das im Text gar nicht beschrieben wurde?'].forEach(t => list.append(element('li', t))); root.append(list); }
      const turns = element('nav', '', 'actions creature-turns'); turns.setAttribute('aria-label', 'Blättern');
      [-1, 1].forEach(direction => { const next = button(direction < 0 ? '‹ Vorheriges Wesen' : 'Nächstes Wesen ›', () => { selected += direction; version = 'first'; render(); focus(); }); next.disabled = !entries[selected + direction]; turns.append(next); });
      turns.insertBefore(element('span', `${selected + 1} von ${entries.length}`), turns.lastChild); root.append(turns);
    }
    function focus() { root.tabIndex = -1; root.focus({ preventScroll: true }); const dialog = root.closest('dialog'); if (dialog) dialog.scrollTop = 0; }
    render();
  } catch (error) { root.replaceChildren(element('p', error.message, 'dialog-notice'), button('Erneut versuchen', () => renderCollection(content, classId))); }
}
