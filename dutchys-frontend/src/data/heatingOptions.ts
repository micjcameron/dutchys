export interface HeatingOption {
  id: string;
  type: 'wood' | 'electric' | 'hybrid';
  category: string;
  name: string;
  description: string;
  priceIncl: number;
  priceExcl: number;
  heatingTime?: string;
  power?: string;
  voltage?: string;
  pros: string[];
  cons: string[];
  image: string;
}

export interface WoodHeatingOption extends HeatingOption {
  type: 'wood';
  placement: 'intern' | 'extern';
  size: string;
  extraOptions?: {
    id: string;
    name: string;
    priceIncl: number;
    priceExcl: number;
    description: string;
  }[];
}

export interface ElectricHeatingOption extends HeatingOption {
  type: 'electric';
  power: string;
  voltage: string;
  heatingTime: string;
}

export interface HybridHeatingOption extends HeatingOption {
  type: 'hybrid';
  power: string;
  voltage: string;
  heatingTime: string;
  keepWarmNote: string;
}

export const woodHeatingOptions: WoodHeatingOption[] = [
  {
    id: 'wood-internal-small',
    type: 'wood',
    category: 'Houtkachel',
    name: 'Interne houtkachel (klein)',
    description: "Compacte interne houtkachel, perfect voor kleinere sauna's",
    placement: 'intern',
    size: 'Klein',
    priceIncl: 0,
    priceExcl: 0,
    heatingTime: '45-60 min',
    image: '/placeholders/material-1.png',
    pros: [
      'Ruimtebesparend',
      'Snellere opwarming',
      'Geen externe schoorsteen nodig',
      'Betere warmteverdeling'
    ],
    cons: [
      'Kleinere vuurhaard',
      'Minder houtcapaciteit',
      'Vaker bijvullen nodig'
    ],
    extraOptions: [
      {
        id: 'black-heater-plate',
        name: 'Zwarte kachelplaat',
        priceIncl: 20,
        priceExcl: 16.53,
        description: 'Stijlvolle zwarte afwerking voor de kachelplaat'
      }
    ]
  },
  {
    id: 'wood-internal-large',
    type: 'wood',
    category: 'Houtkachel',
    name: 'Interne houtkachel (groot)',
    description: 'Grote interne houtkachel voor grotere sauna\'s',
    placement: 'intern',
    size: 'Groot',
    priceIncl: 150,
    priceExcl: 123.97,
    heatingTime: '30-45 min',
    image: '/placeholders/material-2.png',
    pros: [
      'Grotere vuurhaard',
      'Langere brandduur',
      'Beter voor grotere sauna\'s',
      'Efficiëntere verwarming'
    ],
    cons: [
      'Neemt meer binnenruimte in',
      'Hogere aanschafprijs'
    ],
    extraOptions: [
      {
        id: 'black-heater-plate',
        name: 'Zwarte kachelplaat',
        priceIncl: 20,
        priceExcl: 16.53,
        description: 'Stijlvolle zwarte afwerking voor de kachelplaat'
      }
    ]
  },
  {
    id: 'wood-external-small',
    type: 'wood',
    category: 'Houtkachel',
    name: 'Externe houtkachel (klein)',
    description: 'Externe houtkachel met schoorsteen, bespaart binnenruimte',
    placement: 'extern',
    size: 'Klein',
    priceIncl: 200,
    priceExcl: 165.29,
    heatingTime: '60-75 min',
    image: '/placeholders/material-2.png',
    pros: [
      'Meer binnenruimte',
      'Geen rook in de sauna',
      'Makkelijker hout bijvullen',
      'Betere ventilatie'
    ],
    cons: [
      'Langere opwarmtijd',
      'Externe schoorsteen vereist',
      'Complexere installatie'
    ],
    extraOptions: [
      {
        id: 'heater-elbows-set',
        name: 'Kachelbochten set',
        priceIncl: 20,
        priceExcl: 16.53,
        description: 'Extra pijpverbindingen voor externe kachel'
      },
      {
        id: 'chimney-extra',
        name: 'Extra schoorsteen (1m)',
        priceIncl: 20,
        priceExcl: 16.53,
        description: 'Extra schoorsteenlengte voor goede ventilatie'
      }
    ]
  },
  {
    id: 'wood-external-large',
    type: 'wood',
    category: 'Houtkachel',
    name: 'Externe houtkachel (groot)',
    description: 'Grote externe houtkachel voor maximale efficiëntie',
    placement: 'extern',
    size: 'Groot',
    priceIncl: 350,
    priceExcl: 289.26,
    heatingTime: '45-60 min',
    image: '/placeholders/material-3.png',
    pros: [
      'Maximale binnenruimte',
      'Grootste vuurhaardcapaciteit',
      'Meest efficiënt voor grote sauna\'s',
      'Professionele installatie'
    ],
    cons: [
      'Hoogste prijs',
      'Complexe installatie',
      'Meer buitenruimte nodig'
    ],
    extraOptions: [
      {
        id: 'heater-elbows-set',
        name: 'Kachelbochten set',
        priceIncl: 20,
        priceExcl: 16.53,
        description: 'Extra pijpverbindingen voor externe kachel'
      },
      {
        id: 'chimney-extra',
        name: 'Extra schoorsteen (1m)',
        priceIncl: 20,
        priceExcl: 16.53,
        description: 'Extra schoorsteenlengte voor goede ventilatie'
      }
    ]
  }
];

