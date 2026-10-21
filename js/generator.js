import { generatorConfig } from './data.js';
import { activeClass, updateClass } from './state.js';
import { element, button, asset } from './ui.js';

export const rollCategory = () => Math.floor(Math.random() * 12) + 1;
export const generatorValue = (category, roll) => category.values[roll - 1];

export function createGenerator(showHelp) {
  let root;
  let classId;
  let interval;
  let mixing = false;
  let displays = new Map();
  let mainButton;
  let resetButton;
  let note;
  let status;
  function cancel() {
    clearInterval(interval);
    interval = null;
    mixing = false;
    root?.setAttribute('aria-busy', 'false');
    displays.forEach(({ card }) => card.classList.remove('is-mixing'));
  }
  function refresh(classroom) {
    const result = classroom.generatorResult;
    root.setAttribute('aria-busy', String(mixing));
    mainButton.disabled = mixing;
    resetButton.disabled = mixing || !result;
    displays.forEach(({ value, reroll }, id) => {
      reroll.hidden = !result;
      reroll.disabled = mixing;
      if (!mixing) value.textContent = result ? generatorValue(generatorConfig.categories.find(c => c.id === id), result[id]) : 'Noch offen';
      value.classList.toggle('is-long', value.textContent.length > 16);
    });
    if (mixing) return;
    status.textContent = result ? 'Euer Ergebnis ist bereit. Zeichnet und beschreibt euer Tierwesen auf Papier.' : 'Startet den Apparat und sammelt Ideen für euer eigenes Tierwesen.';
    note.replaceChildren(element('h3', 'Unser Tierwesen'));
    if (!result) {
      note.append(element('p', 'Hier erscheinen gleich eure acht Eigenschaften. Daraus entwickelt ihr selbst euer Tierwesen.'));
      return;
    }
    const summary = element('dl', '', 'generator-summary');
    generatorConfig.categories.forEach(category => {
      const item = element('div');
      item.append(element('dt', category.name), element('dd', generatorValue(category, result[category.id])));
      summary.append(item);
    });
    note.append(summary);
  }
  function run(ids) {
    const classroom = activeClass();
    if (mixing || !classroom.unlockedFeatures.includes('generator') || (ids.length < generatorConfig.categories.length && !classroom.generatorResult)) return;
    const result = { ...classroom.generatorResult };
    ids.forEach(id => { result[id] = rollCategory(); displays.get(id).card.classList.add('is-mixing'); });
    mixing = true;
    refresh(classroom);
    status.textContent = 'Der Apparat mischt die Eigenschaften …';
    const finish = () => {
      cancel();
      if (activeClass().id === classId && root.isConnected && root.closest('dialog')?.open) {
        updateClass(c => { c.generatorResult = result; });
      }
    };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
    const started = performance.now();
    interval = setInterval(() => {
      if (activeClass().id !== classId || !root.isConnected || !root.closest('dialog')?.open) { cancel(); return; }
      const elapsed = performance.now() - started;
      ids.forEach((id, index) => {
        const category = generatorConfig.categories.find(c => c.id === id);
        const stopped = elapsed >= 800 + index * 90;
        const display = displays.get(id);
        display.value.textContent = generatorValue(category, stopped ? result[id] : rollCategory());
        display.value.classList.toggle('is-long', display.value.textContent.length > 16);
        display.card.classList.toggle('is-mixing', !stopped);
      });
      if (elapsed >= 800 + (ids.length - 1) * 90) finish();
    }, 80);
  }
  function build(content, classroom) {
    cancel();
    classId = classroom.id;
    displays = new Map();
    root = element('section', '', 'generator-view');
    root.dataset.mode = generatorConfig.mode;
    const mode = generatorConfig.modes.find(mode => mode.id === generatorConfig.mode);
    const top = element('div', '', 'generator-topline');
    const help = button('Vidi', showHelp, 'generator-help');
    help.setAttribute('aria-label', 'Vidi-Hinweis erneut anzeigen');
    top.append(element('p', mode.title), help);
    const machine = element('div', '', 'generator-machine');
    if (generatorConfig.frameAsset) asset(machine, generatorConfig.frameAsset, 'Federhains Forschungsapparat', 'generator-art');
    const grid = element('div', '', 'generator-displays');
    generatorConfig.categories.forEach(category => {
      const card = element('section', '', 'generator-display');
      card.dataset.category = category.id;
      const label = element('h3', category.name);
      const value = element('p', '', 'generator-value');
      const reroll = button('neu', () => run([category.id]), 'generator-reroll');
      reroll.setAttribute('aria-label', `${category.name} neu mischen`);
      card.append(label, value, reroll);
      displays.set(category.id, { card, value, reroll });
      grid.append(card);
    });
    machine.append(grid);
    const actions = element('div', '', 'generator-actions');
    mainButton = button('Tierwesen erzeugen', () => run(generatorConfig.categories.map(c => c.id)), 'generator-start');
    resetButton = button('Neu beginnen', () => { cancel(); updateClass(c => { c.generatorResult = null; }); }, 'generator-reset');
    actions.append(mainButton);
    top.append(resetButton);
    status = element('p', '', 'generator-status');
    status.setAttribute('role', 'status');
    note = element('section', '', 'generator-note');
    note.setAttribute('aria-live', 'polite');
    machine.append(actions, status, note);
    root.append(top, machine);
    content.replaceChildren(root);
  }
  function render(content, classroom) {
    if (!classroom.unlockedFeatures.includes('generator')) {
      cancel();
      content.replaceChildren();
      return;
    }
    if (!root || !content.contains(root) || classId !== classroom.id) build(content, classroom);
    refresh(classroom);
  }
  return { render, cancel };
}
