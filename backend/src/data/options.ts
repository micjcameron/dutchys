import {
  CatalogOptionSeed,
  ColorEnum,
  ExtraCategory,
  FiltrationRole,
  FiltrationType,
  HeatingCategory,
  HeatingPlacement,
  HeatingSize,
  HeatingType,
  LedType,
  LidColor,
  LidMaterial,
  LidType,
  OptionGroupKey,
  OptionSource,
  OptionTag,
  SpaSystemType,
  StairsMaterial,
  StairsType,
  ControlUnitType,
} from '../modules/catalog/types/catalog-option-seed.types';

export const catalogOptions: CatalogOptionSeed[] = [
  {
    groupKey: OptionGroupKey.HEATING_BASE,
    key: "WOOD-INTERNAL-SMALL",
    name: "Interne houtkachel (klein)",
    description: "Compacte interne houtkachel, perfect voor kleinere sauna's",
    priceExcl: 0,
    vatRatePercent: 21,
    images: [
      "/placeholders/material-1.png"
    ],
    tags: [
      OptionTag.WOOD
    ],
    attributes: {
      type: HeatingType.WOOD,
      category: HeatingCategory.HOUTKACHEL,
      heatingTime: "45-60 min",
      power: null,
      voltage: null,
      placement: HeatingPlacement.INTERN,
      size: HeatingSize.KLEIN,
      pros: [
        "Ruimtebesparend",
        "Snellere opwarming",
        "Geen externe schoorsteen nodig",
        "Betere warmteverdeling"
      ],
      cons: [
        "Kleinere vuurhaard",
        "Minder houtcapaciteit",
        "Vaker bijvullen nodig"
      ],
      extraOptionKeys: [
        "BLACK-HEATER-PLATE"
      ]
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.EXTRAS_BASE,
    key: "BLACK-HEATER-PLATE",
    name: "Zwarte kachelplaat",
    description: "Stijlvolle zwarte afwerking voor de kachelplaat",
    priceExcl: 16.53,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.HEATING_EXTRA
    ],
    attributes: {
      source: OptionSource.HEATING
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.HEATING_BASE,
    key: "WOOD-INTERNAL-LARGE",
    name: "Interne houtkachel (groot)",
    description: "Grote interne houtkachel voor grotere sauna's",
    priceExcl: 123.97,
    vatRatePercent: 21,
    images: [
      "/placeholders/material-2.png"
    ],
    tags: [
      OptionTag.WOOD
    ],
    attributes: {
      type: HeatingType.WOOD,
      category: HeatingCategory.HOUTKACHEL,
      heatingTime: "30-45 min",
      power: null,
      voltage: null,
      placement: HeatingPlacement.INTERN,
      size: HeatingSize.GROOT,
      pros: [
        "Grotere vuurhaard",
        "Langere brandduur",
        "Beter voor grotere sauna's",
        "Efficiëntere verwarming"
      ],
      cons: [
        "Neemt meer binnenruimte in",
        "Hogere aanschafprijs"
      ],
      extraOptionKeys: [
        "BLACK-HEATER-PLATE"
      ]
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.HEATING_BASE,
    key: "WOOD-EXTERNAL-SMALL",
    name: "Externe houtkachel (klein)",
    description: "Externe houtkachel met schoorsteen, bespaart binnenruimte",
    priceExcl: 165.29,
    vatRatePercent: 21,
    images: [
      "/placeholders/material-2.png"
    ],
    tags: [
      OptionTag.WOOD
    ],
    attributes: {
      type: HeatingType.WOOD,
      category: HeatingCategory.HOUTKACHEL,
      heatingTime: "60-75 min",
      power: null,
      voltage: null,
      placement: HeatingPlacement.EXTERN,
      size: HeatingSize.KLEIN,
      pros: [
        "Meer binnenruimte",
        "Geen rook in de sauna",
        "Makkelijker hout bijvullen",
        "Betere ventilatie"
      ],
      cons: [
        "Langere opwarmtijd",
        "Externe schoorsteen vereist",
        "Complexere installatie"
      ],
      extraOptionKeys: [
        "HEATER-ELBOWS-SET",
        "CHIMNEY-EXTRA"
      ]
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.EXTRAS_BASE,
    key: "HEATER-ELBOWS-SET",
    name: "Kachelbochten set",
    description: "Extra pijpverbindingen voor externe kachel",
    priceExcl: 16.53,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.HEATING_EXTRA
    ],
    attributes: {
      source: OptionSource.HEATING
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.EXTRAS_BASE,
    key: "CHIMNEY-EXTRA",
    name: "Extra schoorsteen (1m)",
    description: "Extra schoorsteenlengte voor goede ventilatie",
    priceExcl: 16.53,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.HEATING_EXTRA
    ],
    attributes: {
      source: OptionSource.HEATING
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.HEATING_BASE,
    key: "WOOD-EXTERNAL-LARGE",
    name: "Externe houtkachel (groot)",
    description: "Grote externe houtkachel voor maximale efficiëntie",
    priceExcl: 289.26,
    vatRatePercent: 21,
    images: [
      "/placeholders/material-3.png"
    ],
    tags: [
      OptionTag.WOOD
    ],
    attributes: {
      type: HeatingType.WOOD,
      category: HeatingCategory.HOUTKACHEL,
      heatingTime: "45-60 min",
      power: null,
      voltage: null,
      placement: HeatingPlacement.EXTERN,
      size: HeatingSize.GROOT,
      pros: [
        "Maximale binnenruimte",
        "Grootste vuurhaardcapaciteit",
        "Meest efficiënt voor grote sauna's",
        "Professionele installatie"
      ],
      cons: [
        "Hoogste prijs",
        "Complexe installatie",
        "Meer buitenruimte nodig"
      ],
      extraOptionKeys: [
        "HEATER-ELBOWS-SET",
        "CHIMNEY-EXTRA"
      ]
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.HEATING_BASE,
    key: "ELECTRIC-6KW",
    name: "6kW elektrische kachel",
    description: "6kW elektrische kachel voor kleine tot middelgrote sauna's",
    priceExcl: 661.16,
    vatRatePercent: 21,
    images: [
      "/placeholders/material-3.png"
    ],
    tags: [
      OptionTag.ELECTRIC
    ],
    attributes: {
      type: HeatingType.ELECTRIC,
      category: HeatingCategory.VOLLEDIG_ELEKTRISCH,
      heatingTime: "45-60 min",
      power: "6kW",
      voltage: "3-fase",
      placement: null,
      size: null,
      pros: [
        "Geen hout nodig",
        "Constante temperatuur",
        "Eenvoudig te regelen",
        "Geen rook of as"
      ],
      cons: [
        "3-fase stroom vereist",
        "Hogere stroomkosten",
        "Geen authentieke houtvuurervaring"
      ],
      extraOptionKeys: []
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.HEATING_BASE,
    key: "ELECTRIC-9KW",
    name: "9kW elektrische kachel",
    description: "9kW elektrische kachel voor middelgrote sauna's",
    priceExcl: 991.74,
    vatRatePercent: 21,
    images: [
      "/placeholders/material-4.png"
    ],
    tags: [
      OptionTag.ELECTRIC
    ],
    attributes: {
      type: HeatingType.ELECTRIC,
      category: HeatingCategory.VOLLEDIG_ELEKTRISCH,
      heatingTime: "30-45 min",
      power: "9kW",
      voltage: "3-fase",
      placement: null,
      size: null,
      pros: [
        "Snelle opwarming",
        "Goed voor middelgrote sauna's",
        "Betrouwbare prestaties",
        "Eenvoudig onderhoud"
      ],
      cons: [
        "3-fase stroom vereist",
        "Hogere stroomkosten",
        "Geen authentieke houtvuurervaring"
      ],
      extraOptionKeys: []
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.HEATING_BASE,
    key: "ELECTRIC-12KW",
    name: "12kW elektrische kachel",
    description: "12kW elektrische kachel voor grote sauna's",
    priceExcl: 1322.31,
    vatRatePercent: 21,
    images: [
      "/placeholders/material-1.png"
    ],
    tags: [
      OptionTag.ELECTRIC
    ],
    attributes: {
      type: HeatingType.ELECTRIC,
      category: HeatingCategory.VOLLEDIG_ELEKTRISCH,
      heatingTime: "25-35 min",
      power: "12kW",
      voltage: "3-fase",
      placement: null,
      size: null,
      pros: [
        "Snelle opwarming",
        "Perfect voor grote sauna's",
        "Professionele kwaliteit",
        "Constante prestaties"
      ],
      cons: [
        "3-fase stroom vereist",
        "Hoog stroomverbruik",
        "Geen authentieke houtvuurervaring"
      ],
      extraOptionKeys: []
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.HEATING_BASE,
    key: "ELECTRIC-18KW",
    name: "18kW elektrische kachel",
    description: "18kW elektrische kachel voor commercieel gebruik of zeer grote sauna's",
    priceExcl: 1818.18,
    vatRatePercent: 21,
    images: [
      "/placeholders/material-2.png"
    ],
    tags: [
      OptionTag.ELECTRIC
    ],
    attributes: {
      type: HeatingType.ELECTRIC,
      category: HeatingCategory.VOLLEDIG_ELEKTRISCH,
      heatingTime: "20-30 min",
      power: "18kW",
      voltage: "3-fase",
      placement: null,
      size: null,
      pros: [
        "Zeer snelle opwarming",
        "Professionele kwaliteit",
        "Geschikt voor grote volumes",
        "Professionele installatie"
      ],
      cons: [
        "3-fase stroom vereist",
        "Zeer hoge stroomkosten",
        "Geen authentieke houtvuurervaring"
      ],
      extraOptionKeys: []
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.HEATING_BASE,
    key: "HYBRID-230V-3KW",
    name: "Hybride 3kW (230V)",
    description: "Hybridesysteem: houtverwarming + 3kW elektrisch warmhouden",
    priceExcl: 495.87,
    vatRatePercent: 21,
    images: [
      "/placeholders/material-3.png"
    ],
    tags: [
      OptionTag.HYBRID
    ],
    attributes: {
      type: HeatingType.HYBRID,
      category: HeatingCategory.HYBRIDE,
      heatingTime: "45-60 min (hout) + warmhouden",
      power: "3kW",
      voltage: "230V",
      placement: null,
      size: null,
      pros: [
        "Beste van twee werelden",
        "Houtverwarming + elektrisch gemak",
        "Geschikt voor 230V",
        "Kostenefficiënt"
      ],
      cons: [
        "Complexer systeem",
        "Vereist hout en elektriciteit",
        "Temperatuur kan dalen met bepaalde deksels"
      ],
      extraOptionKeys: []
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.HEATING_BASE,
    key: "HYBRID-3PHASE-6KW",
    name: "Hybride 6kW (3-fase)",
    description: "Hybridesysteem: houtverwarming + 6kW elektrisch warmhouden",
    priceExcl: 826.45,
    vatRatePercent: 21,
    images: [
      "/placeholders/material-4.png"
    ],
    tags: [
      OptionTag.HYBRID
    ],
    attributes: {
      type: HeatingType.HYBRID,
      category: HeatingCategory.HYBRIDE,
      heatingTime: "30-45 min (hout) + warmhouden",
      power: "6kW",
      voltage: "3-fase",
      placement: null,
      size: null,
      pros: [
        "Snelle houtopwarming",
        "Krachtige elektrische ondersteuning",
        "Professionele kwaliteit",
        "Betrouwbare temperatuurregeling"
      ],
      cons: [
        "3-fase stroom vereist",
        "Hogere kosten",
        "Complexere installatie"
      ],
      extraOptionKeys: []
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.HEATING_BASE,
    key: "HYBRID-3PHASE-9KW",
    name: "Hybride 9kW (3-fase)",
    description: "Hybridesysteem: houtverwarming + 9kW elektrisch warmhouden",
    priceExcl: 1157.02,
    vatRatePercent: 21,
    images: [
      "/placeholders/material-1.png"
    ],
    tags: [
      OptionTag.HYBRID
    ],
    attributes: {
      type: HeatingType.HYBRID,
      category: HeatingCategory.HYBRIDE,
      heatingTime: "25-35 min (hout) + warmhouden",
      power: "9kW",
      voltage: "3-fase",
      placement: null,
      size: null,
      pros: [
        "Zeer snelle opwarming",
        "Krachtige elektrische ondersteuning",
        "Perfect voor grote sauna's",
        "Professionele kwaliteit"
      ],
      cons: [
        "3-fase stroom vereist",
        "Hoge kosten",
        "Complex systeem"
      ],
      extraOptionKeys: []
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.MATERIALS_INTERNAL_BASE,
    key: "SPRUCE",
    name: "Sparrenhout",
    description: "Klassiek Noord-Europees sparrenhout voor een authentieke sauna-ervaring",
    priceExcl: 0,
    vatRatePercent: 21,
    images: [
      "/placeholders/material-1.png"
    ],
    tags: [
      OptionTag.INTERNAL
    ],
    attributes: {
      colors: [
        {
          id: ColorEnum.SPRUCE_NATURAL.id,
          name: ColorEnum.SPRUCE_NATURAL.name,
          priceExcl: 0,
          vatRatePercent: 21,
          hex: "#F5E6D3"
        },
        {
          id: ColorEnum.SPRUCE_LIGHT.id,
          name: ColorEnum.SPRUCE_LIGHT.name,
          priceExcl: 0,
          vatRatePercent: 21,
          hex: "#F0E68C"
        },
        {
          id: ColorEnum.SPRUCE_MEDIUM.id,
          name: ColorEnum.SPRUCE_MEDIUM.name,
          priceExcl: 41.32,
          vatRatePercent: 21,
          hex: "#D2B48C"
        },
        {
          id: ColorEnum.SPRUCE_DARK.id,
          name: ColorEnum.SPRUCE_DARK.name,
          priceExcl: 82.64,
          vatRatePercent: 21,
          hex: "#8B7355"
        }
      ],
      pros: [
        "Authentiek sauna-gevoel",
        "Natuurlijke houtgeur",
        "Goede warmteopslag",
        "Traditionele uitstraling"
      ],
      cons: [
        "Vereist regelmatig onderhoud",
        "Kan na verloop van tijd donkerder worden",
        "Kan scheurtjes ontwikkelen"
      ]
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.MATERIALS_INTERNAL_BASE,
    key: "CEDAR",
    name: "Cederhout",
    description: "Premium cederhout met natuurlijke oliën en een mooie nerf",
    priceExcl: 247.93,
    vatRatePercent: 21,
    images: [
      "/placeholders/material-2.png"
    ],
    tags: [
      OptionTag.INTERNAL
    ],
    attributes: {
      colors: [
        {
          id: ColorEnum.CEDAR_NATURAL.id,
          name: ColorEnum.CEDAR_NATURAL.name,
          priceExcl: 0,
          vatRatePercent: 21,
          hex: "#D2691E"
        },
        {
          id: ColorEnum.CEDAR_LIGHT.id,
          name: ColorEnum.CEDAR_LIGHT.name,
          priceExcl: 0,
          vatRatePercent: 21,
          hex: "#DEB887"
        },
        {
          id: ColorEnum.CEDAR_MEDIUM.id,
          name: ColorEnum.CEDAR_MEDIUM.name,
          priceExcl: 41.32,
          vatRatePercent: 21,
          hex: "#CD853F"
        },
        {
          id: ColorEnum.CEDAR_DARK.id,
          name: ColorEnum.CEDAR_DARK.name,
          priceExcl: 82.64,
          vatRatePercent: 21,
          hex: "#A0522D"
        }
      ],
      pros: [
        "Natuurlijke oliën weerstaan vocht",
        "Mooie nerfstructuur",
        "Gaat lang mee",
        "Aromatische eigenschappen"
      ],
      cons: [
        "Hogere kosten",
        "Beperkte beschikbaarheid",
        "Kan bij sommigen allergieën veroorzaken"
      ]
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.MATERIALS_INTERNAL_BASE,
    key: "HEMLOCK",
    name: "Hemlockhout",
    description: "Duurzaam hemlockhout met uitstekende warmte-eigenschappen",
    priceExcl: 165.29,
    vatRatePercent: 21,
    images: [
      "/placeholders/material-3.png"
    ],
    tags: [
      OptionTag.INTERNAL
    ],
    attributes: {
      colors: [
        {
          id: ColorEnum.HEMLOCK_NATURAL.id,
          name: ColorEnum.HEMLOCK_NATURAL.name,
          priceExcl: 0,
          vatRatePercent: 21,
          hex: "#F5DEB3"
        },
        {
          id: ColorEnum.HEMLOCK_LIGHT.id,
          name: ColorEnum.HEMLOCK_LIGHT.name,
          priceExcl: 0,
          vatRatePercent: 21,
          hex: "#FFF8DC"
        },
        {
          id: ColorEnum.HEMLOCK_MEDIUM.id,
          name: ColorEnum.HEMLOCK_MEDIUM.name,
          priceExcl: 41.32,
          vatRatePercent: 21,
          hex: "#DDBEA9"
        },
        {
          id: ColorEnum.HEMLOCK_DARK.id,
          name: ColorEnum.HEMLOCK_DARK.name,
          priceExcl: 82.64,
          vatRatePercent: 21,
          hex: "#BC9A6A"
        }
      ],
      pros: [
        "Uitstekende warmteopslag",
        "Duurzaam en stabiel",
        "Goede prijs-kwaliteit",
        "Consistente kleur"
      ],
      cons: [
        "Minder aromatisch dan ceder",
        "Moeilijker te bewerken",
        "Kan meer onderhoud vereisen"
      ]
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.MATERIALS_EXTERNAL_BASE,
    key: "SPRUCE-EXTERNAL",
    name: "Sparrenhout",
    description: "Klassieke sparrenhouten buitenzijde met weersbescherming",
    priceExcl: 0,
    vatRatePercent: 21,
    images: [
      "/placeholders/material-4.png"
    ],
    tags: [
      OptionTag.EXTERNAL
    ],
    attributes: {
      colors: [
        {
          id: ColorEnum.SPRUCE_EXT_NATURAL.id,
          name: ColorEnum.SPRUCE_EXT_NATURAL.name,
          priceExcl: 0,
          vatRatePercent: 21,
          hex: "#F5E6D3"
        },
        {
          id: ColorEnum.SPRUCE_EXT_WHITE.id,
          name: ColorEnum.SPRUCE_EXT_WHITE.name,
          priceExcl: 82.64,
          vatRatePercent: 21,
          hex: "#FFFFFF"
        },
        {
          id: ColorEnum.SPRUCE_EXT_GREY.id,
          name: ColorEnum.SPRUCE_EXT_GREY.name,
          priceExcl: 82.64,
          vatRatePercent: 21,
          hex: "#808080"
        },
        {
          id: ColorEnum.SPRUCE_EXT_BROWN.id,
          name: ColorEnum.SPRUCE_EXT_BROWN.name,
          priceExcl: 82.64,
          vatRatePercent: 21,
          hex: "#8B4513"
        },
        {
          id: ColorEnum.SPRUCE_EXT_BLACK.id,
          name: ColorEnum.SPRUCE_EXT_BLACK.name,
          priceExcl: 82.64,
          vatRatePercent: 21,
          hex: "#000000"
        }
      ],
      pros: [
        "Natuurlijke houtuitstraling",
        "Goede weersbestendigheid",
        "Eenvoudig te onderhouden",
        "Kostenefficiënt"
      ],
      cons: [
        "Regelmatige behandeling vereist",
        "Kan na verloop van tijd verweren",
        "Kan opnieuw geverfd moeten worden"
      ]
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.MATERIALS_EXTERNAL_BASE,
    key: "THERMAL-WOOD",
    name: "Thermisch hout",
    description: "Thermisch behandeld hout met verbeterde duurzaamheid en stabiliteit",
    priceExcl: 330.58,
    vatRatePercent: 21,
    images: [
      "/placeholders/material-1.png"
    ],
    tags: [
      OptionTag.EXTERNAL
    ],
    attributes: {
      colors: [
        {
          id: ColorEnum.THERMAL_NATURAL.id,
          name: ColorEnum.THERMAL_NATURAL.name,
          priceExcl: 0,
          vatRatePercent: 21,
          hex: "#D2B48C"
        },
        {
          id: ColorEnum.THERMAL_DARK.id,
          name: ColorEnum.THERMAL_DARK.name,
          priceExcl: 41.32,
          vatRatePercent: 21,
          hex: "#8B7355"
        },
        {
          id: ColorEnum.THERMAL_CHARCOAL.id,
          name: ColorEnum.THERMAL_CHARCOAL.name,
          priceExcl: 82.64,
          vatRatePercent: 21,
          hex: "#36454F"
        }
      ],
      pros: [
        "Verbeterde duurzaamheid",
        "Betere weersbestendigheid",
        "Stabiele maatvoering",
        "Weinig onderhoud"
      ],
      cons: [
        "Hogere kosten",
        "Beperkte kleurkeuze",
        "Minder natuurlijke uitstraling"
      ]
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.MATERIALS_EXTERNAL_BASE,
    key: "WPC",
    name: "Hout-kunststof composiet (WPC)",
    description: "Modern composietmateriaal dat hout en kunststof combineert",
    priceExcl: 495.87,
    vatRatePercent: 21,
    images: [
      "/placeholders/material-2.png"
    ],
    tags: [
      OptionTag.EXTERNAL
    ],
    attributes: {
      colors: [
        {
          id: ColorEnum.WPC_BROWN.id,
          name: ColorEnum.WPC_BROWN.name,
          priceExcl: 0,
          vatRatePercent: 21,
          hex: "#8B4513"
        },
        {
          id: ColorEnum.WPC_GREY.id,
          name: ColorEnum.WPC_GREY.name,
          priceExcl: 0,
          vatRatePercent: 21,
          hex: "#808080"
        },
        {
          id: ColorEnum.WPC_BLACK.id,
          name: ColorEnum.WPC_BLACK.name,
          priceExcl: 0,
          vatRatePercent: 21,
          hex: "#000000"
        }
      ],
      pros: [
        "Zeer weinig onderhoud",
        "Uitstekende weersbestendigheid",
        "Consistente uitstraling",
        "Gaat lang mee"
      ],
      cons: [
        "Hogere kosten",
        "Minder natuurlijke uitstraling",
        "Beperkte kleurkeuze"
      ]
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.INSULATION_BASE,
    key: "NO-INSULATION",
    name: "Geen isolatie",
    description: "Standaard constructie zonder extra isolatie",
    priceExcl: 0,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.INSULATION
    ],
    attributes: {
      pros: [
        "Lagere kosten",
        "Snellere bouw"
      ],
      cons: [
        "Hogere stookkosten",
        "Minder energie-efficiënt",
        "Langere opwarmtijd"
      ]
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.INSULATION_BASE,
    key: "STANDARD-INSULATION",
    name: "Standaard isolatie",
    description: "Standaard minerale wol isolatie voor betere energie-efficiëntie",
    priceExcl: 165.29,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.INSULATION
    ],
    attributes: {
      pros: [
        "Betere energie-efficiëntie",
        "Snellere opwarming",
        "Lagere gebruikskosten"
      ],
      cons: [
        "Hogere aanschafprijs",
        "Iets dikkere wanden"
      ]
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.INSULATION_BASE,
    key: "PREMIUM-INSULATION",
    name: "Premium isolatie",
    description: "Hoogwaardige isolatie voor maximale energie-efficiëntie",
    priceExcl: 330.58,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.INSULATION
    ],
    attributes: {
      pros: [
        "Maximale energie-efficiëntie",
        "Snelste opwarming",
        "Laagste gebruikskosten"
      ],
      cons: [
        "Hoogste prijs",
        "Dikkere wanden"
      ]
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.SPASYSTEM_BASE,
    key: "CIRCULATION-PUMP",
    name: "Circulatiepomp",
    description: "Vereist als geen hydromassagesysteem is geselecteerd",
    priceExcl: 123.97,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.SPA,
      OptionTag.CIRCULATION
    ],
    attributes: {
      type: SpaSystemType.CIRCULATION,
      power: "0.5kW",
      nozzles: null,
      included: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.SPASYSTEM_BASE,
    key: "HYDRO-MASSAGE-8",
    name: "Hydromassage systeem",
    description: "Hydromassage systeem met 8 sproeiers voor ontspanning",
    priceExcl: 206.61,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.SPA,
      OptionTag.HYDRO_MASSAGE
    ],
    attributes: {
      type: SpaSystemType.HYDRO_MASSAGE,
      power: "1.1kW",
      nozzles: 8,
      included: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.SPASYSTEM_BASE,
    key: "HYDRO-MASSAGE-12",
    name: "Hydromassage systeem",
    description: "Hydromassage systeem met 12 sproeiers voor extra ontspanning",
    priceExcl: 247.93,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.SPA,
      OptionTag.HYDRO_MASSAGE
    ],
    attributes: {
      type: SpaSystemType.HYDRO_MASSAGE,
      power: "1.1kW",
      nozzles: 12,
      included: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.SPASYSTEM_BASE,
    key: "HYDRO-MASSAGE-16",
    name: "Hydromassage systeem",
    description: "Premium hydromassage systeem met 16 sproeiers",
    priceExcl: 330.58,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.SPA,
      OptionTag.HYDRO_MASSAGE
    ],
    attributes: {
      type: SpaSystemType.HYDRO_MASSAGE,
      power: "1.5kW",
      nozzles: 16,
      included: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.SPASYSTEM_BASE,
    key: "AIR-BUBBLE-12",
    name: "Luchtbel systeem",
    description: "Luchtbel systeem met 12 sproeiers voor zachte massage",
    priceExcl: 165.29,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.SPA,
      OptionTag.AIR_BUBBLE
    ],
    attributes: {
      type: SpaSystemType.AIR_BUBBLE,
      power: "0.75kW",
      nozzles: 12,
      included: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.LEDS_BASE,
    key: "LED-INDIVIDUAL-1",
    name: "Losse LED",
    description: "Enkele LED-lamp voor basisverlichting",
    priceExcl: 41.32,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.LED,
      OptionTag.INDIVIDUAL
    ],
    attributes: {
      type: LedType.INDIVIDUAL,
      count: 1,
      size: null
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.LEDS_BASE,
    key: "LED-INDIVIDUAL-3",
    name: "Set van 3 LED's",
    description: "Set van 3 LED-lampen voor betere verlichting",
    priceExcl: 115.7,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.LED,
      OptionTag.INDIVIDUAL
    ],
    attributes: {
      type: LedType.INDIVIDUAL,
      count: 3,
      size: null
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.LEDS_BASE,
    key: "LED-INDIVIDUAL-ADDITIONAL",
    name: "Extra LED",
    description: "Extra losse LED-lamp",
    priceExcl: 24.79,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.LED,
      OptionTag.INDIVIDUAL
    ],
    attributes: {
      type: LedType.INDIVIDUAL,
      count: 1,
      size: null
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.LEDS_BASE,
    key: "LED-MINI",
    name: "Mini LED",
    description: "Kleine LED-lamp voor accentverlichting",
    priceExcl: 8.26,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.LED,
      OptionTag.INDIVIDUAL
    ],
    attributes: {
      type: LedType.INDIVIDUAL,
      count: 1,
      size: null
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.LEDS_BASE,
    key: "LED-GECKO",
    name: "Gecko LED",
    description: "Premium Gecko LED met geavanceerde functies",
    priceExcl: 66.12,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.LED,
      OptionTag.INDIVIDUAL
    ],
    attributes: {
      type: LedType.INDIVIDUAL,
      count: 1,
      size: null
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.LEDS_BASE,
    key: "LED-STRIP-200",
    name: "LED-strip",
    description: "LED-stripverlichting voor 200cm sauna's",
    priceExcl: 123.97,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.LED,
      OptionTag.STRIP
    ],
    attributes: {
      type: LedType.STRIP,
      count: null,
      size: "200cm"
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.LEDS_BASE,
    key: "LED-STRIP-220",
    name: "LED-strip",
    description: "LED-stripverlichting voor 220cm sauna's",
    priceExcl: 148.76,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.LED,
      OptionTag.STRIP
    ],
    attributes: {
      type: LedType.STRIP,
      count: null,
      size: "220cm"
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.LEDS_BASE,
    key: "LED-STRIP-250",
    name: "LED-strip",
    description: "LED-stripverlichting voor 250cm sauna's",
    priceExcl: 165.29,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.LED,
      OptionTag.STRIP
    ],
    attributes: {
      type: LedType.STRIP,
      count: null,
      size: "250cm"
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.FILTRATION_BASE,
    key: "SF-CONNECTIONS",
    name: "SF-verbindingen",
    description: "Standaard SF-verbindingen voor basisfiltratie",
    priceExcl: 33.06,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.FILTRATION,
      OptionTag.CONNECTION
    ],
    attributes: {
      type: FiltrationType.CONNECTION,
      role: FiltrationRole.MAIN,
      required: true
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.FILTRATION_BASE,
    key: "STAINLESS-SF-CONNECTIONS",
    name: "RVS SF-verbindingen",
    description: "Premium RVS SF-verbindingen",
    priceExcl: 74.38,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.FILTRATION,
      OptionTag.CONNECTION
    ],
    attributes: {
      type: FiltrationType.CONNECTION,
      role: FiltrationRole.ADDON,
      required: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.FILTRATION_BASE,
    key: "SAND-FILTER",
    name: "Zandfilter",
    description: "Zandfilter voor superieure waterfiltratie",
    priceExcl: 181.82,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.FILTRATION,
      OptionTag.FILTER
    ],
    attributes: {
      type: FiltrationType.FILTER,
      role: FiltrationRole.MAIN,
      required: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.FILTRATION_BASE,
    key: "COTTON-BALLS",
    name: "Katoenbolletjes filter",
    description: "Alternatief voor zandfilter met katoenbolletjes",
    priceExcl: 148.76,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.FILTRATION,
      OptionTag.FILTER
    ],
    attributes: {
      type: FiltrationType.FILTER,
      role: FiltrationRole.MAIN,
      required: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.FILTRATION_BASE,
    key: "UV-LAMP",
    name: "UV-lamp",
    description: "UV-lamp voor waterdesinfectie",
    priceExcl: 165.29,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.FILTRATION,
      OptionTag.UV
    ],
    attributes: {
      type: FiltrationType.UV,
      role: FiltrationRole.ADDON,
      required: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.CONTROLUNIT_BASE,
    key: "TRADITIONAL-BUTTONS",
    name: "Traditionele knoppen",
    description: "Klassiek bedieningssysteem met knoppen",
    priceExcl: 0,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.CONTROL,
      OptionTag.TRADITIONAL
    ],
    attributes: {
      type: ControlUnitType.TRADITIONAL,
      wifi: null
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.CONTROLUNIT_BASE,
    key: "LED-DISPLAY",
    name: "LED-display",
    description: "LED-display met digitale uitlezing",
    priceExcl: 123.97,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.CONTROL,
      OptionTag.LED_DISPLAY
    ],
    attributes: {
      type: ControlUnitType.LED_DISPLAY,
      wifi: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.CONTROLUNIT_BASE,
    key: "LED-DISPLAY-WIFI",
    name: "LED-display met wifi",
    description: "LED-display met wifi-connectiviteit",
    priceExcl: 206.61,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.CONTROL,
      OptionTag.LED_DISPLAY
    ],
    attributes: {
      type: ControlUnitType.LED_DISPLAY,
      wifi: true
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.CONTROLUNIT_BASE,
    key: "TOUCHSCREEN",
    name: "Touchscreen bediening",
    description: "Modern touchscreen bedieningspaneel",
    priceExcl: 330.58,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.CONTROL,
      OptionTag.TOUCHSCREEN
    ],
    attributes: {
      type: ControlUnitType.TOUCHSCREEN,
      wifi: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.CONTROLUNIT_BASE,
    key: "TOUCHSCREEN-WIFI",
    name: "Touchscreen met wifi",
    description: "Touchscreen bediening met wifi-connectiviteit",
    priceExcl: 413.22,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.CONTROL,
      OptionTag.TOUCHSCREEN
    ],
    attributes: {
      type: ControlUnitType.TOUCHSCREEN,
      wifi: true
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.LID_BASE,
    key: "INCLUDED-LID",
    name: "Standaard deksel",
    description: "Standaard deksel inbegrepen bij de sauna (materiaal volgt interne keuze)",
    priceExcl: 0,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.LID,
      OptionTag.INCLUDED
    ],
    attributes: {
      type: LidType.INCLUDED,
      material: null,
      color: null,
      inheritMaterial: true
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.LID_BASE,
    key: "LEATHER-LID-BLACK",
    name: "Leren deksel (zwart)",
    description: "Premium leren deksel in zwart",
    priceExcl: 247.93,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.LID,
      OptionTag.LEATHER
    ],
    attributes: {
      type: LidType.LEATHER,
      material: LidMaterial.LEATHER,
      color: LidColor.BLACK,
      inheritMaterial: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.LID_BASE,
    key: "LEATHER-LID-BROWN",
    name: "Leren deksel (bruin)",
    description: "Premium leren deksel in bruin",
    priceExcl: 247.93,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.LID,
      OptionTag.LEATHER
    ],
    attributes: {
      type: LidType.LEATHER,
      material: LidMaterial.LEATHER,
      color: LidColor.BROWN,
      inheritMaterial: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.LID_BASE,
    key: "FIBERGLASS-LID",
    name: "Glasvezel deksel",
    description: "Duurzaam glasvezel deksel",
    priceExcl: 165.29,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.LID,
      OptionTag.FIBERGLASS
    ],
    attributes: {
      type: LidType.FIBERGLASS,
      material: LidMaterial.FIBERGLASS,
      color: null,
      inheritMaterial: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.LID_BASE,
    key: "ACRYLIC-LID",
    name: "Acryl deksel",
    description: "Transparant acryl deksel voor zicht",
    priceExcl: 206.61,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.LID,
      OptionTag.ACRYLIC
    ],
    attributes: {
      type: LidType.ACRYLIC,
      material: LidMaterial.ACRYLIC,
      color: null,
      inheritMaterial: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.STAIRS_BASE,
    key: "STANDARD-STAIRS",
    name: "Standaard trap",
    description: "Basistrap inbegrepen bij de sauna",
    priceExcl: 0,
    vatRatePercent: 21,
    images: [],
    tags: [],
    attributes: {
      type: StairsType.STANDARD,
      material: null,
      coversSandFilter: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.STAIRS_BASE,
    key: "XL-STAIRS-SPRUCE",
    name: "XL trap (spar)",
    description: "Extra grote trap met zandfilterbehuizing in sparrenhout",
    priceExcl: 66.12,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.COVERS_SAND_FILTER
    ],
    attributes: {
      type: StairsType.XL,
      material: StairsMaterial.SPRUCE,
      coversSandFilter: true
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.STAIRS_BASE,
    key: "XL-STAIRS-THERMAL",
    name: "XL trap (thermisch hout)",
    description: "Extra grote trap met zandfilterbehuizing in thermisch hout",
    priceExcl: 82.64,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.COVERS_SAND_FILTER
    ],
    attributes: {
      type: StairsType.XL,
      material: StairsMaterial.THERMAL,
      coversSandFilter: true
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.STAIRS_BASE,
    key: "XL-STAIRS-WPC",
    name: "XL trap (WPC)",
    description: "Extra grote trap met zandfilterbehuizing in WPC",
    priceExcl: 99.17,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.COVERS_SAND_FILTER
    ],
    attributes: {
      type: StairsType.XL,
      material: StairsMaterial.WPC,
      coversSandFilter: true
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.STAIRS_BASE,
    key: "3-STEP-SPRUCE",
    name: "3-traps trap (spar)",
    description: "Premium 3-traps trap in sparrenhout",
    priceExcl: 247.93,
    vatRatePercent: 21,
    images: [],
    tags: [],
    attributes: {
      type: StairsType._3_STEP,
      material: StairsMaterial.SPRUCE,
      coversSandFilter: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.STAIRS_BASE,
    key: "3-STEP-THERMAL",
    name: "3-traps trap (thermisch hout)",
    description: "Premium 3-traps trap in thermisch hout",
    priceExcl: 289.26,
    vatRatePercent: 21,
    images: [],
    tags: [],
    attributes: {
      type: StairsType._3_STEP,
      material: StairsMaterial.THERMAL,
      coversSandFilter: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.STAIRS_BASE,
    key: "3-STEP-WPC",
    name: "3-traps trap (WPC)",
    description: "Premium 3-traps trap in WPC",
    priceExcl: 330.58,
    vatRatePercent: 21,
    images: [],
    tags: [],
    attributes: {
      type: StairsType._3_STEP,
      material: StairsMaterial.WPC,
      coversSandFilter: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.EXTRAS_BASE,
    key: "DIGITAL-THERMOMETER",
    name: "Digitale thermometer",
    description: "Digitale thermometer voor nauwkeurige temperatuurmeting",
    priceExcl: 20.66,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.CONVENIENCE
    ],
    attributes: {
      category: ExtraCategory.CONVENIENCE,
      required: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.EXTRAS_BASE,
    key: "HEAD-PILLOW",
    name: "Hoofdkussen",
    description: "Comfortabel hoofdkussen voor ontspanning",
    priceExcl: 12.4,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.COMFORT
    ],
    attributes: {
      category: ExtraCategory.COMFORT,
      required: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.EXTRAS_BASE,
    key: "STEEL-BANDS-SILVER",
    name: "RVS banden (zilver)",
    description: "RVS banden voor structurele versteviging",
    priceExcl: 41.32,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.SAFETY
    ],
    attributes: {
      category: ExtraCategory.SAFETY,
      required: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.EXTRAS_BASE,
    key: "STEEL-BANDS-BLACK",
    name: "RVS banden (zwart)",
    description: "Zwarte RVS banden voor structurele versteviging",
    priceExcl: 41.32,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.SAFETY
    ],
    attributes: {
      category: ExtraCategory.SAFETY,
      required: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.EXTRAS_BASE,
    key: "EXTERNAL-HEATER-ELBOWS",
    name: "Kachelbochten set extern",
    description: "Extra pijpverbindingen voor externe kachel",
    priceExcl: 16.53,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.MAINTENANCE
    ],
    attributes: {
      category: ExtraCategory.MAINTENANCE,
      required: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.EXTRAS_BASE,
    key: "BOTTOM-COVER",
    name: "Bodemcover",
    description: "Beschermende bodemplaat voor de sauna",
    priceExcl: 82.64,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.MAINTENANCE
    ],
    attributes: {
      category: ExtraCategory.MAINTENANCE,
      required: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.EXTRAS_BASE,
    key: "WATER-OUTLET-VALVE",
    name: "Wateraftapkraan",
    description: "Handige aftapkraan voor eenvoudig legen",
    priceExcl: 49.59,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.CONVENIENCE
    ],
    attributes: {
      category: ExtraCategory.CONVENIENCE,
      required: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.EXTRAS_BASE,
    key: "REVISION-DOOR-WHITE",
    name: "Revisiedeur (wit)",
    description: "Witte revisiedeur voor onderhoudstoegang",
    priceExcl: 0,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.MAINTENANCE
    ],
    attributes: {
      category: ExtraCategory.MAINTENANCE,
      required: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.EXTRAS_BASE,
    key: "REVISION-DOOR-GREY",
    name: "Revisiedeur (grijs)",
    description: "Grijze revisiedeur voor onderhoudstoegang",
    priceExcl: 8.26,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.MAINTENANCE
    ],
    attributes: {
      category: ExtraCategory.MAINTENANCE,
      required: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.EXTRAS_BASE,
    key: "CUPHOLDER-STANDARD",
    name: "Standaard bekerhouder",
    description: "Standaard bekerhouder inbegrepen",
    priceExcl: 0,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.CONVENIENCE
    ],
    attributes: {
      category: ExtraCategory.CONVENIENCE,
      required: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.EXTRAS_BASE,
    key: "CUPHOLDER-EXTRA",
    name: "Extra bekerhouder (3-5 gaten)",
    description: "Extra bekerhouder met 3-5 gaten",
    priceExcl: 24.79,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.CONVENIENCE
    ],
    attributes: {
      category: ExtraCategory.CONVENIENCE,
      required: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.EXTRAS_BASE,
    key: "SNACK-DECK",
    name: "Snackplank",
    description: "Klein plateau voor snacks en drankjes",
    priceExcl: 16.53,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.CONVENIENCE
    ],
    attributes: {
      category: ExtraCategory.CONVENIENCE,
      required: false
    },
    isActive: true
  },
  {
    groupKey: OptionGroupKey.SANDFILTER_BASE,
    key: "SAND-FILTER-BOX",
    name: "Zandfilter Box",
    description: "Zandfilter in bijpassende box",
    priceExcl: 82.64,
    vatRatePercent: 21,
    images: [],
    tags: [
      OptionTag.SAND_FILTER_BOX
    ],
    attributes: {
      inheritsExternalColor: true
    },
    isActive: true
  }
];
