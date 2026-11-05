# Bestiarium · Forschungsstation

Statische Browser-App für die Tierbeschreibung in Klasse 5. Bereitstellung weiterhin über GitHub Pages, ohne Build-Schritt oder Backend. `index.html` lädt ES-Module aus `js/`; gemeinsame Gestaltung in `css/app.css`.

## Layout im Fenster und Vollbild

`css/viewport.css` definiert einen gemeinsamen Inhaltsrahmen unter der tatsächlichen Kopfzeile. `js/layout.js` misst die verbleibende Fläche einschließlich Navigation und Fußleisten. Buchgrafiken, Karten, Expeditionen und Generator werden proportional eingepasst. ResizeObserver, Fenster- und Vollbildereignisse aktualisieren ausschließlich die Geometrie; sie bauen Ansichten oder Formulare nicht neu auf.

Die Tierseiten verwenden die originalen Buchgrafiken. In `js/book-reader.js` ist für jede Grafik eine geprüfte freie Schreibfläche rechts oben definiert; Illustrationen, Falz und Rahmen bleiben sichtbar. Der Kodex verwendet bewusst `master-bestiary.png`: Die ebenfalls vorhandene `research-codex-page.png` besitzt viele Verzierungen und weniger zusammenhängende Schreibfläche. Seine beiden freien Pergamentflächen erhalten getrennte Textspalten. Text wird bei gleichbleibender gut lesbarer Schrift in Folgeseiten aufgeteilt, nicht abgeschnitten oder verkleinert. „Textseite“ und „Nächstes/Voriges Tier“ sind separate Schaltflächen. Schriftänderungen und Resize berechnen die Aufteilung neu und erhalten die Textposition.

Für die vollständige lokale Entwicklungskontrolle `/tests/layout.html` öffnen und „Layout prüfen“ starten. Die Seite schaltet **nur auf localhost** die lokale Testklasse frei und erzeugt ausdrücklich gekennzeichnete Entwicklungswerke. Niemals mit echten Unterrichtsdaten in demselben lokalen Entwicklungsbrowser verwenden. Sie prüft alle Tiertexte einschließlich sämtlicher Textfolgeseiten, Kodexkapitel, Inhaltsverzeichnis, Kriterien, Weltkarte, Expeditionen mit Auftrag, beide Generatoren und manuellen Baukasten, die Sammlung mit PNG/JPEG/WebP und langen Texten sowie ein Verwaltungsformular. Bilder, Fassungen und Forschungsfortschritt werden vor/nach der Darstellung verglichen. Das bestehende Initialisieren der Baukasten-Auswahl wird beim Fortschrittsvergleich berücksichtigt.

Die konkrete HDMI-/ThinkPad-Konfiguration war in der zugänglichen Sitzung nicht identifizierbar. Browserprüfungen mit reduzierter normaler Inhaltsfläche und aktiviertem Browser-Vollbild ersetzen keinen Test an der tatsächlichen Smartboard-Hardware. Repräsentative Screenshots werden zusätzlich visuell kontrolliert.

## Buch der unentdeckten Wesen

Das Buch ist oben in der Navigation schon während des Einstiegs erreichbar, unabhängig vom Niffler und von allen Meilensteinen. Vidi führt es im Einstieg ein. Eigene Erfindungen dürfen erste Entwürfe sein. Das spätere Klassen-Bestiarium öffnet dieselbe Sammlung zum Rückblick. Die bisherigen Freischaltungen bleiben in `state.js` / `progress.js`; das Öffnen oder Bearbeiten der Sammlung setzt keinen Unterrichtsschritt auf abgeschlossen.

**Eintrag anlegen:** Oben links „Bestiarium“ anklicken, um den bestehenden Lehrkraftmodus zu öffnen. Im Bereich „Das Buch der unentdeckten Wesen“ auf „Eintrag anlegen“ klicken. Wesenname und Beschreibung ausfüllen, optional Bild, Kürzel, Notiz und Phase ergänzen. „Vorschau anzeigen“, anschließend „Eintrag speichern“. Jede weitere Änderung erfordert erneut eine Vorschau. Absätze und Schreibweise werden unverändert übernommen.

