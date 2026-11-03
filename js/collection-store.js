// Deliberately separate from classroom progress and its reset/export.
export const MAX_ENTRIES = 300;
export const MAX_FILE = 150 * 1024 * 1024;
const fail = () => { throw new Error('Die Sammlungsdatei ist beschädigt oder hat ein unbekanntes Format.'); };
const object = v => v && typeof v === 'object' && !Array.isArray(v);
function rasterHeader(bytes, mime) {
  if (mime === 'image/png') return [137,80,78,71,13,10,26,10].every((n,i) => bytes[i] === n);
  if (mime === 'image/jpeg') return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (mime === 'image/webp') return String.fromCharCode(...bytes.slice(0,4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8,12)) === 'WEBP';
  return false;
}
function text(v, max, required = false) {
  if (typeof v !== 'string' || v.length > max || (required && !v.trim())) fail();
  return v;
}
function version(v) {
  if (!object(v)) fail();
  const image = v.image;
  if (image !== null && (typeof image !== 'string' || image.length > 6 * 1024 * 1024 || !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(image))) fail();
  if (image) {
    try { const [prefix, base64] = image.split(','); if (!rasterHeader(Uint8Array.from(atob(base64.slice(0,32)), c => c.charCodeAt(0)), prefix.slice(5,-7))) fail(); }
    catch { fail(); }
  }
  return { description: text(v.description, 50000, true), image, note: text(v.note, 2000), phase: text(v.phase, 80) };
}
export function validateCollection(data) {
  if (!object(data) || data.format !== 'bestiarium-creatures' || data.version !== 1 || !Array.isArray(data.entries) || data.entries.length > MAX_ENTRIES) fail();
  const ids = new Set();
  return data.entries.map(e => {
    if (!object(e) || typeof e.visible !== 'boolean') fail();
    const id = text(e.id, 100, true);
    if (ids.has(id)) fail();
    ids.add(id);
    return { id, name: text(e.name, 120, true), researcher: text(e.researcher, 100), visible: e.visible, first: version(e.first), revised: e.revised === null ? null : version(e.revised) };
  });
}
export const collectionFile = entries => JSON.stringify({ format: 'bestiarium-creatures', version: 1, entries }, null, 2);
let database;
function open() {
  if (!database) database = new Promise((resolve, reject) => {
    const request = indexedDB.open('bestiarium-creatures', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('collections');
    request.onsuccess = () => { request.result.onversionchange = () => { request.result.close(); database = null; }; resolve(request.result); };
    request.onerror = () => { database = null; reject(new Error('Der Browserspeicher ist nicht verfügbar. Bitte die Browsereinstellungen prüfen.')); };
    request.onblocked = () => { database = null; reject(new Error('Bitte andere Bestiarium-Tabs schließen und erneut versuchen.')); };
  });
  return database;
}
export async function readCollection(classId) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const req = db.transaction('collections').objectStore('collections').get(classId);
    req.onsuccess = () => { try { resolve(req.result ? validateCollection(req.result) : []); } catch (e) { reject(e); } };
    req.onerror = () => reject(new Error('Die Sammlung konnte nicht gelesen werden. Bitte erneut versuchen.'));
  });
}
export async function writeCollection(classId, entries) {
  const serialized = collectionFile(entries);
  if (new Blob([serialized]).size > MAX_FILE) throw new Error('Die Sammlung ist zu groß (maximal 150 MB einschließlich Bildern). Bitte Bilder verkleinern.');
  const checked = validateCollection(JSON.parse(serialized));
  const db = await open();
  await new Promise((resolve, reject) => {
    const tx = db.transaction('collections', 'readwrite');
    tx.objectStore('collections').put({ format: 'bestiarium-creatures', version: 1, entries: checked }, classId);
    tx.oncomplete = resolve;
    tx.onabort = tx.onerror = () => reject(new Error('Speichern fehlgeschlagen. Möglicherweise ist der Browserspeicher voll. Bisher gespeicherte Einträge bleiben erhalten. Bitte die Sammlung exportieren.'));
  });
  window.dispatchEvent(new CustomEvent('collection-changed', { detail: classId }));
}
export async function decodePicture(source) {
  const img = new Image();
  img.src = source;
  try { await img.decode(); } catch { throw new Error('Das Bild kann nicht gelesen werden. Bitte eine gültige PNG-, JPG- oder WebP-Datei wählen.'); }
  if (!img.width || !img.height || img.width * img.height > 80000000) throw new Error('Das Bild hat zu viele Bildpunkte (maximal 80 Millionen). Bitte vorher verkleinern.');
  return img;
}
export async function optimizePicture(file) {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) throw new Error('Bitte ein Bild im Format PNG, JPG oder WebP wählen.');
  if (file.size > 25 * 1024 * 1024) throw new Error('Das Bild ist größer als 25 MB. Bitte vorher verkleinern.');
  if (!rasterHeader(new Uint8Array(await file.slice(0,16).arrayBuffer()), file.type)) throw new Error('Der Dateiinhalt passt nicht zu PNG, JPG oder WebP. Bitte ein gültiges Bild wählen.');
  const url = URL.createObjectURL(file);
  try {
    const img = await decodePicture(url);
    const scale = Math.min(1, 2400 / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale); canvas.height = Math.round(img.height * scale);
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    const result = canvas.toDataURL('image/webp', .92);
    if (result.length > 6 * 1024 * 1024) throw new Error('Das Bild benötigt zu viel Speicher. Bitte ein kleineres Bild wählen.');
    return result;
  } finally { URL.revokeObjectURL(url); }
}
export async function parseCollectionFile(file) {
  if (file.size > MAX_FILE) throw new Error('Die Sammlungsdatei ist zu groß (maximal 150 MB).');
  let entries;
  try { entries = validateCollection(JSON.parse(await file.text())); } catch { fail(); }
  // Decode every embedded image before any database write; no remote URLs/HTML/SVG.
  for (const e of entries) for (const v of [e.first, e.revised]) if (v?.image) await decodePicture(v.image);
  return entries;
}
export function mergeCollection(existing, incoming, mode) {
  if (mode === 'replace') return structuredClone(incoming);
  if (mode !== 'append') throw new Error('Bitte Ergänzen oder Ersetzen auswählen.');
  const result = [...existing, ...incoming.map(e => ({ ...e, id: crypto.randomUUID() }))];
  return validateCollection(JSON.parse(collectionFile(result)));
}
