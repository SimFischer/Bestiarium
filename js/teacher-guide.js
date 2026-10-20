import { milestones } from './progress.js';
import { generatorConfig } from './data.js';
import { element, button } from './ui.js';

export const teacherGuideConfig = {
  title: 'Hilfe & Stundenverlauf',
  tabs: [
    {
      id: 'overview', label: 'Kurz erklärt', title: 'Das Bestiarium – Kurz erklärt',
      paragraphs: [
        'Die App begleitet eine Unterrichtseinheit zum genauen Beschreiben von Tieren und phantastischen Tierwesen in Klasse 5. Du bedienst sie am Laptop und zeigst sie am Smartboard.',
        'Die Schülerinnen und Schüler arbeiten überwiegend analog: beobachten, zeichnen, Stichpunkte sammeln, Tierbeschreibungen planen, schreiben und überarbeiten. Die App liefert Motivation, Visualisierung, Rahmengeschichte und gemeinsame Beobachtungsszenen.',
        'Die Klasse entdeckt die Forschungsstation von Professor Elian Federhain, der von einer Expedition nicht zurückgekehrt ist. Sein Assistent Vidi begleitet sie. Durch genaue Beobachtungen und Beschreibungen wird Federhains Forschung rekonstruiert; neue Teile seiner Welt und Hinweise auf seine letzte Expedition werden sichtbar.'
      ],
      motto: 'Je genauer wir Tiere beobachten und beschreiben können, desto mehr von ihrer Welt können wir entdecken.',
      sections: [
        {
          title: 'So ist die App aufgebaut', cards: [
            ['Forschungsstation', 'Zentraler Ausgangspunkt mit unsichtbaren Klickflächen auf den gezeichneten Objekten. Die Station verändert sich mit dem Fortschritt. Das offene Buch führt zum Bestiarium, die Wandkarte zur Weltkarte und das Gerät rechts zum Generator, sobald er bereit ist.'],
            ['Bestiarium', 'Enthält nur bereits entdeckte Seiten. Neue Einträge erscheinen im Verlauf der Einheit. Über das Inhaltsverzeichnis und die seitlichen Pfeile wechselst du zwischen verfügbaren Seiten.'],
            ['Forschercodex', 'Ein Kapitel im Bestiarium sammelt die Regeln guter Tierbeschreibungen. Nach dem gemeinsamen Sichern der Kriterien wird es eingetragen.'],
            ['Weltkarte', 'Pflanzen-, Wald- und Vulkanregion werden durch Nebelauflösung sichtbar. Eine freigegebene Region führt zur passenden Expedition, wenn auch diese freigegeben ist.'],
            ['Expeditionen', 'Gemeinsame Beobachtungsszenen am Smartboard. Die Kinder lösen dort keine digitalen Aufgaben, sondern halten Beobachtungen auf Papier fest und beschreiben Tiere anschließend analog.'],
            ['Tierwesen-Generator', 'Mischt zufällige Eigenschaften als Anregung für eigene Wesen. Aus dem Ergebnis entwickeln die Kinder Zeichnungen und Beschreibungen auf Papier.'],
            ['Klassen-Bestiarium', 'Zweiter Band für spätere eigene Entdeckungen. Derzeit ist eine vorbereitete Buchansicht vorhanden; eine Verwaltung oder ein Upload eigener Schülerseiten ist noch nicht eingebaut. Schülerkonten sind nicht nötig.']
          ]
        },
        {
          title: 'So steuerst du die App', items: [
            'Nur die Lehrkraft bedient die App; die Schülerinnen und Schüler klicken nicht selbst.',
            'Ein normaler Klick oder Tap auf „Bestiarium“ oben links öffnet den Lehrkraftmodus. Das offene Buch im Raum öffnet dagegen das Bestiarium.',
            'Für den normalen Fortschritt nutzt du die Vidi-Aktion im passenden Bereich. Vidi fragt nach; erst deine bewusste Bestätigung schließt den Unterrichtsschritt ab. „Noch weiterforschen“ oder ESC bricht die Bestätigung ohne Abschluss ab.',
            'Es erscheint höchstens eine aktuell passende Hauptaktion: Buchschritte im Bestiarium, „Forschung bestätigen“ und „Generator aktivieren“ in der Station. Vorherige notwendige Schritte müssen abgeschlossen sein.',
            'Der Lehrkraftmodus bleibt für Tests, Überspringen, Zurücksetzen, manuelle Korrekturen und spontane Unterrichtsanpassungen. Unter „Unterrichtsfortschritt“ stehen alle Meilensteine; „Manuelle Steuerung“ enthält Raumphase, Buchseiten, Regionen, Expeditionen und Funktionen.'
          ]
        },
        {
          title: 'Fortschritt: Du entscheidest', paragraphs: [
            'Zentrale Meilensteine steuern den Fortschritt. Die App erkennt oder bewertet keine Schülerleistung automatisch. Du entscheidest anhand der analogen Arbeit, wann ein Schritt abgeschlossen ist.',
            'Ein Abschluss kann Bestiariumsseiten, Kartenregionen, Expeditionen oder den Generator verfügbar machen, die Station verändern und neue Vidi-Hinweise auslösen. Vidi-Aktionen und Lehrkraftmodus verwenden dieselbe Fortschrittsfunktion.',
            'Bei einer neuen Klasse ist die Entdeckung der Station (M0) als Ausgangspunkt vorbereitet. Das Intro und Vidis Einführung in das leere Buch schließen den Niffler-Schritt noch nicht ab.'
          ]
        },
        {
          title: 'Vollbild am Smartboard', items: [
            'Nutze das Symbol mit den vier Ecken oben rechts in der Station. Es startet nach deinem Klick den Browser-Vollbildmodus und blendet Browserleisten und Betriebssystemoberfläche möglichst aus.',
            'Über dasselbe Symbol oder ESC verlässt du Vollbild. Wenn der Browser Vollbild nicht unterstützt, bleibt die App normal bedienbar; das Symbol wird ausgeblendet.',
            'Verbinde den Laptop per HDMI mit dem Smartboard und verwende nach Bedarf Spiegelung oder einen zweiten Bildschirm. Teste die Darstellung vor dem Unterricht.'
          ]
        },
        {
          title: 'Gut zu wissen: reale und phantastische Tiere', paragraphs: [
            'Die Einheit verbindet bewusst reale Tiere wie Wolf und Wildschwein mit phantastischen Tierwesen. Auch in dieser magischen Welt gibt es normale Tiere. Für beide gelten dieselben Grundprinzipien des genauen Beschreibens.',
            'Bei selbst erfundenen Wesen sollen fantastische Merkmale einer nachvollziehbaren Logik folgen. Begrenze Spezialfähigkeiten, halte Größen und Gewichte plausibel und nutze bekannte Tiere, Pflanzen oder Gegenstände als Orientierung.'
          ]
        },
        {
          title: 'Was die App bewusst nicht macht', items: [
            'Die App bewertet keine Texte, vergibt keine Punkte oder Noten und bietet keine automatische KI-Korrektur oder Lernstandsdiagnose.',
            'Die App ersetzt weder Schreibaufgaben und analoge Arbeitsblätter noch Schreibkonferenzen.',
            'Es gibt keine Schülerkonten und keine Erfassung von Schülernamen. Schülergeräte werden nicht benötigt; nur eine Klassenbezeichnung ist erforderlich.'
          ]
        },
        {
          title: 'Speicherung und Zusammenarbeit', paragraphs: [
            'Jede Klasse hat einen unabhängigen Stand. Er wird im Browser auf diesem Gerät gespeichert (localStorage). Nach dem Schließen und erneuten Öffnen bleibt er erhalten, solange der Browser-Speicher nicht gelöscht wird. Private Browserfenster können den Stand beim Schließen verlieren.',
            'Die Klassenstände werden nicht automatisch zwischen Lehrkräften, Geräten oder Browserprofilen synchronisiert. Nutze im Lehrkraftmodus unter „Daten“ den JSON-Export und JSON-Import für Sicherungen oder einen Laptopwechsel.',
            'Der Export enthält alle Klassen einschließlich der aktiven Klasse. Ein bestätigter Import ersetzt den vollständigen vorhandenen App-Stand; er führt Klassenstände nicht zusammen. Sichere den Zielstand vorher und stimme mit deinen Kolleginnen und Kollegen ab, welche Sicherung aktuell ist.'
          ]
        },
        {
          title: 'Vorbereitung vor der ersten Stunde', checklist: [
            'Öffne die App am vorgesehenen Laptop und teste Smartboard / HDMI.',
            'Starte und verlasse Vollbild einmal.',
            'Öffne über „Bestiarium“ oben links den Lehrkraftmodus; lege unter „Klasse“ die passende Klasse an oder wähle sie aus.',
            'Probiere Intro und bei Bedarf Rücksetzen in einer eigenen Testklasse aus.',
            'Lege Arbeitsblätter, Hefte, Zeichenmaterial und Schreibaufträge bereit.',
            'Sichere bei Bedarf unter „Daten“ einen JSON-Export des Ausgangsstandes.'
          ]
        }
      ]
    },
    {
      id: 'quick', label: 'Spickzettel', title: 'Spickzettel fürs Lehrerpult',
      paragraphs: ['Die wichtigsten Handgriffe für den Unterricht – die Schreibarbeit bleibt auf Papier.'],
      cards: [
        ['Start', 'Öffne die App → „Bestiarium“ oben links → Klasse → „Aktive Klasse“ auswählen → zur Station zurück → Vollbildsymbol. Neue Klassen beginnen mit dem Intro.'],
        ['Fortschritt', 'Nutze nach dem Unterrichtsschritt die passende Vidi-Aktion und bestätige sie. Alternativ: Lehrkraftmodus → Unterrichtsfortschritt. Die App bewertet nichts automatisch.'],
        ['Bestiarium', 'Klicke das offene Buch auf dem Tisch an. Nur entdeckte Einträge sind sichtbar. Mit den seitlichen Pfeilen blätterst du; „Inhaltsverzeichnis“ führt zur Übersicht.'],
        ['Weltkarte', 'Klicke die Wandkarte an. Nebel bedeutet: noch nicht entdeckt. Wähle eine freigegebene Region → Expedition, sofern diese ebenfalls freigegeben ist.'],
        ['Expedition', 'Betrachtet die Szene gemeinsam und sammelt Beobachtungen. Arbeitet anschließend auf dem Arbeitsblatt oder im Heft weiter.'],
        ['Generator · ab M6', 'Aktiviere ihn in der Station über Vidi. Wähle am Gerät „Tierwesen erzeugen“; einzelne Eigenschaften lassen sich mit „neu“ mischen. „Freie Wahl – wählt zwei!“ bedeutet: Die Klasse entscheidet selbst.'],
        ['Lehrkraftmodus', 'Klick / Tap auf „Bestiarium“ oben links. Für Tests, Überspringen, Rücksetzen und Korrekturen. „Manuelle Steuerung“ für gezielte Freigaben.'],
        ['Speicherung', 'Pro Klasse lokal in diesem Browser. Unter „Daten“ JSON exportieren / importieren. Keine automatische Synchronisierung; ein Import ersetzt alle vorhandenen Klassenstände.']
      ]
    },
    {
      id: 'sequence', label: 'Stundenverlauf', title: 'Möglicher Unterrichtsverlauf',
      paragraphs: [
        'Nutze App, Begleitpräsentation und analoge Materialien parallel: Die App zeigt Forschungswelt, Story und Freischaltungen. Die Präsentation liefert weiterhin Impulse, Aufgaben und Sicherungen; Arbeitsblätter und Heftarbeit bleiben zentral.',
        'Materialgrundlage: „Phantastische Tierwesen (Os).zip“, darin „Tiere beschreiben (FO)“. Die S-Angaben stammen aus den Ordnernamen: S1–S5, S5/S6, S7/S8, S9/S10 und S11/S12. Die Überlappung bei S5 ist im Material vorhanden. Eine Zuordnung einzelner Aufgaben zu S1, S2 usw. ist nicht belegt.',
        'Alle Folienangaben beziehen sich auf die 28 PDF-Seiten von „Begleitpräsentation_Phantastische Tierwesen.pdf“; die PPTX-Fassung liegt ebenfalls bei. Richte Dauer und Wiederholungen nach deiner Lerngruppe aus. Die folgenden App-Abschlüsse folgen weiterhin M0–M9; sie sind keine erfundene zusätzliche Stundenplanung.',
        'Wichtig: Der frühe Präsentationsabschnitt enthält bereits eigene Wesen und das Würfeln. Für den App-Fortschritt greifst du diese Aufgaben später bei M6 und M9 wieder auf. Der Ordner S9/S10 enthält Pferd und Riesenschnecke, nicht den Wespuin.'
      ],
      blocks: [
        {
          title: 'S1–S5 · Einstieg mit dem Niffler', focus: 'Genau beobachten und Beobachtungen für eine Beschreibung festhalten.',
          material: '„AB_Phantastische Tierwesen beschreiben.docx.pdf“, Seite 1; „Begleitpräsentation_Phantastische Tierwesen.pdf“ im Ordner „S1-S5_Einstieg und Bestiarium“.',
          presentation: 'Folien 1–5: Einstieg, Beobachtungsauftrag zum Filmausschnitt und Niffler-Text. Folien 6–8 ergänzen Klabbert und erste Beschreibungskriterien; 9–14 liefern weitere Beobachtungsimpulse.',
          steps: 'Zeige den vorgesehenen Filmausschnitt mit dem Auftrag auf Folie 3. Die Kinder notieren Niffler-Merkmale auf AB-Seite 1 und bereiten eine Beschreibung vor. Vergleicht die Beobachtungen mit Folie 5 und sichert geeignete Informationen.',
          app: 'Zeige zuvor Intro und Station. Öffne das leere Buch: Vidi erklärt Federhains Bestiarium. Der Storyeinstieg allein schließt keine Niffler-Forschung ab.',
          finish: 'Bestätige erst nach der Bearbeitung „Niffler ins Bestiarium eintragen“ → „Eintrag übernehmen“. Die Niffler-Seite erscheint mit Schimmer.', milestones: ['station-found', 'niffler-researched']
        },
        {
          title: 'S1–S5 · Pandanaflora zeichnen und beschreiben', focus: 'Genaue Angaben verstehen und selbst präzise formulieren.',
          material: 'Begleitpräsentation, Folien 19–24; Zeichenpapier und Heft. Ein eigenes Pandanaflora-Arbeitsblatt ist im Paket nicht vorhanden.',
          presentation: 'Folie 19: Zeichenauftrag; 20: Beschreibung; 21: Zeichnungen vergleichen; 22: Bildauflösung; 23: umgekehrter Schreibauftrag; 24: Kriterien.',
          steps: 'Lass zuerst nach der Beschreibung auf Folie 20 zeichnen, ohne das Lösungsbild vorwegzunehmen. Vergleicht die Zeichnungen und zeige danach Folie 22. Anschließend beschreiben die Kinder das Wesen nach Folie 23 selbst; sinnvolle zusätzliche Merkmale sind dort erlaubt.',
          app: 'Nutze das Bestiarium als Rahmen. Nach der Dokumentation zeigt Vidi die Pflanzenregion und eine neue Federhain-Spur; die zugehörige Expedition wird verfügbar.',
          finish: 'Nach Zeichnung, Vergleich und eigener Beschreibung: „Pandanaflora dokumentieren“ bestätigen.', milestones: ['pandanaflora-researched']
        },
        {
          title: 'S1–S5 · Merkblatt und Forschercodex', focus: 'Aufbau und Sprache einer genauen Tierbeschreibung sichern.',
          material: '„Merkblatt_Phantastische Tierbeschreibungen.pdf“; Blattüberschrift: „Merkblatt: Phantastische Tierbeschreibung“. Ergänzend „Mit Adjektiven genau beschreiben.pdf“ und „AB_Adjektivkombinationen.pdf“ ohne eigene S-Kennzeichnung.',
          presentation: 'Begleitpräsentation, Folien 8 und 24: „Tiere beschreiben“. Kriterien werden früh eingeführt und nach Pandanaflora erneut gesichert.',
          steps: 'Sichere mit dem Merkblatt Überschrift, Tierart und Besonderheit, Größe / Gewicht, Körperteile, Farben und Formen, Reihenfolge und Schlussangaben zu Verhalten, Lebensraum, Nahrung oder Lebenserwartung. Besprecht sachliche Sprache, treffende Adjektive, Präsens und plausible Fantasiemerkmale. Im Adjektivblatt: 1a Lücken passend füllen, 1b vergleichen, 2a/b Zusammensetzungen bilden, 3 den Adjektivgebrauch begründen. Im Kombinationsblatt sammelt ihr Adjektive in fünf Kategorien.',
          app: 'Vidi schlägt vor, eure gemeinsamen Forschungsregeln festzuhalten. Der Codex ergänzt das analoge Merkblatt.',
          finish: 'Nach der gemeinsamen Sicherung: „Forschungsregeln eintragen“ → „Regeln übernehmen“.', milestones: ['research-codex-complete']
        },
        {
          title: 'S5/S6 · Eine Tierbeschreibung überarbeiten', focus: 'Eine schwache Beschreibung des Wildschwein-Frischlings verbessern.',
          material: '„AB_Eine Tierbeschreibung überarbeiten.pdf“ aus „S5_S6_Eine Tierbeschreibung überarbeiten“; passende Lösungsfassungen liegen im selben Ordner.',
          presentation: 'Die Begleitpräsentation enthält dazu keinen eigenen Abschnitt. Nutze bei Bedarf die Kriterien auf Folie 8 oder 24; zeige das Arbeitsblatt mit „Tierische Supernasen“.',
          steps: 'Aufgabe 1: Wähle a (Körper, Z. 3–5), b (Kopf, Z. 6–9) oder c (ganzer Text, Z. 1–11, mit interessanter Einleitung). Nutzt Bilder, Steckbrief, Wortschatzkasten und Überarbeitungshinweise: treffende Adjektive und Verben, keine persönlichen Wertungen, sinnvolle Satzverknüpfungen und abwechslungsreiche Satzanfänge. Bei d lesen Gruppen die Texte vor und geben Verbesserungstipps.',
          app: 'Station und Codex begleiten die Arbeit. Eine eigene Frischlingsseite ist dafür nicht vorgesehen.',
          finish: 'Kein eigener Meilenstein. Diese Übung schließt M5 noch nicht ab; die spätere Schreibkonferenz folgt nach der Wolfbeschreibung.', milestones: []
        },
        {
          title: 'S7/S8 · Der Wolf – planen und beschreiben', focus: 'Foto und Steckbrief auswerten; einen Schreibplan für eine sachliche Beschreibung nutzen.',
          material: '„Fordern und fördern 3 – Ein Tier beschreiben.pdf“ aus „S7_S8_Der Wolf - eine Tierbeschreibung planen“. Blatttitel: „Fordern und fördern – Ein Tier beschreiben“, „Der Wolf“; Kopiervorlage S. 76–78.',
          presentation: 'Kein eigener Wolf-Abschnitt in der Begleitpräsentation. Zeige Foto und Steckbrief auf PDF-Seite 1; Kriterien bleiben über Folie 8 / 24 verfügbar.',
          steps: 'Aufgabe a: Skizze mit Körperteilen und treffenden Adjektiven beschriften. b: sinnvolle Reihenfolge im Schreibplan festlegen. c: Beschreibung für ein Tiermagazin verfassen. d: Aufbau sowie Grammatik, Rechtschreibung, Zeichensetzung, Adjektive, abwechslungsreiche Verben und Präsens prüfen. Die Hilfe-Karten „Ein Tier beschreiben – Oberbegriffe und Merkmale“ und „Schreibplan mit Formulierungshilfen“ stehen auf PDF-Seite 2. Die Zusatzaufgabe auf Seite 3 ist eine Erzählung, keine weitere Tierbeschreibung.',
          app: 'Dokumentiere den Wolf erst nach der Textarbeit. Vidi entdeckt anschließend Waldregion und Federhain-Spur; die Waldexpedition wird verfügbar.',
          finish: '„Wolf dokumentieren“ → „Eintrag übernehmen“.', milestones: ['wolf-documented']
        },
        {
          title: 'Schreibkonferenz · ohne eigene S-Zuordnung', focus: 'Rückmeldungen anhand gemeinsamer Kriterien geben und Texte überarbeiten.',
          material: '„Schreibkonferenz_Tierbeschreibung.pdf“ mit dem Bogen „Schreibkonferenz – Tierbeschreibung“; eigene Beschreibungen und Merkblatt.',
          presentation: 'Kein eigener Präsentationsabschnitt; greife die Kriterien auf Folie 8 / 24 wieder auf.',
          steps: 'Lass Texte anhand der vier Spalten prüfen: Überschrift/Einleitung, Hauptteil, Schluss und Sprache/Form. Nutzt die freien Felder für Rückmeldungen; die Kinder verbessern anschließend ihre eigene Beschreibung.',
          app: 'Kehre zur Station zurück. Vidi erinnert daran, dass gute Forschung überprüft wird.',
          finish: 'Erst nach Rückmeldung und Überarbeitung: „Forschung bestätigen“ bewusst bestätigen.', milestones: ['research-verified']
        },
        {
          title: 'Tierwesen würfeln · ohne einzelne S-Zuordnung', focus: 'Zufällige Merkmale zu einem plausiblen Wesen verbinden.',
          material: '„Tierwesen würfeln.pdf“ beziehungsweise „Tierwesen würfeln.pptx“; Zeichenpapier und Heft.',
          presentation: 'Begleitpräsentation, Folien 25–26: Zeichenauftrag und „Würfle dir dein Tierwesen“. Der Abschnitt gehört zum frühen Präsentationspaket; in der App wird der Generator erst nach M5 aktiviert.',
          steps: 'Im analogen Blatt wird jede Spalte mit zwei Würfeln ermittelt; bei 12 werden zwei Eigenschaften aus der Spalte gewählt. Die Kinder zeichnen das Wesen. Nutze den App-Generator als digitale Inszenierung derselben Grundidee und lass Zeichnung, Schreibplanung und Beschreibung weiterhin auf Papier entstehen.',
          app: `Aktiviere das Gerät über Vidi in der Station. Die acht Kategorien sind ${generatorConfig.categories.map(category => category.name).join(', ')}. Anschließend kannst du alles erzeugen oder einzelne Eigenschaften neu mischen.`,
          finish: '„Generator aktivieren“ bewusst bestätigen; danach das Gerät öffnen.', milestones: ['generator-activated']
        },
        {
          title: 'S9/S10 · Materialpool für weitere Übung', focus: 'Foto und Steckbrief selbstständig in eine Tierbeschreibung umsetzen.',
          material: 'Ordner „S9_S10_Übungsarbeit“: „Übungsarbeit_Pferd.pdf“, „Übungsarbeit_Schnecke.pdf“ sowie „EWH_Übungsarbeit_Pferde.pdf“ und „EWH_Übungsarbeit_Schnecke.pdf“.',
          presentation: 'Kein dazugehöriger Abschnitt in der Begleitpräsentation. Die dortige Wespuin-Folie 27 ist eine andere Übung und nicht als S9/S10 belegt.',
          steps: 'Wähle die vorhandene Pferd- oder Schneckenaufgabe: Für ein Tiermagazin ein Shire Horse beziehungsweise eine Afrikanische Riesenschnecke anhand des Fotos und geeigneter Steckbriefangaben genau beschreiben. Nutze den zugehörigen Erwartungshorizont zur Rückmeldung und das Merkblatt zur Vorbereitung.',
          app: 'Du kannst Station und Codex als Rahmen zeigen. Diese Materialvarianten erhalten keine zusätzliche Tierseite und verändern die vorhandene App-Reihenfolge nicht.',
          finish: 'Kein eigener App-Meilenstein. M7 bleibt an die nachfolgende Wespuin-Übung gekoppelt.', milestones: []
        },
        {
          title: 'Wespuin · Übungsarbeit ohne gesicherte S-Zuordnung', focus: 'Ein Fantasiewesen selbstständig sachlich und anschaulich beschreiben.',
          material: 'Begleitpräsentation, Folie 27: „Der Wespuin – Übungsarbeit“. „KA_Tierbeschreibung_Wespuin.pdf“ im Ordner „Klassenarbeit“ ist dagegen als „Klassenarbeit Nr. 4: Tierbeschreibung“ bezeichnet.',
          presentation: 'Zeige Folie 27 mit Bild und Schreibauftrag. Eine eigene S-Nummer für diese Wespuin-Übung ist aus den Dateien nicht eindeutig ableitbar.',
          steps: 'Die Kinder verfassen die genaue Beschreibung des abgebildeten Wesens: sachlich informierend, interessant und anschaulich. Nutze das Merkblatt und anschließend die Schreibkonferenz zur Vorbereitung und Rückmeldung. Vermische den Folienauftrag nicht unbemerkt mit der separaten Klassenarbeitsfassung.',
          app: 'Erst nach der tatsächlichen Übungsarbeit wird die Wespuin-Seite eingetragen; das Buch nimmt der Klasse die Schreibaufgabe nicht ab.',
          finish: '„Wespuin dokumentieren“ → „Eintrag übernehmen“.', milestones: ['wespuin-documented']
        },
        {
          title: 'S11/S12 · Zuckerdornechse – Übungsarbeit Nr. 2', focus: 'Bild und Steckbrief zu einer genauen, anschaulichen Beschreibung verbinden.',
          material: '„Steckbrief_Zuckerdornechse.pdf“ aus „S11_S12_Übungsarbeit Nr. 2“; Blattüberschrift „Tierwesen beschreiben: Die Zuckerdornechse“.',
          presentation: 'Begleitpräsentation, Folie 28: „Die Zuckerdornechse – Übungsarbeit Nr. 2“ mit Bild, Schreibauftrag und Steckbrief.',
          steps: 'Lass den Steckbrief unter Besonderheiten, Aussehen, Nahrung und weiteren Informationen sinnvoll ergänzen. Nach Folie 28 schreiben die Kinder eine genaue, sachlich informierende und anschauliche Beschreibung von mindestens einer Seite in normaler Schrift. Dabei nutzen sie die Angaben und ergänzen sinnvolle Eigenschaften.',
          app: 'Vidi führt nach der Dokumentation zur jüngsten Federhain-Spur. Buchseite, Vulkanregion und Vulkanexpedition werden verfügbar.',
          finish: 'Erst nach Abschluss dieser Übungsarbeit: „Zuckerdornechse dokumentieren“ bestätigen.', milestones: ['zuckerdornechse-documented']
        },
        {
          title: 'Eigene Tierwesen · Abschluss ohne feste S-Zuordnung', focus: 'Ein eigenes Wesen schlüssig entwickeln, beschreiben und gestalten.',
          material: '„AB_Erschaffung eines Tierwesens.pdf“ aus „S1-S5_Einstieg und Bestiarium“; alternativ „AB_Phantastische Tierwesen beschreiben.docx.pdf“, Seite 2. Die Vorlagen stehen bereits im frühen Paket und können zum Abschluss wieder aufgegriffen werden.',
          presentation: 'Begleitpräsentation, Folien 15–18: Auftrag und Buchseitenbeispiele sowie das zweiseitige Arbeitsblatt.',
          steps: 'Folie 15 und „Erschaffung eines Tierwesens“: Name, erste Skizze, fantastische Details, Beschreibung in mindestens 15 Sätzen, Überarbeitung und Rechtschreibung, endgültige Zeichnung mit Detailausschnitten und saubere Beschriftung. Die alternative AB-Seite 2 fordert mindestens zehn Sätze; entscheide dich bewusst für eine Vorlage. Sammle die fertigen guten Ergebnisse analog.',
          app: 'Öffne den zweiten Band „Entdeckungen unserer Klasse“. Gute Ergebnisse können später als finale Bestiariumsseiten vorbereitet werden; du kannst dafür bei Bedarf ein passendes Asset vorbereiten lassen. Aktuell gibt es keine Upload- oder Schülerseitenverwaltung.',
          finish: '„Klassen-Bestiarium öffnen“ → „Zweiten Band öffnen“.', milestones: ['class-discoveries']
        }
      ],
      sections: [{
        title: 'Vorbereitung und Klassenarbeit · Material ohne feste S-Zuordnung',
        paragraphs: [
          'Für Wiederholung und Rückmeldung stehen das Merkblatt, „Schreibkonferenz_Tierbeschreibung.pdf“, die Adjektivblätter sowie „Bewertungsbogen_Tierbeschreibung.pdf“ und „Bewertungsbogen2_Tierbeschreibung.pdf“ bereit. Prüfe die Variante: Ein Bogen erlaubt passende Ergänzungen, der andere fordert, nichts hinzuzuerfinden.',
          'Im Ordner „Klassenarbeit“ liegen außerdem „KA_Tierbeschreibung_Bambudosei.pdf“, „KA_Tierbeschreibung_Wespuin.pdf“ und „KA_Tierbeschreibung_Zwielement.pdf“. Diese Fassungen verlangen eine genaue Beschreibung mithilfe des Bildes und einer sinnvollen Auswahl aus den Notizen. Nutze sie bewusst als Klassenarbeitsvarianten; daraus folgt kein zusätzlicher App-Meilenstein.'
        ]
      }]
    },
    {
      id: 'problems', label: 'Wenn etwas hakt', title: 'Wenn etwas hakt',
      paragraphs: ['Prüfe zuerst die aktive Klasse. Fortschritt und manuelle Freigaben kannst du im Lehrkraftmodus unabhängig kontrollieren.'],
      problems: [
        ['Eine neue Seite erscheint nicht', 'Prüfe unter „Unterrichtsfortschritt“ den passenden Schritt. Gib die Seite bei Bedarf unter „Manuelle Steuerung → Bestiarium“ gezielt frei.'],
        ['Die nächste Vidi-Aktion fehlt', 'Prüfe, ob die vorherigen Schritte abgeschlossen sind und der aktuelle noch offen ist. Buchschritte erscheinen im Bestiarium, Überarbeiten und Generatoraktivierung in der Station.'],
        ['Vidi erscheint nicht', 'Bereits bestätigte Hinweise werden normalerweise nicht wiederholt. Unter „Federhains Spur → Storyhinweis erneut zeigen“ lässt sich der aktuelle Forschungshinweis wiederholen. Das Intro liegt unter „Manuelle Steuerung → Raum → Intro erneut anzeigen“; der Generator hat einen eigenen Vidi-Hilfezugang.'],
        ['Eine Region bleibt im Nebel', 'Prüfe den passenden Meilenstein und kontrolliere unter „Manuelle Steuerung → Weltkarte“ die Region.'],
        ['Expedition lässt sich nicht öffnen', 'Sowohl die Region als auch die zugehörige Expedition müssen unter „Manuelle Steuerung“ freigegeben sein.'],
        ['Generator reagiert nicht', 'Er wird erst mit M6 aktiviert. Nutze in der Station die passende Vidi-Aktion oder kontrolliere im Lehrkraftmodus den Unterrichtsfortschritt beziehungsweise die Funktion. Während des Mischens sind die Tasten kurz nicht bedienbar.'],
        ['Vollbild beendet sich', 'Starte es in der Station erneut über das Vollbildsymbol. ESC beendet Vollbild absichtlich.'],
        ['Bild / Asset fehlt', 'Buchseiten und optionale Rahmengrafiken besitzen Ersatzdarstellungen. Lade bei einer fehlenden Raumgrafik oder dauerhaft fehlenden Bildern die Seite neu und prüfe, ob die aktuelle App-Version mit ihren Dateien vollständig geladen wird.'],
        ['Falscher Fortschritt wurde ausgelöst', 'Setze unter „Unterrichtsfortschritt“ den betroffenen Meilenstein zurück. Seine Freigaben werden zurückgenommen; die Raumphase bleibt bestehen. Korrigiere sie bei Bedarf unter „Manuelle Steuerung → Raum“. Spätere Meilensteine werden nicht automatisch zurückgesetzt.'],
        ['Andere Klasse zeigt falschen Stand', 'Wähle über „Bestiarium“ oben links → „Klasse → Aktive Klasse“ die richtige Klasse. Jede Klasse hat ihren eigenen Stand.'],
        ['Browser wurde geschlossen', 'Öffne die App im selben Browserprofil wieder. Der Stand bleibt lokal erhalten, sofern der Browser-Speicher nicht gelöscht wurde. Importiere bei Verlust eine vorhandene JSON-Sicherung.'],
        ['App soll auf einem anderen Laptop genutzt werden', 'Sichere auf dem bisherigen Gerät unter „Daten → JSON exportieren“. Lade die Datei auf dem Zielgerät über „JSON importieren“. Achtung: Nach Bestätigung werden dort alle vorhandenen Klassenstände ersetzt.'],
        ['Mehrere Lehrkräfte arbeiten mit derselben Klasse', 'Stände werden nicht automatisch abgeglichen. Gib die aktuelle JSON-Sicherung gezielt weiter und exportiere vor einem Import den bisherigen Zielstand. Ein Import führt keine Änderungen zusammen.']
      ]
    }
  ]
};

