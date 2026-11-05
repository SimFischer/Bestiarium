if (!['localhost','127.0.0.1','[::1]'].includes(location.hostname)) throw new Error('Nur lokale Entwicklung');
const { updateClass, activeClass, getState } = await import('../js/state.js');
const { milestones, applyMilestone, vidiDialogs } = await import('../js/progress.js');
updateClass(c=>{milestones.forEach(m=>applyMilestone(c,m.id,true));c.introCompleted=true;c.seenVidiDialogs=vidiDialogs.map(d=>d.id);});
const { navigate } = await import('../js/app.js');
const { readCollection, writeCollection } = await import('../js/collection-store.js');
const { button } = await import('../js/ui.js');
const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=900;const ctx=canvas.getContext('2d');
const gradient=ctx.createLinearGradient(0,0,1600,900);gradient.addColorStop(0,'#235e59');gradient.addColorStop(1,'#b68a47');ctx.fillStyle=gradient;ctx.fillRect(0,0,1600,900);ctx.strokeStyle='#f9e6b8';ctx.lineWidth=12;ctx.strokeRect(18,18,1564,864);ctx.fillStyle='#f9e6b8';ctx.font='60px Georgia';ctx.fillText('ENTWICKLUNGSBEISPIEL',170,460);
const first=Array.from({length:18},(_,i)=>`Absatz ${i+1}: Dieses Testwesen hat dichtes, grünes Fell. Seine drei Flügel tragen goldene Federn. An den kräftigen Füßen sitzen fünf gebogene Krallen.`).join('\n\n');
const revised=('Überarbeitet: Der schmale Kopf hat zwei große, bernsteinfarbene Augen.\n\n').repeat(12);
const fixtures=[{id:'quiet-dev-1',name:'ENTWICKLUNGSBEISPIEL – Federwesen',visible:true,researcher:'TEST',first:{description:first,image:canvas.toDataURL('image/png'),phase:'',note:''},revised:{description:revised,image:null,phase:'Überarbeitet',note:''}},{id:'quiet-dev-2',name:'ENTWICKLUNGSBEISPIEL – Waldwesen',visible:true,researcher:'',first:{description:'Dieses zweite Testwesen hat vier Pfoten und große Ohren.',image:canvas.toDataURL('image/jpeg'),phase:'',note:''},revised:null}];
await writeCollection(activeClass().id,fixtures);
const storedWorks=JSON.stringify(await readCollection(activeClass().id));
const content=document.querySelector('#view-content'),dialog=document.querySelector('#view-dialog');
const tick=()=>new Promise(resolve=>{let n=4;const step=()=>--n?requestAnimationFrame(step):resolve();requestAnimationFrame(step);});
const assert=(test,message)=>{if(!test)throw new Error(message);};
const find=label=>[...dialog.querySelectorAll('button')].find(b=>b.textContent===label);
const click=label=>{const b=find(label);assert(b,`Fehlt: ${label}`);b.click();};
const arrow=direction=>content.querySelector(direction<0?'.book-edge-left':'.book-edge-right');
const number=()=>{const match=content.querySelector('.book-position').textContent.match(/Seite (\d+) von (\d+)/);return match?match.slice(1).map(Number):null;};
const open=()=>{dialog.querySelector('.book-options').open=true;};
const close=()=>{dialog.querySelector('.book-options').open=false;};
const geometry=()=>{
  const heading=dialog.querySelector('.dialog-heading').getBoundingClientRect();assert(heading.height<65,'Mehrzeilige Kopfzeile');
  assert(content.querySelectorAll('.book-edge').length===2,'Mehr als ein Paar Pfeile');
  for(const n of content.querySelectorAll('.book-edge,.creature-spread,.book-position,.book-stage')){const r=n.getBoundingClientRect();assert(r.left>=0&&r.top>=0&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1,`Außerhalb: ${n.className}`);}
  for(const p of content.querySelectorAll('.creature-description,.safe-book-copy'))assert(p.scrollHeight<=p.clientHeight+1,'Text abgeschnitten');
  assert(!document.querySelector('[data-presentation]'),'Präsentationsschalter vorhanden');
};
function readAll(expected,selector='.creature-description'){
  while(number()[0]>1)arrow(-1).click();
  let text='',count=0;
  while(true){geometry();text+=[...content.querySelectorAll(selector)].map(p=>p.textContent).join('');count++;const [page,total]=number();if(page===total)break;assert(count<200,'Zu viele Seiten');arrow(1).click();}
  assert(text===expected,'Originaltext nicht vollständig erhalten');return count;
}
const run=button('Buchbedienung prüfen',async()=>{
  const checks=[];const originalState=JSON.stringify(getState());const mode=document.fullscreenElement?'Vollbild':'Fenster';
  try{
    await navigate('collection');await tick();if(content.querySelector('.creature-reader'))click('Inhaltsverzeichnis');await tick();content.querySelector('.creature-card').click();await tick();geometry();
    assert(arrow(-1).disabled,'Anfang nicht erkennbar');assert(dialog.querySelector('.book-options')&&!dialog.querySelector('.book-options').open,'Menü nicht geschlossen');checks.push('Kompakte Kopfzeile und Anfang');
    const total=readAll(first);assert(total>1,'Langer Text ohne Folgeseiten');arrow(1).click();await tick();assert(content.textContent.includes(fixtures[1].name),'Kein Wesenwechsel');assert(arrow(1).disabled,'Ende nicht erkennbar');arrow(-1).click();await tick();assert(number()[0]===number()[1],'Rückwärts nicht letzte Textseite');checks.push('Alle Textseiten, Wesenwechsel und Rückwärtsgrenze');
    click('Bild');await tick();geometry();assert(content.querySelectorAll('.creature-leaf').length===1&&!number(),'Bild mit unsichtbaren Textseiten');arrow(1).click();await tick();assert(content.textContent.includes(fixtures[1].name),'Bildwechsel benötigt mehrere Klicks');
    open();assert(!find('Überarbeitet'),'Unverfügbare Fassung angeboten');close();arrow(-1).click();await tick();checks.push('Bildansicht wechselt unmittelbar; verfügbare Optionen');
    click('Text');await tick();geometry();assert(content.querySelectorAll('.creature-leaf').length===1,'Leere Bildhälfte');click('Bild + Text');await tick();assert(content.querySelectorAll('.creature-leaf').length===2,'Doppelseite fehlt');assert(content.textContent.includes(fixtures[0].name),'Wesen beim Ansichtswechsel verloren');checks.push('Drei Ansichten erhalten das Wesen');
    open();const panel=dialog.querySelector('.book-options-panel').getBoundingClientRect();for(const edge of content.querySelectorAll('.book-edge')){const r=edge.getBoundingClientRect();assert(panel.bottom<=r.top||panel.top>=r.bottom||panel.right<=r.left||panel.left>=r.right,'Menü verdeckt Blätterpfeil');}
    click('Überarbeitet');await tick();close();readAll(revised);open();click('Größer');await tick();click('Größer');await tick();close();geometry();assert(parseFloat(getComputedStyle(content.querySelector('.creature-description')).fontSize)>32,'Schrift nicht größer');readAll(revised);checks.push('Fassung, Schrift und vollständige Aufteilung im Menü');
    open();click('Forschungsfrage zeigen');await tick();close();assert(content.querySelectorAll('.book-question').length===1,'Frage fehlt');geometry();content.querySelector('.book-question button').click();await tick();assert(!content.querySelector('.book-question'),'Frage nicht geschlossen');checks.push('Optionaler schließbarer Impuls');
    open();click('Eintrag bearbeiten');await tick();assert(document.querySelector('#teacher-dialog').open,'Lehrkraftbereich fehlt');const name=document.querySelector('.creature-editor input');assert(name.value===fixtures[0].name,'Falscher Eintrag bearbeitet');document.querySelector('#teacher-dialog [data-close]').click();await tick();checks.push('Bestehenden Eintrag bearbeiten');
    click('Inhaltsverzeichnis');await tick();assert(content.querySelectorAll('.creature-card').length===2,'Verzeichnis fehlt');content.querySelectorAll('.creature-card')[1].click();await tick();assert(content.textContent.includes(fixtures[1].name),'Direkter Sprung fehlt');dialog.querySelector('[data-close]').click();assert(!dialog.open,'Station nicht erreicht');checks.push('Verzeichnis und Station');
    await navigate('bestiary','niffler');await tick();geometry();open();assert(find('Größer'),'Andere Buchansicht ohne Optionen');close();assert(content.querySelectorAll('.book-edge').length===2,'Andere Buchansicht doppelte Navigation');checks.push('Einheitliches Bestiarium');
    assert(JSON.stringify(await readCollection(activeClass().id))===storedWorks,'Werke verändert');assert(JSON.stringify(getState())===originalState,'Fortschritt verändert');checks.push('Daten und Fortschritt unverändert');
    navigate('station');document.title=`OK: ${checks.length} Buchprüfungen · ${innerWidth}×${innerHeight} · ${mode}`;result.textContent=document.title+'\n'+checks.join('\n');
  }catch(error){navigate('station');document.title=`FEHLER nach ${checks.length}: ${error.message}`;result.textContent=document.title+'\n'+checks.join('\n');}
});
document.querySelector('.topbar').append(run);const result=document.createElement('pre');result.id='quiet-result';Object.assign(result.style,{position:'fixed',bottom:'0',left:'0',maxWidth:'90vw',whiteSpace:'pre-wrap',zIndex:'10',background:'#211a14'});document.body.append(result);
const requested=new URLSearchParams(location.search).get('view');
await navigate(requested==='niffler'?'bestiary':'collection',requested==='niffler'?'niffler':null);await tick();
if(requested!=='niffler'&&new URLSearchParams(location.search).has('entry')){content.querySelector('.creature-card').click();await tick();}
