export interface SpaSystem {
  id: string;
  name: string;
  type: 'circulation' | 'hydro-massage' | 'air-bubble';
  power?: string;
  nozzles?: number;
  priceIncl: number;
  priceExcl: number;
  description: string;
  included?: boolean;
}

export interface LEDOption {
  id: string;
  name: string;
  type: 'individual' | 'strip' | 'band';
  count?: number;
  size?: string;
  priceIncl: number;
  priceExcl: number;
  description: string;
}

export interface FiltrationOption {
  id: string;
  name: string;
  type: 'connection' | 'filter' | 'uv';
  priceIncl: number;
  priceExcl: number;
  description: string;
  required?: boolean;
}

export interface ControlUnit {
  id: string;
  name: string;
  type: 'traditional' | 'led-display' | 'touchscreen';
  wifi?: boolean;
  priceIncl: number;
  priceExcl: number;
  description: string;
}

export interface ExtraOption {
  id: string;
  name: string;
  category: 'comfort' | 'safety' | 'convenience' | 'maintenance';
  priceIncl: number;
  priceExcl: number;
  description: string;
  required?: boolean;
}

export interface LidOption {
  id: string;
  name: string;
  type: 'included' | 'leather' | 'fiberglass' | 'acrylic';
  material?: string;
  color?: string;
  priceIncl: number;
  priceExcl: number;
  description: string;
  inheritMaterial?: boolean;
}

export interface StairsOption {
  id: string;
  name: string;
  type: 'standard' | 'xl' | '3-step';
  material?: string;
  coversSandFilter?: boolean;
  priceIncl: number;
  priceExcl: number;
  description: string;
}

export const spaSystems: SpaSystem[] = [
  {
    id: 'circulation-pump',
    name: 'Circulatiepomp',
    type: 'circulation',
    power: '0.5kW',
    priceIncl: 150,
    priceExcl: 123.97,
    description: 'Vereist als geen hydromassagesysteem is geselecteerd',
    included: false
  },
  {
    id: 'hydro-massage-8',
    name: 'Hydromassage systeem',
    type: 'hydro-massage',
    power: '1.1kW',
    nozzles: 8,
    priceIncl: 250,
    priceExcl: 206.61,
    description: 'Hydromassage systeem met 8 sproeiers voor ontspanning'
  },
  {
    id: 'hydro-massage-12',
    name: 'Hydromassage systeem',
    type: 'hydro-massage',
    power: '1.1kW',
    nozzles: 12,
    priceIncl: 300,
    priceExcl: 247.93,
    description: 'Hydromassage systeem met 12 sproeiers voor extra ontspanning'
  },
  {
    id: 'hydro-massage-16',
    name: 'Hydromassage systeem',
    type: 'hydro-massage',
    power: '1.5kW',
    nozzles: 16,
    priceIncl: 400,
    priceExcl: 330.58,
    description: 'Premium hydromassage systeem met 16 sproeiers'
  },
  {
    id: 'air-bubble-12',
    name: 'Luchtbel systeem',
    type: 'air-bubble',
    power: '0.75kW',
    nozzles: 12,
    priceIncl: 200,
    priceExcl: 165.29,
    description: 'Luchtbel systeem met 12 sproeiers voor zachte massage'
  }
];

export const ledOptions: LEDOption[] = [
  {
    id: 'led-individual-1',
    name: 'Losse LED',
    type: 'individual',
    count: 1,
    priceIncl: 50,
    priceExcl: 41.32,
    description: 'Enkele LED-lamp voor basisverlichting'
  },
  {
    id: 'led-individual-3',
    name: "Set van 3 LED's",
    type: 'individual',
    count: 3,
    priceIncl: 140,
    priceExcl: 115.7,
    description: "Set van 3 LED-lampen voor betere verlichting"
  },
  {
    id: 'led-individual-additional',
    name: 'Extra LED',
    type: 'individual',
    count: 1,
    priceIncl: 30,
    priceExcl: 24.79,
    description: 'Extra losse LED-lamp'
  },
  {
    id: 'led-mini',
    name: 'Mini LED',
    type: 'individual',
    count: 1,
    priceIncl: 10,
    priceExcl: 8.26,
    description: 'Kleine LED-lamp voor accentverlichting'
  },
  {
    id: 'led-gecko',
    name: 'Gecko LED',
    type: 'individual',
    count: 1,
    priceIncl: 80,
    priceExcl: 66.12,
    description: 'Premium Gecko LED met geavanceerde functies'
  },
  {
    id: 'led-strip-200',
    name: 'LED-strip',
    type: 'strip',
    size: '200cm',
    priceIncl: 150,
    priceExcl: 123.97,
    description: 'LED-stripverlichting voor 200cm sauna\'s'
  },
  {
    id: 'led-strip-220',
    name: 'LED-strip',
    type: 'strip',
    size: '220cm',
    priceIncl: 180,
    priceExcl: 148.76,
    description: 'LED-stripverlichting voor 220cm sauna\'s'
  },
  {
    id: 'led-strip-250',
    name: 'LED-strip',
    type: 'strip',
    size: '250cm',
    priceIncl: 200,
    priceExcl: 165.29,
    description: 'LED-stripverlichting voor 250cm sauna\'s'
  }
];

