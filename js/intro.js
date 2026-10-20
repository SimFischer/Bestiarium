import { activeClass, updateClass } from './state.js';

const steps = [
  {
    title: 'Eine Entdeckung',
    paragraphs: [
      'Auf einer Wanderung entdeckt ihr zwischen Bäumen und Bergen ein altes Haus.',
      'Es sieht aus, als hätte hier lange niemand mehr gearbeitet.',
      'Neugierig geht ihr näher heran.'
    ],
    button: 'Station untersuchen'
  },
  {
    title: 'Vidi',
    paragraphs: [
      'Oh! Besuch? Damit hat Vidi wirklich nicht mehr gerechnet!',
      'Diese Forschungsstation gehört Professor Elian Federhain.',
      'Vidi war lange sein Assistent.',
      'Aber der Professor ist nicht hier.'
    ],
    button: 'Wo ist Professor Federhain?'
  },
  {
    title: 'Die letzte Expedition',
    paragraphs: [
      'Der Professor ist vor langer Zeit zu einer Expedition aufgebrochen.',
      'Er folgte einer Spur, die ihn zu einem besonderen Tierwesen führen sollte.',
      'Er wollte bald zurückkommen.',
      'Aber seitdem hat Vidi nichts mehr von ihm gehört.'
    ],
    button: 'Gibt es Hinweise?'
  },
  {
    title: 'Die Hinweise',
    paragraphs: [
      'Ja. Einige.',
      'Seine Aufzeichnungen sind noch hier. Aber vieles ist unvollständig.',
      'Im Bestiarium fehlen Seiten, Tierbeschreibungen sind beschädigt und auf der Karte sind noch nicht alle Regionen erforscht.',
      'Wenn wir seine Forschung vervollständigen, finden wir vielleicht heraus, wohin er gegangen ist.'
    ],
    button: 'Wie können wir helfen?'
  },
  {
    title: 'Der Auftrag',
    paragraphs: [
      'Wir müssen Tierwesen genau beobachten.',
      'Wir müssen sie so beschreiben, dass andere sie sich gut vorstellen können.',
      'Wir müssen das Bestiarium vervollständigen und neue Regionen erforschen.'
    ],
    motto: 'Je genauer ihr beobachtet und beschreibt, desto mehr könnt ihr entdecken.',
    closing: 'Vielleicht finden wir so auch Professor Federhain.',
    button: 'Forschung beginnen'
  }
];

export function initIntro() {
  const intro = document.querySelector('#story-intro');
  const panel = document.querySelector('#story-panel');
  const title = document.querySelector('#story-title');
  const text = document.querySelector('#story-text');
  const next = document.querySelector('#story-next');
  const hotspots = document.querySelector('#hotspots');
  let step = 0;
  let presentingClassId;
  let lastClassId;
  let lastCompleted;

  function hide() {
    intro.hidden = true;
    hotspots.inert = false;
  }
  function renderStep(focus = true) {
    const data = steps[step];
    intro.classList.toggle('with-vidi', step > 0);
    intro.classList.toggle('vidi-arrives', step === 1);
    document.querySelector('#story-vidi').hidden = step === 0;
    document.querySelector('#story-step').textContent = step === 0 ? 'Euer Abenteuer beginnt' : 'Vidi';
    title.textContent = data.title;
    text.replaceChildren();
    const append = (tag, value) => {
      const node = document.createElement(tag);
      node.textContent = value;
      text.append(node);
    };
    data.paragraphs.forEach(paragraph => append('p', paragraph));
    if (data.motto) append('blockquote', data.motto);
    if (data.closing) append('p', data.closing);
    next.textContent = data.button;
    panel.getAnimations().forEach(animation => animation.cancel());
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      panel.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: 'ease-out' });
    }
    if (focus) title.focus({ preventScroll: true });
  }
  function start() {
    presentingClassId = activeClass().id;
    step = 0;
    intro.hidden = false;
    hotspots.inert = true;
    renderStep(!document.querySelector('dialog[open]'));
  }
  next.addEventListener('click', () => {
    if (activeClass().id !== presentingClassId) return;
    if (step < steps.length - 1) {
      step += 1;
      renderStep();
      return;
    }
    hide();
    if (!activeClass().introCompleted) updateClass(c => { c.introCompleted = true; });
    document.querySelector('#app-title').focus({ preventScroll: true });
  });
  function sync() {
    const classroom = activeClass();
    const changed = classroom.id !== lastClassId;
    const reset = lastCompleted === true && !classroom.introCompleted;
    lastClassId = classroom.id;
    lastCompleted = classroom.introCompleted;
    if (changed || reset) {
      if (classroom.introCompleted) hide();
      else start();
    }
  }
  return { start, sync };
}
