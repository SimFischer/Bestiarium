export const roomPhases = [
  'Verlassen', 'Erste Spuren', 'Forschungsstation', 'Expedition läuft', 'Vollendetes Archiv'
].map((name, id) => ({ id, name, image: `assets/station/phase-${id}.png` }));

export const animals = [
  {
    id: 'niffler', name: 'Niffler',
    textContent: [
      { heading: 'Aussehen', text: 'Der Niffler ist klein und gedrungen. Er hat dichtes dunkles Fell, eine lange rosige Schnauze und kurze Beine. Seine kräftigen Vorderpfoten tragen lange Krallen.' },
      { heading: 'Besondere Merkmale', text: 'Mit seinen beweglichen Vorderpfoten kann er graben und Gegenstände greifen. Glänzende Dinge interessieren ihn besonders.' },
      { heading: 'Lebensraum', text: 'Er lebt gern in geschützten Verstecken und unterirdischen Bauten.' },
      { heading: 'Nahrung', text: 'Noch nicht dokumentiert.' },
      { heading: 'Verhalten', text: 'Niffler sind neugierig. Auf der Suche nach glänzenden Gegenständen durchwühlen sie Taschen, Kisten und andere Aufbewahrungsorte.' }
    ]
  },
  {
    id: 'pandanaflora', name: 'Pandanaflora',
    textContent: [
      { heading: 'Aussehen', text: 'Das Tierwesen hat einen rundlichen Körper, einen hellen Kopf und dunkle Ohren. Dunkle Flecken umgeben seine grünen Augen. Die Beine sind kurz und kräftig.' },
      { heading: 'Besondere Merkmale', text: 'Grüne, blattförmige Strukturen bedecken den Rücken und den langen Schwanz. Zwischen den Blättern liegen gelbe, längliche Früchte.' },
      { heading: 'Beobachtung', text: 'Die Studie zeigt das Tierwesen zwischen Pflanzen. Beschreibt Kopf, Rumpf, Beine und Schwanz in einer sinnvollen Reihenfolge.' }
    ]
  },
  {
    id: 'wolf', name: 'Wolf',
    textContent: [
      { heading: 'Aussehen', text: 'Der Wolf hat einen länglichen Körper, dichtes graubraunes Fell und eine helle Schnauzenpartie. Seine Ohren sind aufgerichtet und laufen spitz zu.' },
      { heading: 'Besondere Merkmale', text: 'An den kräftigen Pfoten sitzen Krallen. Der buschige Schwanz und die lange Schnauze gehören zu seinen auffälligen Merkmalen.' },
      { heading: 'Beobachtung', text: 'Die Studien zeigen Kopf, Pfote, Fell und Spuren. Achtet auf die genaue Form und die unterschiedlichen Fellfarben.' }
    ]
  },
  {
    id: 'bowtruckle', name: 'Bowtruckle',
    textContent: [
      { heading: 'Aussehen', text: 'Der Bowtruckle ist schmal und länglich. Sein grüner Körper erinnert an einen Zweig. Am Kopf wachsen blattförmige Strukturen.' },
      { heading: 'Besondere Merkmale', text: 'Lange, dünne Arme und Beine gehen in verzweigte Finger und Zehen über. Kleine dunkle Augen sitzen im schmalen Kopf.' },
      { heading: 'Beobachtung', text: 'Vergleicht das Tierwesen mit den Zweigen in der Studie. Welche Formen und Farben machen es zwischen den Pflanzen schwer erkennbar?' }
    ]
  },
  {
    id: 'zuckerdornechse', name: 'Zuckerdornechse',
    textContent: [
      { heading: 'Aussehen', text: 'Die Zuckerdornechse hat einen gedrungenen Körper, vier kurze Beine und einen langen, gebogenen Schwanz. Ihre Haut besteht aus vielen kleinen Schuppen.' },
      { heading: 'Besondere Merkmale', text: 'Rote, spitze Kristalle sitzen auf Kopf, Rücken und Schwanz. Die grünlichen Schuppen heben sich vom orangefarbenen Bauch ab.' },
      { heading: 'Beobachtung', text: 'Die Studie zeigt das Tierwesen in einer felsigen Vulkanlandschaft. Beschreibt die Anordnung der Kristalle und die Form der kräftigen Krallen.' }
    ]
  },
  {
    id: 'wespuin', name: 'Wespuin',
    textContent: [
      { heading: 'Aussehen', text: 'Der Wespuin besitzt einen rundlichen, schwarz-gelb gestreiften Körper. Am Kopf sitzen große dunkle Augen, ein spitzer Schnabel und zwei lange Fühler.' },
      { heading: 'Besondere Merkmale', text: 'Durchscheinende Flügel wachsen am Rücken. Die Beine tragen gelbe, dicht behaarte Abschnitte.' },
      { heading: 'Beobachtung', text: 'Die Studie zeigt das Tierwesen auf einer Blüte. Vergleicht Flügel, Fühler und Beine mit bekannten Tieren.' }
    ]
  },
  {
    id: 'codex', name: 'Forschercodex', type: 'codex', assetName: 'research-codex-page',
    textContent: [
      { heading: 'Überschrift und Einleitung', text: 'Wählt eine treffende Überschrift. Nennt die Tierart oder den Tiernamen und eine auffällige Besonderheit.', x: 24, y: 10, width: 21, height: 22 },
      { heading: 'Größe und Aussehen', text: 'Beschreibt Größe, bei Bedarf Gewicht, Körperteile, Farben, Formen und besondere Merkmale genau.', x: 19, y: 40, width: 26, height: 18 },
      { heading: 'Reihenfolge und Schluss', text: 'Geht sinnvoll vor, etwa vom Kopf bis zum Schwanz. Am Schluss passen Verhalten, Lebensraum, Nahrung oder Lebenserwartung.', x: 17, y: 65, width: 28, height: 14 },
      { heading: 'Genau und sachlich schreiben', text: 'Verwendet treffende Adjektive und passende Vergleiche. Schreibt im Präsens und ohne persönliche Wertung. Andere sollen sich das Tier genau vorstellen können.', x: 54, y: 10, width: 28, height: 31 },
      { heading: 'Phantastische Tierwesen', text: 'Verbindet Bekanntes sinnvoll: Tiere, Pflanzen oder Gegenstände. Besondere Merkmale brauchen eine nachvollziehbare Logik. Überladet euer Wesen nicht mit Fähigkeiten. Größe und Gewicht sollen plausibel bleiben.', x: 54, y: 49, width: 29, height: 21 }
    ]
  },
  { id: 'classBestiary', name: 'Klassen-Bestiarium', type: 'class', feature: 'classBestiary', assetName: 'class-bestiary-page', textContent: [] }
].map(entry => ({ type: 'animal', unlocked: false, ...entry, pageAsset: `assets/bestiary/${entry.assetName || `${entry.id}-bestiary-page`}.png` }));