export function teacherGuideBlockRows(block) {
  const names = block.milestones.map(id => {
    const index = milestones.findIndex(milestone => milestone.id === id);
    return `M${index} · ${milestones[index].title}`;
  }).join(' / ');
  return [['Schwerpunkt', block.focus], ['Material', block.material], ['Präsentation', block.presentation], ['Ablauf', block.steps], ['App', block.app], ['Abschluss', `${block.finish}${names ? ` Intern: ${names}.` : ''}`]];
}

export function initTeacherGuide(teacherDialog) {
  const guide = element('dialog', '', 'teacher-guide');
  guide.setAttribute('aria-labelledby', 'guide-title');
  const heading = element('header', '', 'guide-heading');
  const title = element('h2', teacherGuideConfig.title);
  title.id = 'guide-title';
  const headingActions = element('div', '', 'guide-heading-actions');
  const download = element('a', 'Spickzettel als PDF herunterladen');
  download.href = 'assets/teacher/Bestiarium-Lehrkraefte-Spickzettel.pdf';
  download.download = 'Bestiarium-Lehrkraefte-Spickzettel.pdf';
  headingActions.append(download, button('Zurück zum Lehrkraftmodus', () => guide.close()));
  heading.append(title, headingActions);
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
    data.blocks?.forEach((block, i) => {
      const node = element('section', '', 'guide-block');
      node.append(element('h4', `${i + 1}. ${block.title}`));
      const details = element('dl');
      for (const [label, text] of teacherGuideBlockRows(block)) {
        details.append(element('dt', label), element('dd', text));
      }
      node.append(details);
      panel.append(node);
    });
    data.sections?.forEach(section => {
      const node = element('section', '', 'guide-section');
      node.append(element('h3', section.title));
      prose(node, section);
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
