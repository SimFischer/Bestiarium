import { roomPhases, hotspots, animals, features, expeditions } from './data.js';
import { activeClass, subscribe, getStorageWarning, bookUnlocked } from './state.js';
import { initTeacher } from './teacher.js';
import { initIntro } from './intro.js';
import { renderBestiary } from './bestiary.js';
import { renderMap, renderExpedition, initRegionMessages } from './world.js';
import { element } from './ui.js';
const dialog = document.querySelector('#view-dialog');
const content = document.querySelector('#view-content');
const notice = document.querySelector('#notice');
let currentView = '';
let selectedId = null;
let detailId = null;
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
const images = roomPhases.map(phase => {
  const img = element('img');
  img.src = phase.image;
  img.alt = `Forschungsstation · ${phase.name}`;
  img.draggable = false;
  img.addEventListener('error', () => notify(`Raumgrafik für Phase ${phase.id} konnte nicht geladen werden.`));
  document.querySelector('#room-images').append(img);
  return img;
});
function navigate(view, id = null, detail = null) {
  if (view === 'station') { dialog.close(); return; }
  currentView = view;
  selectedId = id;
  detailId = detail;
  content.replaceChildren();
  renderView();
  if (!dialog.open) dialog.showModal();
  else content.querySelector('button')?.focus();
}
const buttons = hotspots.map(hotspot => {
  const button = element('button', '', 'hotspot');
  button.type = 'button';
  Object.assign(button.style, { left: `${hotspot.x}%`, top: `${hotspot.y}%`, width: `${hotspot.width}%`, height: `${hotspot.height}%` });
  const label = element('span', hotspot.name, 'hotspot-label');
  button.append(label);
  button.addEventListener('click', () => {
    button.classList.add('touched');
    setTimeout(() => button.classList.remove('touched'), 280);
    if (hotspot.feature && !activeClass().features[hotspot.feature]) { notify(`${hotspot.name} ist noch verschlossen.`); return; }
    navigate(hotspot.id, hotspot.bookId);
  });
  document.querySelector('#hotspots').append(button);
  return { button, label, hotspot };
});
function renderView() {
  const classroom = activeClass();
  const heading = document.querySelector('#view-title');
  dialog.classList.toggle('book-dialog', currentView === 'bestiary' && Boolean(selectedId));
  dialog.classList.toggle('landscape-dialog', ['world-map', 'expedition'].includes(currentView));
  if (currentView === 'bestiary') {
    renderBestiary(content, classroom, selectedId, detailId, navigate);
  } else if (currentView === 'world-map') {
    heading.textContent = 'Weltkarte';
    renderMap(content, classroom, navigate, notify);
  } else if (currentView === 'expedition') {
    heading.textContent = expeditions.find(e => e.id === selectedId)?.title || 'Expedition';
    renderExpedition(content, classroom, selectedId, navigate);
  } else {
    content.replaceChildren();
    const feature = features.find(f => f.id === currentView);
    if (!feature) return;
    heading.textContent = feature.name;
    content.append(element('p', classroom.features[feature.id] ? feature.description : 'Dieser Bereich ist noch verschlossen.', 'intro'));
  }
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
    const book = animals.find(a => a.id === hotspot.bookId);
    const locked = Boolean((hotspot.feature && !classroom.features[hotspot.feature]) || (book && !bookUnlocked(classroom, book)));
    button.classList.toggle('locked', locked);
    button.setAttribute('aria-label', `${hotspot.name}${locked ? ' · verschlossen' : ''}`);
    button.setAttribute('aria-disabled', String(locked));
    label.textContent = `${locked ? 'Verschlossen · ' : ''}${hotspot.name}`;
  });
  if (dialog.open) renderView();
  story.sync();
  messages.check();
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
const messages = initRegionMessages();
initTeacher(notify, story.start);
subscribe(render);
render();
