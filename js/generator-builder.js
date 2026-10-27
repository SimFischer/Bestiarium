import { generatorBuilderConfig as config, builderAssets, builderAsset, variantAssets, extraParts, extraOf } from './data.js';
import { activeClass, updateClass } from './state.js';
import { element, button } from './ui.js';
import { preloadImages, decodeImage } from './images.js';

const same = (a, b) => config.layers.every(layer => a?.[layer.id] === b?.[layer.id]);
const pick = list => list[Math.floor(Math.random() * list.length)];
const variantName = (id, value) => config[config.layers.find(layer => layer.id === id).collection].find(variant => variant.id === value).name;
const extraName = result => [['backExtra', result.backExtra], ['headExtra', result.headExtra]]
  .filter(([, value]) => value !== 'none').map(([id, value]) => variantName(id, value)).join(' + ') || 'keines';
const categoryName = id => id === 'extra' ? 'Extra' : config.layers.find(layer => layer.id === id).name;

export function createGeneratorBuilder(showHelp) {
  let root, stage, classId, selected, mainButton, pendingKey, preparation, randomPanel, manualPanel, requestedResult;
  let mode = 'random';
  let revision = 0;
  let available = new Map();
  const controls = new Map();
  const choices = new Map();
  const modeButtons = new Map();
  function cancel() { revision++; pendingKey = null; }
  function setBusy(busy) {
    mainButton.disabled = busy;
    controls.forEach(control => { control.reroll.disabled = busy; });
    root.setAttribute('aria-busy', String(busy));
  }
  const extraAvailable = id => {
    const parts = extraParts(id);
    return Object.entries(parts).every(([layer, value]) => available.get(layer).some(variant => variant.id === value));
  };
  function randomResult() {
    const result = Object.fromEntries(config.layers.map(layer => [layer.id, pick(available.get(layer.id)).id]));
    return { ...result, ...extraParts(pick(config.extras.filter(extra => extraAvailable(extra.id))).id) };
  }
  function show(result) {
    controls.forEach(({ value }, id) => { value.textContent = id === 'extra' ? extraName(result) : variantName(id, result[id]); });
    choices.forEach((options, id) => options.forEach((choice, value) => choice.setAttribute('aria-pressed', String(result[id] === value))));
    const description = config.manualOrder.filter(id => result[id] !== 'none').map(id => `${categoryName(id)}: ${variantName(id, result[id])}`);
    stage.setAttribute('aria-label', `Euer Tierwesen. ${description.join(', ')}`);
  }
  async function present(requested, materialize = false) {
    const token = ++revision;
    requestedResult = requested;
    setBusy(true);
    const loaded = await preloadImages(builderAssets);
    if (token !== revision) return;
    available = new Map(config.layers.map(layer => [layer.id,
      config[layer.collection].filter(variant => variantAssets(variant).every(src => loaded[builderAssets.indexOf(src)]))]));
    if (config.layers.some(layer => !available.get(layer.id).length) || !config.extras.some(extra => extraAvailable(extra.id))) {
      console.warn('Tierbaukasten: Eine Kategorie konnte nicht vorbereitet werden.');
      setBusy(false);
      pendingKey = null;
      return;
    }
    const wanted = requested || selected || randomResult();
    const result = Object.fromEntries(config.layers.map(layer => {
      const variants = available.get(layer.id);
      const variant = variants.find(item => item.id === wanted[layer.id])
        || variants.find(item => item.id === selected?.[layer.id]) || pick(variants);
      return [layer.id, variant.id];
    }));
    const images = config.layers.flatMap(layer => {
      const src = builderAsset(available.get(layer.id).find(variant => variant.id === result[layer.id]), result);
      if (!src) return [];
      const image = element('img', '', 'builder-layer');
      image.alt = '';
      image.draggable = false;
      image.dataset.layer = layer.id;
      const adjustment = layer.id === 'tail' && config.tailAdjustments[result.tail];
      if (adjustment) image.style.translate = `${adjustment.x}% 0`;
      const fit = layer.id === 'headExtra' && config.headExtraAdjustments[result.head];
      if (fit) Object.assign(image.style, { transformOrigin: fit.origin, transform: `translate(${fit.x}%, ${fit.y}%) rotate(${fit.rotate}deg) scale(${fit.scale})` });
      image.src = src;
      return [image];
    });
    const decoded = await Promise.all(images.map(decodeImage));
    if (token !== revision || !root.isConnected || activeClass().id !== classId) return;
    pendingKey = null;
    if (!decoded.every(Boolean)) { setBusy(false); return; }
    // Kopf und Kopf-Extra liegen zuoberst und werden gemeinsam versetzt, damit Geweih / Horn dem Kopf folgt.
    const head = element('div', '', 'builder-head');
    const seat = config.headAdjustments[result.head];
    if (seat) Object.assign(head.style, { translate: `${seat.x}% ${seat.y}%`, scale: String(seat.scale) });
    const isHead = image => image.dataset.layer === 'head' || image.dataset.layer === 'headExtra';
    head.append(...images.filter(isHead));
    stage.replaceChildren(...images.filter(image => !isHead(image)), head);
    if (materialize && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      [...stage.children].forEach(layer => layer.animate([{ opacity: .45 }, { opacity: 1 }], { duration: 230, easing: 'ease-out' }));
    }
    selected = result;
    show(result);
    setBusy(false);
    if (!same(activeClass().generatorBuilderResult, result)) updateClass(c => { c.generatorBuilderResult = result; });
  }
  function mix(ids) {
    if (!selected || mainButton.disabled || activeClass().id !== classId) return;
    const result = { ...selected };
    ids.forEach(id => {
      if (id === 'extra') {
        const alternatives = config.extras.filter(extra => extra.id !== extraOf(selected) && extraAvailable(extra.id));
        if (alternatives.length) Object.assign(result, extraParts(pick(alternatives).id));
        return;
      }
      const alternatives = available.get(id).filter(variant => variant.id !== selected[id]);
      if (alternatives.length) result[id] = pick(alternatives).id;
    });
    preparation = present(result, ids.length === config.categoryOrder.length);
  }
  function choose(id, value) {
    // Bei schnellen Klicks auf der noch ladenden Auswahl aufbauen, damit keine Änderung verloren geht.
    const base = root.getAttribute('aria-busy') === 'true' && requestedResult || selected;
    if (!base || base[id] === value || activeClass().id !== classId) return;
    preparation = present({ ...base, [id]: value });
  }
  function setMode(next) {
    mode = next;
    root.dataset.builderMode = mode;
    randomPanel.hidden = mode !== 'random';
    manualPanel.hidden = mode !== 'manual';
    modeButtons.forEach((choice, id) => choice.setAttribute('aria-pressed', String(id === mode)));
  }
  function build(content, classroom) {
    cancel();
    classId = classroom.id;
    selected = null;
    controls.clear();
    choices.clear();
    modeButtons.clear();
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
    const modes = element('div', '', 'builder-modes');
    modes.setAttribute('role', 'group');
    modes.setAttribute('aria-label', 'Bedienmodus');
    config.modes.forEach(([id, label]) => {
      const choice = button(label, () => setMode(id));
      modeButtons.set(id, choice);
      modes.append(choice);
    });
    randomPanel = element('div', '', 'builder-random');
    config.categoryOrder.forEach(id => {
      const row = element('section', '', 'builder-control');
      row.dataset.layer = id;
      const value = element('p', '', 'builder-value');
      const reroll = button('', () => mix([id]), 'builder-reroll');
      reroll.setAttribute('aria-label', `${categoryName(id)} neu mischen`);
      row.append(element('h3', categoryName(id)), value, reroll);
      randomPanel.append(row);
      controls.set(id, { value, reroll });
    });
    mainButton = button('Tierwesen erzeugen', () => mix(config.categoryOrder), 'builder-start');
    randomPanel.append(mainButton);
    manualPanel = element('div', '', 'builder-manual');
    config.manualOrder.forEach(id => {
      const group = element('section', '', 'builder-choice');
      group.dataset.layer = id;
      const options = element('div', '', 'builder-options');
      options.setAttribute('role', 'group');
      options.setAttribute('aria-label', categoryName(id));
      const map = new Map();
      config[config.layers.find(layer => layer.id === id).collection].forEach(variant => {
        const choice = button(variant.name, () => choose(id, variant.id));
        choice.setAttribute('aria-pressed', 'false');
        map.set(variant.id, choice);
        options.append(choice);
      });
      choices.set(id, map);
      group.append(element('h3', categoryName(id)), options);
      manualPanel.append(group);
    });
    panel.append(modes, randomPanel, manualPanel);
    setMode(mode);
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
