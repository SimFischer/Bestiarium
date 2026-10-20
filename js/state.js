import { animals, regions, expeditions, features, roomPhases } from './data.js';
const STORAGE_KEY = 'bestiarium.classroom.v2';
const listeners = new Set();
let storageWarning = '';
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const id = () => crypto.randomUUID();
const validName = name => typeof name === 'string' && name.trim().length > 0 && name.trim().length <= 60;
const bookDefinitions = animals.filter(a => !a.feature);
const unlockMap = definitions => Object.fromEntries(definitions.map(item => [item.id, { unlocked: item.unlocked ?? false }]));

export function newClass(name = 'Klasse 5') {
  return {
    id: id(), name: name.trim(), phase: 0, introCompleted: false,
    animals: unlockMap(bookDefinitions), expeditions: unlockMap(expeditions),
    regions: Object.fromEntries(regions.map(r => [r.id, { unlocked: r.unlocked, messageSeen: false }])),
    features: Object.fromEntries(features.map(f => [f.id, false])), classEntries: []
  };
}
function initialState() {
  const classroom = newClass();
  return { version: 2, activeClassId: classroom.id, classes: [classroom] };
}
export function validateState(value) {
  if (!object(value) || value.version !== 2 || !Array.isArray(value.classes) || !value.classes.length || value.classes.length > 1000) throw new Error('Ungültige Bestiarium-Sicherungsdatei.');
  const ids = new Set();
  const classes = value.classes.map(c => {
    if (!object(c) || typeof c.id !== 'string' || !c.id || c.id.length > 100 || ids.has(c.id) || !validName(c.name) || !Number.isInteger(c.phase) || !roomPhases[c.phase] || typeof c.introCompleted !== 'boolean') throw new Error('Ungültige Klassendaten.');
    ids.add(c.id);
    const readMap = (source, definitions, read) => {
      if (!object(source)) throw new Error('Unvollständiger Klassenstand.');
      return Object.fromEntries(definitions.map(item => [item.id, read(source[item.id])]));
    };
    const boolean = v => { if (typeof v !== 'boolean') throw new Error('Ungültiger Freischaltstatus.'); return v; };
    const unlocked = v => { if (!object(v)) throw new Error('Ungültiger Freischaltstatus.'); return { unlocked: boolean(v.unlocked) }; };
    const imagePath = path => {
      if (typeof path !== 'string' || path.length > 1500000 || (path && !/^(assets\/[\w./-]+|https:\/\/[^\s]+|data:image\/(png|jpeg|webp);base64,[a-zA-Z0-9+/=]+)$/.test(path))) throw new Error('Ungültiger Bildpfad im Klasseneintrag.');
      return path;
    };
    if (!Array.isArray(c.classEntries) || c.classEntries.length > 200) throw new Error('Ungültige Klasseneinträge.');
    const entryIds = new Set();
    const classEntries = c.classEntries.map(entry => {
      if (!object(entry) || typeof entry.id !== 'string' || !entry.id || entry.id.length > 100 || entryIds.has(entry.id) || !validName(entry.name) || typeof entry.description !== 'string' || entry.description.length > 8000 || !Array.isArray(entry.detailImages) || entry.detailImages.length > 8 || typeof entry.createdAt !== 'string' || !Number.isFinite(Date.parse(entry.createdAt))) throw new Error('Ungültiger Klasseneintrag.');
      entryIds.add(entry.id);
      return { id: entry.id, name: entry.name.trim(), description: entry.description, mainImage: imagePath(entry.mainImage), detailImages: entry.detailImages.map(imagePath), createdAt: entry.createdAt };
    });
    return { id: c.id, name: c.name.trim(), phase: c.phase, introCompleted: c.introCompleted,
      animals: readMap(c.animals, bookDefinitions, unlocked),
      expeditions: readMap(c.expeditions, expeditions, unlocked),
      regions: readMap(c.regions, regions, v => ({ ...unlocked(v), messageSeen: boolean(v.messageSeen) })),
      features: readMap(c.features, features, boolean), classEntries };
  });
  if (!ids.has(value.activeClassId)) throw new Error('Die aktive Klasse fehlt in der Sicherung.');
  return { version: 2, activeClassId: value.activeClassId, classes };
}
function load() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? validateState(JSON.parse(saved)) : initialState();
  } catch {
    storageWarning = 'Gespeicherte Daten konnten nicht geladen werden. Bitte eine JSON-Sicherung importieren. Der bisherige Speicher wird erst bei einer Änderung ersetzt.';
    return initialState();
  }
}
let state = load();
export const getState = () => structuredClone(state);
export const activeClass = () => structuredClone(state.classes.find(c => c.id === state.activeClassId));
export const subscribe = listener => { listeners.add(listener); return () => listeners.delete(listener); };
export const getStorageWarning = () => storageWarning;
function commit(next) {
  state = validateState(next);
  storageWarning = '';
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch { storageWarning = 'Speichern im Browser nicht möglich. Bitte den aktuellen Stand als JSON exportieren.'; }
  listeners.forEach(listener => listener());
}
export function updateClass(change) {
  const next = getState();
  change(next.classes.find(c => c.id === next.activeClassId));
  commit(next);
}
export function selectClass(classId) { commit({ ...getState(), activeClassId: classId }); }
export function addClass(name) {
  if (!validName(name)) throw new Error('Bitte einen Klassennamen mit 1–60 Zeichen eingeben.');
  const next = getState();
  const classroom = newClass(name);
  next.classes.push(classroom);
  next.activeClassId = classroom.id;
  commit(next);
}
export function renameClass(name) {
  if (!validName(name)) throw new Error('Bitte einen Klassennamen mit 1–60 Zeichen eingeben.');
  updateClass(c => { c.name = name.trim(); });
}
export function deleteClass() {
  const next = getState();
  next.classes = next.classes.filter(c => c.id !== next.activeClassId);
  if (!next.classes.length) next.classes.push(newClass());
  next.activeClassId = next.classes[0].id;
  commit(next);
}
export function resetClass() {
  updateClass(c => Object.assign(c, newClass(c.name), { id: c.id }));
}
export function importState(text) { commit(validateState(JSON.parse(text))); }
export const exportState = () => JSON.stringify(state, null, 2);
export const bookUnlocked = (classroom, entry) => entry.feature ? classroom.features[entry.feature] : classroom.animals[entry.id].unlocked;
export function setBookUnlocked(entry, unlocked) {
  updateClass(c => {
    if (entry.feature) c.features[entry.feature] = unlocked;
    else c.animals[entry.id].unlocked = unlocked;
  });
}
