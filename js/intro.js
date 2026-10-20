import { activeClass, updateClass } from './state.js';

const steps = [
  {
    title: 'Eine vergessene Forschungsstation',
    paragraphs: [
      'Am Rand der bekannten Tierwesenwelt wurde eine alte Forschungsstation entdeckt.',
      'Seit langer Zeit scheint hier niemand mehr gearbeitet zu haben.',
      'Doch im Inneren befinden sich noch Bücher, Karten und Spuren früherer Expeditionen.'
    ],
    button: 'Station untersuchen'
  },
  {
    title: 'Vidi',
    paragraphs: [
      'Oh! Besucher? Damit hatte Vidi wirklich nicht mehr gerechnet.',
      'Diese Forschungsstation gehört Professor Elian Federhain. Vidi war viele Jahre sein Assistent.',
      'Aber der Professor ist nicht hier.'
    ],
    button: 'Wo ist Professor Federhain?'
  },
  {
    title: 'Die letzte Expedition',
    paragraphs: [
      'Professor Federhain hatte eine ungewöhnliche Spur entdeckt.',
      'Er glaubte, sie könnte ihn zu einem Tierwesen führen, nach dem er schon lange gesucht hatte.',
      'Also brach er zu einer Expedition auf. Er versprach zurückzukehren.',
      'Aber seitdem hat Vidi nichts mehr von ihm gehört.'
    ],
    button: 'Gibt es keine Hinweise?'
  },
  {
    title: 'Die unvollständige Forschung',
    paragraphs: [
      'Doch. Einige.',
      'Professor Federhains letzte Aufzeichnungen befinden sich noch hier.',
      'Aber vieles ist unvollständig. Seiten des Bestiariums sind beschädigt, Tierbeobachtungen fehlen und auf der Weltkarte sind ganze Gebiete noch unerforscht.',
      'Wenn wir seine Forschung vervollständigen, können wir vielleicht herausfinden, wohin seine letzte Expedition geführt hat.'
    ],
    button: 'Wie können wir helfen?'
  },
  {
    title: 'Der Forschungsauftrag',
    paragraphs: [
      'Wir müssen genau beobachten.',
      'Wir müssen Tierwesen so beschreiben, dass andere sie sich genau vorstellen können.',
      'Wir müssen alte Aufzeichnungen prüfen, Bestiariumsseiten vervollständigen und neue Regionen erforschen.'
    ],
    motto: 'Je genauer wir beobachten und beschreiben, desto mehr können wir entdecken.',
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
    document.querySelector('#story-vidi').hidden = step === 0;
    const caption = step === 0 ? 'Die Entdeckung' : step === 1 ? 'Hauself und Forschungsassistent' : 'Vidi erzählt';
    document.querySelector('#story-step').textContent = `${caption} · ${step + 1} / ${steps.length}`;
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
