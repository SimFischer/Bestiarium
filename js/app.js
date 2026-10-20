import { roomPhases, hotspots, animals, features, expeditions, generatorConfig } from './data.js';
import { activeClass, subscribe, getStorageWarning, bookUnlocked } from './state.js';
import { initTeacher } from './teacher.js';
import { initIntro } from './intro.js';
import { renderBestiary } from './bestiary.js';
import { renderMap, renderExpedition } from './world.js';
import { element } from './ui.js';
import { initVidiDialogs } from './story.js';
import { createGenerator } from './generator.js';
import { initFullscreen } from './fullscreen.js';
const dialog = document.querySelector('#view-dialog');
const content = document.querySelector('#view-content');
const stationAction = element('div', '', 'station-action');
document.querySelector('#hotspots').append(stationAction);
let currentView = '';
let selectedId = null;
let detailId = null;
let noticeTimer;
function notify(message) {
  clearTimeout(noticeTimer);
  const feedback = document.querySelector('#teacher-dialog .dialog-notice');
  if (!feedback) return;
  feedback.textContent = message;
  feedback.hidden = false;
  noticeTimer = setTimeout(() => {
    feedback.hidden = true;
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
  generator.cancel();
  if (view === 'station') { dialog.close(); return; }
  currentView = view;
  selectedId = id;
  detailId = detail;
  content.replaceChildren();
  renderView();
  if (!dialog.open) dialog.showModal();
  else content.querySelector('button')?.focus();
  messages.check();
}
const buttons = hotspots.map(hotspot => {
  const button = element('button', '', 'hotspot');
  button.type = 'button';
  Object.assign(button.style, { left: `${hotspot.x}%`, top: `${hotspot.y}%`, width: `${hotspot.width}%`, height: `${hotspot.height}%` });
  button.addEventListener('click', () => {
    const classroom = activeClass();
    const book = animals.find(entry => entry.id === hotspot.bookId);
    if ((hotspot.feature && !classroom.unlockedFeatures.includes(hotspot.feature)) || (book && !bookUnlocked(classroom, book))) return;
    navigate(hotspot.id, hotspot.bookId);
  });
  document.querySelector('#hotspots').append(button);
  return { button, hotspot };
});
function renderView() {
  const classroom = activeClass();
  const heading = document.querySelector('#view-title');
  dialog.classList.toggle('book-dialog', currentView === 'bestiary');
  dialog.classList.toggle('landscape-dialog', ['world-map', 'expedition'].includes(currentView));
  dialog.classList.toggle('generator-dialog', currentView === 'generator');
  if (currentView === 'bestiary') {
    renderBestiary(content, classroom, selectedId, detailId, navigate);
    const tools = element('div', '', 'book-tools');
    const back = content.querySelector('.bestiary-back');
    if (back) tools.append(back);
    const hasAction = messages.renderAction(tools, 'bestiary');
    content.classList.toggle('has-presentation-action', hasAction);
    if (back || hasAction) content.prepend(tools);
  } else if (currentView === 'world-map') {
    heading.textContent = 'Weltkarte';
    renderMap(content, classroom, navigate);
  } else if (currentView === 'expedition') {
    heading.textContent = expeditions.find(e => e.id === selectedId)?.title || 'Expedition';
    renderExpedition(content, classroom, selectedId, navigate);
  } else if (currentView === 'generator') {
    if (!classroom.unlockedFeatures.includes('generator')) { generator.cancel(); dialog.close(); return; }
    heading.textContent = 'Tierwesen-Generator';
    generator.render(content, classroom);
  } else {
    content.replaceChildren();
    const feature = features.find(f => f.id === currentView);
    if (!feature) return;
    heading.textContent = feature.name;
    if (classroom.unlockedFeatures.includes(feature.id)) content.append(element('p', feature.description, 'intro'));
  }
}
function render() {
  const classroom = activeClass();
  images.forEach((img, index) => {
    const active = index === classroom.roomPhase;
    img.classList.toggle('active', active);
    img.setAttribute('aria-hidden', String(!active));
  });
  document.querySelector('#class-label').textContent = `${classroom.name} · ${roomPhases[classroom.roomPhase].name}`;
  buttons.forEach(({ button, hotspot }) => {
    const book = animals.find(a => a.id === hotspot.bookId);
    const locked = Boolean((hotspot.feature && !classroom.unlockedFeatures.includes(hotspot.feature)) || (book && !bookUnlocked(classroom, book)));
    button.disabled = locked;
    button.setAttribute('aria-label', hotspot.name);
  });
  if (dialog.open) renderView();
  stationAction.replaceChildren();
  messages.renderAction(stationAction, 'station');
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
const messages = initVidiDialogs(
  () => ({ view: dialog.open ? currentView : 'station', id: selectedId }),
  regionId => {
    navigate('world-map');
    const scene = content.querySelector('.world-scene');
    scene.inert = true;
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      scene.querySelector(`[data-region="${regionId}"] .region-fog`).animate([{ opacity: 1 }, { opacity: 0 }], { duration: 650, easing: 'ease-out' });
    }
  },
  () => { const scene = content.querySelector('.world-scene'); if (scene) scene.inert = false; },
  milestone => {
    const bookId = milestone.unlocks.bestiary?.[0];
    if (!bookId) { navigate('station'); return; }
    navigate('bestiary', bookId);
    const spread = content.querySelector('.bestiary-spread');
    const image = spread.querySelector('.book-art');
    const shine = () => spread.classList.add('book-revealed');
    if (image.complete) shine();
    else { image.addEventListener('load', shine, { once: true }); image.addEventListener('error', shine, { once: true }); }
  }
);
const generator = createGenerator(() => messages.replay(generatorConfig.vidiDialog));
dialog.addEventListener('close', () => { generator.cancel(); messages.check(); });
initTeacher(notify, story.start, messages.replay);
initFullscreen();
subscribe(render);
render();
