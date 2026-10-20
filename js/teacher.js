import { roomPhases, animals, animalStatuses, regions, regionStatuses, features } from './data.js';
import { getState, activeClass, updateClass, selectClass, addClass, renameClass, deleteClass, resetClass, importState, exportState, validateState } from './state.js';

export function initTeacher(notify, replayIntro) {
  const dialog = document.querySelector('#teacher-dialog');
  const content = document.querySelector('#teacher-content');
  const element = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  function render() {
    content.replaceChildren();
    const classroom = activeClass();
    function section(title) {
      const node = element('section', '', 'teacher-section');
      node.append(element('h3', title));
      content.append(node);
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
    const room = section('Raum');
    selectRow(room, 'Raumphase', roomPhases.map(p => [p.id, `${p.id} · ${p.name}`]), classroom.phase, value => updateClass(c => { c.phase = Number(value); }));
    button(room, 'Intro erneut anzeigen', () => { dialog.close(); replayIntro(); });
    const bestiary = section('Bestiarium');
    animals.forEach(a => selectRow(bestiary, a.name, Object.entries(animalStatuses), classroom.animals[a.id], value => updateClass(c => { c.animals[a.id] = value; })));
    const world = section('Welt');
    regions.forEach(r => selectRow(world, r.name, Object.entries(regionStatuses), classroom.regions[r.id], value => updateClass(c => { c.regions[r.id] = value; })));
    const featureSection = section('Funktionen');
    features.forEach(feature => {
      const label = element('label', '', 'check-field');
      const input = element('input');
      input.type = 'checkbox';
      input.checked = classroom.features[feature.id];
      input.addEventListener('change', () => updateClass(c => { c.features[feature.id] = input.checked; }));
      label.append(input, element('span', `${feature.name} freigeschaltet`));
      featureSection.append(label);
    });
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
  });
}
