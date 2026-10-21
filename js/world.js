import { regions, expeditions, mapConfig } from './data.js';
import { activeClass } from './state.js';
import { element, button, asset, position } from './ui.js';

export function renderMap(content, classroom, navigate) {
  let scene = content.querySelector('.world-scene');
  if (!scene) {
    content.replaceChildren();
    scene = element('div', '', 'world-scene observation-scene');
    scene.setAttribute('aria-label', 'Weltkarte mit vier Forschungsregionen');
    asset(scene, mapConfig.asset, 'Weltkarte der Forschungsstation', 'scene-background');
    regions.forEach(region => {
      const hotspot = button('', () => {
        const current = activeClass();
        if (!current.unlockedRegions.includes(region.id)) return;
        if (region.id === 'station') { navigate('station'); return; }
        const expedition = expeditions.find(e => e.regionId === region.id);
        if (!expedition || !current.unlockedExpeditions.includes(expedition.id)) return;
        navigate('expedition', expedition.id);
      }, 'map-region');
      position(hotspot, region);
      hotspot.dataset.region = region.id;
      const fog = element('span', '', 'region-fog');
      fog.setAttribute('aria-hidden', 'true');
      hotspot.append(fog, element('span', region.name, 'region-label'));
      scene.append(hotspot);
    });
    content.append(element('p', 'Federhains Spuren führen uns durch diese Welt.', 'muted'), scene);
  }
  regions.forEach(region => {
    const hotspot = scene.querySelector(`[data-region="${region.id}"]`);
    const unlocked = classroom.unlockedRegions.includes(region.id);
    hotspot.classList.toggle('region-unlocked', unlocked);
    const expedition = expeditions.find(item => item.regionId === region.id);
    hotspot.disabled = !unlocked || (region.id !== 'station' && (!expedition || !classroom.unlockedExpeditions.includes(expedition.id)));
    hotspot.querySelector('.region-label').hidden = !unlocked;
    hotspot.setAttribute('aria-label', unlocked ? region.name : 'Nebelverhülltes Gebiet');
  });
}
export function renderExpedition(content, classroom, expeditionId, navigate) {
  content.replaceChildren();
  content.append(button('Zur Weltkarte', () => navigate('world-map'), 'bestiary-back'));
  const expedition = expeditions.find(e => e.id === expeditionId);
  if (!expedition || !classroom.unlockedRegions.includes(expedition.regionId) || !classroom.unlockedExpeditions.includes(expedition.id)) {
    navigate('world-map');
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
    const name = creature.name || creature.id.charAt(0).toUpperCase() + creature.id.slice(1);
    if (creature.frames) {
      wrapper.style.setProperty('--travel', `${creature.travel}cqw`);
      wrapper.style.setProperty('--walk-duration', `${creature.duration}s`);
      wrapper.style.setProperty('--frame-duration', `${creature.cadence}s`);
      motion.setAttribute('role', 'img');
      motion.setAttribute('aria-label', name);
      const walking = element('div', '', 'walking-frames');
      const images = creature.frames.map((src, index) => {
        const image = element('img', '', `creature-image creature-frame frame-${index}`);
        image.alt = '';
        image.draggable = false;
        image.src = src;
        (index ? walking : motion).append(image);
        return image;
      });
      motion.append(walking);
      Promise.all(images.map(image => image.decode())).then(() => {
        wrapper.classList.add('walking-ready');
      }).catch(() => {});
    } else {
      asset(motion, creature.asset, name, 'creature-image');
    }
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
