import { roomPhases, animals, regions, expeditions, features } from './data.js';
import { bookUnlocked, setBookUnlocked, setClassUnlock, setMilestone, getState, activeClass, updateClass, selectClass, addClass, renameClass, deleteClass, resetClass, importState, exportState, validateState, getStorageWarning } from './state.js';

import { milestones, federhainClues, storyStage } from './progress.js';

export function initTeacher(notify, replayIntro, replayStory) {
  const dialog = document.querySelector('#teacher-dialog');
  const content = document.querySelector('#teacher-content');
  const element = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  function render() {
    const manualOpen = content.querySelector('.manual-controls')?.open || false;
    content.replaceChildren();
    const classroom = activeClass();
    function section(title, parent = content) {
      const node = element('section', '', 'teacher-section');
      node.append(element('h3', title));
      parent.append(node);
      return node;
    }
    function selectRow(section, label, options, selected, onChange) {
      const row = element('label', '', 'field');
      row.append(element('span', label));
      const input = element('select');
      for (const [value, name] of options) {
        const option = element('option', name);
        option.value = value;
        option.selected = String(selected) === String(value);
        input.append(option);
      }
      input.addEventListener('change', () => onChange(input.value));
      row.append(input);
      section.append(row);
    }
    function button(section, label, callback, danger = false) {
      const node = element('button', label, danger ? 'danger' : '');
      node.type = 'button';
      node.addEventListener('click', () => {
        try { callback(); } catch (error) { notify(error.message); }
      });
      section.append(node);
    }
    const progress = section('Unterrichtsfortschritt');
    progress.classList.add('milestone-section');
    progress.append(element('p', 'Die Lehrkraft erklärt den Unterrichtsschritt für abgeschlossen. Die App schaltet die passenden Seiten und Forschungsgebiete frei.', 'muted'));
    const milestoneList = element('div', '', 'milestone-list');
    milestones.forEach((milestone, index) => {
      const completed = classroom.completedMilestones.includes(milestone.id);
      const row = element('article', '', `milestone-item${completed ? ' completed' : ''}`);
      const summary = element('div');
      summary.append(element('h4', `M${index} · ${milestone.title}`), element('p', milestone.description), element('span', completed ? 'Abgeschlossen' : 'Noch offen', 'milestone-status'));
      button(row, completed ? 'Zurücksetzen' : 'Abschließen', () => { setMilestone(milestone.id, !completed); render(); });
      row.querySelector('button').setAttribute('aria-label', `${completed ? 'Zurücksetzen' : 'Abschließen'}: ${milestone.title}`);
      row.prepend(summary);
      milestoneList.append(row);
    });
    progress.append(milestoneList, element('p', 'Zurücksetzen nimmt die zugehörigen Freigaben zurück. Die Raumphase bleibt erhalten und kann manuell geändert werden.', 'muted small'));
    const story = section('Federhains Spur');
    story.classList.add('story-progress');
    const current = storyStage(classroom);
    story.append(element('p', current ? `Aktueller Storyschritt: ${current.title}` : 'Noch keine Forschungsspur entdeckt.'));
    const clues = element('ol', '', 'story-clues');
    federhainClues.filter(clue => classroom.discoveredFederhainClues.includes(clue.id)).forEach(clue => {
      const item = element('li');
      item.append(element('strong', clue.title), element('p', clue.text));
      clues.append(item);
    });
    const next = federhainClues.find(clue => !classroom.discoveredFederhainClues.includes(clue.id));
    story.append(clues, element('p', next ? `Nächster noch verborgener Hinweis: ${next.title}` : 'Alle vier Hinweise sind entdeckt. Federhains Verbleib bleibt offen.', 'muted'));
    if (current) button(story, 'Storyhinweis erneut zeigen', () => { dialog.close(); replayStory(current.dialogId); });
    const manual = element('details', '', 'manual-controls');
    manual.open = manualOpen;
    manual.append(element('summary', 'Manuelle Steuerung'));
    const manualContent = element('div', '', 'manual-content');
    manual.append(manualContent);
    content.append(manual);
    const room = section('Raum', manualContent);
    selectRow(room, 'Raumphase', roomPhases.map(p => [p.id, `${p.id} · ${p.name}`]), classroom.roomPhase, value => updateClass(c => { c.roomPhase = Number(value); }));
    button(room, 'Intro erneut anzeigen', () => { dialog.close(); replayIntro(); });
    function unlockRow(section, name, checked, change) {
      const label = element('label', '', 'check-field');
      const input = element('input');
      input.type = 'checkbox';
      input.checked = checked;
      input.addEventListener('change', () => change(input.checked));
      label.append(input, element('span', `${name} freigeschaltet`));
      section.append(label);
    }
    const bestiary = section('Bestiarium', manualContent);
    animals.forEach(entry => unlockRow(bestiary, entry.name, bookUnlocked(classroom, entry), value => {
      setBookUnlocked(entry, value);
      if (entry.feature) render();
    }));
    const world = section('Weltkarte', manualContent);
    regions.forEach(region => unlockRow(world, region.name, classroom.unlockedRegions.includes(region.id), value => { setClassUnlock('regions', region.id, value); render(); }));
    const expeditionsSection = section('Expeditionen', manualContent);
    expeditions.forEach(expedition => unlockRow(expeditionsSection, expedition.title, classroom.unlockedExpeditions.includes(expedition.id), value => setClassUnlock('expeditions', expedition.id, value)));
    const featureSection = section('Funktionen', manualContent);
    features.forEach(feature => unlockRow(featureSection, feature.name, classroom.unlockedFeatures.includes(feature.id), value => {
      setClassUnlock('features', feature.id, value);
      if (feature.id === 'classBestiary') render();
    }));
    const classes = section('Klasse');
    selectRow(classes, 'Aktive Klasse', getState().classes.map(c => [c.id, c.name]), classroom.id, value => { selectClass(value); render(); });
    const nameLabel = element('label', '', 'field');
    nameLabel.append(element('span', 'Klassenname'));
    const name = element('input');
    name.type = 'text';
    name.maxLength = 60;
    name.value = classroom.name;
    nameLabel.append(name);
    classes.append(nameLabel);
    const actions = element('div', '', 'actions');
    classes.append(actions);
    button(actions, 'Umbenennen', () => { renameClass(name.value); render(); });
    button(actions, 'Neue Klasse', () => { addClass(name.value); render(); });
    button(actions, 'Klasse löschen', () => {
      if (confirm(`Klasse „${activeClass().name}“ und ihren gesamten Fortschritt löschen?`)) { deleteClass(); render(); }
    }, true);
    classes.append(element('p', 'Zum Anlegen einer Klasse den gewünschten Namen eintragen. Die letzte gelöschte Klasse wird durch eine leere Klasse ersetzt.', 'muted small'));
    const data = section('Daten');
    data.append(element('p', 'JSON sichert alle Klassen einschließlich der aktiven Klasse. Ein Import ersetzt den vollständigen App-Stand.', 'muted'));
    const dataActions = element('div', '', 'actions');
    data.append(dataActions);
    button(dataActions, 'JSON exportieren', () => {
      const url = URL.createObjectURL(new Blob([exportState()], { type: 'application/json' }));
      const link = element('a');
      link.href = url;
      link.download = `bestiarium-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      notify('Sicherung exportiert.');
    });
    const file = element('input');
    file.type = 'file';
    file.accept = '.json,application/json';
    file.hidden = true;
    file.addEventListener('change', async () => {
      const selected = file.files[0];
      if (!selected) return;
      try {
        if (selected.size > 2 * 1024 * 1024) throw new Error('Die Sicherung ist zu groß (maximal 2 MB).');
        const text = await selected.text();
        const checked = validateState(JSON.parse(text));
        if (confirm(`Alle vorhandenen Klassen durch ${checked.classes.length} Klasse(n) aus dieser Sicherung ersetzen?`)) {
          importState(text); render(); notify('Sicherung importiert.');
        }
      } catch (error) { notify(`Import fehlgeschlagen: ${error.message}`); }
      finally { file.value = ''; }
    });
    data.append(file);
    button(dataActions, 'JSON importieren', () => file.click());
    button(dataActions, 'Klassenstand zurücksetzen', () => {
      if (confirm(`Fortschritt von „${activeClass().name}“ auf den Anfang zurücksetzen? Die übrigen Klassen bleiben erhalten.`)) {
        resetClass(); render(); notify('Klassenstand zurückgesetzt.');
      }
    }, true);
  }
  const title = document.querySelector('#app-title');
  title.addEventListener('click', () => {
    render();
    if (!dialog.open) dialog.showModal();
    if (getStorageWarning()) notify(getStorageWarning());
  });
}
