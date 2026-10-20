import { milestones } from './progress.js';
import { generatorConfig } from './data.js';
import { element, button } from './ui.js';

export const teacherGuideConfig = {
  title: 'Hilfe & Stundenverlauf',
  tabs: [
    {
      id: 'overview', label: 'Kurz erklärt', title: 'Das Bestiarium – Kurz erklärt',
      paragraphs: [
        'Die App begleitet eine Unterrichtseinheit zum genauen Beschreiben von Tieren und phantastischen Tierwesen in Klasse 5. Sie läuft am Laptop der Lehrkraft und wird am Smartboard gemeinsam betrachtet.',
        'Die Schülerinnen und Schüler arbeiten überwiegend analog: beobachten, zeichnen, Stichpunkte sammeln, Tierbeschreibungen planen, schreiben und überarbeiten. Die App liefert Motivation, Visualisierung, Rahmengeschichte und gemeinsame Beobachtungsszenen.',
        'Die Klasse entdeckt die Forschungsstation von Professor Elian Federhain, der von einer Expedition nicht zurückgekehrt ist. Sein Assistent Vidi begleitet sie. Durch genaue Beobachtungen und Beschreibungen wird Federhains Forschung rekonstruiert; neue Teile seiner Welt und Hinweise auf seine letzte Expedition werden sichtbar.'
      ],
      motto: 'Je genauer wir Tiere beobachten und beschreiben können, desto mehr von ihrer Welt können wir entdecken.',
      sections: [
        {
          title: 'So ist die App aufgebaut', cards: [
            ['Forschungsstation', 'Zentraler Ausgangspunkt mit unsichtbaren Klickflächen auf den gezeichneten Objekten. Die Station verändert sich mit dem Fortschritt. Das offene Buch führt zum Bestiarium, die Wandkarte zur Weltkarte und das Gerät rechts zum Generator, sobald er bereit ist.'],
            ['Bestiarium', 'Enthält nur bereits entdeckte Seiten. Neue Einträge erscheinen im Verlauf der Einheit. Über das Inhaltsverzeichnis und die seitlichen Pfeile wechseln Sie zwischen verfügbaren Seiten.'],
            ['Forschercodex', 'Ein Kapitel im Bestiarium sammelt die Regeln guter Tierbeschreibungen. Nach dem gemeinsamen Sichern der Kriterien wird es eingetragen.'],
            ['Weltkarte', 'Pflanzen-, Wald- und Vulkanregion werden durch Nebelauflösung sichtbar. Eine freigegebene Region führt zur passenden Expedition, wenn auch diese freigegeben ist.'],
            ['Expeditionen', 'Gemeinsame Beobachtungsszenen am Smartboard. Die Kinder lösen dort keine digitalen Aufgaben, sondern halten Beobachtungen auf Papier fest und beschreiben Tiere anschließend analog.'],
            ['Tierwesen-Generator', 'Mischt zufällige Eigenschaften als Anregung für eigene Wesen. Aus dem Ergebnis entwickeln die Kinder Zeichnungen und Beschreibungen auf Papier.'],
            ['Klassen-Bestiarium', 'Zweiter Band für spätere eigene Entdeckungen. Derzeit ist eine vorbereitete Buchansicht vorhanden; eine Verwaltung oder ein Upload eigener Schülerseiten ist noch nicht eingebaut. Schülerkonten sind nicht nötig.']
          ]
        },
        {
          title: 'So steuern Sie die App', items: [
            'Nur die Lehrkraft bedient die App; die Schülerinnen und Schüler klicken nicht selbst.',
            'Ein normaler Klick oder Tap auf „Bestiarium“ oben links öffnet den Lehrkraftmodus. Das offene Buch im Raum öffnet dagegen das Bestiarium.',
            'Für den normalen Fortschritt nutzen Sie die Vidi-Aktion im passenden Bereich. Vidi fragt nach; erst Ihre bewusste Bestätigung schließt den Unterrichtsschritt ab. „Noch weiterforschen“ oder ESC bricht die Bestätigung ohne Abschluss ab.',
            'Es erscheint höchstens eine aktuell passende Hauptaktion: Buchschritte im Bestiarium, „Forschung bestätigen“ und „Generator aktivieren“ in der Station. Vorherige notwendige Schritte müssen abgeschlossen sein.',
            'Der Lehrkraftmodus bleibt für Tests, Überspringen, Zurücksetzen, manuelle Korrekturen und spontane Unterrichtsanpassungen. Unter „Unterrichtsfortschritt“ stehen alle Meilensteine; „Manuelle Steuerung“ enthält Raumphase, Buchseiten, Regionen, Expeditionen und Funktionen.'
          ]
        },
        {
          title: 'Fortschritt: Sie entscheiden', paragraphs: [
            'Zentrale Meilensteine steuern den Fortschritt. Die App erkennt oder bewertet keine Schülerleistung automatisch. Sie entscheiden anhand der analogen Arbeit, wann ein Schritt abgeschlossen ist.',
            'Ein Abschluss kann Bestiariumsseiten, Kartenregionen, Expeditionen oder den Generator verfügbar machen, die Station verändern und neue Vidi-Hinweise auslösen. Vidi-Aktionen und Lehrkraftmodus verwenden dieselbe Fortschrittsfunktion.',
            'Bei einer neuen Klasse ist die Entdeckung der Station (M0) als Ausgangspunkt vorbereitet. Das Intro und Vidis Einführung in das leere Buch schließen den Niffler-Schritt noch nicht ab.'
          ]
        },
        {
          title: 'Vollbild am Smartboard', items: [
            'Nutzen Sie das Symbol mit den vier Ecken oben rechts in der Station. Es startet nach Ihrem Klick den Browser-Vollbildmodus und blendet Browserleisten und Betriebssystemoberfläche möglichst aus.',
            'Über dasselbe Symbol oder ESC verlassen Sie Vollbild. Wenn der Browser Vollbild nicht unterstützt, bleibt die App normal bedienbar; das Symbol wird ausgeblendet.',
            'Verbinden Sie den Laptop per HDMI mit dem Smartboard und verwenden Sie nach Bedarf Spiegelung oder einen zweiten Bildschirm. Testen Sie die Darstellung vor dem Unterricht.'
          ]
        },
        {
          title: 'Gut zu wissen: reale und phantastische Tiere', paragraphs: [
            'Die Einheit verbindet bewusst reale Tiere wie Wolf und Wildschwein mit phantastischen Tierwesen. Auch in dieser magischen Welt gibt es normale Tiere. Für beide gelten dieselben Grundprinzipien des genauen Beschreibens.',
            'Bei selbst erfundenen Wesen sollen fantastische Merkmale einer nachvollziehbaren Logik folgen. Begrenzen Sie Spezialfähigkeiten, halten Sie Größen und Gewichte plausibel und nutzen Sie bekannte Tiere, Pflanzen oder Gegenstände als Orientierung.'
          ]
        },
        {
          title: 'Was die App bewusst nicht macht', items: [
            'Sie bewertet keine Texte, vergibt keine Punkte oder Noten und bietet keine automatische KI-Korrektur oder Lernstandsdiagnose.',
            'Sie ersetzt weder Schreibaufgaben und analoge Arbeitsblätter noch Schreibkonferenzen.',
            'Es gibt keine Schülerkonten und keine Erfassung von Schülernamen. Schülergeräte werden nicht benötigt; nur eine Klassenbezeichnung ist erforderlich.'
          ]
        },
        {
          title: 'Speicherung und Zusammenarbeit', paragraphs: [
            'Jede Klasse hat einen unabhängigen Stand. Er wird im Browser auf diesem Gerät gespeichert (localStorage). Nach dem Schließen und erneuten Öffnen bleibt er erhalten, solange der Browser-Speicher nicht gelöscht wird. Private Browserfenster können den Stand beim Schließen verlieren.',
            'Die Klassenstände werden nicht automatisch zwischen Lehrkräften, Geräten oder Browserprofilen synchronisiert. Nutzen Sie im Lehrkraftmodus unter „Daten“ den JSON-Export und JSON-Import für Sicherungen oder einen Laptopwechsel.',
            'Der Export enthält alle Klassen einschließlich der aktiven Klasse. Ein bestätigter Import ersetzt den vollständigen vorhandenen App-Stand; er führt Klassenstände nicht zusammen. Sichern Sie den Zielstand vorher und stimmen Sie ab, welche Sicherung aktuell ist.'
          ]
        },
        {
          title: 'Vorbereitung vor der ersten Stunde', checklist: [
            'App am vorgesehenen Laptop öffnen und Smartboard / HDMI testen.',
            'Vollbild einmal starten und verlassen.',
            'Über „Bestiarium“ oben links den Lehrkraftmodus öffnen; unter „Klasse“ die passende Klasse anlegen oder auswählen.',
            'Intro und bei Bedarf Rücksetzen in einer eigenen Testklasse ausprobieren.',
            'Arbeitsblätter, Hefte, Zeichenmaterial und Schreibaufträge bereitlegen.',
            'Bei Bedarf unter „Daten“ einen JSON-Export des Ausgangsstandes sichern.'
          ]
        }
      ]
    },
    {
      id: 'quick', label: 'Spickzettel', title: 'Spickzettel fürs Lehrerpult',
      paragraphs: ['Die wichtigsten Handgriffe für den Unterricht – die Schreibarbeit bleibt auf Papier.'],
      cards: [
        ['Start', 'App öffnen → „Bestiarium“ oben links → Klasse → „Aktive Klasse“ auswählen → zur Station zurück → Vollbildsymbol. Neue Klassen beginnen mit dem Intro.'],
        ['Fortschritt', 'Nach dem Unterrichtsschritt die passende Vidi-Aktion nutzen und bestätigen. Alternativ: Lehrkraftmodus → Unterrichtsfortschritt. Die App bewertet nichts automatisch.'],
        ['Bestiarium', 'Offenes Buch auf dem Tisch anklicken. Nur entdeckte Einträge sind sichtbar. Seitliche Pfeile blättern; „Inhaltsverzeichnis“ führt zur Übersicht.'],
        ['Weltkarte', 'Wandkarte anklicken. Nebel bedeutet: noch nicht entdeckt. Freigegebene Region anklicken → Expedition, sofern diese ebenfalls freigegeben ist.'],
        ['Expedition', 'Szene gemeinsam betrachten, Beobachtungen sammeln und anschließend auf Arbeitsblatt oder im Heft weiterarbeiten.'],
        ['Generator · ab M6', 'In der Station über Vidi aktivieren. Am Gerät „Tierwesen erzeugen“ wählen; einzelne Eigenschaften lassen sich mit „neu“ mischen. „Freie Wahl – wählt zwei!“ bedeutet: Die Klasse entscheidet selbst.'],
        ['Lehrkraftmodus', 'Klick / Tap auf „Bestiarium“ oben links. Für Tests, Überspringen, Rücksetzen und Korrekturen. „Manuelle Steuerung“ für gezielte Freigaben.'],
        ['Speicherung', 'Pro Klasse lokal in diesem Browser. Unter „Daten“ JSON exportieren / importieren. Keine automatische Synchronisierung; ein Import ersetzt alle vorhandenen Klassenstände.']
      ]
    },
    {
      id: 'sequence', label: 'Stundenverlauf', title: 'Möglicher Unterrichtsverlauf',
      paragraphs: ['Die Bausteine bilden eine längere Einheit, keine feste Zahl von Unterrichtsstunden. Planen Sie Dauer und Wiederholungen nach Lerngruppe. Ein Baustein kann mehrere Stunden umfassen.'],
      blocks: [
        { title: 'Einstieg – Forschungsstation & Niffler', focus: 'Erste Begegnung mit Tierbeschreibung; genau beobachten.', analog: 'Niffler gemeinsam betrachten, Merkmale und Stichpunkte sammeln, erste Beschreibung planen und schreiben.', app: 'Intro, Station und Vidi kennenlernen; leeres Bestiarium öffnen. Nach der analogen Arbeit „Niffler ins Bestiarium eintragen“ bestätigen.', milestones: ['station-found', 'niffler-researched'] },
        { title: 'Pandanaflora – genau beschreiben und zeichnen', focus: 'Genaue Informationen entnehmen, Körpermerkmale und treffende Adjektive nutzen.', analog: 'Nach einer Beschreibung zeichnen, Ergebnisse vergleichen und eine präzise eigene Beschreibung verfassen.', app: 'Pandanaflora dokumentieren; die Buchseite erscheint. Anschließend werden Pflanzenregion und eine neue Federhain-Spur sichtbar.', milestones: ['pandanaflora-researched'] },
        { title: 'Regeln guter Tierbeschreibung sichern', focus: 'Ein gemeinsames Merkblatt als Forschercodex entwickeln.', analog: 'Sichern: passende Überschrift; Tierart / Name und Besonderheit; Größe, gegebenenfalls Gewicht; Körperteile, Farben und Formen; sinnvolle Reihenfolge; Verhalten, Lebensraum, Ernährung und gegebenenfalls Lebenserwartung. Treffende Adjektive, sachliche Sprache und Präsens verwenden. Andere sollen sich das Tier genau vorstellen können.', app: 'Im Bestiarium über Vidi „Forschungsregeln eintragen“. Der Forschercodex wird als Kapitel verfügbar.', milestones: ['research-codex-complete'] },
        { title: 'Tierbeschreibung überarbeiten', focus: 'Eine schwächere Beschreibung gezielt verbessern.', analog: 'Zum Beispiel die Beschreibung eines Wildschwein-Frischlings anhand des Merkblatts prüfen, ungenaue Stellen besprechen und überarbeiten.', app: 'Station und Bestiarium als Rahmen nutzen. Für diese Übung ist keine neue Buchseite erforderlich.', milestones: [], note: 'Übung zwischen M3 und M4; kein eigener Meilenstein.' },
        { title: 'Reales Tier planen und beschreiben – Wolf', focus: 'Steckbrief auswerten, Schreibplan erstellen und eine Beschreibung verfassen.', analog: 'Treffende Adjektive, abwechslungsreiche Verben, Präsens und eine sinnvolle Reihenfolge üben.', app: 'Wolf dokumentieren. Wolfseite, Waldregion, Waldexpedition und Federhain-Spur werden verfügbar.', milestones: ['wolf-documented'] },
        { title: 'Überarbeiten / Schreibkonferenz', focus: 'Texte gemeinsam prüfen und verbessern.', analog: 'Rückmeldungen mit den vereinbarten Kriterien geben; eigene Texte überarbeiten.', app: 'Zur Station zurückkehren. Vidi erinnert daran, dass gute Forschung überprüft wird; „Forschung bestätigen“ bewusst abschließen.', milestones: ['research-verified'] },
        { title: 'Eigene Tierwesen entwickeln', focus: 'Kreative Kombinationen mit plausiblen fantastischen Merkmalen verbinden.', analog: 'Aus den Eigenschaften ein eigenes Wesen zeichnen, Merkmale ordnen und eine Beschreibung planen.', app: `In der Station „Generator aktivieren“, dann das Gerät öffnen. Kategorien: ${generatorConfig.categories.map(category => category.name).join(', ')}. Die Klasse gestaltet das Ergebnis auf Papier weiter.`, milestones: ['generator-activated'] },
        { title: 'Übungsbeschreibung – Wespuin', focus: 'Ein Fantasiewesen selbstständig beschreiben.', analog: 'Beobachtungen ordnen und eine zusammenhängende Beschreibung schreiben; anschließend anhand der Kriterien prüfen.', app: 'Nach der Übungsarbeit den Wespuin im Bestiarium dokumentieren.', milestones: ['wespuin-documented'] },
        { title: 'Weitere Übung – Zuckerdornechse', focus: 'Genau und anschaulich beschreiben.', analog: 'Eine weitere Übungsbeschreibung verfassen und überarbeiten.', app: 'Zuckerdornechse dokumentieren. Vulkanregion, Vulkanexpedition und die jüngste Federhain-Spur werden sichtbar.', milestones: ['zuckerdornechse-documented'] },
        { title: 'Abschluss – eigene Tierwesen', focus: 'Eigene Wesen entwickeln, beschreiben und gestalten.', analog: 'Zeichnungen und fertige Beschreibungen sammeln, präsentieren und besprechen.', app: '„Klassen-Bestiarium öffnen“: Der zweite Band wird verfügbar. Eigene Schülerseiten werden derzeit weiterhin analog gesammelt; es gibt kein Uploadsystem.', milestones: ['class-discoveries'] }
      ]
    },
    {
      id: 'problems', label: 'Wenn etwas hakt', title: 'Wenn etwas hakt',
      paragraphs: ['Prüfen Sie zuerst die aktive Klasse. Fortschritt und manuelle Freigaben können im Lehrkraftmodus unabhängig kontrolliert werden.'],
      problems: [
        ['Eine neue Seite erscheint nicht', 'Unter „Unterrichtsfortschritt“ den passenden Schritt prüfen. Bei Bedarf unter „Manuelle Steuerung → Bestiarium“ gezielt freigeben.'],
        ['Die nächste Vidi-Aktion fehlt', 'Prüfen, ob die vorherigen Schritte abgeschlossen sind und der aktuelle noch offen ist. Buchschritte erscheinen im Bestiarium, Überarbeiten und Generatoraktivierung in der Station.'],
        ['Vidi erscheint nicht', 'Bereits bestätigte Hinweise werden normalerweise nicht wiederholt. Unter „Federhains Spur → Storyhinweis erneut zeigen“ lässt sich der aktuelle Forschungshinweis wiederholen. Das Intro liegt unter „Manuelle Steuerung → Raum → Intro erneut anzeigen“; der Generator hat einen eigenen Vidi-Hilfezugang.'],
        ['Eine Region bleibt im Nebel', 'Passenden Meilenstein prüfen; unter „Manuelle Steuerung → Weltkarte“ die Region kontrollieren.'],
        ['Expedition lässt sich nicht öffnen', 'Sowohl die Region als auch die zugehörige Expedition müssen unter „Manuelle Steuerung“ freigegeben sein.'],
        ['Generator reagiert nicht', 'Er wird erst mit M6 aktiviert. In der Station die passende Vidi-Aktion nutzen oder im Lehrkraftmodus den Unterrichtsfortschritt beziehungsweise die Funktion kontrollieren. Während des Mischens sind die Tasten kurz nicht bedienbar.'],
        ['Vollbild beendet sich', 'In der Station erneut über das Vollbildsymbol starten. ESC beendet Vollbild absichtlich.'],
        ['Bild / Asset fehlt', 'Buchseiten und optionale Rahmengrafiken besitzen Ersatzdarstellungen. Bei einer fehlenden Raumgrafik oder dauerhaft fehlenden Bildern die Seite neu laden und prüfen, ob die aktuelle App-Version mit ihren Dateien vollständig geladen wird.'],
        ['Falscher Fortschritt wurde ausgelöst', 'Unter „Unterrichtsfortschritt“ den betroffenen Meilenstein zurücksetzen. Seine Freigaben werden zurückgenommen; die Raumphase bleibt bestehen und kann unter „Manuelle Steuerung → Raum“ korrigiert werden. Spätere Meilensteine werden nicht automatisch zurückgesetzt.'],
        ['Andere Klasse zeigt falschen Stand', 'Über „Bestiarium“ oben links → „Klasse → Aktive Klasse“ die richtige Klasse auswählen. Jede Klasse hat ihren eigenen Stand.'],
        ['Browser wurde geschlossen', 'Die App im selben Browserprofil wieder öffnen. Der Stand bleibt lokal erhalten, sofern der Browser-Speicher nicht gelöscht wurde. Bei Verlust eine vorhandene JSON-Sicherung importieren.'],
        ['App soll auf einem anderen Laptop genutzt werden', 'Auf dem bisherigen Gerät unter „Daten → JSON exportieren“ sichern. Die Datei auf dem Zielgerät über „JSON importieren“ laden. Achtung: Nach Bestätigung werden dort alle vorhandenen Klassenstände ersetzt.'],
        ['Mehrere Lehrkräfte arbeiten mit derselben Klasse', 'Stände werden nicht automatisch abgeglichen. Die aktuelle JSON-Sicherung gezielt übergeben und vor einem Import den bisherigen Zielstand exportieren. Ein Import führt keine Änderungen zusammen.']
      ]
    }
  ]
};