export const mapConfig = { asset: 'assets/map/worldmap-full.png', revealDuration: 3600 };
export const regions = [
  { id: 'station', name: 'Forschungsstation', unlocked: true, x: 7, y: 57, width: 25, height: 31 },
  { id: 'forest', name: 'Waldregion', unlocked: false, x: 2, y: 20, width: 32, height: 43,
    vidiDialog: 'region-forest' },
  { id: 'plant', name: 'Pflanzenregion', unlocked: false, x: 35, y: 52, width: 34, height: 39,
    vidiDialog: 'region-plant' },
  { id: 'volcano', name: 'Vulkanregion', unlocked: false, x: 2, y: 3, width: 23, height: 16,
    vidiDialog: 'region-volcano' }
];
export const expeditions = [
  { id: 'forest-observation', regionId: 'forest', title: 'Beobachtung im Wald', creatureId: 'wild-boar', animationType: 'walk',
    background: 'forest-expedition-background.png',
    creatures: [
      { id: 'wild-boar', name: 'Wildschwein', x: 24, y: 64, scale: 1.1, animationType: 'walk',
        frames: ['wild-boar-idle.png', 'wild-boar-step-a.png', 'wild-boar-step-b.png'],
        travel: 12, duration: 28, cadence: 1.2 },
      { id: 'mooshorn', name: 'Mooshorn', x: 77, y: 51, scale: 1.45, animationType: 'walk',
        frames: ['forest-fantasy-idle.png', 'forest-fantasy-step-a.png', 'forest-fantasy-step-b.png'],
        travel: -9, duration: 44, cadence: 2 }
    ] },
  { id: 'plant-observation', regionId: 'plant', title: 'Beobachtung in der Pflanzenregion',
    background: 'plants-expedition-background.png',
    creatures: [
      { id: 'giant-african-snail', name: 'Afrikanische Riesenschnecke', x: 23, y: 68, scale: 1.05, motionType: 'glide',
        frames: ['giant-african-snail.png'], travel: 6, duration: 140, delay: 6 },
      { id: 'bloomwing', name: 'Blütenflügler', x: 77, y: 59, scale: 1.05, animationType: 'walk',
        frames: ['bloomwing-idle.png', 'bloomwing-step-a.png', 'bloomwing-step-b.png'],
        travel: -14, duration: 32, cadence: 1.6, delay: 1 }
    ] },
  { id: 'volcano-observation', regionId: 'volcano', title: 'Beobachtung im Vulkanland',
    background: 'volcano-expedition-background.png',
    creatures: [
      { id: 'fire-salamander', name: 'Feuersalamander', x: 27, y: 71, scale: 0.95, motionType: 'glide',
        frames: ['fire-salamander.png'], travel: 8, duration: 96, delay: 3 },
      { id: 'ash-phoenix', name: 'Aschenphönix', x: 77, y: 29, scale: 1.25, motionType: 'fly',
        frames: ['phoenix-hover.png', 'phoenix-flap-a.png', 'phoenix-flap-b.png'],
        travel: -40, duration: 76, cadence: 2.4, floatDuration: 8, lift: 0.8 }
    ] }
].map(item => ({
  ...item, unlocked: false, backgroundAsset: `assets/expeditions/${item.id}/${item.background || 'background.png'}`,
  hint: 'Beobachtet genau. Welche Merkmale fallen euch auf?',
  vidiDialog: `expedition-${item.regionId}`,
  creatures: (item.creatures || [{ id: item.creatureId, x: 52, y: 62, scale: 1, animationType: item.animationType }]).map(creature => ({
    ...creature, asset: `assets/expeditions/${item.id}/${creature.id}.png`,
    frames: creature.frames?.map(file => `assets/expeditions/${item.id}/${file}`)
  }))
}));
export const features = [
  { id: 'generator', name: 'Tierwesen-Generator', description: 'Mischt Eigenschaften für neue Tierwesen. Zeichnet und beschreibt sie anschließend auf Papier.' },
  { id: 'classBestiary', name: 'Klassen-Bestiarium' }
];
export const hotspots = [
  { id: 'bestiary', name: 'Bestiarium', x: 27, y: 55, width: 48, height: 29 },
  { id: 'world-map', name: 'Weltkarte', x: 39, y: 10, width: 36, height: 34 },
  { id: 'generator', name: 'Tierwesen-Generator', x: 84, y: 30, width: 14, height: 23, feature: 'generator' },
  { id: 'bestiary', bookId: 'classBestiary', name: 'Klassen-Bestiarium', x: 75, y: 63, width: 16, height: 22, feature: 'classBestiary' },
  { id: 'bestiary', bookId: 'codex', name: 'Forschercodex', x: 25, y: 48, width: 7, height: 9 }
];

