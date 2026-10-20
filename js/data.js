export const roomPhases = [
  'Verlassen', 'Erste Spuren', 'Forschungsstation', 'Expedition läuft', 'Vollendetes Archiv'
].map((name, id) => ({ id, name, image: `assets/station/phase-${id}.png` }));

export const animalStatuses = {
  hidden: 'Noch unbekannt', hint: 'Erste Spur', sighted: 'Gesichtet',
  documented: 'Dokumentiert', verified: 'Überprüft'
};
export const animals = [
  { id: 'niffler', name: 'Niffler', hint: 'Eine Spur führt zu einem unbekannten Tierwesen.' },
  { id: 'pandanaflora', name: 'Pandanaflora', hint: 'Etwas Unbekanntes verbirgt sich in der Pflanzenwelt.' },
  { id: 'wolf', name: 'Wolf', hint: 'Pfotenabdrücke wurden entdeckt.' },
  { id: 'zuckerdornechse', name: 'Zuckerdornechse', hint: 'Eine ungewöhnliche Spur wartet auf Untersuchung.' }
];
export const regionStatuses = { hidden: 'Unbekannt', discovered: 'Entdeckt', explored: 'Erforscht' };
export const regions = [
  { id: 'base', name: 'Forschungsstation' }, { id: 'forest', name: 'Wald' },
  { id: 'mountains', name: 'Gebirge' }, { id: 'wetlands', name: 'Feuchtgebiete' },
  { id: 'volcano', name: 'Vulkanland' }, { id: 'frost', name: 'Frostlande' },
  { id: 'island', name: 'Insel' }
];
export const features = [
  { id: 'generator', name: 'Tierwesen-Generator', description: 'Das Gerät ist bereit. Die Erschaffung neuer Tierwesen folgt in einer späteren Ausbaustufe.' },
  { id: 'classBestiary', name: 'Klassen-Bestiarium', description: 'Band II wartet auf die selbst erfundenen Tierwesen unserer Klasse.' },
  { id: 'codex', name: 'Forscherkodex', description: 'Hier entsteht später unser gemeinsamer Forscherkodex.' }
];
// Prozentwerte beziehen sich für alle Raumphasen auf dieselbe 16:9-Szene.
export const hotspots = [
  { id: 'bestiary', name: 'Bestiarium', x: 27, y: 55, width: 48, height: 29 },
  { id: 'world', name: 'Weltkarte', x: 39, y: 10, width: 36, height: 34 },
  { id: 'generator', name: 'Tierwesen-Generator', x: 84, y: 30, width: 14, height: 23, feature: 'generator' },
  { id: 'classBestiary', name: 'Klassen-Bestiarium', x: 75, y: 63, width: 16, height: 22, feature: 'classBestiary' },
  { id: 'codex', name: 'Forscherkodex', x: 25, y: 48, width: 7, height: 9, feature: 'codex' }
];
