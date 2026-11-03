import { element, button } from './ui.js';
import { creatureSpread, collectionTitle } from './collection.js';
import { readCollection, writeCollection, optimizePicture, parseCollectionFile, mergeCollection, collectionFile, MAX_FILE } from './collection-store.js';

export async function renderCollectionTeacher(parent, classId) {
  const section = element('section', '', 'teacher-section collection-manager');
  parent.append(section);
  const status = element('p', '', 'collection-status'); status.setAttribute('role', 'status');
  const body = element('div');
  section.append(element('h3', collectionTitle), element('p', 'Diese Sammlung ist in diesem Browser gespeichert. Mit Export und Import kannst du sie auf das Smartboard übertragen.', 'muted'), element('p', 'Die Sammlung gehört zur aktiven Klasse. Der Fortschritts-Reset verändert sie nicht. Browserdaten löschen entfernt auch diese Sammlung; regelmäßig exportieren. Ein Upload veröffentlicht keine Dateien auf GitHub.', 'muted'), status, body);
  let entries, busy = false;
  const report = error => { status.textContent = error.message || error; };
  async function action(callback) {
    if (busy) return;
    busy = true; body.inert = true; status.textContent = 'Bitte warten …';
    try { await callback(); } catch (e) { report(e); }
    finally { busy = false; body.inert = false; }
  }
  async function save(next, message) {
    await writeCollection(classId, next); entries = next; render(); report(message);
  }
  function render() {
    body.replaceChildren();
    const actions = element('div', '', 'actions');
    actions.append(button('Eintrag anlegen', () => edit()), button('Sammlung exportieren', () => action(async () => {
      const json = collectionFile(entries);
      const blob = new Blob([json], { type: 'application/json' });
      if (blob.size > MAX_FILE) throw new Error('Die Sammlung ist für den Dateitransfer zu groß (150 MB). Bitte Bilder verkleinern.');
      const url = URL.createObjectURL(blob), link = element('a');
      link.href = url; link.download = `unentdeckte-wesen-${new Date().toISOString().slice(0, 10)}.json`; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000); report('Sammlung einschließlich beider Fassungen und aller Bilder exportiert.');
    })));
    const file = element('input'); file.type = 'file'; file.accept = '.json,application/json'; file.hidden = true;
    actions.append(button('Sammlung importieren', () => file.click()), file);
    file.addEventListener('change', () => action(async () => {
      const selected = file.files[0]; if (!selected) return;
      try {
        const incoming = await parseCollectionFile(selected);
        const choice = element('div', '', 'collection-import');
        choice.append(element('p', `${incoming.length} Einträge geprüft. Wie sollen sie in diese Klasse übernommen werden? Ergänzen behält alle vorhandenen Einträge und fügt Kopien hinzu.`));
        choice.append(button('Ergänzen', () => action(() => save(mergeCollection(entries, incoming, 'append'), 'Sammlung ergänzt.'))), button('Ersetzen', () => {
          if (confirm(`Alle ${entries.length} Einträge dieser Klasse durch ${incoming.length} importierte Einträge ersetzen?`)) action(() => save(mergeCollection(entries, incoming, 'replace'), 'Sammlung ersetzt.'));
        }, 'danger'), button('Abbrechen', () => { choice.remove(); report('Import abgebrochen.'); }));
        body.querySelector('.collection-import')?.remove(); actions.after(choice); report('Datei geprüft. Bitte Ergänzen oder Ersetzen auswählen.');
      } finally { file.value = ''; }
    }));
    body.append(actions);
    const list = element('ol', '', 'collection-list');
    entries.forEach((entry, index) => {
      const row = element('li'); row.append(element('strong', entry.name), element('span', entry.visible ? 'Sichtbar' : 'Ausgeblendet'));
      const controls = element('div', '', 'actions');
      controls.append(button('Bearbeiten', () => edit(entry)), button(entry.visible ? 'Ausblenden' : 'Einblenden', () => action(() => save(entries.map(e => e.id === entry.id ? { ...e, visible: !e.visible } : e), 'Sichtbarkeit gespeichert.'))));
      [-1, 1].forEach(direction => {
        const move = button(direction < 0 ? '↑ Nach oben' : '↓ Nach unten', () => action(async () => {
          const next = [...entries]; [next[index], next[index + direction]] = [next[index + direction], next[index]]; await save(next, 'Reihenfolge gespeichert.');
        })); move.disabled = !entries[index + direction]; controls.append(move);
      });
      controls.append(button('Löschen', () => { if (confirm(`„${entry.name}“ einschließlich beider Fassungen endgültig löschen?`)) action(() => save(entries.filter(e => e.id !== entry.id), 'Eintrag gelöscht.')); }, 'danger'));
      row.append(controls); list.append(row);
    });
    body.append(list);
    if (!entries.length) body.append(element('p', 'Noch keine Einträge in dieser Klasse.'));
    if (entries.length) body.append(button('Sammlung dieser Klasse löschen', () => { if (confirm('Alle Schülerwerke dieser Klasse einschließlich Bildern endgültig löschen? Der Unterrichtsfortschritt bleibt erhalten.')) action(() => save([], 'Sammlung gelöscht.')); }, 'danger'));
  }
  function edit(original) {
    body.querySelector('.creature-editor')?.remove();
    const draft = structuredClone(original || { id: crypto.randomUUID(), name: '', researcher: '', visible: true, first: { description: '', image: null, note: '', phase: '' }, revised: null });
    let version = 'first', imageTask = 0;
    const form = element('form', '', 'creature-editor');
    const fields = element('div'), preview = element('div', '', 'collection-preview');
    const previewButton = button('Vorschau anzeigen', () => {
      if (!form.reportValidity()) return;
      preview.replaceChildren(element('h4', 'Vorschau – noch nicht gespeichert'), creatureSpread(draft, version));
      saveButton.disabled = false;
    });
    const saveButton = button('Eintrag speichern', () => action(async () => {
      if (!form.reportValidity() || saveButton.disabled) return;
      await save(original ? entries.map(e => e.id === draft.id ? draft : e) : [...entries, draft], 'Eintrag gespeichert.');
    })); saveButton.disabled = true;
    function invalidate() { saveButton.disabled = true; preview.replaceChildren(); }
    function field(label, key, target, multiline = false, max = 120, required = false) {
      const wrap = element('label', '', 'field'); wrap.append(element('span', label));
      const input = element(multiline ? 'textarea' : 'input'); if (!multiline) input.type = 'text';
      input.value = target[key]; input.maxLength = max; input.required = required;
      if (multiline) { input.rows = 10; input.spellcheck = false; }
      input.addEventListener('input', () => { target[key] = input.value; invalidate(); }); wrap.append(input); fields.append(wrap);
    }
    function renderFields() {
      fields.replaceChildren();
      field('Name des Wesens', 'name', draft, false, 120, true);
      field('Forschername oder Kürzel (optional)', 'researcher', draft, false, 100);
      const modes = element('div', '', 'actions');
      modes.append(element('strong', version === 'first' ? 'Erste Idee bearbeiten' : 'Überarbeitete Fassung bearbeiten'));
      modes.append(button(version === 'first' ? (draft.revised ? 'Überarbeitung bearbeiten' : 'Überarbeitung hinzufügen') : 'Erste Idee bearbeiten', () => {
        imageTask++;
        if (!draft.revised) draft.revised = { ...draft.first, phase: 'Überarbeitet' };
        version = version === 'first' ? 'revised' : 'first'; invalidate(); renderFields();
      })); fields.append(modes);
      const data = draft[version];
      field('Beschreibung (Absätze bleiben erhalten)', 'description', data, true, 50000, true);
      field('Forschungsnotiz (optional)', 'note', data, true, 2000);
      field('Phase (optional)', 'phase', data, false, 80);
      const label = element('label', '', 'field'); label.append(element('span', 'Bild (optional): PNG, JPG, WebP; maximal 25 MB'));
      const file = element('input'); file.type = 'file'; file.accept = 'image/png,image/jpeg,image/webp'; label.append(file); fields.append(label);
      file.addEventListener('change', () => {
        const selected = file.files[0]; if (!selected) return;
        const task = ++imageTask; invalidate(); previewButton.disabled = true;
        action(async () => {
          try { const image = await optimizePicture(selected); if (task === imageTask && form.isConnected) { data.image = image; report('Bild vorbereitet. Bitte Vorschau prüfen.'); } }
          finally { previewButton.disabled = false; file.value = ''; }
        });
      });
      fields.append(element('p', data.image ? 'Ein Bild ist vorhanden. Es bleibt erhalten, bis es ersetzt oder entfernt wird.' : 'Ohne Bild erscheint ein Platzhalter.', 'muted'));
      if (data.image) fields.append(button('Bild dieser Fassung entfernen', () => { data.image = null; invalidate(); renderFields(); }));
    }
    form.addEventListener('submit', e => e.preventDefault());
    form.append(element('h4', original ? 'Eintrag bearbeiten' : 'Neuer Eintrag'), element('p', 'Schülertexte werden unverändert gespeichert. Die erste Idee und die Überarbeitung bleiben getrennt erhalten.'), fields, previewButton, preview, saveButton, button('Abbrechen', () => { imageTask++; form.remove(); }));
    renderFields(); body.prepend(form); form.querySelector('input').focus();
  }
  try { entries = await readCollection(classId); if (section.isConnected) render(); }
  catch (e) { report(e); body.append(button('Erneut versuchen', () => { section.remove(); renderCollectionTeacher(parent, classId); })); }
}