export const classBestiaryPages = [];
export const bestiaryConfig = {
  indexAsset: 'assets/bestiary/master-bestiary.png',
  order: ['niffler', 'pandanaflora', 'wolf', 'bowtruckle', 'wespuin', 'zuckerdornechse', 'codex', 'classBestiary']
};

export const generatorConfig = {
  mode: 'traits',
  modes: [{ id: 'traits', title: 'Eigenschaften mischen' }],
  frameAsset: 'assets/generator/generator-machine-frame.png',
  vidiDialog: 'generator-first-open',
  categories: [
    { id: 'habitat', name: 'Lebensraum', values: ['Wasser', 'Luft', 'Wald', 'Wiese', 'Berg', 'Höhle', 'Wüste', 'Erde', 'Schnee', 'Vulkan', 'Buch'] },
    { id: 'shape', name: 'Gestalt', values: ['groß', 'klein', 'gigantisch', 'winzig', 'rund', 'eckig', 'spitz', 'lang', 'kurz', 'flach', 'breit'] },
    { id: 'special', name: 'Besonderheit', values: ['Flügel', 'Beine', 'Augen', 'Maul', 'Ohren', 'Finger', 'Haut', 'Fell', 'Krallen', 'Ruf', 'Nase'] },
    { id: 'type', name: 'Typ', values: ['Wasser', 'Luft', 'Pflanze', 'Gestein', 'Fee', 'Geist', 'Elektro', 'Metall', 'Drache', 'Feuer', 'Käfer'] },
    { id: 'color', name: 'Farbe', values: ['blau', 'gelb', 'grün', 'lila', 'braun', 'orange', 'rot', 'rosa', 'schwarz', 'bunt', 'türkis'] },
    { id: 'pattern', name: 'Muster', values: ['einfarbig', 'gestreift', 'gepunktet', 'kariert', 'gefleckt', 'verlaufend', 'abwechselnd', 'verblassend', 'geometrisch', 'verschlungen', 'Kreise'] },
    { id: 'similarity1', name: 'Vorbild 1', values: ['Schildkröte', 'Vogel', 'Reh', 'Käfer', 'Schnecke', 'Fledermaus', 'Kaktus', 'Wurm', 'Pinguin', 'Salamander', 'Biene'] },
    { id: 'similarity2', name: 'Vorbild 2', values: ['Raupe', 'Schlange', 'Blume', 'Oktopus', 'Baum', 'Blätter', 'Stein', 'Phönix', 'Schnabeltier', 'Frucht', 'Gemüse'] }
  ].map(category => ({ ...category, values: [...category.values, 'Freie Wahl – wählt zwei!'] }))
};