„Bearbeiten“ öffnet auch „Überarbeitung hinzufügen“. Diese zweite Fassung beginnt als Kopie der ersten. Änderungen an einer Fassung verändern die andere nicht. Überarbeitungen sind optional. Die ursprüngliche Fassung bleibt gespeichert, kann aber von der Lehrkraft ausdrücklich bearbeitet werden.

Die Verwaltung erlaubt Sichtbarkeit, Reihenfolge und bestätigtes Löschen einzelner Werke oder der Sammlung der aktiven Klasse. Die Schüleransicht zeigt ausschließlich sichtbare Werke, ohne Uploads oder Anmeldung.

## Gemeinsam am Smartboard präsentieren

Die Lehrkraft bereitet die Werke am Laptop vor. Wird **derselbe Laptop** an das Smartboard angeschlossen oder sein Bild übertragen, sind die Einträge direkt vorhanden. Dafür sind weder Export noch Import nötig.

- **Präsentationsmodus** in der Kopfzeile oder im geöffneten Buch aktivieren. Verwaltung und nebensächliche Hinweise werden ausgeblendet, Animationen gestoppt. **Präsentation beenden** ist jederzeit erreichbar. Eintrag, Fassung, Ansicht und Textposition bleiben beim Umschalten erhalten.
- Im Buch **Bild und Text**, **Nur Bild** oder **Nur Text** wählen. Einzelansichten verwenden die ganze Buchbreite; Bilder werden vollständig und ohne Beschneiden dargestellt.
- **Schrift & Fassung** aufklappen: Schrift in sechs Stufen von 24 bis 48 px wählen oder zwischen erster und überarbeiteter Fassung wechseln. Es gibt keine automatische Schriftverkleinerung.
- Lange Beschreibungen erscheinen auf **Textseiten**, passend zur tatsächlichen Schrift und Bildschirmfläche. Die Darstellung verändert weder Originaltext noch Absätze. Mit **Textseite › / ‹ Textseite** durch die Beschreibung blättern; **Wesen › / ‹ Wesen** wechselt direkt den Eintrag. Im Präsentationsmodus übernehmen zwei große Schaltflächen **Zurück / Weiter** beides: zunächst Textseiten, anschließend das nächste/vorherige Wesen. Die Pfeiltasten verhalten sich genauso. Beim Schreiben in Eingabefeldern greifen die Kürzel nicht.
- **Forschungsfrage zeigen / Nächste Frage** zeigt immer nur eine Frage in einer eigenen Zeile unter den Buchseiten. **Frage ausblenden** schafft wieder mehr Platz. Keine Überlagerung und kein automatischer Wechsel.
- **Vollbild** funktioniert unabhängig vom Präsentationsmodus, auch direkt im Buch. Vollbild kann über den Schalter oder die browserübliche Escape-Taste beendet werden. Der Buchzustand bleibt erhalten. Falls ein Browser Vollbild verweigert, bleibt der Präsentationsmodus nutzbar.

Die Einzelansicht nutzt große Querformatflächen, besonders 1920 × 1080 und 1366 × 768. Nur der äußere Buchdialog kann bei sehr kleinen Fenstern oder aufgeklappten langen Notizen scrollen; Textseiten haben keinen eigenen Scrollbereich.

## Sicherung oder tatsächlicher Geräte-/Browserwechsel

1. Im Lehrkraftmodus die gewünschte Klasse wählen und „Sammlung exportieren“ anklicken.
2. Die heruntergeladene JSON-Datei auf das Smartboard übertragen, etwa per USB-Stick.
3. Dort dieselbe App öffnen, im Lehrkraftmodus die passende Klasse wählen und „Sammlung importieren“ anklicken.
4. Datei wählen und ausdrücklich **Ergänzen** oder **Ersetzen** auswählen. Ersetzen verlangt zusätzlich eine Bestätigung. Ergänzen fügt Kopien hinzu, auch wenn diese Werke bereits vorhanden sind.

