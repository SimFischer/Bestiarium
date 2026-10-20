import { regions, expeditions, mapConfig } from './data.js';
import { activeClass, updateClass } from './state.js';
import { element, button, asset, position } from './ui.js';

export function renderMap(content, classroom, navigate, notify) {
  let scene = content.querySelector('.world-scene');
  if (!scene) {
    content.replaceChildren();
    scene = element('div', '', 'world-scene observation-scene');
    scene.setAttribute('aria-label', 'Weltkarte mit vier Forschungsregionen');
    asset(scene, mapConfig.asset, 'Weltkarte der Forschungsstation', 'scene-background');
    regions.forEach(region => {
      const hotspot = button('', () => {
        const current = activeClass();
        if (!current.regions[region.id].unlocked) { notify('Diese Region liegt noch im Nebel.'); return; }
        if (region.id === 'station') { navigate('station'); return; }
        const expedition = expeditions.find(e => e.regionId === region.id);
        if (!expedition || !current.expeditions[expedition.id].unlocked) { notify('Die Expedition ist noch nicht freigeschaltet.'); return; }
        navigate('expedition', expedition.id);
      }, 'map-region');
      position(hotspot, region);
      hotspot.dataset.region = region.id;
      const fog = element('span', '', 'region-fog');
      fog.setAttribute('aria-hidden', 'true');
      hotspot.append(fog, element('span', region.name, 'region-label'));
      scene.append(hotspot);
    });
    content.append(element('p', 'Wählt eine freigeschaltete Region für eine gemeinsame Beobachtung.', 'muted'), scene);
  }
  regions.forEach(region => {
    const hotspot = scene.querySelector(`[data-region="${region.id}"]`);
    const unlocked = classroom.regions[region.id].unlocked;
    hotspot.classList.toggle('region-unlocked', unlocked);
    hotspot.setAttribute('aria-disabled', String(!unlocked));
    hotspot.setAttribute('aria-label', `${region.name} · ${unlocked ? 'freigeschaltet' : 'verschlossen'}`);
  });
}
export function renderExpedition(content, classroom, expeditionId, navigate) {
  content.replaceChildren();
  content.append(button('Zur Weltkarte', () => navigate('world-map'), 'bestiary-back'));
  const expedition = expeditions.find(e => e.id === expeditionId);
  if (!expedition || !classroom.regions[expedition.regionId].unlocked || !classroom.expeditions[expedition.id].unlocked) {
    content.append(element('p', 'Diese Expedition ist noch verschlossen.', 'locked-page'));
    return;
  }
  const scene = element('div', '', 'expedition-scene observation-scene');
  scene.setAttribute('aria-label', expedition.title);
  asset(scene, expedition.backgroundAsset, expedition.title, 'scene-background');
  expedition.creatures.forEach(creature => {
    const wrapper = element('div', '', 'expedition-creature');
    wrapper.style.left = `${creature.x}%`;
    wrapper.style.top = `${creature.y}%`;
    wrapper.style.width = `${24 * creature.scale}%`;
    wrapper.style.height = `${40 * creature.scale}%`;
    const motion = element('div', '', `creature-motion motion-${creature.animationType}`);
    const name = creature.id.charAt(0).toUpperCase() + creature.id.slice(1);
    asset(motion, creature.asset, name, 'creature-image');
    wrapper.append(motion);
    scene.append(wrapper);
  });
  const hint = element('aside', '', 'expedition-hint');
  const portrait = element('img');
  portrait.src = 'assets/story/vidi-fullbody.png';
  portrait.alt = 'Vidi';
  hint.append(portrait, element('p', `Vidi: „${expedition.hint}“`));
  scene.append(hint);
  content.append(scene);
}
export function initRegionMessages() {
  const dialog = element('dialog', '', 'region-message-dialog');
  dialog.setAttribute('aria-labelledby', 'region-message-title');
  const title = element('h2', 'Vidi hat etwas entdeckt!');
  title.id = 'region-message-title';
  const image = element('img');
  image.src = 'assets/story/vidi-fullbody.png';
  image.alt = 'Vidi';
  const text = element('p');
  const body = element('div');
  let regionId;
  let classId;
  const acknowledge = () => {
    if (activeClass().id === classId && regionId) updateClass(c => { c.regions[regionId].messageSeen = true; });
    dialog.close();
  };
  body.append(title, text, button('Weiterforschen', acknowledge));
  dialog.append(image, body);
  document.body.append(dialog);
  function check() {
    if (dialog.open || document.querySelector('#teacher-dialog').open || !document.querySelector('#story-intro').hidden) return;
    const classroom = activeClass();
    const region = regions.find(r => r.message && classroom.regions[r.id].unlocked && !classroom.regions[r.id].messageSeen);
    if (!region) return;
    regionId = region.id;
    classId = classroom.id;
    text.textContent = region.message;
    dialog.showModal();
  }
  dialog.addEventListener('cancel', event => { event.preventDefault(); acknowledge(); });
  dialog.addEventListener('close', check);
  document.querySelector('#teacher-dialog').addEventListener('close', check);
  return { check };
}
