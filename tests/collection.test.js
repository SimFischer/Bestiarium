import { validateCollection, collectionFile, parseCollectionFile, mergeCollection, writeCollection, readCollection, optimizePicture } from '../js/collection-store.js';
import { renderCollection, creatureSpread } from '../js/collection.js';
import { renderCollectionTeacher } from '../js/collection-teacher.js';
import { activeClass, getState, resetClass, setMilestone } from '../js/state.js';
import { newClass } from '../js/state.js';
import { applyMilestone } from '../js/progress.js';
const results = document.querySelector('#results'), sandbox = document.querySelector('#sandbox');
if (!['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) {
  results.textContent = 'Entwicklungstests sind nur auf localhost erlaubt. Auf der Live-Seite werden keine Tests ausgeführt.';
  throw new Error('Tests benötigen einen eigenen lokalen Entwicklungsbrowser.');
}
let passed = 0, failed = 0;
const assert = (value, message = 'Bedingung nicht erfüllt') => { if (!value) throw new Error(message); };
const test = async (name, callback) => { try { await callback(); passed++; results.textContent += `\n✓ ${name}`; } catch(e) { failed++; results.textContent += `\n✗ ${name}: ${e.message}`; } };
const tick = () => new Promise(resolve => setTimeout(resolve, 60));
const wait = async predicate => { for (let i=0;i<100;i++) { if (predicate()) return; await tick(); } throw new Error('Zeitüberschreitung'); };
const click = label => { const node = [...sandbox.querySelectorAll('button')].find(b => b.textContent === label); assert(node, `Schaltfläche fehlt: ${label}`); node.click(); };
const id = `development-test-${crypto.randomUUID()}`;
const e = { id:'development-example', name:'ENTWICKLUNGSBEISPIEL', researcher:'TEST', visible:true, first:{ description:'Erste Idee.\n\n<img src=x onerror=alert(1)>', image:null, note:'Testnotiz', phase:'' }, revised:{ description:'Genauere Beschreibung.', image:null, note:'', phase:'Überarbeitet' } };
results.textContent = 'Browser-Funktionstests';
await test('Dateiformat, Absätze und beide Fassungen bleiben unverändert', () => {
  assert(JSON.stringify(validateCollection(JSON.parse(collectionFile([e])))) === JSON.stringify([e]));
});
await test('Ungültige Datensätze und fremde Bild-URLs werden abgelehnt', () => {
  for (const change of [x=>x.entries[0].first.image='https://example.com/test.png', x=>x.version=9, x=>x.entries.push(x.entries[0]), x=>x.entries[0].name='', x=>x.entries[0].visible='true', x=>x.entries[0].revised={}, x=>x.entries[0].first.image='data:image/svg+xml;base64,PHN2Zz4=']) {
    const data=JSON.parse(collectionFile([e])); change(data); let rejected=false; try {validateCollection(data);}catch {rejected=true;} assert(rejected);
  }
});
await test('PNG, JPG und WebP optimieren; Export/Import einschließlich Bildern', async () => {
  const canvas=document.createElement('canvas'); canvas.width=3000; canvas.height=1000;
  canvas.getContext('2d').fillRect(0,0,3000,1000);
  for (const mime of ['image/png','image/jpeg','image/webp']) {
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,mime));
    const image=await optimizePicture(new File([blob],'development-test',{type:mime}));
    const img=new Image(); img.src=image; await img.decode(); assert(img.width===2400 && img.height===800);
    const entry=structuredClone(e); entry.first.image=image; entry.revised.image=image;
    const parsed=await parseCollectionFile(new File([collectionFile([entry])],'test.json'));
    assert(parsed[0].first.image===image && parsed[0].revised.image===image);
    e.first.image=image;
  }
});
await test('Falsche, zu große und beschädigte Dateien werden abgelehnt', async () => {
  for (const action of [()=>optimizePicture(new File(['abc'],'test.svg',{type:'image/svg+xml'})),()=>optimizePicture(new File(['broken'],'test.png',{type:'image/png'})),()=>parseCollectionFile(new File(['{'],'broken.json')),()=>parseCollectionFile(new File([collectionFile([{...e,first:{...e.first,image:'data:image/png;base64,YWJj'}}])],'broken-image.json')),()=>parseCollectionFile({size:151*1024*1024})]) {
    let rejected=false;try{await action();}catch{rejected=true;}assert(rejected);
  }
});
await test('Ergänzen erhält vorhandene IDs und erzeugt neue; Ersetzen nur ausdrücklich',()=>{
  const appended=mergeCollection([e],[e],'append');assert(appended.length===2 && appended[0].id===e.id && appended[1].id!==e.id);
  assert(mergeCollection([e],[],'replace').length===0);
  let rejected=false;try{mergeCollection([e],[e]);}catch{rejected=true;}assert(rejected);
});
await test('IndexedDB speichert beide Fassungen und Bilder; Klassen bleiben getrennt',async()=>{
  await writeCollection(id,[e]);assert(JSON.stringify(await readCollection(id))===JSON.stringify([e]));assert((await readCollection(id+'-other')).length===0);
});
await test('Importierte Texte bleiben Text; lange Beschreibungen werden vollständig gerendert',()=>{
  const copy=structuredClone(e);copy.first.description += '\nLanger Text.'.repeat(3000);
  const node=creatureSpread(copy);sandbox.replaceChildren(node);
  assert(node.querySelector('.creature-description').textContent===copy.first.description);assert(node.querySelectorAll('img').length===1);
});
await test('Buchnavigation, Fassungswechsel, Bild/Text unabhängig verdecken und Impulse',async()=>{
  await renderCollection(sandbox,id);click('ENTWICKLUNGSBEISPIEL');
  assert(sandbox.querySelector('.creature-description').textContent===e.first.description);
  click('Überarbeitet');assert(sandbox.querySelector('.creature-description').textContent===e.revised.description);
  click('Bild ausblenden');assert(!sandbox.querySelector('.creature-art img') && sandbox.querySelector('.creature-description'));
  click('Beschreibung ausblenden');assert(!sandbox.querySelector('.creature-description'));
  click('Gesprächsimpulse einblenden');assert(sandbox.querySelectorAll('.creature-prompts li').length===3);
  click('Zur Übersicht');assert(sandbox.querySelectorAll('.creature-card').length===1);
});
await test('Lehrkraft: anlegen, Vorschau erforderlich, bearbeiten, umordnen, ausblenden und löschen',async()=>{
  sandbox.replaceChildren();await renderCollectionTeacher(sandbox,id);click('Eintrag anlegen');
  const fill=(name,value)=>{const input=[...sandbox.querySelectorAll('label')].find(l=>l.textContent.startsWith(name)).querySelector('input,textarea');input.value=value;input.dispatchEvent(new Event('input'));};
  fill('Name des Wesens','ENTWICKLUNGSBEISPIEL 2');fill('Beschreibung','Beschreibung 2');
  assert([...sandbox.querySelectorAll('button')].find(b=>b.textContent==='Eintrag speichern').disabled);
  click('Vorschau anzeigen');click('Eintrag speichern');await wait(()=>sandbox.querySelectorAll('.collection-list > li').length===2);
  click('Bearbeiten');fill('Name des Wesens','ENTWICKLUNGSBEISPIEL geändert');click('Vorschau anzeigen');click('Eintrag speichern');await wait(()=>!sandbox.querySelector('form'));
  assert((await readCollection(id))[0].revised.description===e.revised.description);
  click('↓ Nach unten');await wait(()=>sandbox.querySelector('.collection-list li strong').textContent==='ENTWICKLUNGSBEISPIEL 2');
  click('Ausblenden');await wait(()=>sandbox.querySelector('.collection-list li span').textContent==='Ausgeblendet');
  const present=document.createElement('div');sandbox.append(present);await renderCollection(present,id);assert(present.querySelectorAll('.creature-card').length===1);present.remove();
  const confirmOriginal=window.confirm;window.confirm=()=>false;click('Löschen');assert((await readCollection(id)).length===2);
  window.confirm=()=>true;click('Löschen');await wait(()=>sandbox.querySelectorAll('.collection-list > li').length===1);window.confirm=confirmOriginal;
});
await test('Sammlung verändert keinen Fortschritt; Reset lässt Schülerwerke erhalten',async()=>{
  const previous=getState();const classId=activeClass().id;const works=await readCollection(classId);
  await writeCollection(classId,works);assert(JSON.stringify(getState())===JSON.stringify(previous));
  // This development page uses its own dedicated test origin, never the live app.
  setMilestone('niffler-researched',true);resetClass();assert(activeClass().id===classId);assert(JSON.stringify(await readCollection(classId))===JSON.stringify(works));
  assert(!activeClass().unlockedBestiaryEntries.includes('niffler'));
});
await test('Bestehende Freischaltungen: Niffler und späterer Sammlungsschluss',()=>{
  const classroom=newClass();assert(!classroom.unlockedBestiaryEntries.includes('niffler'));applyMilestone(classroom,'niffler-researched',true);assert(classroom.unlockedBestiaryEntries.includes('niffler'));
  applyMilestone(classroom,'class-discoveries',true);assert(classroom.unlockedFeatures.includes('classBestiary'));
});
await writeCollection(id,[]);
results.textContent += `\n\n${passed} bestanden, ${failed} fehlgeschlagen.`;
document.title = `${failed ? 'FEHLER' : 'OK'} – ${passed} Bestiarium-Tests`;
