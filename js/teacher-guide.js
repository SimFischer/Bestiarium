import { milestones } from './progress.js';
import { element, button } from './ui.js';

export const teacherGuideConfig = {
  title: 'Hilfe & Stundenverlauf',
  tabs: [
    {
      id: 'overview',
      label: 'Kurz erklärt',
      title: 'Das Bestiarium – auf einen Blick',
      subtitle: 'Eine Smartboard-Begleitung zur Unterrichtseinheit „Phantastische Tierbeschreibung“ in Klasse 5',
      paragraphs: ['Deine Klasse entdeckt Federhains Forschungsstation. Der Professor ist von einer Expedition nicht zurückgekehrt; sein Assistent Vidi begleitet euch. Durch genaues Beobachten und Beschreiben rekonstruiert ihr seine Forschung. Die App ist eure gemeinsame visuelle Klassenwelt. Beobachtungen, Zeichnungen, Stichpunkte, Schreibplanung, Texte und Überarbeitung bleiben auf Papier.'],
      motto: 'Je genauer wir Tiere beobachten und beschreiben können, desto mehr von ihrer Welt können wir entdecken.',
      cards: [
        ['Forschungsstation', 'Zentraler Ausgangspunkt mit unsichtbaren Klickflächen: offenes Buch, Wandkarte und später Gerät rechts. Die Station verändert sich mit dem Fortschritt.'],
        ['Bestiarium', 'Zeigt nur entdeckte Seiten. Nutze Inhaltsverzeichnis und seitliche Blätterpfeile.'],
        ['Weltkarte & Expeditionen', 'Pflanzen-, Wald- und Vulkanregion werden sichtbar. Region und Expedition müssen freigegeben sein; gemeinsam beobachten, anschließend analog beschreiben.'],
        ['Forschercodex', 'Kapitel im Bestiarium mit den gemeinsam gesicherten Regeln guter Tierbeschreibungen.'],
        ['Generator', 'Mischt Eigenschaften für eigene Wesen. Zeichnung, Planung und Beschreibung entstehen weiterhin auf Papier.'],
        ['Klassen-Bestiarium', 'Vorbereiteter zweiter Band für eigene Entdeckungen. Noch keine Verwaltung oder Uploads eigener Schülerseiten.']
      ],
      knowledge: [
        'Nur du bedienst die App; keine Schülergeräte oder Schülerkonten.',
        'Keine Schülernamen nötig; nur eine Klassenbezeichnung.',
        'Keine automatische Bewertung, KI-Korrektur, Punkte oder Noten; keine Lernstandsdiagnose.',
        'Klassenstände lokal im Browser; Sicherung und Übergabe per JSON.',
        'Vollbild fürs Smartboard; Arbeitsblätter und Schreibkonferenz bleiben zentral.'
      ],
      route: [
        'Niffler',
        'Pandanaflora',
        'Forschercodex',
        'Überarbeiten',
        'Wolf',
        'Schreibkonferenz',
        'Generator',
        'Übungsarbeiten',
        'Zuckerdornechse',
        'eigene Tierwesen'
      ],
      preparation: [
        'App am Unterrichtslaptop öffnen.',
        'Smartboard / HDMI und Vollbild testen.',
        'Lehrkraftmodus öffnen; richtige Klasse anlegen / auswählen.',
        'Intro und bei Bedarf Reset in einer Testklasse ausprobieren.',
        'Begleitpräsentation bereithalten.',
        'Arbeitsblätter, Hefte und Zeichenmaterial bereitlegen.',
        'Optional Ausgangsstand als JSON sichern.'
      ],
      didactics: ['Die Einheit verbindet bewusst reale Tiere wie Wolf und Wildschwein mit phantastischen Tierwesen. Auch in dieser magischen Welt gibt es normale Tiere. Für beide gelten dieselben Grundprinzipien des genauen Beschreibens.', 'Bei selbst erfundenen Wesen sollen fantastische Merkmale einer nachvollziehbaren Logik folgen. Begrenze Spezialfähigkeiten, halte Größen und Gewichte plausibel und nutze bekannte Tiere, Pflanzen oder Gegenstände als Orientierung.']
    },
    {
      id: 'quick',
      label: 'Spickzettel',
      title: 'Spickzettel fürs Lehrerpult',
      paragraphs: ['Die wichtigsten Handgriffe für den Unterricht – die Schreibarbeit bleibt auf Papier.'],
      cards: [
        ['Start', 'App öffnen → Klasse wählen → Vollbild → Intro / Station. Klassenwahl: Lehrkraftmodus → Klasse → Aktive Klasse.'],
        ['Fortschritt', 'Nutze die passende Vidi-Aktion. Erst nach analoger Arbeit bewusst bestätigen; keine automatische Bewertung.'],
        ['Bestiarium', 'Offenes Buch anklicken → bekannte Seiten. Pfeile zum Blättern; „Inhaltsverzeichnis“ für die Übersicht.'],
        ['Weltkarte', 'Wandkarte anklicken. Nebel = noch nicht entdeckt. Freigegebene Region → freigegebene Expedition.'],
        ['Expedition', 'Gemeinsam beobachten; anschließend auf Arbeitsblatt / im Heft weiterarbeiten.'],
        ['Generator · ab M6', 'Über Vidi aktivieren → „Tierwesen erzeugen“ / einzelne Eigenschaften antippen. Bei „Freie Wahl – wählt zwei!“ entscheidet die Klasse.'],
        ['Lehrkraftmodus', '„Bestiarium“ oben links: Tests, Überspringen, Zurücksetzen und Korrekturen; „Manuelle Steuerung“ für Freigaben.'],
        ['Speicherung', 'Lehrkraftmodus → Daten → JSON exportieren / importieren. Lokal pro Klasse; Import ersetzt alle Zielstände.']
      ],
      notes: [
        [
          'Bewusst steuern',
          [
            'Aktuelle Vidi-Aktion: Buchschritte im Bestiarium; Überarbeiten und Generatoraktivierung in der Station.',
            'Du entscheidest nach der analogen Arbeit. Erst die Bestätigung schließt ab; „Noch weiterforschen“ oder ESC bricht ohne Abschluss ab.',
            'Alternativ: Lehrkraftmodus → Unterrichtsfortschritt.',
            '„Manuelle Steuerung“: Raumphase, Buchseiten, Regionen, Expeditionen und Funktionen.'
          ]
        ],
        [
          'Vollbild & HDMI',
          [
            'Start per Eckensymbol nach deinem Klick; Ende mit ESC oder demselben Symbol.',
            'Browserleisten und Betriebssystemoberfläche werden möglichst ausgeblendet.',
            'Ohne Unterstützung fehlt das Symbol; die App bleibt bedienbar.',
            'HDMI-Smartboard: Spiegelung oder zweiter Bildschirm.'
          ]
        ],
        [
          'Daten sicher übergeben',
          [
            'Pro Klasse unabhängig und lokal (localStorage). Gleiches Browserprofil: Stand bleibt nach dem Schließen erhalten, sofern der Speicher nicht gelöscht wird. Private Fenster können ihn verlieren.',
            'Keine automatische Synchronisierung zwischen Lehrkräften, Geräten oder Profilen.',
            'JSON exportiert alle Klassen einschließlich der aktiven Klasse.',
            'Ein bestätigter Import ersetzt den gesamten Zielstand, ohne Zusammenführung. Sichere ihn vorher und stimme ab, welche Sicherung aktuell ist.'
          ]
        ]
      ],
      quickProblems: [
        ['Buchseite fehlt', 'Unterrichtsschritt prüfen; notfalls manuell freigeben.'],
        ['Vidi-Aktion fehlt', 'Vorgänger abgeschlossen? Richtiger Bereich? Schritt noch offen?'],
        ['Region im Nebel', 'Meilenstein und Regionsfreigabe kontrollieren.'],
        ['Expedition öffnet nicht', 'Region UND Expedition müssen freigegeben sein.'],
        ['Generator reagiert nicht', 'Ab M6 aktivieren; beim Mischen kurz warten.'],
        ['Falsche Klasse', 'Lehrkraftmodus → Klasse → Aktive Klasse.'],
        ['Falscher Fortschritt', 'Meilenstein zurücksetzen; Raumphase bei Bedarf korrigieren.'],
        ['Vollbild beendet', 'Per Eckensymbol neu starten; ESC beendet es absichtlich.'],
        ['Browser / Laptopwechsel', 'Gleiches Profil: lokaler Stand; anderes Gerät: JSON exportieren / importieren.']
      ]
    },
    {
      id: 'sequence',
      label: 'Stundenverlauf',
      title: 'Möglicher Unterrichtsverlauf',
      blocks: [
        {
          title: 'S1–S5 · Einstieg mit dem Niffler',
          focus: 'Genau beobachten und Beobachtungen für eine Beschreibung festhalten.',
          material: '„AB_Phantastische Tierwesen beschreiben.docx.pdf“, Seite 1; „Begleitpräsentation_Phantastische Tierwesen.pdf“ im Ordner „S1-S5_Einstieg und Bestiarium“.',
          presentation: 'Folien 1–5: Einstieg, Beobachtungsauftrag zum Filmausschnitt und Niffler-Text. Folien 6–8 ergänzen Klabbert und erste Beschreibungskriterien; 9–14 liefern weitere Beobachtungsimpulse.',
          milestones: ['station-found', 'niffler-researched'],
          phases: [
            { phase: '1 · App starten', action: 'Öffne die App, wähle die richtige Klasse im Lehrkraftmodus und starte Vollbild. Spiele bei einer neuen Klasse das Intro: Außenansicht, Vidi, Federhains Verschwinden und Forschungsauftrag. Zeige danach die Station. Die App setzt zunächst nur den Rahmen; M0 ist vorbereitet.', medium: 'APP', reference: 'Klasse → Vollbild → Intro → Station' },
            { phase: '2 · Buch entdecken', action: 'Klicke das offene Buch an. Zeige das leere Bestiarium und Vidis Einführung. Klicke „Mit der Forschung beginnen“. Das markiert den Niffler ausdrücklich noch nicht als erledigt.', medium: 'APP', reference: 'Leeres Bestiarium' },
            { phase: '3 · Präsentation', action: 'Öffne jetzt die Begleitpräsentation „Phantastische Tierwesen“. Nutze Folien 1–5 für Einstieg, Auftrag, Filmausschnitt und Niffler-Text. Während der Arbeitsphase führt die Präsentation; die App kann im Hintergrund bleiben.', medium: 'PRÄSENTATION', reference: 'Folien 1–5; Auftrag auf 3' },
            { phase: '4 · Erarbeitung', action: 'Verteile AB-Seite 1. Die Kinder beobachten den Niffler im Filmausschnitt, notieren Merkmale und wählen passende Informationen für die anschließende Beschreibung aus.', medium: 'MATERIAL', reference: 'AB S. 1; Filmausschnitt' },
            { phase: '5 · Sicherung', action: 'Vergleicht die Beobachtungen mit dem Niffler-Text auf Folie 5. Sichert geeignete Merkmale und erste Beschreibungskriterien. Folien 6–8 ergänzen Klabbert und Kriterien; 9–14 bieten weitere Beobachtungsimpulse.', medium: 'PRÄSENTATION', reference: 'Folie 5; ergänzend 6–14' },
            { phase: '6 · App-Fortschritt', action: 'Kehre erst nach der tatsächlichen Unterrichtsarbeit ins Bestiarium zurück. Klicke „Niffler ins Bestiarium eintragen“ und danach „Eintrag übernehmen“. Jetzt erscheinen die Niffler-Seite mit Schimmer und die veränderte Station; erst jetzt ist M1 abgeschlossen.', medium: 'APP', reference: 'Vidi → Eintrag übernehmen' }
          ]
        },
        {
          title: 'S1–S5 · Pandanaflora zeichnen und beschreiben',
          focus: 'Genaue Angaben verstehen und selbst präzise formulieren.',
          material: 'Begleitpräsentation, Folien 19–24; Zeichenpapier und Heft. Ein eigenes Pandanaflora-Arbeitsblatt ist im Paket nicht vorhanden.',
          presentation: 'Folie 19: Zeichenauftrag; 20: Beschreibung; 21: Zeichnungen vergleichen; 22: Bildauflösung; 23: umgekehrter Schreibauftrag; 24: Kriterien.',
          milestones: ['pandanaflora-researched'],
          phases: [
            { phase: 'Auftrag', action: 'Öffne die Präsentation. Zeige den Zeichenauftrag und lies oder zeige die Beschreibung. Das Lösungsbild bleibt zunächst verborgen.', medium: 'PRÄSENTATION', reference: '19: Auftrag; 20: Beschreibung' },
            { phase: 'Zeichnen & vergleichen', action: 'Die Kinder zeichnen auf Papier. Vergleicht ihre Zeichnungen auf Folie 21; zeige erst danach die Bildauflösung auf Folie 22.', medium: 'MATERIAL', reference: 'Zeichenpapier; Folien 21–22' },
            { phase: 'Aufgabe umkehren', action: 'Lass die Kinder das Pandanaflora selbst beschreiben. Sinnvolle zusätzliche Merkmale sind nach dem Auftrag erlaubt.', medium: 'PRÄSENTATION', reference: 'Folie 23; Heft' },
            { phase: 'Sicherung', action: 'Sichert die Kriterien und prüft, welche genauen Angaben beim Zeichnen und Beschreiben geholfen haben.', medium: 'PRÄSENTATION', reference: 'Folie 24' },
            { phase: 'App-Fortschritt', action: 'Kehre ins Bestiarium zurück. Bestätige nach Zeichnung, Vergleich und Beschreibung „Pandanaflora dokumentieren“. Vidi zeigt Pflanzenregion und Federhain-Spur; Buchseite und Expedition werden verfügbar.', medium: 'APP', reference: 'Bestiarium → Vidi' }
          ]
        },
        {
          title: 'S1–S5 · Merkblatt und Forschercodex',
          focus: 'Aufbau und Sprache einer genauen Tierbeschreibung sichern.',
          material: '„Merkblatt_Phantastische Tierbeschreibungen.pdf“; Blattüberschrift: „Merkblatt: Phantastische Tierbeschreibung“. Ergänzend „Mit Adjektiven genau beschreiben.pdf“ und „AB_Adjektivkombinationen.pdf“ ohne eigene S-Kennzeichnung.',
          presentation: 'Begleitpräsentation, Folien 8 und 24: „Tiere beschreiben“. Kriterien werden früh eingeführt und nach Pandanaflora erneut gesichert.',
          milestones: ['research-codex-complete'],
          phases: [
            { phase: 'Erkenntnisse sammeln', action: 'Greife die bisherigen Beobachtungen und die Kriterien der Präsentation wieder auf. Verteile das Merkblatt.', medium: 'PRÄSENTATION', reference: 'Folien 8 / 24; Merkblatt' },
            { phase: 'Kriterien sichern', action: 'Sichert Überschrift, Tierart und Besonderheit, Größe / Gewicht, Körperteile, Farben, Formen, Reihenfolge und Schlussangaben zu Verhalten, Lebensraum, Nahrung oder Lebenserwartung. Besprecht sachliche Sprache, Adjektive, Präsens und plausible Fantasiemerkmale.', medium: 'MATERIAL', reference: 'Merkblatt' },
            { phase: 'Sprachlich üben', action: 'Adjektivblatt: 1a Lücken füllen, 1b vergleichen, 2a/b Zusammensetzungen bilden, 3 Adjektivgebrauch begründen. Im Kombinationsblatt Adjektive in fünf Kategorien sammeln.', medium: 'MATERIAL', reference: 'Beide Adjektivblätter' },
            { phase: 'App-Fortschritt', action: 'Öffne das Bestiarium. Vidi schlägt gemeinsame Forschungsregeln vor. Nach der Sicherung: „Forschungsregeln eintragen“ → „Regeln übernehmen“. Der Codex ergänzt das analoge Merkblatt.', medium: 'APP', reference: 'Bestiarium → Forschercodex' }
          ]
        },
        {
          title: 'S5/S6 · Eine Tierbeschreibung überarbeiten',
          focus: 'Eine schwache Beschreibung des Wildschwein-Frischlings verbessern.',
          material: '„AB_Eine Tierbeschreibung überarbeiten.pdf“ aus „S5_S6_Eine Tierbeschreibung überarbeiten“; passende Lösungsfassungen liegen im selben Ordner.',
          presentation: 'Die Begleitpräsentation enthält dazu keinen eigenen Abschnitt. Nutze bei Bedarf die Kriterien auf Folie 8 oder 24; zeige das Arbeitsblatt mit „Tierische Supernasen“.',
          milestones: [],
          phases: [
            { phase: 'Einstieg', action: 'Verteile das Arbeitsblatt und lest die schwache Beschreibung „Tierische Supernasen“. Zeige bei Bedarf die bekannten Kriterien; es gibt keinen eigenen Präsentationsabschnitt.', medium: 'MATERIAL', reference: 'AB; Kriterien: Folien 8 / 24' },
            { phase: 'Erarbeitung', action: 'Aufgabe 1: Bearbeitet a (Körper, Z. 3–5), b (Kopf, Z. 6–9) oder c (ganzer Text, Z. 1–11, mit interessanter Einleitung). Nutzt Bilder, Steckbrief und Wortschatzkasten.', medium: 'MATERIAL', reference: 'AB, Aufgabe 1a / b / c' },
            { phase: 'Vergleichen', action: 'Achtet auf treffende Adjektive und Verben, keine persönlichen Wertungen, sinnvolle Satzverknüpfungen und abwechslungsreiche Satzanfänge. Bei d lesen Gruppen vor und geben Verbesserungstipps.', medium: 'MATERIAL', reference: 'Überarbeitungshinweise; 1d' },
            { phase: 'App als Rahmen', action: 'Station und Codex begleiten die Arbeit. Keine Frischlingsseite und noch kein App-Meilenstein: M5 folgt erst nach der späteren Schreibkonferenz zur Wolfbeschreibung.', medium: 'APP', reference: 'Kein Fortschrittsbutton' }
          ],
          tips: ['Differenzierung: Wähle Aufgabe 1a, 1b oder 1c passend zur Lerngruppe; bei 1d vergleichen Gruppen ihre Ergebnisse. Die Lösungsfassungen liegen im selben Ordner.']
        },
        {
          title: 'S7/S8 · Der Wolf – planen und beschreiben',
          focus: 'Foto und Steckbrief auswerten; einen Schreibplan für eine sachliche Beschreibung nutzen.',
          material: '„Fordern und fördern 3 – Ein Tier beschreiben.pdf“ aus „S7_S8_Der Wolf - eine Tierbeschreibung planen“. Blatttitel: „Fordern und fördern – Ein Tier beschreiben“, „Der Wolf“; Kopiervorlage S. 76–78.',
          presentation: 'Kein eigener Wolf-Abschnitt in der Begleitpräsentation. Zeige Foto und Steckbrief auf PDF-Seite 1; Kriterien bleiben über Folie 8 / 24 verfügbar.',
          milestones: ['wolf-documented'],
          phases: [
            { phase: 'Einstieg', action: 'Zeige Foto und Steckbrief. Es gibt keinen eigenen Wolf-Abschnitt in der Präsentation; Kriterien bleiben über Folien 8 / 24 verfügbar.', medium: 'MATERIAL', reference: 'Wolf-PDF S. 1' },
            { phase: 'Planen', action: 'Aufgabe a: Skizze mit Körperteilen und treffenden Adjektiven beschriften. b: sinnvolle Reihenfolge im Schreibplan festlegen; nutze bei Bedarf die Hilfe-Karten.', medium: 'MATERIAL', reference: 'a / b; Hilfen auf PDF S. 2' },
            { phase: 'Schreiben', action: 'Aufgabe c: Beschreibung für ein Tiermagazin verfassen.', medium: 'MATERIAL', reference: 'Schreibplan; Heft' },
            { phase: 'Prüfen', action: 'Aufgabe d: Aufbau, Grammatik, Rechtschreibung, Zeichensetzung, Adjektive, abwechslungsreiche Verben und Präsens prüfen.', medium: 'MATERIAL', reference: 'Aufgabe d' },
            { phase: 'App-Fortschritt', action: 'Erst nach der Textarbeit: „Wolf dokumentieren“ → „Eintrag übernehmen“. Vidi entdeckt Waldregion und Federhain-Spur; Wolfseite und Waldexpedition werden verfügbar.', medium: 'APP', reference: 'Bestiarium → Vidi' }
          ],
          tips: ['Differenzierung: Hilfe-Karten „Ein Tier beschreiben – Oberbegriffe und Merkmale“ und „Schreibplan mit Formulierungshilfen“ auf PDF-Seite 2. Die Zusatzaufgabe auf Seite 3 ist eine Erzählung, keine weitere Tierbeschreibung.']
        },
        {
          title: 'Schreibkonferenz · ohne eigene S-Zuordnung',
          focus: 'Rückmeldungen anhand gemeinsamer Kriterien geben und Texte überarbeiten.',
          material: '„Schreibkonferenz_Tierbeschreibung.pdf“ mit dem Bogen „Schreibkonferenz – Tierbeschreibung“; eigene Beschreibungen und Merkblatt.',
          presentation: 'Kein eigener Präsentationsabschnitt; greife die Kriterien auf Folie 8 / 24 wieder auf.',
          milestones: ['research-verified'],
          phases: [
            { phase: 'Texte austauschen', action: 'Tauscht eigene Beschreibungen aus und gebt den Kriterienbogen aus. Greife bei Bedarf Folien 8 / 24 wieder auf; kein eigener Präsentationsabschnitt.', medium: 'MATERIAL', reference: 'Eigene Texte; Kriterienbogen' },
            { phase: 'Rückmeldung', action: 'Prüft die vier Spalten: Überschrift/Einleitung, Hauptteil, Schluss und Sprache/Form. Haltet Rückmeldungen in den freien Feldern fest.', medium: 'MATERIAL', reference: 'Schreibkonferenz-Bogen' },
            { phase: 'Überarbeiten', action: 'Die Kinder verbessern ihre eigene Beschreibung anhand der Rückmeldungen.', medium: 'MATERIAL', reference: 'Eigener Text' },
            { phase: 'App-Fortschritt', action: 'Öffne danach die Station. Vidi erinnert daran, dass gute Forschung überprüft wird. Erst nach Rückmeldung und Überarbeitung „Forschung bestätigen“ bewusst bestätigen.', medium: 'APP', reference: 'Station → Vidi' }
          ]
        },
        {
          title: 'Tierwesen würfeln · ohne einzelne S-Zuordnung',
          focus: 'Zufällige Merkmale zu einem plausiblen Wesen verbinden.',
          material: '„Tierwesen würfeln.pdf“ beziehungsweise „Tierwesen würfeln.pptx“; Zeichenpapier und Heft.',
          presentation: 'Begleitpräsentation, Folien 25–26: Zeichenauftrag und „Würfle dir dein Tierwesen“. Der Abschnitt gehört zum frühen Präsentationspaket; in der App wird der Generator erst nach M5 aktiviert.',
          milestones: ['generator-activated'],
          phases: [
            { phase: 'Aufgabe vorstellen', action: 'Zeige „Würfle dir dein Tierwesen“. Analog ermittelt ihr jede Spalte mit zwei Würfeln; bei 12 werden zwei Eigenschaften gewählt. Die Kinder zeichnen das Wesen.', medium: 'PRÄSENTATION', reference: 'Folien 25–26; Würfelblatt' },
            { phase: 'App aktivieren', action: 'Aktiviere nach M5 in der Station bewusst „Generator aktivieren“. Öffne danach das Gerät. Die App inszeniert dieselbe Grundidee digital.', medium: 'APP', reference: 'Station → Vidi → Gerät' },
            { phase: 'Gemeinsam mischen', action: 'Nutze „Tierwesen erzeugen“ oder mische einzelne Eigenschaften neu. Kategorien: Lebensraum, Gestalt, Besonderheit, Typ, Farbe, Muster, Ähnlichkeit 1 und Ähnlichkeit 2.', medium: 'APP', reference: 'Generator; bei 12 freie Wahl' },
            { phase: 'Analog weiterarbeiten', action: 'Lass das Ergebnis am Smartboard stehen. Die Kinder zeichnen, planen und beschreiben auf Papier; sie schreiben keine Texte in die App.', medium: 'MATERIAL', reference: 'Zeichenpapier; Heft' }
          ]
        },
        {
          title: 'S9/S10 · Materialpool für weitere Übung',
          focus: 'Foto und Steckbrief selbstständig in eine Tierbeschreibung umsetzen.',
          material: 'Ordner „S9_S10_Übungsarbeit“: „Übungsarbeit_Pferd.pdf“, „Übungsarbeit_Schnecke.pdf“ sowie „EWH_Übungsarbeit_Pferde.pdf“ und „EWH_Übungsarbeit_Schnecke.pdf“.',
          presentation: 'Kein dazugehöriger Abschnitt in der Begleitpräsentation. Die dortige Wespuin-Folie 27 ist eine andere Übung und nicht als S9/S10 belegt.',
          milestones: [],
          phases: [
            { phase: 'Material wählen', action: 'Wähle die vorhandene Pferd- oder Schneckenaufgabe. Kein eigener Präsentationsabschnitt: Die Wespuin-Folie 27 ist eine andere Übung, nicht als S9/S10 belegt.', medium: 'MATERIAL', reference: 'Pferd / Riesenschnecke' },
            { phase: 'Übungsarbeit', action: 'Für ein Tiermagazin ein Shire Horse beziehungsweise eine Afrikanische Riesenschnecke anhand des Fotos und geeigneter Steckbriefangaben genau beschreiben.', medium: 'MATERIAL', reference: 'Foto, Steckbrief; Heft' },
            { phase: 'Rückmeldung', action: 'Nutze das Merkblatt zur Vorbereitung und den zugehörigen Erwartungshorizont für die Rückmeldung.', medium: 'MATERIAL', reference: 'Merkblatt; passender EWH' },
            { phase: 'Ohne Freischaltung', action: 'Station und Codex können den Rahmen bilden. Keine neue Tierseite und kein eigener Meilenstein; M7 bleibt an die Wespuin-Übung gekoppelt.', medium: 'APP', reference: 'Kein Fortschrittsbutton' }
          ]
        },
        {
          title: 'Wespuin · Übungsarbeit ohne gesicherte S-Zuordnung',
          focus: 'Ein Fantasiewesen selbstständig sachlich und anschaulich beschreiben.',
          material: 'Begleitpräsentation, Folie 27: „Der Wespuin – Übungsarbeit“. „KA_Tierbeschreibung_Wespuin.pdf“ im Ordner „Klassenarbeit“ ist dagegen als „Klassenarbeit Nr. 4: Tierbeschreibung“ bezeichnet.',
          presentation: 'Zeige Folie 27 mit Bild und Schreibauftrag. Eine eigene S-Nummer für diese Wespuin-Übung ist aus den Dateien nicht eindeutig ableitbar.',
          milestones: ['wespuin-documented'],
          phases: [
            { phase: 'Auftrag zeigen', action: 'Zeige „Der Wespuin – Übungsarbeit“ mit Bild und Schreibauftrag. Keine eindeutige S-Nummer ableitbar; nicht unbemerkt mit der separaten Klassenarbeitsfassung vermischen.', medium: 'PRÄSENTATION', reference: 'Folie 27' },
            { phase: 'Übungsarbeit', action: 'Die Kinder beschreiben das abgebildete Wesen genau: sachlich informierend, interessant und anschaulich. Nutze das Merkblatt zur Vorbereitung.', medium: 'MATERIAL', reference: 'Bild; Merkblatt; Heft' },
            { phase: 'Rückmeldung', action: 'Nutze anschließend die Schreibkonferenz zur Rückmeldung. Das Buch nimmt die Schreibaufgabe nicht ab.', medium: 'MATERIAL', reference: 'Schreibkonferenz' },
            { phase: 'App-Fortschritt', action: 'Erst nach der tatsächlichen Übungsarbeit: „Wespuin dokumentieren“ → „Eintrag übernehmen“. Die Wespuin-Seite erscheint.', medium: 'APP', reference: 'Bestiarium → Vidi' }
          ]
        },
        {
          title: 'S11/S12 · Zuckerdornechse – Übungsarbeit Nr. 2',
          focus: 'Bild und Steckbrief zu einer genauen, anschaulichen Beschreibung verbinden.',
          material: '„Steckbrief_Zuckerdornechse.pdf“ aus „S11_S12_Übungsarbeit Nr. 2“; Blattüberschrift „Tierwesen beschreiben: Die Zuckerdornechse“.',
          presentation: 'Begleitpräsentation, Folie 28: „Die Zuckerdornechse – Übungsarbeit Nr. 2“ mit Bild, Schreibauftrag und Steckbrief.',
          milestones: ['zuckerdornechse-documented'],
          phases: [
            { phase: 'Auftrag zeigen', action: 'Zeige Bild, Schreibauftrag und Steckbrief der „Übungsarbeit Nr. 2“. Verteile den ergänzbaren Steckbrief.', medium: 'PRÄSENTATION', reference: 'Folie 28; Steckbrief-AB' },
            { phase: 'Vorbereiten', action: 'Lass Besonderheiten, Aussehen, Nahrung und weitere Informationen im Steckbrief sinnvoll ergänzen.', medium: 'MATERIAL', reference: 'Steckbrief' },
            { phase: 'Übungsarbeit', action: 'Nach Folie 28: mindestens eine Seite in normaler Schrift, genau, sachlich informierend und anschaulich. Nutzt die Angaben und ergänzt sinnvolle Eigenschaften.', medium: 'MATERIAL', reference: 'Heft; Bild und Angaben' },
            { phase: 'App-Fortschritt', action: 'Erst nach Abschluss dieser Übungsarbeit „Zuckerdornechse dokumentieren“ bestätigen. Vidi zeigt die jüngste Federhain-Spur; Seite, Vulkanregion und Vulkanexpedition werden verfügbar.', medium: 'APP', reference: 'Bestiarium → Vidi' }
          ]
        },
        {
          title: 'Eigene Tierwesen · Abschluss ohne feste S-Zuordnung',
          focus: 'Ein eigenes Wesen schlüssig entwickeln, beschreiben und gestalten.',
          material: '„AB_Erschaffung eines Tierwesens.pdf“ aus „S1-S5_Einstieg und Bestiarium“; alternativ „AB_Phantastische Tierwesen beschreiben.docx.pdf“, Seite 2. Die Vorlagen stehen bereits im frühen Paket und können zum Abschluss wieder aufgegriffen werden.',
          presentation: 'Begleitpräsentation, Folien 15–18: Auftrag und Buchseitenbeispiele sowie das zweiseitige Arbeitsblatt.',
          milestones: ['class-discoveries'],
          phases: [
            { phase: 'Aufgabe vorstellen', action: 'Greife den frühen Auftrag zum Abschluss wieder auf: eigenes Wesen mit Namen, erster Skizze und fantastischen Details entwickeln.', medium: 'PRÄSENTATION', reference: 'Folien 15–18; Arbeitsblatt' },
            { phase: 'Planen & schreiben', action: 'Auftrag nach Folie 15 / „Erschaffung eines Tierwesens“: Beschreibung in mindestens 15 Sätzen planen und verfassen. Die alternative AB-Seite 2 fordert mindestens zehn Sätze; wähle bewusst eine Vorlage.', medium: 'MATERIAL', reference: 'Name, Skizze, Details; Text' },
            { phase: 'Überarbeiten & gestalten', action: 'Text und Rechtschreibung überarbeiten; endgültige Zeichnung mit Detailausschnitten und sauberer Beschriftung anfertigen. Sammle gute Ergebnisse analog.', medium: 'MATERIAL', reference: 'Text; endgültige Zeichnung' },
            { phase: 'App-Fortschritt', action: 'Danach „Klassen-Bestiarium öffnen“ → „Zweiten Band öffnen“. Gute Ergebnisse können später als finale Buchseiten vorbereitet werden; bei Bedarf lässt du ein passendes Asset vorbereiten. Noch keine Upload- oder Schülerseitenverwaltung.', medium: 'APP', reference: 'Zweiter Band' }
          ]
        }
      ],
      sections: [
        {
          title: 'Vorbereitung und Klassenarbeit · Material ohne feste S-Zuordnung',
          paragraphs: ['Wiederholung und Rückmeldung: Merkblatt, „Schreibkonferenz_Tierbeschreibung.pdf“, Adjektivblätter, „Bewertungsbogen_Tierbeschreibung.pdf“ und „Bewertungsbogen2_Tierbeschreibung.pdf“. Prüfe die Variante: Ein Bogen erlaubt passende Ergänzungen, der andere fordert, nichts hinzuzuerfinden.', 'Klassenarbeitsvarianten (Ordner „Klassenarbeit“): „KA_Tierbeschreibung_Bambudosei.pdf“, „KA_Tierbeschreibung_Wespuin.pdf“, „KA_Tierbeschreibung_Zwielement.pdf“. Auftrag: genaue Beschreibung anhand des Bildes und sinnvoll ausgewählter Notizen. Kein zusätzlicher App-Meilenstein.']
        }
      ],
      notes: [
        'Nutze App, Begleitpräsentation und analoge Materialien parallel: Die App zeigt Forschungswelt, Story und Freischaltungen. Die Präsentation liefert weiterhin Impulse, Aufgaben und Sicherungen; Arbeitsblätter und Heftarbeit bleiben zentral.',
        'Materialgrundlage: „Phantastische Tierwesen (Os).zip“, darin „Tiere beschreiben (FO)“. Die S-Angaben stammen aus den Ordnernamen: S1–S5, S5/S6, S7/S8, S9/S10 und S11/S12. Die Überlappung bei S5 ist im Material vorhanden. Eine Zuordnung einzelner Aufgaben zu S1, S2 usw. ist nicht belegt.',
        'Alle Folienangaben beziehen sich auf die 28 PDF-Seiten von „Begleitpräsentation_Phantastische Tierwesen.pdf“; die PPTX-Fassung liegt ebenfalls bei. Richte Dauer und Wiederholungen nach deiner Lerngruppe aus. Die folgenden App-Abschlüsse folgen weiterhin M0–M9; sie sind keine erfundene zusätzliche Stundenplanung.',
        'Wichtig: Der frühe Präsentationsabschnitt enthält bereits eigene Wesen und das Würfeln. Für den App-Fortschritt greifst du diese Aufgaben später bei M6 und M9 wieder auf. Der Ordner S9/S10 enthält Pferd und Riesenschnecke, nicht den Wespuin.'
      ]
    },
    {
      id: 'problems',
      label: 'Wenn etwas hakt',
      title: 'Wenn etwas hakt',
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

export function teacherGuideMilestoneLabel(block) {
  return block.milestones.map(id => {
    const index = milestones.findIndex(milestone => milestone.id === id);
    return `M${index} · ${milestones[index].title}`;
  }).join(' / ') || 'Kein eigener App-Meilenstein';
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
  function note(parent, title, items, className = '') {
    const box = element('section', '', `guide-note ${className}`);
    box.append(element('h4', title));
    prose(box, { items });
    parent.append(box);
  }
  function problemTable(parent, problems) {
    const table = element('table', '', 'guide-problems');
    const head = element('thead');
    const row = element('tr');
    ['Problem', 'Lösung'].forEach(label => { const cell = element('th', label); cell.scope = 'col'; row.append(cell); });
    head.append(row);
    const body = element('tbody');
    problems.forEach(([problem, solution]) => {
      const row = element('tr');
      const label = element('th', problem);
      label.scope = 'row';
      row.append(label, element('td', solution));
      body.append(row);
    });
    table.append(head, body);
    parent.append(table);
  }
  function select(index) {
    const data = teacherGuideConfig.tabs[index];
    tabButtons.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(index === i));
      tab.tabIndex = index === i ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tabButtons[index].id);
    panel.replaceChildren(element('h3', data.title));
    if (data.subtitle) panel.append(element('p', data.subtitle, 'guide-subtitle'));
    data.paragraphs?.forEach(text => panel.append(element('p', text)));
    if (data.motto) panel.append(element('blockquote', data.motto));
    if (data.preparation) {
      const preparation = element('section', '', 'guide-note guide-important');
      preparation.append(element('h4', 'Vor der ersten Stunde'));
      prose(preparation, { checklist: data.preparation });
      panel.append(preparation);
    }
    if (data.knowledge) {
      const columns = element('div', '', 'guide-columns');
      const structure = element('section');
      structure.append(element('h4', 'So ist die App aufgebaut'));
      prose(structure, { cards: data.cards });
      const right = element('section');
      note(right, 'Gut zu wissen', data.knowledge);
      right.append(element('h4', 'Unterrichtsweg'), element('p', data.route.join(' → '), 'guide-route'));
      columns.append(structure, right);
      panel.append(columns);
      note(panel, 'Reale und phantastische Tiere', data.didactics, 'guide-tip');
    } else if (data.quickProblems) {
      const columns = element('div', '', 'guide-columns guide-quick');
      const left = element('section');
      left.append(element('h4', 'Im Unterricht'));
      prose(left, { cards: data.cards });
      const right = element('section');
      right.append(element('h4', 'Wenn etwas hakt – Kurzfassung'));
      problemTable(right, data.quickProblems);
      columns.append(left, right);
      panel.append(columns);
      data.notes.forEach(([title, items]) => note(panel, title, items));
    } else if (data.notes) {
      const source = element('details', '', 'guide-source-notes');
      source.append(element('summary', 'Materialgrundlage und Zuordnung'));
      prose(source, { items: data.notes });
      panel.append(source);
    }
    if (data.blocks) panel.append(element('p', 'APP: Rahmen & Freischaltungen · PRÄSENTATION: Unterrichtsführung · MATERIAL: analoge Schülerarbeit', 'guide-legend'));
    data.blocks?.forEach((block, i) => {
      const node = element('section', '', 'guide-block');
      node.append(element('h4', `${i + 1}. ${block.title}`));
      const goal = element('p');
      goal.append(element('strong', 'Ziel: '), document.createTextNode(block.focus));
      node.append(goal);
      note(node, 'Du brauchst', [`MATERIAL · ${block.material}`, `PRÄSENTATION · ${block.presentation}`], 'guide-important');
      const table = element('table', '', 'guide-flow');
      const head = element('thead');
      const row = element('tr');
      ['Phase', 'Was machst du?', 'Material / App'].forEach(text => { const cell = element('th', text); cell.scope = 'col'; row.append(cell); });
      head.append(row);
      const body = element('tbody');
      block.phases.forEach(phase => {
        const row = element('tr');
        const label = element('th', phase.phase);
        label.scope = 'row';
        const reference = element('td');
        reference.append(element('span', phase.medium, `guide-medium medium-${phase.medium.toLowerCase()}`), element('p', phase.reference));
        row.append(label, element('td', phase.action), reference);
        body.append(row);
      });
      table.append(head, body);
      node.append(table, element('p', teacherGuideMilestoneLabel(block), 'guide-milestone'));
      if (block.tips) note(node, 'Differenzierung', block.tips, 'guide-tip');
      panel.append(node);
    });
    data.sections?.forEach(section => {
      const node = element('section', '', 'guide-section');
      node.append(element('h3', section.title));
      prose(node, section);
      panel.append(node);
    });
    if (data.problems) problemTable(panel, data.problems);
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
