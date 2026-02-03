import {
  CatalogOptionSeed,
  HeatingType,
  LedType,
  LidColor,
  LidMaterial,
  LidType,
  OptionGroupKey,
  SpaSystemType,
  StairsMaterial,
  StairsType,
  ControlUnitType,
  CoverType,
  BaseShape,
  LEDInstallationType,
  ProductType,
  HeatingMode,
  HeaterLocation,
} from "../catalog/catalog.types";
import { toPriceExcl } from "../utils/price-util";

const withVat = (priceIncl: number, vatRatePercent = 21) => ({
  priceIncl,
  priceExcl: toPriceExcl(priceIncl, vatRatePercent),
  vatRatePercent,
});

export const catalogOptions: CatalogOptionSeed[] = [
  {
    groupKey: OptionGroupKey.COOLER_BASE,
    key: "ICE-TUB-CHILLER-ECO",
    name: "Ice Tub Chiller Eco",
    description:
      "Ontdek de Ice Tub Chiller Model Economic: krachtige koeling, eenvoudige bediening en direct uit voorraad leverbaar. Ideaal voor jouw Ice Tub met 1 PK vermogen en 2500 W koelcapaciteit. Koop nu voor optimale prestaties en voordelige prijzen!",
    ...withVat(0, 21),
    images: ['/placeholders/material-1.png'],
    attributes: {
      power: "1 PK",
      coolingCapacity: "2500 W",
    },
  },

// =========================
  // HEATER INSTALLATION / MODE (3 options)
  // =========================  
  {
    groupKey: OptionGroupKey.HEATER_INSTALLATION,
    key: 'HEATING-MODE-EXTERNAL',
    name: 'Externe houtkachel (extern)',
    description:
      'De houtkachel staat buiten de hottub en wordt aangesloten met leidingen. Alleen houtgestookt. Vaak efficiënter stoken en meer ruimte in de kuip.',
    // external base surcharge (example €0)
    ...withVat(0, 21),
    images: ['/placeholders/material-1.png'],
    attributes: { mode: HeatingMode.EXTERNAL },
  },
  {
    groupKey: OptionGroupKey.HEATER_INSTALLATION,
    key: 'HEATING-MODE-INTERNAL',
    name: 'Geïntegreerde kachel (intern)',
    description:
      'De kachel wordt in de hottub/sauna geïntegreerd. Kies hierna een interne houtkachel óf een elektrische kachel. Strakke uitstraling en compact geplaatst.',
    // price: integrated surcharge (example €200)
    ...withVat(200, 21),
    images: ['/placeholders/material-1.png'],
    attributes: { mode: HeatingMode.INTERNAL },
  },
  {
    groupKey: OptionGroupKey.HEATER_INSTALLATION,
    key: 'HEATING-MODE-HYBRID',
    name: 'Hybride (hout extern + elektrisch intern)',
    description:
      'Combineer een externe houtkachel met een interne elektrische kachel. Hout voor snel opwarmen, elektrisch voor bijverwarmen of warmhouden. Je kiest hierna beide kachels.',
    // set your hybrid surcharge if any (example €200 or €0)
    ...withVat(200, 21),
    images: ['/placeholders/material-1.png'],
    attributes: { mode: HeatingMode.HYBRID },
  },

  // =========================
  // HEATING BASE (WOOD internal)
  // =========================
  {
    groupKey: OptionGroupKey.HEATING_BASE,
    key: 'AISI304-INTERNAL-26KW-METAL',
    name: 'AISI 304 intern 26kW (metaal)',
    description: 'Interne houtkachel (AISI 304) met metalen deur. Robuust, duurzaam en onderhoudsvriendelijk.',
    ...withVat(0, 21),
    images: ['/placeholders/material-1.png'],
    attributes: {
      type: HeatingType.WOOD,
      location: HeaterLocation.INTERNAL,
      heatingTime: null,
      power: '26kW',
      voltage: null,
      pros: [],
      cons: [],
      doorType: 'METAL',
      kW: 26,
    },
  },
  {
    groupKey: OptionGroupKey.HEATING_BASE,
    key: 'AISI316-INTERNAL-26KW-GLASS',
    name: 'AISI 316 intern 26kW (glas)',
    description: 'Interne houtkachel (AISI 316) met glazen deur. Premium RVS met luxe uitstraling en extra corrosiebestendig.',
    ...withVat(195, 21),
    images: ['/placeholders/material-1.png'],
    attributes: {
      type: HeatingType.WOOD,
      location: HeaterLocation.INTERNAL,
      heatingTime: null,
      power: '26kW',
      voltage: null,
      pros: [],
      cons: [],
      doorType: 'GLASS',
      kW: 26,
    },
  },

  // =========================
  // HEATING BASE (WOOD external 20kW)
  // =========================
  {
    groupKey: OptionGroupKey.HEATING_BASE,
    key: 'AISI304-EXTERNAL-20KW-METAL',
    name: 'AISI 304 extern 20kW (metaal)',
    description: 'Externe houtkachel (AISI 304) met metalen deur. Efficiënte opwarming met extra ruimte in de kuip.',
    ...withVat(0, 21),
    images: ['/placeholders/material-2.png'],
    attributes: {
      type: HeatingType.WOOD,
      location: HeaterLocation.EXTERNAL,
      heatingTime: null,
      power: '20kW',
      voltage: null,
      pros: [],
      cons: [],
      doorType: 'METAL',
      kW: 20,
    },
  },
  {
    groupKey: OptionGroupKey.HEATING_BASE,
    key: 'AISI316-EXTERNAL-20KW-GLASS',
    name: 'AISI 316 extern 20kW (glas)',
    description: 'Externe houtkachel (AISI 316) met glazen deur. Premium RVS met luxe uitstraling en hogere corrosiebestendigheid.',
    ...withVat(195, 21),
    images: ['/placeholders/material-2.png'],
    attributes: {
      type: HeatingType.WOOD,
      location: HeaterLocation.EXTERNAL,
      heatingTime: null,
      power: '20kW',
      voltage: null,
      pros: [],
      cons: [],
      doorType: 'GLASS',
      kW: 20,
    },
  },

  // =========================
  // HEATING BASE (WOOD external XL 30kW)
  // =========================
  {
    groupKey: OptionGroupKey.HEATING_BASE,
    key: 'AISI304-EXTERNAL-XL-30KW-METAL',
    name: 'AISI 304 extern XL 30kW (metaal)',
    description: 'Externe XL houtkachel (AISI 304) met metalen deur. Extra vermogen voor sneller opwarmen en grotere volumes.',
    ...withVat(295, 21),
    images: ['/placeholders/material-3.png'],
    attributes: {
      type: HeatingType.WOOD,
      location: HeaterLocation.EXTERNAL,
      heatingTime: null,
      power: '30kW',
      voltage: null,
      pros: [],
      cons: [],
      doorType: 'METAL',
      kW: 30,
    },
  },
  {
    groupKey: OptionGroupKey.HEATING_BASE,
    key: 'AISI316-EXTERNAL-XL-30KW-GLASS',
    name: 'AISI 316 extern XL 30kW (glas)',
    description: 'Externe XL houtkachel (AISI 316) met glazen deur. Premium RVS, luxe uitstraling en extra corrosiebestendig.',
    ...withVat(445, 21),
    images: ['/placeholders/material-3.png'],
    attributes: {
      type: HeatingType.WOOD,
      location: HeaterLocation.EXTERNAL,
      heatingTime: null,
      power: '30kW',
      voltage: null,
      pros: [],
      cons: [],
      doorType: 'GLASS',
      kW: 30,
    },
  },

  // =========================
  // HEATING BASE (ELECTRIC)
  // =========================
  {
    groupKey: OptionGroupKey.HEATING_BASE,
    key: 'ELECTRIC-6KW',
    name: '6kW elektrische kachel',
    description: 'Elektrische kachel 6kW. Geschikt voor kleinere ruimtes; eenvoudig te regelen en onderhoudsarm (3-fase vereist).',
    ...withVat(800, 21),
    images: ['/placeholders/material-3.png'],
    attributes: {
      type: HeatingType.ELECTRIC,
      location: HeaterLocation.INTERNAL, // usable for INTERNAL (electric only) and HYBRID (internal electric)
      heatingTime: '45-60 min',
      power: '6kW',
      voltage: '3-fase',
      pros: ['Geen hout nodig', 'Constante temperatuur', 'Eenvoudig te regelen', 'Geen rook of as'],
      cons: ['3-fase stroom vereist', 'Hogere stroomkosten', 'Geen authentieke houtvuurervaring'],
      kW: 6,
    },
  },
  {
    groupKey: OptionGroupKey.HEATING_BASE,
    key: 'ELECTRIC-9KW',
    name: '9kW elektrische kachel',
    description: 'Elektrische kachel 9kW. Snellere opwarming voor middelgrote ruimtes; stabiele prestaties (3-fase vereist).',
    ...withVat(1200, 21),
    images: ['/placeholders/material-4.png'],
    attributes: {
      type: HeatingType.ELECTRIC,
      location: HeaterLocation.INTERNAL,
      heatingTime: '30-45 min',
      power: '9kW',
      voltage: '3-fase',
      pros: ['Snelle opwarming', 'Betrouwbare prestaties', 'Eenvoudig onderhoud'],
      cons: ['3-fase stroom vereist', 'Hogere stroomkosten', 'Geen authentieke houtvuurervaring'],
      kW: 9,
    },
  },
  {
    groupKey: OptionGroupKey.HEATING_BASE,
    key: 'ELECTRIC-12KW',
    name: '12kW elektrische kachel',
    description: 'Elektrische kachel 12kW. Sterke prestaties voor grotere ruimtes; snel op temperatuur (3-fase vereist).',
    ...withVat(1600, 21),
    images: ['/placeholders/material-1.png'],
    attributes: {
      type: HeatingType.ELECTRIC,
      location: HeaterLocation.INTERNAL,
      heatingTime: '25-35 min',
      power: '12kW',
      voltage: '3-fase',
      pros: ['Snelle opwarming', 'Professionele kwaliteit', 'Constante prestaties'],
      cons: ['3-fase stroom vereist', 'Hoog stroomverbruik', 'Geen authentieke houtvuurervaring'],
      kW: 12,
    },
  },
  {
    groupKey: OptionGroupKey.HEATING_BASE,
    key: 'ELECTRIC-18KW',
    name: '18kW elektrische kachel',
    description: 'Elektrische kachel 18kW. Voor zeer grote volumes of intensief gebruik; zeer snelle opwarming (3-fase vereist).',
    ...withVat(2200, 21),
    images: ['/placeholders/material-2.png'],
    attributes: {
      type: HeatingType.ELECTRIC,
      location: HeaterLocation.INTERNAL,
      heatingTime: '20-30 min',
      power: '18kW',
      voltage: '3-fase',
      pros: ['Zeer snelle opwarming', 'Professionele kwaliteit', 'Geschikt voor grote volumes'],
      cons: ['3-fase stroom vereist', 'Zeer hoge stroomkosten', 'Geen authentieke houtvuurervaring'],
      kW: 18,
    },
  },

  // =========================
  // HEATER ADDONS (internal/external) with modes[]
  // =========================
  {
    groupKey: OptionGroupKey.HEATER_ADDONS_INTERNAL,
    key: 'BLACK-HEATER-PLATE',
    name: 'Zwarte kachelplaat',
    description: 'Stijlvolle zwarte afwerking voor de kachelplaat. Past bij interne opstellingen en hybride combinaties.',
    ...withVat(20, 21),
    images: ['/placeholders/material-1.png'],
    attributes: { modes: [HeatingMode.INTERNAL, HeatingMode.HYBRID], heatingType: HeatingType.WOOD },
  },
  {
    groupKey: OptionGroupKey.HEATER_ADDONS_EXTERNAL,
    key: 'HEATER-ELBOWS-SET',
    name: 'Kachelbochten set',
    description: 'Extra pijpverbindingen/bochten voor een externe houtkachel. Handig bij lastige aansluitroutes.',
    ...withVat(20, 21),
    images: ['/placeholders/material-1.png'],
    attributes: { modes: [HeatingMode.EXTERNAL, HeatingMode.HYBRID], heatingType: HeatingType.WOOD },
  },
  {
    groupKey: OptionGroupKey.HEATER_ADDONS_EXTERNAL,
    key: 'CHIMNEY-EXTRA',
    name: 'Extra schoorsteen (1m)',
    description: 'Extra schoorsteenlengte voor betere trek en ventilatie bij een externe houtkachel.',
    ...withVat(20, 21),
    images: ['/placeholders/material-1.png'],
    attributes: { modes: [HeatingMode.EXTERNAL, HeatingMode.HYBRID], heatingType: HeatingType.WOOD },
  },


// =========================
// MATERIALS (INTERNAL)
// =========================
{
  groupKey: OptionGroupKey.MATERIALS_INTERNAL_BASE,
  key: 'INTERNAL-FIBERGLASS-STANDARD',
  name: 'Standard (fiberglass)',
  description: 'Standaard afwerking in fiberglass',
  ...withVat(0, 21),
  images: ['/placeholders/material-1.png'],
  attributes: { material: 'FIBERGLASS', finish: 'STANDARD' },
},
{
  groupKey: OptionGroupKey.MATERIALS_INTERNAL_BASE,
  key: 'INTERNAL-FIBERGLASS-PEARL',
  name: 'Pearl (fiberglass)',
  description: 'Pearl afwerking in fiberglass',
  ...withVat(25, 21),
  images: ['/placeholders/material-1.png'],
  attributes: { material: 'FIBERGLASS', finish: 'PEARL' },
},
{
  groupKey: OptionGroupKey.MATERIALS_INTERNAL_BASE,
  key: 'INTERNAL-FIBERGLASS-GRANITE',
  name: 'Granite (fiberglass)',
  description: 'Granite afwerking in fiberglass',
  ...withVat(145, 21),
  images: ['/placeholders/material-1.png'],
  attributes: { material: 'FIBERGLASS', finish: 'GRANITE' },
},
{
  groupKey: OptionGroupKey.MATERIALS_INTERNAL_BASE,
  key: 'INTERNAL-ACRYLIC-STANDARD',
  name: 'Standard (acryl)',
  description: 'Standaard afwerking in acryl',
  ...withVat(495, 21),
  images: ['/placeholders/material-1.png'],
  attributes: { material: 'ACRYLIC', finish: 'STANDARD' },
},
{
  groupKey: OptionGroupKey.MATERIALS_INTERNAL_BASE,
  key: 'INTERNAL-ACRYLIC-MARBLE',
  name: 'Marble (acryl)',
  description: 'Marble afwerking in acryl',
  ...withVat(695, 21),
  images: ['/placeholders/material-1.png'],
  attributes: { material: 'ACRYLIC', finish: 'MARBLE' },
},

// =========================
// MATERIALS (EXTERNAL)
// =========================
{
  groupKey: OptionGroupKey.MATERIALS_EXTERNAL_BASE,
  key: 'EXTERNAL-SPRUCE',
  name: 'Vurenhout',
  description: 'Vurenhout buitenzijde',
  ...withVat(0, 21),
  images: ['/placeholders/material-1.png'],
  attributes: { material: 'WOOD', woodType: 'SPRUCE', profile: 'STANDARD' },
},
{
  groupKey: OptionGroupKey.MATERIALS_EXTERNAL_BASE,
  key: 'EXTERNAL-SPRUCE-W',
  name: 'Vurenhout (W-profiel)',
  description: 'Vurenhout buitenzijde met W-profiel',
  ...withVat(125, 21),
  images: ['/placeholders/material-1.png'],
  attributes: { material: 'WOOD', woodType: 'SPRUCE', profile: 'W_PROFILE' },
},
{
  groupKey: OptionGroupKey.MATERIALS_EXTERNAL_BASE,
  key: 'EXTERNAL-THERMO',
  name: 'Thermohout',
  description: 'Thermohout buitenzijde',
  ...withVat(195, 21),
  images: ['/placeholders/material-1.png'],
  attributes: { material: 'WOOD', woodType: 'THERMO', profile: 'STANDARD' },
},
{
  groupKey: OptionGroupKey.MATERIALS_EXTERNAL_BASE,
  key: 'EXTERNAL-THERMO-W',
  name: 'Thermohout (W-profiel)',
  description: 'Thermohout buitenzijde met W-profiel',
  ...withVat(299, 21),
  images: ['/placeholders/material-1.png'],
  attributes: { material: 'WOOD', woodType: 'THERMO', profile: 'W_PROFILE' },
},
{
  groupKey: OptionGroupKey.MATERIALS_EXTERNAL_BASE,
  key: 'EXTERNAL-WPC',
  name: 'WPC',
  description: 'WPC buitenzijde (alleen vierkant, vereist RVS hoeken)',
  ...withVat(499, 21),
  images: ['/placeholders/material-1.png'],
  attributes: {
    material: 'WPC',
    constraints: ['Alleen vierkante modellen', 'Vereist RVS hoeken'],
  },
},
{
  groupKey: OptionGroupKey.MATERIALS_EXTERNAL_BASE,
  key: 'EXTERNAL-WPC-HKC',
  name: 'WPC (HKC) - kunststof houtlook',
  description: 'WPC (HKC) buitenzijde',
  ...withVat(395, 21),
  images: ['/placeholders/material-1.png'],
  attributes: {
    material: 'WPC',
    variant: 'HKC',
    constraints: ['Alleen vierkante modellen', 'Vereist RVS hoeken'],
  },
},


  // =========================
  // INSULATION
  // =========================
// =========================
// INSULATION
// =========================
{
  groupKey: OptionGroupKey.INSULATION_BASE,
  key: "NO-INSULATION",
  name: "Geen isolatie",
  description: "Standaard constructie zonder extra isolatie",
  ...withVat(0, 21),
  images: ['/placeholders/material-1.png'],
  attributes: {
    level: "NONE",
    pros: ["Lagere kosten", "Snellere bouw"],
    cons: ["Hogere stookkosten", "Minder energie-efficiënt", "Langere opwarmtijd"],
  },
},
{
  groupKey: OptionGroupKey.INSULATION_BASE,
  key: "STANDARD-INSULATION",
  name: "Standaard isolatie",
  description: "Standaard minerale wol isolatie voor betere energie-efficiëntie",
  ...withVat(200, 21),
  images: ['/placeholders/material-1.png'],
  attributes: {
    level: "STANDARD",
    pros: ["Betere energie-efficiëntie", "Snellere opwarming", "Lagere gebruikskosten"],
    cons: ["Hogere aanschafprijs", "Iets dikkere wanden"],
  },
},
{
  groupKey: OptionGroupKey.INSULATION_BASE,
  key: "PREMIUM-INSULATION",
  name: "Premium isolatie",
  description: "Hoogwaardige isolatie voor maximale energie-efficiëntie",
  ...withVat(400, 21),
  images: ['/placeholders/material-1.png'],
  attributes: {
    level: "PREMIUM",
    pros: ["Maximale energie-efficiëntie", "Snelste opwarming", "Laagste gebruikskosten"],
    cons: ["Hoogste prijs", "Dikkere wanden"],
  },
},


// =========================
// SPASYSTEM
// =========================
{
  groupKey: OptionGroupKey.SPASYSTEM_BASE,
  key: "CIRCULATION-PUMP",
  name: "Circulatiepomp",
  description: "Vereist als geen hydromassagesysteem is geselecteerd",
  ...withVat(150, 21),
  images: ['/placeholders/material-1.png'],
  attributes: {
    type: SpaSystemType.CIRCULATION,
    powerKw: 0.5,
    nozzles: null,
    minimumRequire: true
  },
},
{
  groupKey: OptionGroupKey.SPASYSTEM_BASE,
  key: "HYDRO-MASSAGE-8",
  name: "Hydromassage systeem (8 sproeiers)",
  description: "Hydromassage systeem met 8 sproeiers voor ontspanning",
  ...withVat(250, 21),
  images: ['/placeholders/material-1.png'],
  attributes: {
    type: SpaSystemType.HYDRO_MASSAGE,
    powerKw: 1.1,
    nozzles: 8,
  },
},
{
  groupKey: OptionGroupKey.SPASYSTEM_BASE,
  key: "HYDRO-MASSAGE-12",
  name: "Hydromassage systeem (12 sproeiers)",
  description: "Hydromassage systeem met 12 sproeiers voor extra ontspanning",
  ...withVat(300, 21),
  images: ['/placeholders/material-1.png'],
  attributes: {
    type: SpaSystemType.HYDRO_MASSAGE,
    powerKw: 1.1,
    nozzles: 12,
  },
},
{
  groupKey: OptionGroupKey.SPASYSTEM_BASE,
  key: "HYDRO-MASSAGE-16",
  name: "Hydromassage systeem (16 sproeiers)",
  description: "Premium hydromassage systeem met 16 sproeiers",
  ...withVat(400, 21),
  images: ['/placeholders/material-1.png'],
  attributes: {
    type: SpaSystemType.HYDRO_MASSAGE,
    powerKw: 1.5,
    nozzles: 16,
  },
},
{
  groupKey: OptionGroupKey.SPASYSTEM_BASE,
  key: "AIR-BUBBLE-12",
  name: "Luchtbel systeem (12 sproeiers)",
  description: "Luchtbel systeem met 12 sproeiers voor zachte massage",
  ...withVat(200, 21),
  images: ['/placeholders/material-1.png'],
  attributes: {
    type: SpaSystemType.AIR_BUBBLE,
    powerKw: 0.75,
    nozzles: 12,
  },
},


  // =========================
// LEDS
// =========================
{
  groupKey: OptionGroupKey.LEDS_BASE,
  key: "LED-INDIVIDUAL-1",
  name: "Enkele LED installatie",
  description: "Enkele LED-lamp voor basisverlichting (inclusief installatie en voeding)",
  ...withVat(175, 21),
  images: ["/placeholders/material-1.png"],
  attributes: {
    type: LedType.INSTALLATION,
    installationType: LEDInstallationType.INTERNAL,
  },
},
{
  groupKey: OptionGroupKey.LEDS_BASE,
  key: "LED-INDIVIDUAL-3",
  name: "Set van 3 LED's",
  description: "Set van 3 LED-lampen voor betere verlichting (inclusief installatie en voeding)",
  ...withVat(295, 21),
  images: ["/placeholders/material-1.png"],
  attributes: {
    type: LedType.INSTALLATION,
    installationType: LEDInstallationType.INTERNAL,
  },
},
{
  groupKey: OptionGroupKey.LEDS_BASE,
  key: "LED-INDIVIDUAL-ADDITIONAL",
  name: "Extra LED",
  description: "Extra losse LED-lamp",
  ...withVat(60, 21),
  images: ["/placeholders/material-1.png"],
  attributes: {
    type: LedType.INDIVIDUAL,
    installationType: LEDInstallationType.INTERNAL,
  },
  quantityRule: { min: 0, max: 10, step: 1 },
},
{
  groupKey: OptionGroupKey.LEDS_BASE,
  key: "LED-MINI",
  name: "Mini LED",
  description: "Kleine LED-lamp voor accentverlichting",
  ...withVat(25, 21),
  images: ["/placeholders/material-1.png"],
  attributes: {
    type: LedType.INDIVIDUAL,
    installationType: LEDInstallationType.INTERNAL,
  },
  quantityRule: { min: 0, max: 10, step: 1 },
},
{
  groupKey: OptionGroupKey.LEDS_BASE,
  key: "LED-GECKO",
  name: "Gecko LED",
  description: "Premium Gecko LED met geavanceerde functies",
  ...withVat(80, 21),
  images: ["/placeholders/material-1.png"],
  attributes: {
    type: LedType.INDIVIDUAL,
    installationType: LEDInstallationType.INTERNAL,
  },
  quantityRule: { min: 0, max: 1, step: 1 },
},
{
  groupKey: OptionGroupKey.LEDS_BASE,
  key: "LED-BAND-ROUND-200",
  name: "LED-band - rond 200cm",
  description: "LED-band voor ronde hottub 200cm.",
  ...withVat(295, 21),
  images: ["/placeholders/material-1.png"],
  appliesTo: { productModelKeys: ["HOTTUB_ROUND_200"] },
  attributes: {
    type: LedType.BAND,
    installationType: LEDInstallationType.EXTERNAL,
  },
},
{
  groupKey: OptionGroupKey.LEDS_BASE,
  key: "LED-BAND-SQUARE-200",
  name: "LED-band - vierkant 200cm",
  description: "LED-band voor vierkante hottub 200cm.",
  ...withVat(295, 21),
  images: ["/placeholders/material-1.png"],
  appliesTo: { productModelKeys: ["HOTTUB_SQUARE_200"] },
  attributes: {
    type: LedType.BAND,
    installationType: LEDInstallationType.EXTERNAL,
  },
},
{
  groupKey: OptionGroupKey.LEDS_BASE,
  key: "LED-BAND-ROUND-225",
  name: "LED-band - rond 225cm",
  description: "LED-band voor ronde hottub 225cm.",
  ...withVat(345, 21),
  images: ["/placeholders/material-1.png"],
  appliesTo: { productModelKeys: ["HOTTUB_ROUND_225"] },
  attributes: {
    type: LedType.BAND,
    installationType: LEDInstallationType.EXTERNAL,
  },
},
{
  groupKey: OptionGroupKey.LEDS_BASE,
  key: "LED-BAND-SQUARE-220",
  name: "LED-band - vierkant 220cm",
  description: "LED-band voor vierkante hottub 220cm.",
  ...withVat(345, 21),
  images: ["/placeholders/material-1.png"],
  appliesTo: { productModelKeys: ["HOTTUB_SQUARE_220"] },
  attributes: {
    type: LedType.BAND,
    installationType: LEDInstallationType.EXTERNAL,
  },
},
{
  groupKey: OptionGroupKey.LEDS_BASE,
  key: "LED-BAND-SQUARE-245",
  name: "LED-band - vierkant 245cm",
  description: "LED-band voor vierkante hottub 245cm.",
  ...withVat(395, 21),
  images: ["/placeholders/material-1.png"],
  appliesTo: { productModelKeys: ["HOTTUB_SQUARE_245"] },
  attributes: {
    type: LedType.BAND,
    installationType: LEDInstallationType.EXTERNAL,
  },
},


// =========================
// FILTRATION
// =========================

// --- Connectors (bucket: CONNECTION)
{
  groupKey: OptionGroupKey.FILTRATION_CONNECTOR_BASE,
  key: "SF-CONNECTIONS",
  name: "SF-verbindingen",
  subKey: "CONNECTION",
  description: "SF-verbindingen (slang) voor basisfiltratie / wateraansluitingen.",
  ...withVat(80.0, 21),
  images: ["/placeholders/material-1.png"],
  attributes: {
    warnings: [
      "Aan te raden/vaak nodig voor filtratie-aansluitingen. Bij externe filtratie mogelijk ook vereist (afhankelijk van jouw setup).",
    ],
  },
},

{
  groupKey: OptionGroupKey.FILTRATION_CONNECTOR_BASE,
  key: "STAINLESS-SF-CONNECTIONS",
  name: "RVS SF-verbindingen",
  subKey: "CONNECTION",
  description: "Premium RVS SF-verbindingen.",
  ...withVat(145, 21),
  images: ["/placeholders/material-1.png"],
  attributes: null,
},

// --- Filter (bucket: FILTER)
{
  groupKey: OptionGroupKey.FILTRATION_FILTER_BASE,
  key: "SAND-FILTER",
  name: "Zandfilter (via ons)",
  subKey: "FILTER",
  description: "Wij leveren en installeren een zandfilter voor optimale waterfiltratie.",
  ...withVat(320, 21),
  images: ["/placeholders/material-1.png"],
  attributes: null,
},
{
  groupKey: OptionGroupKey.FILTRATION_FILTER_BASE,
  key: "OWN-FILTER",
  name: "Eigen filter (ik regel dit zelf)",
  subKey: "FILTER",
  description: "Ik plaats zelf een extern filter. Aansluitingen kunnen nodig zijn, afhankelijk van mijn setup.",
  ...withVat(0, 21),
  images: ["/placeholders/material-1.png"],
  attributes: null,
},
{
  groupKey: OptionGroupKey.FILTRATION_FILTER_BASE,
  key: "NO-FILTRATION",
  name: "Geen filtratie (geen aansluitingen)",
  subKey: "FILTER",
  description: "Ik wil geen filtratie en ook geen in/uitgangen in de hottub.",
  ...withVat(0, 21),
  images: ["/placeholders/material-1.png"],
  attributes: null,
},


// --- Addons (bucket: ADDONS)
// MO CONNECTIONS MEANS NO UV
{
  groupKey: OptionGroupKey.FILTRATION_ADDONS,
  key: "UV-LAMP",
  name: "UV-lamp",
  subKey: "ADDONS",
  description: "UV-lamp voor waterdesinfectie.",
  ...withVat(345, 21),
  images: ["/placeholders/material-1.png"],
  attributes: null, // <- no requirements, always selectable
},

// --- Filter Box (only relevant when Sand Filter is chosen)
{
  groupKey: OptionGroupKey.FILTRATION_BOX,
  key: "SAND-FILTER-BOX-SPRUCE",
  name: "Filterbox - sparrenhout",
  description: "Zandfilter in sparrenhouten box.",
  ...withVat(195, 21),
  images: ["/placeholders/material-1.png"],
  attributes: {
    requiresFilter: true, // UI hint: show only when a real filter (SAND-FILTER) is selected
    material: "SPRUCE",
  },
},

{
  groupKey: OptionGroupKey.FILTRATION_BOX,
  key: "SAND-FILTER-BOX-THERMO",
  name: "Filterbox - thermohout",
  description: "Zandfilter in thermohouten box.",
  ...withVat(245, 21),
  images: ["/placeholders/material-1.png"],
  attributes: {
    requiresFilter: true,
    material: "THERMO",
  },
},

{
  groupKey: OptionGroupKey.FILTRATION_BOX,
  key: "SAND-FILTER-BOX-WPC",
  name: "Filterbox - WPC",
  description: "Zandfilter in WPC box.",
  ...withVat(295, 21),
  images: ["/placeholders/material-1.png"],
  attributes: {
    requiresFilter: true,
    material: "WPC",
  },
},


// =========================
// COVER_BASE
// =========================

// THERMAL COVERS
{
  groupKey: OptionGroupKey.COVER_BASE,
  key: "THERMAL-COVER-ROUND-200",
  name: "Thermal cover - rond 200cm",
  description: "Thermal cover voor ronde hottub 200cm.",
  ...withVat(395, 21),
  images: ["/placeholders/material-1.png"],
  appliesTo: { productModelKeys: ["HOTTUB_ROUND_200"] },
  attributes: { type: CoverType.THERMAL, shape: BaseShape.ROUND, sizeCm: 200 },
},
{
  groupKey: OptionGroupKey.COVER_BASE,
  key: "THERMAL-COVER-ROUND-225",
  name: "Thermal cover - rond 225cm",
  description: "Thermal cover voor ronde hottub 225cm.",
  ...withVat(445, 21),
  images: ["/placeholders/material-1.png"],
  appliesTo: { productModelKeys: ["HOTTUB_ROUND_225"] },
  attributes: { type: CoverType.THERMAL, shape: BaseShape.ROUND, sizeCm: 225 },
},
{
  groupKey: OptionGroupKey.COVER_BASE,
  key: "THERMAL-COVER-SQUARE-200",
  name: "Thermal cover - vierkant 200cm",
  description: "Thermal cover voor vierkante hottub 200cm.",
  ...withVat(445, 21),
  images: ["/placeholders/material-1.png"],
  appliesTo: { productModelKeys: ["HOTTUB_SQUARE_200"] },
  attributes: { type: CoverType.THERMAL, shape: BaseShape.SQUARE, sizeCm: 200 },
},
{
  groupKey: OptionGroupKey.COVER_BASE,
  key: "THERMAL-COVER-SQUARE-220",
  name: "Thermal cover - vierkant 220cm",
  description: "Thermal cover voor vierkante hottub 220cm.",
  ...withVat(495, 21),
  images: ["/placeholders/material-1.png"],
  appliesTo: { productModelKeys: ["HOTTUB_SQUARE_220"] },
  attributes: { type: CoverType.THERMAL, shape: BaseShape.SQUARE, sizeCm: 220 },
},
{
  groupKey: OptionGroupKey.COVER_BASE,
  key: "THERMAL-COVER-SQUARE-245",
  name: "Thermal cover - vierkant 245cm",
  description: "Thermal cover voor vierkante hottub 245cm.",
  ...withVat(545, 21),
  images: ["/placeholders/material-1.png"],
  appliesTo: { productModelKeys: ["HOTTUB_SQUARE_245"] },
  attributes: { type: CoverType.THERMAL, shape: BaseShape.SQUARE, sizeCm: 245 },
},
{
  groupKey: OptionGroupKey.COVER_BASE,
  key: "THERMAL-COVER-OFURO-120-190",
  name: "Thermal cover - Ofuro 120×190",
  description: "Thermal cover voor Ofuro model 120×190.",
  ...withVat(345, 21),
  images: ["/placeholders/material-1.png"],
  appliesTo: { productModelKeys: ["HOTTUB_OFURO_120_190"] },
  attributes: {
    type: CoverType.THERMAL,
    shape: BaseShape.OFURO,
  },
},

// COLD PLUNGE THERMAL COVER
{
  groupKey: OptionGroupKey.COVER_BASE,
  key: "THERMAL-COVER-PLUNGE",
  name: "Thermal cover - cold plunge",
  description: "Thermal cover voor cold plunge.",
  ...withVat(200, 21),
  images: ["/placeholders/material-1.png"],
  appliesTo: { productTypes: [ProductType.COLD_PLUNGE] },
  attributes: { type: CoverType.THERMAL, shape: BaseShape.PLUNGE },
},

// FIBERGLASS COVERS
{
  groupKey: OptionGroupKey.COVER_BASE,
  key: "FIBERGLASS-COVER-ROUND-200",
  name: "Glasvezel cover - rond 200cm",
  description: "Duurzame glasvezel cover voor ronde hottub 200cm.",
  ...withVat(200, 21),
  images: ["/placeholders/material-1.png"],
  appliesTo: { productModelKeys: ["HOTTUB_ROUND_200"] },
  attributes: { type: CoverType.FIBERGLASS, shape: BaseShape.ROUND, sizeCm: 200 },
},
{
  groupKey: OptionGroupKey.COVER_BASE,
  key: "FIBERGLASS-COVER-ROUND-225",
  name: "Glasvezel cover - rond 225cm",
  description: "Duurzame glasvezel cover voor ronde hottub 225cm.",
  ...withVat(250, 21),
  images: ["/placeholders/material-1.png"],
  appliesTo: { productModelKeys: ["HOTTUB_ROUND_225"] },
  attributes: { type: CoverType.FIBERGLASS, shape: BaseShape.ROUND, sizeCm: 225 },
},
{
  groupKey: OptionGroupKey.COVER_BASE,
  key: "FIBERGLASS-COVER-OFURO-120-190",
  name: "Glasvezel cover - Ofuro 120×190",
  description: "Duurzame glasvezel cover voor Ofuro 120×190.",
  ...withVat(200, 21),
  images: ["/placeholders/material-1.png"],
  appliesTo: { productModelKeys: ["HOTTUB_OFURO_120_190"] },
  attributes: {
    type: CoverType.FIBERGLASS,
    shape: BaseShape.OFURO,
  },
},

  // =========================
// CONTROL UNIT
// =========================
{
  groupKey: OptionGroupKey.CONTROLUNIT_BASE,
  key: "TRADITIONAL-BUTTONS",
  name: "Traditionele knoppen",
  description: "Klassiek bedieningssysteem met fysieke knoppen",
  ...withVat(0, 21),
  included: true,
  images: ["/placeholders/material-1.png"],
  attributes: {
    type: ControlUnitType.TRADITIONAL,
    capabilities: [],
    pros: [
      "Eenvoudig in gebruik",
      "Zeer betrouwbaar",
      "Geen elektronica of software",
    ],
    cons: [
      "Geen digitale uitlezing",
      "Geen slimme functies",
    ],
  },
},
{
  groupKey: OptionGroupKey.CONTROLUNIT_BASE,
  key: "LED-DISPLAY",
  name: "LED-display",
  description: "LED-display met digitale uitlezing",
  ...withVat(150, 21),
  images: ["/placeholders/material-1.png"],
  attributes: {
    type: ControlUnitType.LED_DISPLAY,
    capabilities: ["DIGITAL_DISPLAY"],
    pros: [
      "Duidelijke temperatuurweergave",
      "Moderne uitstraling",
      "Eenvoudige bediening",
    ],
    cons: [
      "Geen bediening op afstand",
    ],
  },
},
{
  groupKey: OptionGroupKey.CONTROLUNIT_BASE,
  key: "LED-DISPLAY-WIFI",
  name: "LED-display met wifi",
  description: "LED-display met wifi-connectiviteit",
  ...withVat(250, 21),
  images: ["/placeholders/material-1.png"],
  attributes: {
    type: ControlUnitType.LED_DISPLAY,
    capabilities: ["DIGITAL_DISPLAY", "WIFI"],
    pros: [
      "Bediening via smartphone",
      "Altijd inzicht in temperatuur",
      "Moderne functionaliteit",
    ],
    cons: [
      "Afhankelijk van wifi-netwerk",
    ],
  },
},
{
  groupKey: OptionGroupKey.CONTROLUNIT_BASE,
  key: "TOUCHSCREEN",
  name: "Touchscreen bediening",
  description: "Modern touchscreen bedieningspaneel",
  ...withVat(400, 21),
  images: ["/placeholders/material-1.png"],
  attributes: {
    type: ControlUnitType.TOUCHSCREEN,
    capabilities: ["TOUCH_INTERFACE"],
    pros: [
      "Intuïtieve bediening",
      "Moderne uitstraling",
      "Snelle toegang tot instellingen",
    ],
    cons: [
      "Gevoeliger dan knoppen",
    ],
  },
},
{
  groupKey: OptionGroupKey.CONTROLUNIT_BASE,
  key: "TOUCHSCREEN-WIFI",
  name: "Touchscreen met wifi",
  description: "Touchscreen bediening met wifi-connectiviteit",
  ...withVat(500, 21),
  images: ["/placeholders/material-1.png"],
  attributes: {
    type: ControlUnitType.TOUCHSCREEN,
    capabilities: ["TOUCH_INTERFACE", "WIFI"],
    pros: [
      "Volledige bediening via touchscreen en app",
      "Hoogste gebruiksgemak",
      "Meest toekomstbestendig",
    ],
    cons: [
      "Duurste optie",
      "Afhankelijk van wifi",
    ],
  },
},


// =========================
// LID
// =========================
{
  groupKey: OptionGroupKey.LID_BASE,
  key: "INCLUDED-LID",
  name: "Standaard deksel (inbegrepen)",
  description: "Standaard deksel inbegrepen bij de hottub (afgestemd op gekozen materialen)",
  ...withVat(0, 21),
  included: true,
  images: ["/placeholders/material-1.png"],
  attributes: {
    type: LidType.STANDARD,
    pros: [
      "Inbegrepen bij de hottub",
      "Functioneel en praktisch",
    ],
    cons: [
      "Minder isolerend",
      "Eenvoudige uitstraling",
    ],
  },
},
{
  groupKey: OptionGroupKey.LID_BASE,
  key: "LEATHER-LID-BLACK",
  name: "Leren deksel (zwart)",
  description: "Premium leren deksel in zwart",
  ...withVat(300, 21),
  images: ["/placeholders/material-1.png"],
  attributes: {
    type: LidType.LEATHER,
    material: LidMaterial.LEATHER,
    color: LidColor.BLACK,
    pros: [
      "Luxe uitstraling",
      "Goede isolatie",
      "Comfortabele afwerking",
    ],
    cons: [
      "Hogere prijs",
      "Meer onderhoud dan kunststof",
    ],
  },
},
{
  groupKey: OptionGroupKey.LID_BASE,
  key: "LEATHER-LID-BROWN",
  name: "Leren deksel (bruin)",
  description: "Premium leren deksel in bruin",
  ...withVat(300, 21),
  images: ["/placeholders/material-1.png"],
  attributes: {
    type: LidType.LEATHER,
    material: LidMaterial.LEATHER,
    color: LidColor.BROWN,
    pros: [
      "Warme, natuurlijke uitstraling",
      "Goede isolatie",
      "Comfortabele afwerking",
    ],
    cons: [
      "Hogere prijs",
      "Meer onderhoud dan kunststof",
    ],
  },
},
{
  groupKey: OptionGroupKey.LID_BASE,
  key: "FIBERGLASS-LID",
  name: "Glasvezel deksel",
  description: "Duurzaam glasvezel deksel",
  ...withVat(200, 21),
  images: ["/placeholders/material-1.png"],
  attributes: {
    type: LidType.FIBERGLASS,
    material: LidMaterial.FIBERGLASS,
    pros: [
      "Zeer duurzaam",
      "Goede isolatie",
      "Onderhoudsarm",
    ],
    cons: [
      "Zwaarder dan andere opties",
      "Minder luxe uitstraling",
    ],
  },
},
{
  groupKey: OptionGroupKey.LID_BASE,
  key: "ACRYLIC-LID",
  name: "Acryl deksel",
  description: "Transparant acryl deksel voor extra zicht",
  ...withVat(250, 21),
  images: ["/placeholders/material-1.png"],
  attributes: {
    type: LidType.ACRYLIC,
    material: LidMaterial.ACRYLIC,
    pros: [
      "Moderne uitstraling",
      "Laat licht door",
      "Onderhoudsarm",
    ],
    cons: [
      "Minder isolerend dan leer of glasvezel",
      "Gevoeliger voor krassen",
    ],
  },
},
 
  // =========================
// STAIRS
// =========================
{
  groupKey: OptionGroupKey.STAIRS_BASE,
  key: "STANDARD-STAIRS",
  name: "Standaard trap (inbegrepen)",
  description: "Basistrap inbegrepen bij de hottub",
  ...withVat(0, 21),
  included: true,
  images: ["/placeholders/material-1.png"],
  attributes: {
    type: StairsType.STANDARD,
    coversSandFilter: false,
    pros: ["Inbegrepen", "Praktisch en eenvoudig"],
    cons: ["Minder luxe uitstraling", "Geen filterbehuizing"],
  },
},
{
  groupKey: OptionGroupKey.STAIRS_BASE,
  key: "XL-STAIRS-SPRUCE",
  name: "XL trap (spar)",
  description: "Extra grote trap met ruimte/afwerking voor zandfilter",
  ...withVat(80, 21),
  images: ["/placeholders/material-1.png"],
  attributes: {
    type: StairsType.XL,
    material: StairsMaterial.SPRUCE,
    coversSandFilter: true,
    pros: ["XL formaat", "Met zandfilterbehuizing", "Warme houtlook"],
    cons: ["Neemt meer ruimte in"],
  },
},
{
  groupKey: OptionGroupKey.STAIRS_BASE,
  key: "XL-STAIRS-THERMAL",
  name: "XL trap (thermisch hout)",
  description: "Extra grote trap met ruimte/afwerking voor zandfilter",
  ...withVat(100, 21),
  images: ["/placeholders/material-1.png"],
  attributes: {
    type: StairsType.XL,
    material: StairsMaterial.THERMAL,
    coversSandFilter: true,
    pros: ["XL formaat", "Met zandfilterbehuizing", "Duurzamer hout (thermo)"],
    cons: ["Neemt meer ruimte in"],
  },
},
{
  groupKey: OptionGroupKey.STAIRS_BASE,
  key: "XL-STAIRS-WPC",
  name: "XL trap (WPC)",
  description: "Extra grote trap met ruimte/afwerking voor zandfilter",
  ...withVat(120, 21),
  images: ["/placeholders/material-1.png"],
  attributes: {
    type: StairsType.XL,
    material: StairsMaterial.WPC,
    coversSandFilter: true,
    pros: ["XL formaat", "Met zandfilterbehuizing", "Onderhoudsarm (WPC)"],
    cons: ["Neemt meer ruimte in"],
  },
},
{
  groupKey: OptionGroupKey.STAIRS_BASE,
  key: "3-STEP-SPRUCE",
  name: "3-traps trap (spar)",
  description: "Premium 3-traps trap in sparrenhout",
  ...withVat(300, 21),
  images: ["/placeholders/material-1.png"],
  attributes: {
    type: StairsType._3_STEP,
    material: StairsMaterial.SPRUCE,
    coversSandFilter: false,
    pros: ["Luxe uitstraling", "Comfortabeler instappen", "Stabiele tredes"],
    cons: ["Geen filterbehuizing", "Neemt meer ruimte in"],
  },
},
{
  groupKey: OptionGroupKey.STAIRS_BASE,
  key: "3-STEP-THERMAL",
  name: "3-traps trap (thermisch hout)",
  description: "Premium 3-traps trap in thermisch hout",
  ...withVat(350, 21),
  images: ["/placeholders/material-1.png"],
  attributes: {
    type: StairsType._3_STEP,
    material: StairsMaterial.THERMAL,
    coversSandFilter: false,
    pros: ["Luxe uitstraling", "Comfortabeler instappen", "Duurzamer hout (thermo)"],
    cons: ["Geen filterbehuizing", "Neemt meer ruimte in"],
  },
},
{
  groupKey: OptionGroupKey.STAIRS_BASE,
  key: "3-STEP-WPC",
  name: "3-traps trap (WPC)",
  description: "Premium 3-traps trap in WPC",
  ...withVat(400, 21),
  images: ["/placeholders/material-1.png"],
  attributes: {
    type: StairsType._3_STEP,
    material: StairsMaterial.WPC,
    coversSandFilter: false,
    pros: ["Luxe uitstraling", "Comfortabeler instappen", "Onderhoudsarm (WPC)"],
    cons: ["Geen filterbehuizing", "Neemt meer ruimte in"],
  },
},
{
  groupKey: OptionGroupKey.STAIRS_COVER_FILTER,
  key: "STAIRS-COVER-FILTER-YES",
  name: "Zandfilter onder de trap plaatsen",
  description: "De zandfilter wordt netjes onder de trap weggewerkt. De aparte filterbox komt te vervallen.",
  ...withVat(0, 21),
  images: ["/placeholders/material-1.png"],
  attributes: {
    removesFilterBox: true,
  },
},
{
  groupKey: OptionGroupKey.STAIRS_COVER_FILTER,
  key: "STAIRS-COVER-FILTER-NO",
  name: "Zandfilter in aparte filterbox houden",
  description: "De zandfilter blijft in een losse filterbox naast de hottub geplaatst.",
  ...withVat(0, 21),
  images: ["/placeholders/material-1.png"],
  attributes: {
    removesFilterBox: false,
  },
},
  
    // =========================
// EXTRAS (quantity-based)
// =========================
{
  groupKey: OptionGroupKey.EXTRAS_BASE,
  key: "DIGITAL-THERMOMETER",
  name: "Digitale thermometer",
  description: "Digitale thermometer voor nauwkeurige temperatuurmeting",
  ...withVat(25, 21),
  images: ["/placeholders/material-1.png"],
  quantityRule: { min: 0, max: 2, step: 1 },
},
{
  groupKey: OptionGroupKey.EXTRAS_BASE,
  key: "HEAD-PILLOW",
  name: "Hoofdkussen",
  description: "Comfortabel hoofdkussen voor ontspanning",
  ...withVat(15, 21),
  images: ["/placeholders/material-1.png"],
  quantityRule: { min: 0, max: 4, step: 1 },
},
{
  groupKey: OptionGroupKey.EXTRAS_BASE,
  key: "STEEL-BANDS-SILVER",
  name: "RVS banden (zilver)",
  description: "RVS banden voor structurele versteviging",
  ...withVat(50, 21),
  images: ["/placeholders/material-1.png"],
  quantityRule: { min: 0, max: 4, step: 1 },
},
{
  groupKey: OptionGroupKey.EXTRAS_BASE,
  key: "STEEL-BANDS-BLACK",
  name: "RVS banden (zwart)",
  description: "Zwarte RVS banden voor structurele versteviging",
  ...withVat(50, 21),
  images: ["/placeholders/material-1.png"],
  quantityRule: { min: 0, max: 4, step: 1 },
},
{
  groupKey: OptionGroupKey.EXTRAS_BASE,
  key: "EXTERNAL-HEATER-ELBOWS",
  name: "Kachelbochten set extern",
  description: "Extra pijpverbindingen voor externe kachel",
  ...withVat(20, 21),
  images: ["/placeholders/material-1.png"],
  quantityRule: { min: 0, max: 3, step: 1 },
},
{
  groupKey: OptionGroupKey.EXTRAS_BASE,
  key: "BOTTOM-COVER",
  name: "Bodemcover",
  description: "Beschermende bodemplaat voor de hottub",
  ...withVat(100, 21),
  images: ["/placeholders/material-1.png"],
  quantityRule: { min: 0, max: 1, step: 1 },
},
{
  groupKey: OptionGroupKey.EXTRAS_BASE,
  key: "WATER-OUTLET-VALVE",
  name: "Wateraftapkraan",
  description: "Handige aftapkraan voor eenvoudig legen",
  ...withVat(60, 21),
  images: ["/placeholders/material-1.png"],
  quantityRule: { min: 0, max: 1, step: 1 },
},
{
  groupKey: OptionGroupKey.EXTRAS_BASE,
  key: "REVISION-DOOR-WHITE",
  name: "Revisiedeur (wit)",
  description: "Witte revisiedeur voor onderhoudstoegang",
  ...withVat(0, 21),
  images: ["/placeholders/material-1.png"],
  quantityRule: { min: 0, max: 1, step: 1 },
},
{
  groupKey: OptionGroupKey.EXTRAS_BASE,
  key: "REVISION-DOOR-GREY",
  name: "Revisiedeur (grijs)",
  description: "Grijze revisiedeur voor onderhoudstoegang",
  ...withVat(10, 21),
  images: ["/placeholders/material-1.png"],
  quantityRule: { min: 0, max: 1, step: 1 },
},
{
  groupKey: OptionGroupKey.EXTRAS_BASE,
  key: "CUPHOLDER-STANDARD",
  name: "Standaard bekerhouder",
  description: "Standaard bekerhouder inbegrepen",
  ...withVat(0, 21),
  images: ["/placeholders/material-1.png"],
  quantityRule: { min: 0, max: 1, step: 1 },
},
{
  groupKey: OptionGroupKey.EXTRAS_BASE,
  key: "CUPHOLDER-EXTRA",
  name: "Extra bekerhouder (3-5 gaten)",
  description: "Extra bekerhouder met 3-5 gaten",
  ...withVat(30, 21),
  images: ["/placeholders/material-1.png"],
  quantityRule: { min: 0, max: 3, step: 1 },
},
{
  groupKey: OptionGroupKey.EXTRAS_BASE,
  key: "SNACK-DECK",
  name: "Snackplank",
  description: "Klein plateau voor snacks en drankjes",
  ...withVat(20, 21),
  images: ["/placeholders/material-1.png"],
  quantityRule: { min: 0, max: 2, step: 1 },
}
];
