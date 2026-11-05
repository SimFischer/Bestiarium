if (!['localhost','127.0.0.1','[::1]'].includes(location.hostname)) throw new Error('Nur lokale Entwicklung');
const { updateClass, activeClass, getState } = await import('../js/state.js');
const { milestones, applyMilestone, vidiDialogs } = await import('../js/progress.js');
updateClass(c => {
  milestones.forEach(m => applyMilestone(c,m.id,true));
  c.introCompleted=true;c.seenVidiDialogs=vidiDialogs.map(d=>d.id);
  c.unlockedBestiaryEntries.push(...['bowtruckle'].filter(id=>!c.unlockedBestiaryEntries.includes(id)));
});
const { navigate } = await import('../js/app.js');
const { animals, expeditions } = await import('../js/data.js');
const { codexSections } = await import('../js/research.js');
const { writeCollection, readCollection } = await import('../js/collection-store.js');
const { button } = await import('../js/ui.js');
const progress = () => { const state=getState();state.classes.forEach(c=>{delete c.generatorBuilderResult;});return JSON.stringify(state); };
const originalState=progress();
const tick=()=>new Promise(resolve=>{let frames=6;const frame=()=>--frames?requestAnimationFrame(frame):resolve();requestAnimationFrame(frame);});
const assert=(ok,message)=>{if(!ok)throw new Error(message);};
const dialog=document.querySelector('#view-dialog'),content=document.querySelector('#view-content');
function geometry(name) {
  const nodes=[...content.querySelectorAll('.book-stage,.book-reader-controls,.observation-scene,.generator-machine,.builder-controls,.description-review')];
  for(const node of nodes){const r=node.getBoundingClientRect();assert(r.top>=0 && r.bottom<=innerHeight+2 && r.left>=-1 && r.right<=innerWidth+1,`${name}: ${node.className} außerhalb (${Math.round(r.bottom)} / ${innerHeight})`);}
  for(const p of content.querySelectorAll('.safe-book-copy,.creature-description'))assert(p.scrollHeight<=p.clientHeight+1,`${name}: Text läuft über`);
}
async function allText(expected) {
  let result='',count=0;
  const next=content.querySelector('.book-edge-right');
  while(true){geometry('Textseite');result+=[...content.querySelectorAll('.safe-book-copy')].map(p=>p.textContent).join('');count++;const pair=content.querySelector('.book-position').textContent.match(/Seite (\d+) von (\d+)/);if(pair[1]===pair[2])break;assert(count<500,'Zu viele Seiten');next.click();}
  assert(result===expected,'Text fehlt oder wurde verändert');return count;
}
const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=900;const ctx=canvas.getContext('2d');ctx.fillStyle='#456957';ctx.fillRect(0,0,1600,900);ctx.fillStyle='#fff3cf';ctx.font='70px Georgia';ctx.fillText('ENTWICKLUNGSBEISPIEL',160,450);
const works=[['PNG',1600,900],['JPG',700,1200],['WebP',1000,1000]].map(([format,w,h],i)=>{
 const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(canvas,0,0,w,h);
 return {id:`layout-test-${i}`,name:`ENTWICKLUNGSBEISPIEL ${format}`,researcher:'TEST',visible:true,first:{description:('Das Testwesen besitzt drei Flügel und lange Krallen.\n\n').repeat(90),image:c.toDataURL(format==='JPG'?'image/jpeg':`image/${format.toLowerCase()}`),note:'',phase:''},revised:{description:'Überarbeitete Testfassung.',image:null,note:'',phase:'Überarbeitet'}};
});
// Only the local development class receives explicit fixtures.
await writeCollection(activeClass().id,works);
const run=button('Layout prüfen',async()=>{
 const checked=[];let textPages=0;const displayMode=document.fullscreenElement?'Browser-Vollbild':'Fenster';
 try{
  for(const entry of animals.filter(a=>a.type==='animal')){
   await navigate('bestiary',entry.id);await tick();geometry(entry.id);
   const text=entry.textContent.map(s=>`${s.heading}: ${s.text}`).join('\n\n');textPages+=await allText(text);
   document.querySelector('.book-font-options button:last-child').click();await tick();
   while(Number(content.querySelector('.book-position').textContent.match(/Seite (\d+) von (\d+)/)[1])>1){content.querySelector('.book-edge-left').click();}
   textPages+=await allText(text);checked.push(entry.id);
  }
  await navigate('bestiary');await tick();geometry('Inhaltsverzeichnis');checked.push('Inhaltsverzeichnis');
  for(const section of codexSections){await navigate('bestiary','codex',section.id);await tick();geometry(section.id);textPages+=await allText(section.items.map(i=>`• ${i}`).join('\n\n'));checked.push(`Kodex ${section.title}`);}
  await navigate('bestiary','codex','check');await tick();geometry('Kriterien');checked.push('Kriterien');
  await navigate('world-map');await tick();geometry('Weltkarte');checked.push('Weltkarte');
  for(const e of expeditions){await navigate('expedition',e.id);await tick();geometry(e.title);content.querySelector('.research-launch').click();await tick();geometry(e.title+' Auftrag');[...content.querySelectorAll('button')].find(b=>b.textContent==='Vidis Hinweis').click();await tick();geometry(e.title+' Hinweis');checked.push(e.title);}
  for(const mode of ['traits','builder']){await navigate('generator',mode);await tick();geometry('Generator '+mode);checked.push('Generator '+mode);if(mode==='builder'){[...content.querySelectorAll('button')].find(b=>b.textContent==='Selbst zusammenstellen').click();await tick();geometry('Baukasten manuell');checked.push('Baukasten manuell');}}
  await navigate('collection');await tick();checked.push('Sammlungsübersicht');
  for(let i=0;i<3;i++){if(i)document.querySelector('.book-chrome > button').click();await tick();content.querySelectorAll('.creature-card')[i].click();await tick();for(const label of ['Bild + Text','Bild','Text']){[...document.querySelectorAll('.book-view-switch button')].find(b=>b.textContent===label).click();await tick();geometry('Sammlung '+label);}checked.push(works[i].name);}
  document.querySelector('.book-chrome > button').click();await tick();content.querySelector('.creature-card').click();await tick();
  let complete='',collectionPages=0;
  while(true){geometry('Langer Schülertext');complete+=content.querySelector('.creature-description').textContent;collectionPages++;const forward=content.querySelector('.book-edge-right');const pair=content.querySelector('.book-position').textContent.match(/Seite (\d+) von (\d+)/);if(pair[1]===pair[2])break;assert(collectionPages<500,'Zu viele Schülertextseiten');forward.click();}
  assert(complete===works[0].first.description,'Schülertextseiten unvollständig');textPages+=collectionPages;checked.push('Alle Schülertextseiten');
  navigate('station');document.querySelector('#app-title').click();await tick();
  const teacher=document.querySelector('#teacher-dialog');
  [...teacher.querySelectorAll('button')].find(b=>b.textContent==='Eintrag anlegen').click();await tick();
  const field=teacher.querySelector('.creature-editor input');field.value='ENTWICKLUNGSENTWURF';field.dispatchEvent(new Event('input'));
  window.dispatchEvent(new Event('resize'));await tick();assert(field.value==='ENTWICKLUNGSENTWURF','Eingabe bei Resize verloren');
  teacher.scrollTop=teacher.scrollHeight;await tick();assert(teacher.querySelector('.creature-editor'),'Formular verloren');
  teacher.close();checked.push('Lehrkraftformular');
  assert(progress()===originalState,'Fortschritt verändert');assert(JSON.stringify(await readCollection(activeClass().id))===JSON.stringify(works),'Werke verändert');
  navigate('station');document.title=`OK: ${checked.length} Ansichten, ${textPages} Textseiten · ${innerWidth}×${innerHeight} · ${displayMode}`;
  document.querySelector('#layout-result').textContent=document.title+'\n'+checked.join(', ');
 }catch(error){document.title='FEHLER: '+error.message;navigate('station');document.querySelector('#layout-result').textContent=document.title+'\nBereits geprüft: '+checked.join(', ');}
});
document.querySelector('.topbar').append(run);
const result=document.createElement('pre');result.id='layout-result';Object.assign(result.style,{position:'fixed',bottom:'0',left:'0',background:'#211',zIndex:'20',maxWidth:'95vw',whiteSpace:'pre-wrap'});document.body.append(result);
const requested=new URLSearchParams(location.search).get('view');
if(requested==='map')await navigate('world-map');
else if(requested==='generator'||requested==='builder')await navigate('generator',requested==='builder'?'builder':'traits');
else if(requested==='collection')await navigate('collection');
else if(requested==='expedition')await navigate('expedition',expeditions[0].id);
else if(requested==='codex')await navigate('bestiary','codex','structure');
else if(requested)await navigate('bestiary',requested==='index'?null:requested);
