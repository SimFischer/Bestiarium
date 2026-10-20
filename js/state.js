import { animals, regions, expeditions, features, roomPhases } from './data.js';
import { milestones, federhainClues, vidiDialogs, applyMilestone, setUnlock } from './progress.js';
const STORAGE_KEY = 'bestiarium.classroom.v3';
const listeners = new Set();
let storageWarning = '';
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const id = () => crypto.randomUUID();
const validName = name => typeof name === 'string' && name.trim().length > 0 && name.trim().length <= 60;

export function newClass(name = 'Klasse 5') {
  const classroom = {
    id: id(), name: name.trim(), roomPhase: 0, introCompleted: false,
    completedMilestones: [], unlockedBestiaryEntries: [], unlockedRegions: [],
    unlockedExpeditions: [], unlockedFeatures: [], seenVidiDialogs: [], discoveredFederhainClues: []
  };
  applyMilestone(classroom, 'station-found', true);
  return classroom;
}
function initialState() {
  const classroom = newClass();
  return { version: 3, activeClassId: classroom.id, classes: [classroom] };
}
export function validateState(value) {
  if (!object(value) || value.version !== 3 || !Array.isArray(value.classes) || !value.classes.length || value.classes.length > 1000) throw new Error('Ungültige Bestiarium-Sicherungsdatei.');
  const ids = new Set();
  const classes = value.classes.map(c => {
    if (!object(c) || typeof c.id !== 'string' || !c.id || c.id.length > 100 || ids.has(c.id) || !validName(c.name) || !Number.isInteger(c.roomPhase) || !roomPhases[c.roomPhase] || typeof c.introCompleted !== 'boolean') throw new Error('Ungültige Klassendaten.');
    ids.add(c.id);
    const readIds = (field, definitions) => {
      const list = c[field];
      if (!Array.isArray(list) || list.length > definitions.length || new Set(list).size !== list.length || !list.every(id => definitions.some(item => item.id === id))) throw new Error('Ungültiger Unterrichts- oder Storyfortschritt.');
      return [...list];
    };
    const classroom = {
      id: c.id, name: c.name.trim(), roomPhase: c.roomPhase, introCompleted: c.introCompleted,
      completedMilestones: readIds('completedMilestones', milestones),
      unlockedBestiaryEntries: readIds('unlockedBestiaryEntries', animals),
      unlockedRegions: readIds('unlockedRegions', regions),
      unlockedExpeditions: readIds('unlockedExpeditions', expeditions),
      unlockedFeatures: readIds('unlockedFeatures', features),
      seenVidiDialogs: readIds('seenVidiDialogs', vidiDialogs),
      discoveredFederhainClues: readIds('discoveredFederhainClues', federhainClues)
    };
    if (classroom.unlockedBestiaryEntries.includes('classBestiary') !== classroom.unlockedFeatures.includes('classBestiary')) throw new Error('Widersprüchlicher Freischaltstatus des Klassen-Bestiariums.');
    return classroom;
  });
  if (!ids.has(value.activeClassId)) throw new Error('Die aktive Klasse fehlt in der Sicherung.');
  return { version: 3, activeClassId: value.activeClassId, classes };
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
export const bookUnlocked = (classroom, entry) => classroom.unlockedBestiaryEntries.includes(entry.id);
export function setBookUnlocked(entry, unlocked) { setClassUnlock('bestiary', entry.id, unlocked); }
export function setClassUnlock(group, id, unlocked) { updateClass(c => setUnlock(c, group, id, unlocked)); }
export function setMilestone(id, completed) { updateClass(c => applyMilestone(c, id, completed)); }
export function markVidiDialogSeen(id) {
  updateClass(c => { if (!c.seenVidiDialogs.includes(id)) c.seenVidiDialogs.push(id); });
}