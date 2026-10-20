import { regions, expeditions } from './data.js';
import { milestones, vidiDialogs } from './progress.js';
import { activeClass, markVidiDialogSeen } from './state.js';
import { element, button } from './ui.js';

export function initVidiDialogs(getRoute, revealRegion, finishReveal) {
  const dialog = element('dialog', '', 'region-message-dialog vidi-dialog');
  dialog.setAttribute('aria-labelledby', 'vidi-dialog-title');
  const title = element('h2', 'Vidi');
  title.id = 'vidi-dialog-title';
  const image = element('img');
  image.src = 'assets/story/vidi-fullbody.png';
  image.alt = 'Vidi, Hauself und früherer Assistent von Professor Elian Federhain';
  const text = element('p');
  const body = element('div');
  let presenting;
  let replayId;
  let pendingRegion;
  let timer;
  function acknowledge() {
    if (presenting && activeClass().id === presenting.classId) markVidiDialogSeen(presenting.id);
    finishReveal();
    dialog.close();
  }
  body.append(title, text, button('Weiterforschen', acknowledge));
  dialog.append(image, body);
  document.body.append(dialog);
  function show(id) {
    const message = vidiDialogs.find(item => item.id === id);
    if (!message) return;
    presenting = { id, classId: activeClass().id };
    text.textContent = message.text;
    dialog.showModal();
  }
  function check() {
    if (dialog.open || document.querySelector('#teacher-dialog').open || !document.querySelector('#story-intro').hidden) return;
    const classroom = activeClass();
    if (replayId) { const id = replayId; replayId = null; show(id); return; }
    const unseen = id => id && !classroom.seenVidiDialogs.includes(id);
    const region = regions.find(item => item.vidiDialog && classroom.unlockedRegions.includes(item.id) && unseen(item.vidiDialog));
    if (region) {
      if (pendingRegion?.classId !== classroom.id || pendingRegion?.id !== region.id) {
        clearTimeout(timer);
        pendingRegion = { classId: classroom.id, id: region.id, ready: false };
        revealRegion(region.id);
        timer = setTimeout(() => { pendingRegion.ready = true; check(); }, 700);
        return;
      }
      if (!pendingRegion.ready) return;
      show(region.vidiDialog);
      return;
    }
    clearTimeout(timer);
    pendingRegion = null;
    finishReveal();
    const milestone = milestones.find(item => classroom.completedMilestones.includes(item.id) && unseen(item.vidiDialog) && !regions.some(region => region.vidiDialog === item.vidiDialog));
    if (milestone) { show(milestone.vidiDialog); return; }
    const route = getRoute();
    const expedition = route.view === 'expedition' && expeditions.find(item => item.id === route.id && classroom.unlockedExpeditions.includes(item.id) && classroom.unlockedRegions.includes(item.regionId));
    if (expedition && unseen(expedition.vidiDialog)) show(expedition.vidiDialog);
  }
  dialog.addEventListener('cancel', event => { event.preventDefault(); acknowledge(); });
  dialog.addEventListener('close', check);
  document.querySelector('#teacher-dialog').addEventListener('close', check);
  return { check, replay: id => { replayId = id; check(); } };
}
