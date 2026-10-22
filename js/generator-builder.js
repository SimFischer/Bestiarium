import { generatorBuilderConfig as config, builderAssets, builderAsset, variantAssets } from './data.js';
import { activeClass, updateClass } from './state.js';
import { element, button } from './ui.js';
import { preloadImages, decodeImage } from './images.js';

const same = (a, b) => config.layers.every(layer => a?.[layer.id] === b?.[layer.id]);
const pick = list => list[Math.floor(Math.random() * list.length)];

export function createGeneratorBuilder(showHelp) {
  let root, stage, classId, selected, mainButton, pendingKey, preparation;
  let revision = 0;
  let available = new Map();
  const controls = new Map();
  function cancel() { revision++; pendingKey = null; }
  function setBusy(busy) {
    mainButton.disabled = busy;
    controls.forEach(control => { control.reroll.disabled = busy; });
    root.setAttribute('aria-busy', String(busy));
  }
  async function present(requested) {
    const token = ++revision;
    setBusy(true);
    const loaded = await preloadImages(builderAssets);
    if (token !== revision) return;
    available = new Map(config.layers.map(layer => [layer.id,
      config[layer.collection].filter(variant => variantAssets(variant).every(src => loaded[builderAssets.indexOf(src)]))]));
    if (config.layers.some(layer => !available.get(layer.id).length)) {
      console.warn('Tierbaukasten: Eine Kategorie konnte nicht vorbereitet werden.');
      setBusy(false);
      pendingKey = null;
      return;
    }
    const result = Object.fromEntries(config.layers.map(layer => {
      const variants = available.get(layer.id);
      const variant = variants.find(item => item.id === requested?.[layer.id])
        || variants.find(item => item.id === selected?.[layer.id]) || pick(variants);
      return [layer.id, variant.id];
    }));
    const images = config.layers.map(layer => {
      const image = element('img', '', 'builder-layer');
      image.alt = '';
      image.draggable = false;
      image.dataset.layer = layer.id;
      image.src = builderAsset(available.get(layer.id).find(variant => variant.id === result[layer.id]), result);
      return image;
    });
    const decoded = await Promise.all(images.map(decodeImage));
    if (token !== revision || !root.isConnected || activeClass().id !== classId) return;
    pendingKey = null;
    if (!decoded.every(Boolean)) { setBusy(false); return; }
    stage.replaceChildren(...images);
    selected = result;
    const description = [];
    config.layers.forEach(layer => {
      const name = config[layer.collection].find(variant => variant.id === result[layer.id]).name;
      controls.get(layer.id).value.textContent = name;
      description.push(`${layer.name}: ${name}`);
    });
    stage.setAttribute('aria-label', `Euer Tierwesen. ${description.join(', ')}`);
    setBusy(false);
    if (!same(activeClass().generatorBuilderResult, result)) updateClass(c => { c.generatorBuilderResult = result; });
  }
  function mix(ids) {
    if (!selected || mainButton.disabled || activeClass().id !== classId) return;
    const result = { ...selected };
    ids.forEach(id => {
      const alternatives = available.get(id).filter(variant => variant.id !== selected[id]);
      if (alternatives.length) result[id] = pick(alternatives).id;
    });
    preparation = present(result);
  }
  function build(content, classroom) {
    cancel();
    classId = classroom.id;
    selected = null;
    controls.clear();
    root = element('section', '', 'generator-view builder-view');
    root.dataset.mode = 'builder';
    const top = element('div', '', 'generator-topline');
    const help = button('Vidi', showHelp, 'generator-help');
    help.setAttribute('aria-label', 'Vidi-Hinweis erneut anzeigen');
    top.append(element('p', config.title), help);
    const layout = element('div', '', 'builder-layout');
    stage = element('div', '', 'builder-stage');
    stage.setAttribute('role', 'img');
    stage.setAttribute('aria-label', 'Euer Tierwesen');
    const panel = element('div', '', 'builder-controls');
    config.categoryOrder.forEach(id => {
      const layer = config.layers.find(item => item.id === id);
      const row = element('section', '', 'builder-control');
      row.dataset.layer = id;
      const value = element('p', '', 'builder-value');
      const reroll = button('', () => mix([id]), 'builder-reroll');
      reroll.setAttribute('aria-label', `${layer.name} neu mischen`);
      row.append(element('h3', layer.name), value, reroll);
      panel.append(row);
      controls.set(id, { value, reroll });
    });
    mainButton = button('Tierwesen erzeugen', () => mix(config.categoryOrder), 'builder-start');
    panel.append(mainButton);
    layout.append(stage, panel);
    root.append(top, layout);
    content.replaceChildren(root);
  }
  function render(content, classroom) {
    if (!root || !content.contains(root) || classId !== classroom.id) build(content, classroom);
    if (selected && same(selected, classroom.generatorBuilderResult)) return Promise.resolve();
    const key = JSON.stringify(classroom.generatorBuilderResult);
    if (pendingKey === key) return preparation;
    pendingKey = key;
    preparation = present(classroom.generatorBuilderResult);
    return preparation;
  }
  return { render, cancel };
}
