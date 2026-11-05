import { renderCollection } from '../js/collection.js';
import { writeCollection, readCollection, collectionFile } from '../js/collection-store.js';
import { paginateText } from '../js/text-pages.js';
import { initPresentation, setPresentation, isPresentation } from '../js/presentation.js';
if (!['localhost','127.0.0.1','[::1]'].includes(location.hostname)) throw new Error('Nur lokale Entwicklung');
const id = 'presentation-development-fixtures';
const original = ('Dieses ENTWICKLUNGSBEISPIEL hat einen langen, geschuppten Rücken und drei große Flügel. An seinen Füßen sitzen fünf gebogene Krallen.\n\n').repeat(45) + 'ENDE DES ORIGINALTEXTES. 🦉';
const makeImage = (width,height,type) => {
  const canvas=document.createElement('canvas'); canvas.width=width;canvas.height=height; const c=canvas.getContext('2d');
  const gradient=c.createLinearGradient(0,0,width,height);gradient.addColorStop(0,'#1e645e');gradient.addColorStop(1,'#daa354');c.fillStyle=gradient;c.fillRect(0,0,width,height);
  c.strokeStyle='#fff4d1';c.lineWidth=10;c.strokeRect(12,12,width-24,height-24);c.fillStyle='#fff4d1';c.font=`${width/14}px Georgia`;c.textAlign='center';c.fillText('ENTWICKLUNGSBEISPIEL',width/2,height/2);return canvas.toDataURL(type);
};
const entries = [['Querformat · PNG',1600,900,'image/png'],['Hochformat · JPG',700,1200,'image/jpeg'],['Quadratisch · WebP',1000,1000,'image/webp']].map(([name,w,h,type],i)=>({id:`development-${i}`,name:`ENTWICKLUNGSBEISPIEL ${i+1} · ${name}`,researcher:'Test',visible:true,first:{description:original,image:makeImage(w,h,type),note:'Notiz nur bei Bedarf.',phase:'Erste Idee'},revised:{description:'Überarbeitet.\n\nDiese zweite Fassung bleibt getrennt erhalten.',image:null,note:'',phase:'Überarbeitet'}}));
await writeCollection(id,entries);
const content=document.querySelector('#view-content'), dialog=document.querySelector('dialog');
initPresentation();
dialog.showModal();await renderCollection(content,id);
document.querySelector('#leave-book').onclick=()=>dialog.close();
document.querySelector('#open-test-book').onclick=()=>dialog.showModal();
document.querySelector('#download-examples').onclick=()=>{
  const link=document.createElement('a');const url=URL.createObjectURL(new Blob([collectionFile(entries)],{type:'application/json'}));link.href=url;link.download='ENTWICKLUNGSBEISPIELE-praesentation.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
const click=label=>{const b=[...content.querySelectorAll('button')].find(b=>b.textContent===label);if(!b)throw new Error(`Fehlt: ${label}`);b.click();};
const tick=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
const assert=(condition,message)=>{if(!condition)throw new Error(message);};
const result=document.querySelector('#test-result');
document.querySelector('#run-tests').onclick=async()=>{
  let count=0;result.textContent='Prüfung läuft';
  try {
    if(!dialog.open)dialog.showModal(); await renderCollection(content,id);
    content.querySelector('.creature-card').click(); await tick();
    const measure=()=>{
      const spread=content.querySelector('.creature-spread'), paragraph=content.querySelector('.creature-description'), footer=content.querySelector('.creature-reader-footer');
      assert(spread.getBoundingClientRect().width>innerWidth*.93,'Buch nutzt die Breite nicht');
      assert(footer.getBoundingClientRect().bottom<=innerHeight,'Bedienleiste außerhalb des Bildschirms');
      if(paragraph){assert(paragraph.clientHeight>=60,'Keine Textfläche');assert(paragraph.scrollHeight<=paragraph.clientHeight+1,'Textseite wird abgeschnitten');}
    };
    const verifyText=()=>{
      const p=content.querySelector('.creature-description'); const slices=paginateText(original,p);assert(slices.map(x=>x.text).join('')===original,'Originaltext verändert');
      for(const part of slices){p.textContent=part.text;assert(p.scrollHeight<=p.clientHeight+1,'Abschnitt passt nicht');}
      return slices.length;
    };
    measure();assert(verifyText()>1,'Langer Text nicht aufgeteilt');count++;
    click('Nur Text');await tick();measure();assert(content.querySelectorAll('.creature-leaf').length===1,'Leere Hälfte');const bothPages=verifyText();count++;
    const settings=content.querySelector('details');settings.open=true;await tick();
    for(let i=0;i<3;i++){click('A+ Schrift größer');await tick();}
    measure();assert(getComputedStyle(content.querySelector('.creature-description')).fontSize==='48px','Schrift nicht vergrößert');assert(verifyText()>=bothPages,'Keine neuen Textseiten');count++;
    content.querySelector('details').open=false;await tick();
    const before=content.querySelector('.text-page-label').textContent;
    content.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));await tick();assert(content.querySelector('.text-page-label').textContent!==before,'Pfeiltaste blättert nicht');
    const input=document.createElement('textarea');content.append(input);input.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}));await tick();assert(content.querySelector('.text-page-label').textContent!==before,'Tastenkürzel im Eingabefeld');input.remove();count++;
    click('Forschungsfrage zeigen');await tick();measure();assert(content.querySelectorAll('.creature-question').length===1,'Mehr als eine Frage');click('Nächste Frage');await tick();measure();count++;
    const pageBefore=content.querySelector('.text-page-label').textContent;
    setPresentation(true);await tick();assert(isPresentation(),'Präsentationsmodus fehlt');measure();
    const combinedBefore=content.querySelector('.reader-combined-label').textContent;
    content.querySelector('[data-reader-forward]').click();await tick();assert(content.querySelector('.reader-combined-label').textContent!==combinedBefore,'Präsentationsblättern funktioniert nicht');
    content.querySelector('[data-reader-back]').click();await tick();
    setPresentation(false);await tick();assert(!isPresentation(),'Präsentation nicht beendet');
    assert(content.querySelector('[aria-pressed="true"]').textContent==='Nur Text','Ansicht beim Moduswechsel verloren');count++;
    click('Nur Bild');await tick();measure();assert(!content.querySelector('.creature-words'),'Leere Textseite');
    for(let i=0;i<3;i++){
      const image=content.querySelector('img');await image.decode();assert(getComputedStyle(image).objectFit==='contain','Bild wird beschnitten');
      assert(image.getBoundingClientRect().width>innerWidth*.85,'Bildfläche zu schmal'); if(i<2){click('Wesen ›');await tick();}
    }count++;
    assert(JSON.stringify(await readCollection(id))===JSON.stringify(entries),'Gespeicherte Daten verändert');count++;
    result.textContent=`${count} Präsentationstests bestanden bei ${innerWidth} × ${innerHeight}.`;document.title=`OK – ${count} Präsentationstests (${innerWidth} × ${innerHeight})`;
    dialog.close();
  }catch(error){result.textContent=`FEHLER nach ${count} Tests: ${error.message}`;document.title='FEHLER – Präsentation';dialog.close();}
};
