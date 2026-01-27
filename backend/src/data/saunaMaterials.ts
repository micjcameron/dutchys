export interface MaterialOption {
  id: string;
  name: string;
  type: 'internal' | 'external';
  priceIncl: number;
  priceExcl: number;
  description: string;
  colors: ColorOption[];
  pros: string[];
  cons: string[];
  image: string;
}

export interface ColorOption {
  id: string;
  name: string;
  priceIncl: number;
  priceExcl: number;
  hex?: string;
  description?: string;
}

export const internalMaterials: MaterialOption[] = [
  {
    id: 'spruce',
    name: 'Sparrenhout',
    type: 'internal',
    priceIncl: 0,
    priceExcl: 0,
    description: 'Klassiek Noord-Europees sparrenhout voor een authentieke sauna-ervaring',
    image: '/placeholders/material-1.png',
    pros: [
      'Authentiek sauna-gevoel',
      'Natuurlijke houtgeur',
      'Goede warmteopslag',
      'Traditionele uitstraling'
    ],
    cons: [
      'Vereist regelmatig onderhoud',
      'Kan na verloop van tijd donkerder worden',
      'Kan scheurtjes ontwikkelen'
    ],
    colors: [
      { id: 'spruce-natural', name: 'Naturel', priceIncl: 0, priceExcl: 0, hex: '#F5E6D3' },
      { id: 'spruce-light', name: 'Licht', priceIncl: 0, priceExcl: 0, hex: '#F0E68C' },
      { id: 'spruce-medium', name: 'Midden', priceIncl: 50, priceExcl: 41.32, hex: '#D2B48C' },
      { id: 'spruce-dark', name: 'Donker', priceIncl: 100, priceExcl: 82.64, hex: '#8B7355' }
    ]
  },
  {
    id: 'cedar',
    name: 'Cederhout',
    type: 'internal',
    priceIncl: 300,
    priceExcl: 247.93,
    description: 'Premium cederhout met natuurlijke oliën en een mooie nerf',
    image: '/placeholders/material-2.png',
    pros: [
      'Natuurlijke oliën weerstaan vocht',
      'Mooie nerfstructuur',
      'Gaat lang mee',
      'Aromatische eigenschappen'
    ],
    cons: [
      'Hogere kosten',
      'Beperkte beschikbaarheid',
      'Kan bij sommigen allergieën veroorzaken'
    ],
    colors: [
      { id: 'cedar-natural', name: 'Naturel', priceIncl: 0, priceExcl: 0, hex: '#D2691E' },
      { id: 'cedar-light', name: 'Licht', priceIncl: 0, priceExcl: 0, hex: '#DEB887' },
      { id: 'cedar-medium', name: 'Midden', priceIncl: 50, priceExcl: 41.32, hex: '#CD853F' },
      { id: 'cedar-dark', name: 'Donker', priceIncl: 100, priceExcl: 82.64, hex: '#A0522D' }
    ]
  },
  {
    id: 'hemlock',
    name: 'Hemlockhout',
    type: 'internal',
    priceIncl: 200,
    priceExcl: 165.29,
    description: 'Duurzaam hemlockhout met uitstekende warmte-eigenschappen',
    image: '/placeholders/material-3.png',
    pros: [
      'Uitstekende warmteopslag',
      'Duurzaam en stabiel',
      'Goede prijs-kwaliteit',
      'Consistente kleur'
    ],
    cons: [
      'Minder aromatisch dan ceder',
      'Moeilijker te bewerken',
      'Kan meer onderhoud vereisen'
    ],
    colors: [
      { id: 'hemlock-natural', name: 'Naturel', priceIncl: 0, priceExcl: 0, hex: '#F5DEB3' },
      { id: 'hemlock-light', name: 'Licht', priceIncl: 0, priceExcl: 0, hex: '#FFF8DC' },
      { id: 'hemlock-medium', name: 'Midden', priceIncl: 50, priceExcl: 41.32, hex: '#DDBEA9' },
      { id: 'hemlock-dark', name: 'Donker', priceIncl: 100, priceExcl: 82.64, hex: '#BC9A6A' }
    ]
  }
];

