# Bestiarium · Forschungsstation

Statische Browser-App für die Tierbeschreibung in Klasse 5. Bereitstellung weiterhin über GitHub Pages, ohne Build-Schritt oder Backend. `index.html` lädt ES-Module aus `js/`; gemeinsame Gestaltung in `css/app.css`.

## Buch der unentdeckten Wesen

Das Buch ist oben in der Navigation schon während des Einstiegs erreichbar, unabhängig vom Niffler und von allen Meilensteinen. Vidi führt es im Einstieg ein. Eigene Erfindungen dürfen erste Entwürfe sein. Das spätere Klassen-Bestiarium öffnet dieselbe Sammlung zum Rückblick. Die bisherigen Freischaltungen bleiben in `state.js` / `progress.js`; das Öffnen oder Bearbeiten der Sammlung setzt keinen Unterrichtsschritt auf abgeschlossen.

**Eintrag anlegen:** Oben links „Bestiarium“ anklicken, um den bestehenden Lehrkraftmodus zu öffnen. Im Bereich „Das Buch der unentdeckten Wesen“ auf „Eintrag anlegen“ klicken. Wesenname und Beschreibung ausfüllen, optional Bild, Kürzel, Notiz und Phase ergänzen. „Vorschau anzeigen“, anschließend „Eintrag speichern“. Jede weitere Änderung erfordert erneut eine Vorschau. Absätze und Schreibweise werden unverändert übernommen.

„Bearbeiten“ öffnet auch „Überarbeitung hinzufügen“. Diese zweite Fassung beginnt als Kopie der ersten. Änderungen an einer Fassung verändern die andere nicht. Überarbeitungen sind optional. Die ursprüngliche Fassung bleibt gespeichert, kann aber von der Lehrkraft ausdrücklich bearbeitet werden.

Die Verwaltung erlaubt Sichtbarkeit, Reihenfolge und bestätigtes Löschen einzelner Werke oder der Sammlung der aktiven Klasse. Die Schüleransicht zeigt ausschließlich sichtbare Werke, ohne Uploads oder Anmeldung. Einzelansichten bieten Fassungswechsel, getrenntes Verdecken von Bild und Text und optionale Gesprächsimpulse. Lange Texte werden vollständig auf Textfolgeseiten verteilt; innerhalb der Buchseiten gibt es keine Scrollbalken. Die Sammlungsübersicht und die Lehrkraftvorschau bleiben fließende Ansichten.

## Auf das Smartboard übertragen

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

Die Tierseiten, das Inhaltsverzeichnis und die Kodexkapitel passen das Buch proportional in die nach den Bedienelementen verbleibende Breite und Höhe ein. Auf Tiergrafiken ist ausschließlich die Fläche bei 54–92 % der Breite und 8–45 % der Höhe für Text freigegeben. Die untere Illustration bleibt unverändert sichtbar. Der Kodex und das Verzeichnis verwenden die vorhandene freie Doppelseite; ihre Inhaltsflächen berücksichtigen Falz und Pergamentränder. Lesbare Mindestschriftgrößen werden durch gemessene Folgeseiten ermöglicht, einschließlich einzelner langer Abschnitte und ungetrennter Wörter. Fenstergröße, Browserzoom und geladene Schriftarten lösen eine neue Aufteilung aus. Die aktuelle Textposition bleibt dabei nach Möglichkeit erhalten. Textseiten und Eintragswechsel haben getrennte Bedienelemente. Es werden ausschließlich Ansichten verändert, keine gespeicherten Texte, Bilder oder Fortschritte.

`tests/book-layout.html` ist eine ausschließlich auf localhost erlaubte Layout-Testansicht mit isolierten Entwicklungsbeispielen. `tests/book-layout.cjs` startet einen eigenen Server und ein temporäres Chrome-Profil. Es benötigt Node.js, Playwright und Chrome (optional über `BESTIARIUM_CHROME` festlegen). Ausführen mit `node tests/book-layout.cjs`; Playwright muss für Node auflösbar sein. Die Prüfung verwendet echten Chrome-Browserzoom von 100/125/150 % bei 1920×1080, 1366×768 und 1900×830, liest sämtliche Folgeseiten und vergleicht den vollständigen Tiertext. Sie prüft außerdem Kodex, Verzeichnis, lange Einzelabschnitte und Schülerwerke. Screenshots landen im ausgegebenen temporären Verzeichnis; über `BOOK_TEST_OUTPUT` lässt sich ein anderes Ziel wählen. Niemals das Profil oder den Ursprung einer echten Unterrichtsinstanz zum Testen verwenden.

Für eine eigene lokale Entwicklungsinstanz einen statischen HTTP-Server starten (nur `127.0.0.1`, nicht direkt `file://`). In einem separaten Entwicklungsbrowser `/tests/collection.html` öffnen. **Die Tests ändern den Fortschritt der lokalen Testklasse. Niemals mit echten Unterrichtsdaten ausführen.** Auf nicht lokalen Hosts wird die Ausführung verweigert.

Die elf Browser-Tests prüfen Validierung, Bildformate und Optimierung, beschädigte Dateien, Bildtransfer, beide Fassungen, IndexedDB, Klassentrennung, sichere/lange Texte, Präsentationsschalter, CRUD/Reihenfolge/Sichtbarkeit, Bestätigungsabbruch und Trennung vom Fortschritt. Testdaten sind ausdrücklich als Entwicklungsbeispiele gekennzeichnet und werden von der normalen App nicht geladen.

Zusätzlich: `node --check` für alle Dateien in `js/` und `tests/`; visuell Buch auf Laptop, Tablet und Smartboard prüfen, Neuladen und echte Download-/Dateiauswahl testen. Das Testszenario ersetzt keinen Test auf der konkreten Smartboard-Hardware.
