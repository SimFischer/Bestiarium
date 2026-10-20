import { regions, expeditions, generatorConfig } from './data.js';
import { milestones, vidiDialogs, nextPresentationMilestone } from './progress.js';
import { activeClass, markVidiDialogSeen, setMilestone } from './state.js';
import { element, button } from './ui.js';

export function initVidiDialogs(getRoute, revealRegion, finishReveal, finishPresentation) {
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
  let confirming;
  let completion;
  function acknowledge() {
    if (confirming) {
      confirming = null;
      dialog.close();
      return;
    }
    const completed = completion?.classId === activeClass().id && completion.milestone.vidiDialog === presenting?.id ? completion.milestone : null;
    if (presenting && activeClass().id === presenting.classId) markVidiDialogSeen(presenting.id);
    finishReveal();
    dialog.close();
    if (completed) { completion = null; finishPresentation(completed); }
  }
  const accept = button('Weiterforschen', () => {
    if (!confirming) { acknowledge(); return; }
    const classroom = activeClass();
    const milestone = nextPresentationMilestone(classroom);
    if (classroom.id !== confirming.classId || milestone?.id !== confirming.milestoneId) {
      confirming = null;
      dialog.close();
      return;
    }
    completion = { classId: classroom.id, milestone };
    confirming = null;
    setMilestone(milestone.id, true);
    dialog.close();
  });
  const defer = button('Noch weiterforschen', acknowledge);
  const actions = element('div', '', 'vidi-actions');
  actions.append(accept, defer);
  body.append(title, text, actions);
  dialog.append(image, body);
  document.body.append(dialog);
  function show(id, milestone = null) {
    const message = vidiDialogs.find(item => item.id === id);
    if (!message) return;
    presenting = { id, classId: activeClass().id };
    confirming = milestone ? { classId: presenting.classId, milestoneId: milestone.id } : null;
    accept.textContent = milestone?.presentationAction.completeLabel || message.buttonLabel || 'Weiterforschen';
    defer.hidden = !milestone;
    text.textContent = message.text;
    dialog.showModal();
  }
  function check() {
    if (dialog.open || document.querySelector('#teacher-dialog').open || !document.querySelector('#story-intro').hidden) return;
    const classroom = activeClass();
    if (completion && (completion.classId !== classroom.id || !classroom.completedMilestones.includes(completion.milestone.id))) completion = null;
    if (replayId) { const id = replayId; replayId = null; show(id); return; }
    const unseen = id => id && (!classroom.seenVidiDialogs.includes(id) || completion?.milestone.vidiDialog === id);
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
    if (route.view === 'bestiary' && !classroom.unlockedBestiaryEntries.length && unseen('bestiary-introduction')) {
      show('bestiary-introduction');
      return;
    }
    if (route.view === 'generator' && classroom.unlockedFeatures.includes('generator') && unseen(generatorConfig.vidiDialog)) {
      show(generatorConfig.vidiDialog);
      return;
    }
    const expedition = route.view === 'expedition' && expeditions.find(item => item.id === route.id && classroom.unlockedExpeditions.includes(item.id) && classroom.unlockedRegions.includes(item.regionId));
    if (expedition && unseen(expedition.vidiDialog)) show(expedition.vidiDialog);
  }
  dialog.addEventListener('cancel', event => { event.preventDefault(); acknowledge(); });
  dialog.addEventListener('close', check);
  document.querySelector('#teacher-dialog').addEventListener('close', check);
  function renderAction(host, location) {
    const milestone = nextPresentationMilestone(activeClass());
    if (milestone?.presentationAction.location !== location) return false;
    const action = button('', () => {
      const current = nextPresentationMilestone(activeClass());
      if (current?.id === milestone.id && getRoute().view === location) show(current.presentationAction.dialog, current);
    }, 'presentation-action');
    action.append(element('span', 'Vidi', 'vidi-seal'), element('span', milestone.presentationAction.label));
    host.append(action);
    return true;
  }
  return { check, renderAction, replay: id => { replayId = id; check(); } };
}
