import { element, button } from './ui.js';

export const researchPrompts = [
  'Achtet zuerst nur auf den Körperbau.',
  'Welche Farben und Muster erkennt ihr?',
  'Beschreibt das Tier vom Kopf zum Schwanz.',
  'Welche treffenden Adjektive passen?',
  'Welche Informationen könnt ihr nur sehen – welche nicht?'
];
export const codexSections = [
  { id: 'structure', title: 'Aufbau', items: [
    'Wählt eine treffende Überschrift.',
    'Nennt Tierart / Tiername und eine Besonderheit in der Einleitung.',
    'Gebt Größe und Gewicht an.',
    'Beschreibt das Aussehen genau: Farben, Formen und Körperteile.',
    'Geht in einer sinnvollen Reihenfolge vor, z. B. vom Kopf zum Schwanz.',
    'Zum Schluss passen Verhalten, Lebenserwartung, Lebensraum oder Nahrung.'
  ] },
  { id: 'language', title: 'Sprache', items: [
    'Verwendet treffende und ausdrucksstarke Adjektive.',
    'Nutzt genaue Begriffe und passende Vergleiche.',
    'Schreibt sachlich, ohne persönliche Wertung.',
    'Verwendet das Präsens.',
    'Beschreibt so genau, dass andere sich das Tier vorstellen können.'
  ] },
  { id: 'fantasy', title: 'Fantasietiere', items: [
    'Euer Fantasietier folgt einer nachvollziehbaren Logik.',
    'Gebt ihm nicht zu viele Fähigkeiten oder Merkmale.',
    'Größe und Gewicht bleiben plausibel.',
    'Orientiert euch an Bekanntem.',
    'Kombiniert Tierarten, Pflanzen oder Gegenstände sinnvoll.'
  ] },
  { id: 'revision', title: 'Überarbeiten', items: [
    'Ist die Reihenfolge sinnvoll?',
    'Ist das Tier genau vorstellbar?',
    'Sind die Begriffe treffend?',
    'Gibt es unnötige Wiederholungen?',
    'Wird sachlich und im Präsens geschrieben?',
    'Sind wichtige Merkmale vollständig beschrieben?'
  ] }
];
export const descriptionCriteria = [
  'Tierart / Besonderheit', 'Größe / Gewicht', 'Körperbau', 'Kopf',
  'weitere Merkmale', 'Verhalten / Lebensraum', 'treffende Adjektive',
  'Präsens', 'sachlich', 'sinnvolle Reihenfolge', 'Tier gut vorstellbar'
];
const checkedByClass = new Map();

export function renderCodex(content, spread, classroom, sectionId, navigate) {
  const open = id => navigate('bestiary', 'codex', id);
  const nav = element('nav', '', 'codex-navigation');
  nav.setAttribute('aria-label', 'Forschercodex');
  const section = codexSections.find(item => item.id === sectionId) || codexSections[0];
  const checking = sectionId === 'check';
  codexSections.forEach(item => {
    const choice = button(item.title, () => open(item.id));
    choice.setAttribute('aria-pressed', String(!checking && section.id === item.id));
    nav.append(choice);
  });
  const check = button('Tierbeschreibung prüfen', () => open('check'));
  check.setAttribute('aria-pressed', String(checking));
  nav.append(check);
  content.append(nav);
  if (checking) {
    const panel = element('section', '', 'description-review');
    panel.append(element('h3', 'Tierbeschreibung prüfen'), element('p', 'Lest euren Beispieltext auf Papier oder am Smartboard. Markiert gemeinsam, welche Kriterien er erfüllt.'));
    if (!checkedByClass.has(classroom.id)) checkedByClass.set(classroom.id, new Set());
    const checked = checkedByClass.get(classroom.id);
    const list = element('div', '', 'description-criteria');
    descriptionCriteria.forEach((criterion, index) => {
      const control = button('', () => {
        if (checked.has(index)) checked.delete(index); else checked.add(index);
        control.setAttribute('aria-pressed', String(checked.has(index)));
      });
      control.setAttribute('aria-pressed', String(checked.has(index)));
      const mark = element('span', '', 'criterion-mark');
      mark.setAttribute('aria-hidden', 'true');
      control.append(mark, element('span', criterion));
      list.append(control);
    });
    panel.append(list);
    content.append(panel);
    return;
  }
  const split = Math.ceil(section.items.length / 2);
  [section.items.slice(0, split), section.items.slice(split)].forEach((items, index) => {
    const column = element('section', '', `codex-reference codex-reference-${index}`);
    column.append(element('h3', index ? 'Darauf achten wir' : section.title));
    const list = element('ul');
    items.forEach(text => list.append(element('li', text)));
    column.append(list);
    spread.append(column);
  });
}

export function addResearchTask(toolbar, scene, expedition) {
  const prompts = expedition.researchPrompts || researchPrompts;
  let index = 0;
  const panel = element('aside', '', 'research-task');
  panel.hidden = true;
  panel.setAttribute('aria-label', 'Forscherauftrag');
  const title = element('h3', 'Forscherauftrag');
  const prompt = element('p', '', 'research-prompt');
  prompt.setAttribute('aria-live', 'polite');
  const controls = element('div', '', 'research-actions');
  function show() {
    prompt.textContent = prompts[index];
    previous.disabled = index === 0;
    next.disabled = index === prompts.length - 1;
  }
  const previous = button('Zurück', () => { if (index > 0) index--; show(); });
  const next = button('Weiter', () => { if (index < prompts.length - 1) index++; show(); });
  const close = button('Schließen', () => {
    panel.hidden = true;
    launch.setAttribute('aria-expanded', 'false');
    focus('both');
    launch.focus();
  });
  controls.append(previous, next, close);
  const focusControls = element('div', '', 'research-focus');
  focusControls.setAttribute('role', 'group');
  focusControls.setAttribute('aria-label', 'Tierfokus');
  function focus(id) {
    scene.querySelectorAll('.expedition-creature').forEach(node => node.classList.toggle('is-muted', id !== 'both' && node.dataset.creature !== id));
    [...focusControls.children].forEach(node => node.setAttribute('aria-pressed', String(node.dataset.creature === id)));
  }
  [{ id: 'both', name: 'Beide Tiere' }, ...expedition.creatures].forEach(creature => {
    const choice = button(creature.name, () => focus(creature.id));
    choice.dataset.creature = creature.id;
    focusControls.append(choice);
  });
  panel.append(title, prompt, controls, focusControls);
  const launch = button('Forscherauftrag', () => {
    panel.hidden = !panel.hidden;
    launch.setAttribute('aria-expanded', String(!panel.hidden));
    if (panel.hidden) focus('both');
  }, 'research-launch');
  launch.setAttribute('aria-expanded', 'false');
  toolbar.append(launch);
  scene.append(panel);
  show();
  focus('both');
}