Die Datei enthält alle sichtbaren und ausgeblendeten Einträge, beide Fassungen und eingebettete Bilder. Der Unterrichtsfortschritt wird separat über „JSON exportieren/importieren“ gesichert. Wer auch den Fortschritt überträgt, importiert diesen **zuerst** und danach die Sammlung in die passende aktive Klasse.

## Speicher und Grenzen

- Sammlung pro Klassen-ID in IndexedDB (`bestiarium-creatures`, Store `collections`); Fortschritt und stabile Klassen-IDs weiterhin in localStorage (`bestiarium.classroom.v4`). Erstmalige Klassen-IDs werden jetzt sofort gespeichert.
- Fortschritts-Reset lässt die Sammlung bestehen. Beim Löschen einer Klasse wird ihre Kennung aus der Klassenverwaltung entfernt; ihre Sammlung wird nicht automatisch gelöscht und ist dann nur nach Wiederherstellung derselben Klassen-ID aus einer Fortschrittssicherung wieder zugeordnet. Deshalb vor dem Löschen einer Klasse beide Sicherungen exportieren; zum gezielten Entfernen von Schülerwerken die eigene Sammlungs-Löschfunktion verwenden.
- Browserdaten löschen, Privatmodus und Gerätewechsel können lokale Daten entfernen oder unzugänglich machen. Regelmäßig exportieren. Kein automatischer Abgleich zwischen Geräten oder gleichzeitig geöffneten Tabs; Sammlung möglichst nur in einem Tab bearbeiten.
- Ein Browser-Upload veröffentlicht keine Dateien im Repository. Es gibt weder KI-Bildgenerierung noch Backend, Zugangsdaten oder sicheren Zugriffsschutz im Lehrkraftmodus.
- PNG/JPG/WebP bis 25 MB und 80 Millionen Pixel; Bilder werden mit maximal 2400 Pixeln an der längsten Kante und hoher WebP-Qualität gespeichert. Transparenz bleibt bei WebP erhalten. Kein Hochskalieren kleiner Bilder. Maximal 300 Werke und 150 MB pro Sammlungsdatei; der verfügbare Browserspeicher kann geringer sein. Speicherfehler werden gemeldet, erfolgreiche Speicherung erst nach Transaktionsabschluss bestätigt.
- Importformat `bestiarium-creatures`, Version 1. Es werden nur die definierten Textfelder, boolesche Sichtbarkeit und eingebettete PNG/JPEG/WebP-Daten akzeptiert; Bilder werden vor dem Import decodiert. Texte werden ausschließlich mit `textContent` ausgegeben. Keine HTML-Ausführung, externen Bild-URLs oder SVG-Dateien.

## Prüfungen

Für eine eigene lokale Entwicklungsinstanz einen statischen HTTP-Server starten (nur `127.0.0.1`, nicht direkt `file://`). In einem separaten Entwicklungsbrowser `/tests/collection.html` öffnen. **Die Tests ändern den Fortschritt der lokalen Testklasse. Niemals mit echten Unterrichtsdaten ausführen.** Auf nicht lokalen Hosts wird die Ausführung verweigert.

Die elf Browser-Tests prüfen Validierung, Bildformate und Optimierung, beschädigte Dateien, Bildtransfer, beide Fassungen, IndexedDB, Klassentrennung, sichere/lange Texte, Ansichten und Fragen, CRUD/Reihenfolge/Sichtbarkeit, Bestätigungsabbruch und Trennung vom Fortschritt. Zusätzlich `/tests/presentation.html` auf localhost öffnen und „Präsentationstests ausführen“ wählen: acht Prüfgruppen für Breiten-/Höhennutzung, verlustfreie Textseiten, alle Ansichten, Vergrößerung bis 48 px, Tastatur mit Eingabeschutz, einzelne Fragen, Moduswechsel, drei Bildformate und unveränderte Speicherung. Testdaten sind ausdrücklich als Entwicklungsbeispiele gekennzeichnet und werden von der normalen App nicht geladen.

Zusätzlich: `node --check` für alle Dateien in `js/` und `tests/`; visuell Buch auf Laptop, Tablet und Smartboard prüfen, Neuladen und echte Download-/Dateiauswahl testen. Das Testszenario ersetzt keinen Test auf der konkreten Smartboard-Hardware.