export const electricHeatingOptions: ElectricHeatingOption[] = [
  {
    id: 'electric-6kw',
    type: 'electric',
    category: 'Volledig elektrisch',
    name: '6kW elektrische kachel',
    description: "6kW elektrische kachel voor kleine tot middelgrote sauna's",
    power: '6kW',
    voltage: '3-fase',
    priceIncl: 800,
    priceExcl: 661.16,
    heatingTime: '45-60 min',
    image: '/placeholders/material-3.png',
    pros: [
      'Geen hout nodig',
      'Constante temperatuur',
      'Eenvoudig te regelen',
      'Geen rook of as'
    ],
    cons: [
      '3-fase stroom vereist',
      'Hogere stroomkosten',
      'Geen authentieke houtvuurervaring'
    ]
  },
  {
    id: 'electric-9kw',
    type: 'electric',
    category: 'Volledig elektrisch',
    name: '9kW elektrische kachel',
    description: '9kW elektrische kachel voor middelgrote sauna\'s',
    power: '9kW',
    voltage: '3-fase',
    priceIncl: 1200,
    priceExcl: 991.74,
    heatingTime: '30-45 min',
    image: '/placeholders/material-4.png',
    pros: [
      'Snelle opwarming',
      'Goed voor middelgrote sauna\'s',
      'Betrouwbare prestaties',
      'Eenvoudig onderhoud'
    ],
    cons: [
      '3-fase stroom vereist',
      'Hogere stroomkosten',
      'Geen authentieke houtvuurervaring'
    ]
  },
  {
    id: 'electric-12kw',
    type: 'electric',
    category: 'Volledig elektrisch',
    name: '12kW elektrische kachel',
    description: '12kW elektrische kachel voor grote sauna\'s',
    power: '12kW',
    voltage: '3-fase',
    priceIncl: 1600,
    priceExcl: 1322.31,
    heatingTime: '25-35 min',
    image: '/placeholders/material-1.png',
    pros: [
      'Snelle opwarming',
      'Perfect voor grote sauna\'s',
      'Professionele kwaliteit',
      'Constante prestaties'
    ],
    cons: [
      '3-fase stroom vereist',
      'Hoog stroomverbruik',
      'Geen authentieke houtvuurervaring'
    ]
  },
  {
    id: 'electric-18kw',
    type: 'electric',
    category: 'Volledig elektrisch',
    name: '18kW elektrische kachel',
    description: '18kW elektrische kachel voor commercieel gebruik of zeer grote sauna\'s',
    power: '18kW',
    voltage: '3-fase',
    priceIncl: 2200,
    priceExcl: 1818.18,
    heatingTime: '20-30 min',
    image: '/placeholders/material-2.png',
    pros: [
      'Zeer snelle opwarming',
      'Professionele kwaliteit',
      'Geschikt voor grote volumes',
      'Professionele installatie'
    ],
    cons: [
      '3-fase stroom vereist',
      'Zeer hoge stroomkosten',
      'Geen authentieke houtvuurervaring'
    ]
  }
];

export const hybridHeatingOptions: HybridHeatingOption[] = [
  {
    id: 'hybrid-230v-3kw',
    type: 'hybrid',
    category: 'Hybride',
    name: 'Hybride 3kW (230V)',
    description: 'Hybridesysteem: houtverwarming + 3kW elektrisch warmhouden',
    power: '3kW',
    voltage: '230V',
    priceIncl: 600,
    priceExcl: 495.87,
    heatingTime: '45-60 min (hout) + warmhouden',
    keepWarmNote: 'Leren deksel houdt warmte goed vast, glasvezel/acryl deksels laten temperatuur sneller dalen',
    image: '/placeholders/material-3.png',
    pros: [
      'Beste van twee werelden',
      'Houtverwarming + elektrisch gemak',
      'Geschikt voor 230V',
      'Kostenefficiënt'
    ],
    cons: [
      'Complexer systeem',
      'Vereist hout en elektriciteit',
      'Temperatuur kan dalen met bepaalde deksels'
    ]
  },
  {
    id: 'hybrid-3phase-6kw',
    type: 'hybrid',
    category: 'Hybride',
    name: 'Hybride 6kW (3-fase)',
    description: 'Hybridesysteem: houtverwarming + 6kW elektrisch warmhouden',
    power: '6kW',
    voltage: '3-fase',
    priceIncl: 1000,
    priceExcl: 826.45,
    heatingTime: '30-45 min (hout) + warmhouden',
    keepWarmNote: 'Leren deksel houdt warmte goed vast, glasvezel/acryl deksels laten temperatuur sneller dalen',
    image: '/placeholders/material-4.png',
    pros: [
      'Snelle houtopwarming',
      'Krachtige elektrische ondersteuning',
      'Professionele kwaliteit',
      'Betrouwbare temperatuurregeling'
    ],
    cons: [
      '3-fase stroom vereist',
      'Hogere kosten',
      'Complexere installatie'
    ]
  },
  {
    id: 'hybrid-3phase-9kw',
    type: 'hybrid',
    category: 'Hybride',
    name: 'Hybride 9kW (3-fase)',
    description: 'Hybridesysteem: houtverwarming + 9kW elektrisch warmhouden',
    power: '9kW',
    voltage: '3-fase',
    priceIncl: 1400,
    priceExcl: 1157.02,
    heatingTime: '25-35 min (hout) + warmhouden',
    keepWarmNote: 'Leren deksel houdt warmte goed vast, glasvezel/acryl deksels laten temperatuur sneller dalen',
    image: '/placeholders/material-1.png',
    pros: [
      'Zeer snelle opwarming',
      'Krachtige elektrische ondersteuning',
      'Perfect voor grote sauna\'s',
      'Professionele kwaliteit'
    ],
    cons: [
      '3-fase stroom vereist',
      'Hoge kosten',
      'Complex systeem'
    ]
  }
];

export const allHeatingOptions = [
  ...woodHeatingOptions,
  ...electricHeatingOptions,
  ...hybridHeatingOptions
];