export const filtrationOptions: FiltrationOption[] = [
  {
    id: 'sf-connections',
    name: 'SF-verbindingen',
    type: 'connection',
    priceIncl: 40,
    priceExcl: 33.06,
    description: 'Standaard SF-verbindingen voor basisfiltratie',
    required: true
  },
  {
    id: 'stainless-sf-connections',
    name: 'RVS SF-verbindingen',
    type: 'connection',
    priceIncl: 90,
    priceExcl: 74.38,
    description: 'Premium RVS SF-verbindingen'
  },
  {
    id: 'sand-filter',
    name: 'Zandfilter',
    type: 'filter',
    priceIncl: 220,
    priceExcl: 181.82,
    description: 'Zandfilter voor superieure waterfiltratie'
  },
  {
    id: 'cotton-balls',
    name: 'Katoenbolletjes filter',
    type: 'filter',
    priceIncl: 180,
    priceExcl: 148.76,
    description: 'Alternatief voor zandfilter met katoenbolletjes'
  },
  {
    id: 'uv-lamp',
    name: 'UV-lamp',
    type: 'uv',
    priceIncl: 200,
    priceExcl: 165.29,
    description: 'UV-lamp voor waterdesinfectie'
  }
];

export const controlUnits: ControlUnit[] = [
  {
    id: 'traditional-buttons',
    name: 'Traditionele knoppen',
    type: 'traditional',
    priceIncl: 0,
    priceExcl: 0,
    description: 'Klassiek bedieningssysteem met knoppen'
  },
  {
    id: 'led-display',
    name: 'LED-display',
    type: 'led-display',
    wifi: false,
    priceIncl: 150,
    priceExcl: 123.97,
    description: 'LED-display met digitale uitlezing'
  },
  {
    id: 'led-display-wifi',
    name: 'LED-display met wifi',
    type: 'led-display',
    wifi: true,
    priceIncl: 250,
    priceExcl: 206.61,
    description: 'LED-display met wifi-connectiviteit'
  },
  {
    id: 'touchscreen',
    name: 'Touchscreen bediening',
    type: 'touchscreen',
    wifi: false,
    priceIncl: 400,
    priceExcl: 330.58,
    description: 'Modern touchscreen bedieningspaneel'
  },
  {
    id: 'touchscreen-wifi',
    name: 'Touchscreen met wifi',
    type: 'touchscreen',
    wifi: true,
    priceIncl: 500,
    priceExcl: 413.22,
    description: 'Touchscreen bediening met wifi-connectiviteit'
  }
];

export const lidOptions: LidOption[] = [
  {
    id: 'included-lid',
    name: 'Standaard deksel',
    type: 'included',
    priceIncl: 0,
    priceExcl: 0,
    description: 'Standaard deksel inbegrepen bij de sauna (materiaal volgt interne keuze)',
    inheritMaterial: true
  },
  {
    id: 'leather-lid-black',
    name: 'Leren deksel (zwart)',
    type: 'leather',
    material: 'leather',
    color: 'black',
    priceIncl: 300,
    priceExcl: 247.93,
    description: 'Premium leren deksel in zwart'
  },
  {
    id: 'leather-lid-brown',
    name: 'Leren deksel (bruin)',
    type: 'leather',
    material: 'leather',
    color: 'brown',
    priceIncl: 300,
    priceExcl: 247.93,
    description: 'Premium leren deksel in bruin'
  },
  {
    id: 'fiberglass-lid',
    name: 'Glasvezel deksel',
    type: 'fiberglass',
    material: 'fiberglass',
    priceIncl: 200,
    priceExcl: 165.29,
    description: 'Duurzaam glasvezel deksel'
  },
  {
    id: 'acrylic-lid',
    name: 'Acryl deksel',
    type: 'acrylic',
    material: 'acrylic',
    priceIncl: 250,
    priceExcl: 206.61,
    description: 'Transparant acryl deksel voor zicht'
  }
];

