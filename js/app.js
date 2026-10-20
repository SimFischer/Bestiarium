import { roomPhases, hotspots, animals, animalStatuses, regions, regionStatuses, features } from './data.js';
import { activeClass, subscribe, getStorageWarning } from './state.js';
import { initTeacher } from './teacher.js';
import { initIntro } from './intro.js';
const dialog = document.querySelector('#view-dialog');
const content = document.querySelector('#view-content');
const notice = document.querySelector('#notice');
let currentView = '';
let currentAnimalId = null;
let noticeTimer;
function notify(message) {
  clearTimeout(noticeTimer);
  notice.textContent = message;
  notice.hidden = false;
  document.querySelectorAll('.dialog-notice').forEach(node => { node.textContent = message; node.hidden = false; });
  noticeTimer = setTimeout(() => {
    notice.hidden = true;
    document.querySelectorAll('.dialog-notice').forEach(node => { node.hidden = true; });
  }, 9000);
}
const element = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
};
const images = roomPhases.map(phase => {
  const img = element('img');
  img.src = phase.image;
  img.alt = `Forschungsstation · ${phase.name}`;
  img.draggable = false;
  img.addEventListener('error', () => notify(`Raumgrafik für Phase ${phase.id} konnte nicht geladen werden.`));
  document.querySelector('#room-images').append(img);
  return img;
});
const buttons = hotspots.map(hotspot => {
  const button = element('button', '', 'hotspot');
  button.type = 'button';
  button.style.left = `${hotspot.x}%`;
  button.style.top = `${hotspot.y}%`;
  button.style.width = `${hotspot.width}%`;
  button.style.height = `${hotspot.height}%`;
  const label = element('span', hotspot.name, 'hotspot-label');
  button.append(label);
  button.addEventListener('click', () => {
    button.classList.add('touched');
    setTimeout(() => button.classList.remove('touched'), 280);
    if (hotspot.feature && !activeClass().features[hotspot.feature]) {
      notify(`${hotspot.name} ist noch verschlossen.`);
      return;
    }
    currentView = hotspot.id;
    currentAnimalId = null;
    renderView();
    dialog.showModal();
  });
  document.querySelector('#hotspots').append(button);
  return { button, label, hotspot };
});
function renderView() {
  const classroom = activeClass();
  const heading = document.querySelector('#view-title');
  content.replaceChildren();
  dialog.classList.toggle('book-dialog', currentView === 'bestiary' && Boolean(currentAnimalId));
  if (currentView === 'bestiary') {
    if (currentAnimalId) {
      renderAnimalPage(animals.find(a => a.id === currentAnimalId), classroom);
      return;
    }
    heading.textContent = 'Bestiarium · Band I';
    content.append(element('p', 'Wir sammeln Spuren, beobachten genau und halten unsere Entdeckungen im Heft fest.', 'intro'));
    const list = element('div', '', 'card-grid');
    animals.forEach((animal, index) => {
      if (animal.pageAsset) {
        const entry = element('article', '', 'entry');
        entry.append(element('h3', animal.name), element('p', classroom.animals[animal.id].unlocked ? 'Freigeschaltet' : 'Noch verschlossen', 'status'));
        const open = element('button', `${animal.name} öffnen`);
        open.type = 'button';
        open.addEventListener('click', () => { currentAnimalId = animal.id; renderView(); content.querySelector('.bestiary-back').focus(); });
        entry.append(open);
        list.append(entry);
        return;
      }
      const status = classroom.animals[animal.id];
      const card = element('article', '', `entry status-${status}`);
      card.append(element('p', `Eintrag ${String(index + 1).padStart(2, '0')}`, 'eyebrow'));
      card.append(element('h3', ['hidden', 'hint'].includes(status) ? 'Unbekanntes Tierwesen' : animal.name));
      card.append(element('p', animalStatuses[status], 'status'));
      const descriptions = {
        hidden: 'Diese Seite des beschädigten Bestiariums wartet noch auf eine Entdeckung.',
        hint: animal.hint,
        sighted: 'Gesichtet! Beobachtet Körperbau, Kopf, Rumpf, Gliedmaßen und besondere Merkmale.',
        documented: 'Die Tierbeschreibung wurde dokumentiert. Prüft Aufbau, genaue Adjektive und sachliche Sprache.',
        verified: 'Der Eintrag wurde überprüft und in das Forschungsarchiv aufgenommen.'
      };
      card.append(element('p', descriptions[status]));
      list.append(card);
    });
    content.append(list);
  } else if (currentView === 'world') {
    heading.textContent = 'Weltkarte';
    content.append(element('p', 'Je genauer wir Tiere beobachten und beschreiben können, desto mehr von ihrer Welt können wir entdecken.', 'intro'));
    content.append(element('p', 'Expeditionsübersicht · Die gezeichnete Weltkarte folgt später.', 'muted'));
    const list = element('div', '', 'region-grid');
    regions.forEach((region, index) => {
      const status = classroom.regions[region.id];
      const card = element('article', '', `region status-${status}`);
      card.append(element('span', String(index + 1).padStart(2, '0'), 'region-number'));
      const text = element('div');
      text.append(element('h3', status === 'hidden' ? 'Unbekannte Region' : region.name), element('p', regionStatuses[status], 'status'));
      card.append(text);
      list.append(card);
    });
    content.append(list);
  } else {
    const feature = features.find(f => f.id === currentView);
    if (!feature) return;
    heading.textContent = feature.name;
    content.append(element('p', classroom.features[feature.id] ? feature.description : 'Dieser Bereich ist noch verschlossen.', 'intro'));
    if (feature.id === 'classBestiary' && classroom.features[feature.id]) content.append(element('p', 'Noch keine Tierwesen eingetragen.', 'muted'));
  }
}
function renderAnimalPage(animal, classroom) {
  document.querySelector('#view-title').textContent = `Bestiarium · ${animal.name}`;
  const back = element('button', 'Zur Bestiariumsübersicht', 'bestiary-back');
  back.type = 'button';
  back.addEventListener('click', () => { currentAnimalId = null; renderView(); content.querySelector('button').focus(); });
  content.append(back);
  if (!classroom.animals[animal.id].unlocked) {
    const locked = element('section', '', 'locked-page');
    locked.append(element('h3', 'Diese Buchseite wartet noch auf euch.'), element('p', `Der Eintrag „${animal.name}“ ist noch verschlossen. Eure Lehrkraft kann ihn freischalten.`));
    content.append(locked);
    return;
  }
  const spread = element('article', '', 'bestiary-spread');
  const image = element('img');
  image.src = animal.pageAsset;
  image.alt = `Vollständige Bestiariums-Doppelseite: ${animal.name} mit Körper-, Pfoten- und Verhaltensstudien`;
  const text = element('div', '', 'bestiary-page-text');
  text.append(element('h3', animal.name));
  animal.textContent.forEach(section => {
    const paragraph = element('p');
    paragraph.append(element('strong', `${section.heading}: `), document.createTextNode(section.text));
    text.append(paragraph);
  });
  spread.append(image, text);
  content.append(spread);
}
function render() {
  const classroom = activeClass();
  images.forEach((img, index) => {
    const active = index === classroom.phase;
    img.classList.toggle('active', active);
    img.setAttribute('aria-hidden', String(!active));
  });
  document.querySelector('#class-label').textContent = `${classroom.name} · ${roomPhases[classroom.phase].name}`;
  buttons.forEach(({ button, label, hotspot }) => {
    const locked = Boolean(hotspot.feature && !classroom.features[hotspot.feature]);
    button.classList.toggle('locked', locked);
    button.setAttribute('aria-label', `${hotspot.name}${locked ? ' · verschlossen' : ''}`);
    button.setAttribute('aria-disabled', String(locked));
    label.textContent = `${locked ? 'Verschlossen · ' : ''}${hotspot.name}`;
  });
  if (dialog.open) renderView();
  story.sync();
  if (getStorageWarning()) notify(getStorageWarning());
}
document.querySelectorAll('dialog').forEach(modal => {
  const feedback = element('p', '', 'dialog-notice');
  feedback.hidden = true;
  feedback.setAttribute('role', 'status');
  modal.querySelector('.dialog-heading').after(feedback);
  modal.querySelector('[data-close]').addEventListener('click', () => modal.close());
});
const story = initIntro();
initTeacher(notify, story.start);
subscribe(render);
render();
