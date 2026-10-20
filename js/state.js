import { animals, regions, features, animalStatuses, regionStatuses, roomPhases } from './data.js';
const STORAGE_KEY = 'bestiarium.classroom.v1';
const listeners = new Set();
let storageWarning = '';
const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const id = () => crypto.randomUUID();
const validName = name => typeof name === 'string' && name.trim().length > 0 && name.trim().length <= 60;

export function newClass(name = 'Klasse 5') {
  return {
    id: id(), name: name.trim(), phase: 0,
    animals: Object.fromEntries(animals.map(a => [a.id, 'hidden'])),
    regions: Object.fromEntries(regions.map(r => [r.id, r.id === 'base' ? 'discovered' : 'hidden'])),
    features: Object.fromEntries(features.map(f => [f.id, false]))
  };
}
function initialState() {
  const classroom = newClass();
  return { version: 1, activeClassId: classroom.id, classes: [classroom] };
}
export function validateState(value) {
  if (!object(value) || value.version !== 1 || !Array.isArray(value.classes) || !value.classes.length || value.classes.length > 1000) throw new Error('Ungültige Bestiarium-Sicherungsdatei.');
  const ids = new Set();
  const classes = value.classes.map(c => {
    if (!object(c) || typeof c.id !== 'string' || !c.id || c.id.length > 100 || ids.has(c.id) || !validName(c.name) || !Number.isInteger(c.phase) || !roomPhases[c.phase]) throw new Error('Ungültige Klassendaten.');
    ids.add(c.id);
    const readMap = (source, definitions, valid) => {
      if (!object(source)) throw new Error('Unvollständiger Klassenstand.');
      return Object.fromEntries(definitions.map(item => {
        if (!own(source, item.id) || !valid(source[item.id])) throw new Error('Ungültiger Status im Klassenstand.');
        return [item.id, source[item.id]];
      }));
    };
    return { id: c.id, name: c.name.trim(), phase: c.phase,
      animals: readMap(c.animals, animals, v => own(animalStatuses, v)),
      regions: readMap(c.regions, regions, v => own(regionStatuses, v)),
      features: readMap(c.features, features, v => typeof v === 'boolean') };
  });
  if (!ids.has(value.activeClassId)) throw new Error('Die aktive Klasse fehlt in der Sicherung.');
  return { version: 1, activeClassId: value.activeClassId, classes };
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
