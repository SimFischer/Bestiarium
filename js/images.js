import { roomPhases, mapConfig, bestiaryConfig, animals, classBestiaryPages, expeditions, generatorConfig, builderAssets } from './data.js';

const pending = new Map();
export const criticalImages = phase => [
  roomPhases[phase].image, mapConfig.asset, bestiaryConfig.indexAsset,
  'assets/bestiary/master-bestiary.png',
  'assets/story/vidi-fullbody.png', 'assets/story/station-exterior.png'
];
export const backgroundImages = [
  generatorConfig.frameAsset,
  ...builderAssets,
  ...roomPhases.map(phase => phase.image),
  ...animals.map(animal => animal.pageAsset), ...classBestiaryPages.map(page => page.asset),
  ...expeditions.flatMap(expedition => [expedition.backgroundAsset,
    ...expedition.creatures.flatMap(creature => creature.frames || [creature.asset])])
];

export function decodeImage(image) {
  return new Promise(resolve => {
    let finished = false;
    const finish = success => {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      image.removeEventListener('load', loaded);
      image.removeEventListener('error', failed);
      if (!success) console.warn('Bild konnte nicht vorbereitet werden:', image.src);
      resolve(success);
    };
    const loaded = async () => {
      try { if (image.decode) await image.decode(); }
      catch { /* Bereits geladene Bilder bleiben ohne decode nutzbar. */ }
      finish(image.naturalWidth > 0);
    };
    const failed = () => finish(false);
    const timeout = setTimeout(failed, 15000);
    image.addEventListener('load', loaded, { once: true });
    image.addEventListener('error', failed, { once: true });
    if (image.complete) {
      if (image.naturalWidth) loaded();
      else failed();
    }
  });
}

export function preloadImage(src) {
  if (!pending.has(src)) {
    const image = new Image();
    image.src = src;
    pending.set(src, decodeImage(image).then(success => {
      if (!success) pending.delete(src);
      return success;
    }));
  }
  return pending.get(src);
}
export const preloadImages = list => Promise.all([...new Set(list.filter(Boolean))].map(preloadImage));
