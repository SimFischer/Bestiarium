import { generatorBuilderConfig } from './data.js';

export function createBuilderSelection(config = generatorBuilderConfig) {
  return Object.fromEntries(config.layers.map(layer => [layer.id, null]));
}
function pickModule(layer, config) {
  const modules = config[layer.collection];
  return modules.length ? modules[Math.floor(Math.random() * modules.length)].id : null;
}
export function randomizeCreature(config = generatorBuilderConfig) {
  return Object.fromEntries(config.layers.map(layer => [layer.id, pickModule(layer, config)]));
}
export function randomizeModule(selection, layerId, config = generatorBuilderConfig) {
  return Object.fromEntries(config.layers.map(layer => [
    layer.id, layer.id === layerId ? pickModule(layer, config) : selection?.[layer.id] ?? null
  ]));
}
export function renderCreature(container, selection, config = generatorBuilderConfig) {
  const stage = document.createElement('div');
  stage.className = 'generator-builder-stage';
  stage.setAttribute('role', 'img');
  stage.setAttribute('aria-label', 'Mischwesen aus deckungsgleichen Bildebenen');
  Object.assign(stage.style, {
    position: 'relative', isolation: 'isolate', width: '100%',
    aspectRatio: `${config.canvas.width} / ${config.canvas.height}`
  });
  config.layers.forEach((layer, index) => {
    const module = config[layer.collection].find(item => item.id === selection?.[layer.id]);
    if (!module?.asset) return;
    const image = document.createElement('img');
    image.alt = '';
    image.draggable = false;
    image.dataset.layer = layer.id;
    Object.assign(image.style, {
      position: 'absolute', inset: '0', width: '100%', height: '100%',
      objectFit: 'contain', zIndex: String(index), display: 'none'
    });
    image.addEventListener('load', () => {
      if (image.naturalWidth !== config.canvas.width || image.naturalHeight !== config.canvas.height) { image.remove(); return; }
      image.style.display = 'block';
    });
    image.addEventListener('error', () => image.remove());
    stage.append(image);
    image.src = module.asset.startsWith('assets/') ? module.asset : `${layer.directory}${module.asset}`;
  });
  container.replaceChildren(stage);
  return stage;
}