export const stairsOptions: StairsOption[] = [
  {
    id: 'standard-stairs',
    name: 'Standaard trap',
    type: 'standard',
    priceIncl: 0,
    priceExcl: 0,
    description: 'Basistrap inbegrepen bij de sauna'
  },
  {
    id: 'xl-stairs-spruce',
    name: 'XL trap (spar)',
    type: 'xl',
    material: 'spruce',
    coversSandFilter: true,
    priceIncl: 80,
    priceExcl: 66.12,
    description: 'Extra grote trap met zandfilterbehuizing in sparrenhout'
  },
  {
    id: 'xl-stairs-thermal',
    name: 'XL trap (thermisch hout)',
    type: 'xl',
    material: 'thermal',
    coversSandFilter: true,
    priceIncl: 100,
    priceExcl: 82.64,
    description: 'Extra grote trap met zandfilterbehuizing in thermisch hout'
  },
  {
    id: 'xl-stairs-wpc',
    name: 'XL trap (WPC)',
    type: 'xl',
    material: 'wpc',
    coversSandFilter: true,
    priceIncl: 120,
    priceExcl: 99.17,
    description: 'Extra grote trap met zandfilterbehuizing in WPC'
  },
  {
    id: '3-step-spruce',
    name: '3-traps trap (spar)',
    type: '3-step',
    material: 'spruce',
    priceIncl: 300,
    priceExcl: 247.93,
    description: 'Premium 3-traps trap in sparrenhout'
  },
  {
    id: '3-step-thermal',
    name: '3-traps trap (thermisch hout)',
    type: '3-step',
    material: 'thermal',
    priceIncl: 350,
    priceExcl: 289.26,
    description: 'Premium 3-traps trap in thermisch hout'
  },
  {
    id: '3-step-wpc',
    name: '3-traps trap (WPC)',
    type: '3-step',
    material: 'wpc',
    priceIncl: 400,
    priceExcl: 330.58,
    description: 'Premium 3-traps trap in WPC'
  }
];

export const extraOptions: ExtraOption[] = [
  {
    id: 'digital-thermometer',
    name: 'Digitale thermometer',
    category: 'convenience',
    priceIncl: 25,
    priceExcl: 20.66,
    description: 'Digitale thermometer voor nauwkeurige temperatuurmeting'
  },
  {
    id: 'head-pillow',
    name: 'Hoofdkussen',
    category: 'comfort',
    priceIncl: 15,
    priceExcl: 12.4,
    description: 'Comfortabel hoofdkussen voor ontspanning'
  },
  {
    id: 'steel-bands-silver',
    name: 'RVS banden (zilver)',
    category: 'safety',
    priceIncl: 50,
    priceExcl: 41.32,
    description: 'RVS banden voor structurele versteviging'
  },
  {
    id: 'steel-bands-black',
    name: 'RVS banden (zwart)',
    category: 'safety',
    priceIncl: 50,
    priceExcl: 41.32,
    description: 'Zwarte RVS banden voor structurele versteviging'
  },
  {
    id: 'external-heater-elbows',
    name: 'Kachelbochten set extern',
    category: 'maintenance',
    priceIncl: 20,
    priceExcl: 16.53,
    description: 'Extra pijpverbindingen voor externe kachel'
  },
  {
    id: 'bottom-cover',
    name: 'Bodemcover',
    category: 'maintenance',
    priceIncl: 100,
    priceExcl: 82.64,
    description: 'Beschermende bodemplaat voor de sauna'
  },
  {
    id: 'water-outlet-valve',
    name: 'Wateraftapkraan',
    category: 'convenience',
    priceIncl: 60,
    priceExcl: 49.59,
    description: 'Handige aftapkraan voor eenvoudig legen'
  },
  {
    id: 'revision-door-white',
    name: 'Revisiedeur (wit)',
    category: 'maintenance',
    priceIncl: 0,
    priceExcl: 0,
    description: 'Witte revisiedeur voor onderhoudstoegang'
  },
  {
    id: 'revision-door-grey',
    name: 'Revisiedeur (grijs)',
    category: 'maintenance',
    priceIncl: 10,
    priceExcl: 8.26,
    description: 'Grijze revisiedeur voor onderhoudstoegang'
  },
  {
    id: 'cupholder-standard',
    name: 'Standaard bekerhouder',
    category: 'convenience',
    priceIncl: 0,
    priceExcl: 0,
    description: 'Standaard bekerhouder inbegrepen'
  },
  {
    id: 'cupholder-extra',
    name: 'Extra bekerhouder (3-5 gaten)',
    category: 'convenience',
    priceIncl: 30,
    priceExcl: 24.79,
    description: 'Extra bekerhouder met 3-5 gaten'
  },
  {
    id: 'snack-deck',
    name: 'Snackplank',
    category: 'convenience',
    priceIncl: 20,
    priceExcl: 16.53,
    description: 'Klein plateau voor snacks en drankjes'
  }
];

export const allOptions = {
  spaSystems,
  ledOptions,
  filtrationOptions,
  controlUnits,
  lidOptions,
  stairsOptions,
  extraOptions
};