export function initTeacherGuide(teacherDialog) {
  const guide = element('dialog', '', 'teacher-guide');
  guide.setAttribute('aria-labelledby', 'guide-title');
  const heading = element('header', '', 'guide-heading');
  const title = element('h2', teacherGuideConfig.title);
  title.id = 'guide-title';
  heading.append(title, button('Zurück zum Lehrkraftmodus', () => guide.close()));
  const tabs = element('nav', '', 'guide-tabs');
  tabs.setAttribute('role', 'tablist');
  tabs.setAttribute('aria-label', 'Bereiche der Lehrkrafthilfe');
  const panel = element('div', '', 'guide-panel');
  panel.id = 'guide-panel';
  panel.tabIndex = 0;
  panel.setAttribute('role', 'tabpanel');
  const tabButtons = [];
  function prose(parent, data) {
    data.paragraphs?.forEach(text => parent.append(element('p', text)));
    const items = data.items || data.checklist;
    if (items) {
      const list = element('ul', '', data.checklist ? 'guide-checklist' : '');
      items.forEach(text => list.append(element('li', text)));
      parent.append(list);
    }
    if (data.cards) {
      const grid = element('div', '', 'guide-cards');
      data.cards.forEach(([label, text]) => {
        const card = element('article');
        card.append(element('h4', label), element('p', text));
        grid.append(card);
      });
      parent.append(grid);
    }
  }
  function select(index) {
    const data = teacherGuideConfig.tabs[index];
    tabButtons.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(index === i));
      tab.tabIndex = index === i ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tabButtons[index].id);
    panel.replaceChildren(element('h3', data.title));
    prose(panel, data);
    if (data.motto) panel.append(element('blockquote', data.motto));
    data.sections?.forEach(section => {
      const node = element('section', '', 'guide-section');
      node.append(element('h3', section.title));
      prose(node, section);
      panel.append(node);
    });
    data.blocks?.forEach((block, i) => {
      const node = element('section', '', 'guide-block');
      node.append(element('h4', `${i + 1}. ${block.title}`));
      const details = element('dl');
      const milestoneNames = block.milestones.map(id => {
        const index = milestones.findIndex(milestone => milestone.id === id);
        return `M${index} · ${milestones[index].title}`;
      }).join(' / ') || block.note;
      for (const [label, text] of [['Schwerpunkt', block.focus], ['Analoge Arbeit', block.analog], ['Einsatz der App', block.app], ['Meilenstein', milestoneNames]]) {
        details.append(element('dt', label), element('dd', text));
      }
      node.append(details);
      panel.append(node);
    });
    if (data.problems) {
      const table = element('table', '', 'guide-problems');
      const head = element('thead');
      const row = element('tr');
      ['Problem', 'Lösung'].forEach(label => { const cell = element('th', label); cell.scope = 'col'; row.append(cell); });
      head.append(row);
      const body = element('tbody');
      data.problems.forEach(([problem, solution]) => {
        const row = element('tr');
        const label = element('th', problem);
        label.scope = 'row';
        row.append(label, element('td', solution));
        body.append(row);
      });
      table.append(head, body);
      panel.append(table);
    }
    panel.scrollTop = 0;
  }
  teacherGuideConfig.tabs.forEach((tab, index) => {
    const control = button(tab.label, () => select(index));
    control.id = `guide-tab-${tab.id}`;
    control.setAttribute('role', 'tab');
    control.setAttribute('aria-controls', panel.id);
    control.addEventListener('keydown', event => {
      const count = teacherGuideConfig.tabs.length;
      const keys = { ArrowRight: (index + 1) % count, ArrowLeft: (index + count - 1) % count, Home: 0, End: count - 1 };
      if (!(event.key in keys)) return;
      event.preventDefault();
      select(keys[event.key]);
      tabButtons[keys[event.key]].focus();
    });
    tabButtons.push(control);
    tabs.append(control);
  });
  guide.append(heading, tabs, panel);
  document.body.append(guide);
  return () => {
    if (!teacherDialog.open || guide.open) return;
    select(0);
    guide.showModal();
    tabButtons[0].focus();
  };
}