export const generatorBuilderConfig = {
  id: 'builder', title: 'Tierwesen zusammensetzen',
  canvas: { width: 1600, height: 1200 },
  categoryOrder: ['head', 'body', 'legs', 'tail', 'extra'],
  layers: [
    { id: 'body', name: 'Körper', collection: 'bodies' },
    { id: 'legs', name: 'Beine', collection: 'legs' },
    { id: 'tail', name: 'Schwanz', collection: 'tails' },
    { id: 'head', name: 'Kopf', collection: 'heads' },
    { id: 'extra', name: 'Extra', collection: 'extras' }
  ],
  heads: [['wolf', 'Wolf'], ['bird', 'Vogel'], ['reptile', 'Reptil'], ['deer', 'Hirsch'], ['insect', 'Insekt']],
  bodies: [['furry', 'Fell'], ['slender', 'Schlank'], ['heavy', 'Kräftig'], ['scaled', 'Schuppen'], ['plant', 'Pflanze']],
  legs: [['paws', 'Pfoten'], ['hooves', 'Hufe'], ['claws', 'Krallen'], ['bird', 'Vogelbeine'], ['insect', 'Insektenbeine']],
  tails: [['bushy', 'Buschig'], ['reptile', 'Reptil'], ['leaf', 'Blatt'], ['feather', 'Federn'], ['spiked', 'Stacheln']],
  extras: [['wings', 'Flügel'], ['antlers', 'Geweih / Horn'], ['leaves', 'Blätter'], ['crystals', 'Kristalle'], ['spines', 'Rückenstacheln']]
};
generatorBuilderConfig.layers.forEach(layer => {
  generatorBuilderConfig[layer.collection] = generatorBuilderConfig[layer.collection].map(([id, name]) => ({
    id, name, asset: `assets/generator-builder/${layer.collection}/${layer.id}-${id}.png`
  }));
});
// Geweih / Horn bleibt logisch ein Extra; die Datei richtet sich nach dem gewählten Kopf.
const antlers = generatorBuilderConfig.extras.find(variant => variant.id === 'antlers');
antlers.assetsByHead = Object.fromEntries(generatorBuilderConfig.heads.map(head => [head.id, `assets/generator-builder/extras/extra-antlers-${head.id}.png`]));
delete antlers.asset;
export const variantAssets = variant => variant.assetsByHead ? Object.values(variant.assetsByHead) : [variant.asset];
export const builderAsset = (variant, result) => variant.assetsByHead?.[result.head] || variant.asset;
export const builderAssets = generatorBuilderConfig.layers.flatMap(layer => generatorBuilderConfig[layer.collection].flatMap(variantAssets));