export const externalMaterials: MaterialOption[] = [
  {
    id: 'spruce-external',
    name: 'Sparrenhout',
    type: 'external',
    priceIncl: 0,
    priceExcl: 0,
    description: 'Klassieke sparrenhouten buitenzijde met weersbescherming',
    image: '/placeholders/material-4.png',
    pros: [
      'Natuurlijke houtuitstraling',
      'Goede weersbestendigheid',
      'Eenvoudig te onderhouden',
      'Kostenefficiënt'
    ],
    cons: [
      'Regelmatige behandeling vereist',
      'Kan na verloop van tijd verweren',
      'Kan opnieuw geverfd moeten worden'
    ],
    colors: [
      { id: 'spruce-ext-natural', name: 'Naturel', priceIncl: 0, priceExcl: 0, hex: '#F5E6D3' },
      { id: 'spruce-ext-white', name: 'Wit', priceIncl: 100, priceExcl: 82.64, hex: '#FFFFFF' },
      { id: 'spruce-ext-grey', name: 'Grijs', priceIncl: 100, priceExcl: 82.64, hex: '#808080' },
      { id: 'spruce-ext-brown', name: 'Bruin', priceIncl: 100, priceExcl: 82.64, hex: '#8B4513' },
      { id: 'spruce-ext-black', name: 'Zwart', priceIncl: 100, priceExcl: 82.64, hex: '#000000' }
    ]
  },
  {
    id: 'thermal-wood',
    name: 'Thermisch hout',
    type: 'external',
    priceIncl: 400,
    priceExcl: 330.58,
    description: 'Thermisch behandeld hout met verbeterde duurzaamheid en stabiliteit',
    image: '/placeholders/material-1.png',
    pros: [
      'Verbeterde duurzaamheid',
      'Betere weersbestendigheid',
      'Stabiele maatvoering',
      'Weinig onderhoud'
    ],
    cons: [
      'Hogere kosten',
      'Beperkte kleurkeuze',
      'Minder natuurlijke uitstraling'
    ],
    colors: [
      { id: 'thermal-natural', name: 'Naturel', priceIncl: 0, priceExcl: 0, hex: '#D2B48C' },
      { id: 'thermal-dark', name: 'Donker', priceIncl: 50, priceExcl: 41.32, hex: '#8B7355' },
      { id: 'thermal-charcoal', name: 'Antraciet', priceIncl: 100, priceExcl: 82.64, hex: '#36454F' }
    ]
  },
  {
    id: 'wpc',
    name: 'Hout-kunststof composiet (WPC)',
    type: 'external',
    priceIncl: 600,
    priceExcl: 495.87,
    description: 'Modern composietmateriaal dat hout en kunststof combineert',
    image: '/placeholders/material-2.png',
    pros: [
      'Zeer weinig onderhoud',
      'Uitstekende weersbestendigheid',
      'Consistente uitstraling',
      'Gaat lang mee'
    ],
    cons: [
      'Hogere kosten',
      'Minder natuurlijke uitstraling',
      'Beperkte kleurkeuze'
    ],
    colors: [
      { id: 'wpc-brown', name: 'Bruin', priceIncl: 0, priceExcl: 0, hex: '#8B4513' },
      { id: 'wpc-grey', name: 'Grijs', priceIncl: 0, priceExcl: 0, hex: '#808080' },
      { id: 'wpc-black', name: 'Zwart', priceIncl: 0, priceExcl: 0, hex: '#000000' }
    ]
  }
];

export const insulationOptions = [
  {
    id: 'no-insulation',
    name: 'Geen isolatie',
    priceIncl: 0,
    priceExcl: 0,
    description: 'Standaard constructie zonder extra isolatie',
    pros: ['Lagere kosten', 'Snellere bouw'],
    cons: ['Hogere stookkosten', 'Minder energie-efficiënt', 'Langere opwarmtijd']
  },
  {
    id: 'standard-insulation',
    name: 'Standaard isolatie',
    priceIncl: 200,
    priceExcl: 165.29,
    description: 'Standaard minerale wol isolatie voor betere energie-efficiëntie',
    pros: ['Betere energie-efficiëntie', 'Snellere opwarming', 'Lagere gebruikskosten'],
    cons: ['Hogere aanschafprijs', 'Iets dikkere wanden']
  },
  {
    id: 'premium-insulation',
    name: 'Premium isolatie',
    priceIncl: 400,
    priceExcl: 330.58,
    description: 'Hoogwaardige isolatie voor maximale energie-efficiëntie',
    pros: ['Maximale energie-efficiëntie', 'Snelste opwarming', 'Laagste gebruikskosten'],
    cons: ['Hoogste prijs', 'Dikkere wanden']
  }
];

export const allMaterials = {
  internal: internalMaterials,
  external: externalMaterials,
  insulation: insulationOptions
};
