import { BaseShape, ProductType } from "src/catalog/catalog.types";
import { toPriceExcl } from "src/utils/price-util";

export type ProductModel = {
  key: string; // canonical key used everywhere

  slug: string; // for URLs only
  name: string;
  description: string;

  productType: ProductType;
  shape: BaseShape;

  // UI labels (kept as-is for display)
  sizeLabel: string;
  internalSizeLabel: string;
  externalSizeLabel: string;
  personsLabel: string;

  // Pricing: priceIncl is truth, priceExcl derived
  vatRatePercent: number;
  priceIncl: number;
  priceExcl: number;

  image: string;
  details: string[];
  features: string[];

  delivery: string;
  inStock: boolean;
  rating?: number;
  reviewCount?: number;

  attributes?: {
    // numeric dimensions for logic (optional but useful)
    diameterCm?: number;
    widthCm?: number;
    lengthCm?: number;
    heightCm?: number;

    // keep for now
    allowsIntegratedHeater?: boolean;
    allowsExternalHeater?: boolean;
  };
};

const VAT = 21;

export const productModelsSeed: ProductModel[] = [
  {
    slug: 'cold-plunge',
    key: 'COLD_PLUNGE_120',
    name: 'Cold Water Plunge',
    description: 'Compacte cold plunge voor dagelijks herstel en wellness.',
    productType: ProductType.COLD_PLUNGE,
    shape: BaseShape.PLUNGE,

    sizeLabel: '120cm',
    internalSizeLabel: '100cm',
    externalSizeLabel: '120cm',
    personsLabel: '1-2',

    vatRatePercent: VAT,
    priceIncl: 1295,
    priceExcl: toPriceExcl(1295, VAT),

    image: '/placeholders/product-8.png',
    details: [],
    features: ['Snel herstel na training', 'Compact formaat', 'Temperatuurregeling 4-12°C'],

    delivery: '2-4 weken',
    inStock: true,
    rating: 4.6,
    reviewCount: 12,

    attributes: {
      diameterCm: 120,
      allowsIntegratedHeater: false,
      allowsExternalHeater: false,
    },
  },

  {
    slug: 'sauna-4p',
    key: 'SAUNA_4P',
    name: 'Sauna 4-persoons',
    description: 'Moderne buitensauna met glasfront, geschikt voor 2-4 personen.',
    productType: ProductType.SAUNA,
    shape: BaseShape.SQUARE, // your enum has no RECTANGLE; treat as SQUARE for now

    sizeLabel: '220x200cm',
    internalSizeLabel: '200x180cm',
    externalSizeLabel: '220x200cm',
    personsLabel: '2-4',

    vatRatePercent: VAT,
    priceIncl: 3146,
    priceExcl: toPriceExcl(3146, VAT),

    image: '/placeholders/product-7.png',
    details: ['/placeholders/product-details-1.png', '/placeholders/product-details-2.png'],
    features: [
      'Thermische isolatie voor snelle opwarming',
      'Volledig glazen voorzijde',
      'Geschikt voor hout, elektrisch of hybride',
      'Inclusief ergonomische banken',
      'Afmeting: 220x200cm',
    ],

    delivery: '3-5 weken',
    inStock: true,
    rating: 4.4,
    reviewCount: 6,

    attributes: {
      widthCm: 220,
      lengthCm: 200,
      // leave heater flags for sauna logic later; don’t guess here
    },
  },

  {
    slug: 'ofuro',
    key: 'HOTTUB_OFURO_120_190',
    name: 'Ofuro',
    description: 'Traditionele Japanse zitkuip, pure wellness.',
    productType: ProductType.HOTTUB,
    shape: BaseShape.OFURO,

    sizeLabel: '120x190cm',
    internalSizeLabel: '100x170cm',
    externalSizeLabel: '120x190cm',
    personsLabel: '1-2',

    vatRatePercent: VAT,
    priceIncl: 2695,
    priceExcl: toPriceExcl(2695, VAT),

    image: '/placeholders/product-6.png',
    details: [
      '/placeholders/product-details-1.png',
      '/placeholders/product-details-2.png',
      '/placeholders/product-details-3.png',
    ],
    features: [
      'Gemaakt van duurzaam hout',
      'Verwarmingssysteem: houtgestookt',
      'Capaciteit: 1-2 personen',
      'Afmeting: 120x190cm',
      'Hoogte: 100 cm',
      'Inclusief isolerend deksel',
      'Eenvoudige installatie',
    ],

    delivery: '2-4 weken',
    inStock: true,
    rating: 4.1,
    reviewCount: 7,

    attributes: {
      widthCm: 120,
      lengthCm: 190,
      heightCm: 100,
      // per your note: all hottubs true/true
      allowsIntegratedHeater: true,
      allowsExternalHeater: true,
    },
  },

  {
    slug: 'ofuro-icetub',
    key: 'COLD_PLUNGE_OFURO_120_190',
    name: 'Ofuro icetub',
    description: 'Ofuro icetub voor koudetherapie in compact formaat.',
    productType: ProductType.COLD_PLUNGE,
    shape: BaseShape.PLUNGE,

    sizeLabel: '120x190cm',
    internalSizeLabel: '100x170cm',
    externalSizeLabel: '120x190cm',
    personsLabel: '1-2',

    vatRatePercent: VAT,
    priceIncl: 2195,
    priceExcl: toPriceExcl(2195, VAT),

    image: '/placeholders/product-6.png',
    details: ['/placeholders/product-details-1.png', '/placeholders/product-details-2.png'],
    features: ['Ideaal voor koudetherapie', 'Compacte footprint', 'Duurzame houtafwerking'],

    delivery: '2-4 weken',
    inStock: true,
    rating: 4.0,
    reviewCount: 4,

    attributes: {
      widthCm: 120,
      lengthCm: 190,
      allowsIntegratedHeater: false,
      allowsExternalHeater: false,
    },
  },

  {
    slug: 'hottub-rond-200',
    key: 'HOTTUB_ROUND_200',
    name: 'Rond 200',
    description: 'Compacte ronde hottub, ideaal voor kleine tuinen.',
    productType: ProductType.HOTTUB,
    shape: BaseShape.ROUND,

    sizeLabel: '200cm',
    internalSizeLabel: '180cm',
    externalSizeLabel: '200cm',
    personsLabel: '2-4',

    vatRatePercent: VAT,
    priceIncl: 2995,
    priceExcl: toPriceExcl(2995, VAT),

    image: '/placeholders/product-1.png',
    details: [
      '/placeholders/product-details-1.png',
      '/placeholders/product-details-2.png',
      '/placeholders/product-details-3.png',
    ],
    features: [
      'Gemaakt van duurzaam hout',
      'Capaciteit: 2-4 personen',
      'Diameter: 200cm ø',
      'Hoogte: 100 cm',
      'Inclusief isolerend deksel',
      'Eenvoudige installatie',
    ],

    delivery: '2-4 weken',
    inStock: true,
    rating: 4.7,
    reviewCount: 18,

    attributes: {
      diameterCm: 200,
      heightCm: 100,
      allowsIntegratedHeater: true,
      allowsExternalHeater: true,
    },
  },

  {
    slug: 'hottub-rond-225',
    key: 'HOTTUB_ROUND_225',
    name: 'Rond 225',
    description: 'Extra ruime ronde hottub voor het hele gezin.',
    productType: ProductType.HOTTUB,
    shape: BaseShape.ROUND,

    sizeLabel: '225cm',
    internalSizeLabel: '200cm',
    externalSizeLabel: '225cm',
    personsLabel: '4-6',

    vatRatePercent: VAT,
    priceIncl: 3295,
    priceExcl: toPriceExcl(3295, VAT),

    image: '/placeholders/product-2.png',
    details: [
      '/placeholders/product-details-1.png',
      '/placeholders/product-details-2.png',
      '/placeholders/product-details-3.png',
    ],
    features: [
      'Gemaakt van duurzaam hout',
      'Capaciteit: 4-6 personen',
      'Diameter: 225cm ø',
      'Hoogte: 100 cm',
      'Inclusief isolerend deksel',
      'Eenvoudige installatie',
    ],

    delivery: '2-4 weken',
    inStock: true,
    rating: 4.2,
    reviewCount: 9,

    attributes: {
      diameterCm: 225,
      heightCm: 100,
      allowsIntegratedHeater: true,
      allowsExternalHeater: true,
    },
  },

  {
    slug: 'hottub-vierkant-200',
    key: 'HOTTUB_SQUARE_200',
    name: 'Vierkant 200',
    description: 'Compacte vierkante hottub, snel op temperatuur.',
    productType: ProductType.HOTTUB,
    shape: BaseShape.SQUARE,

    sizeLabel: '200x200cm',
    internalSizeLabel: '180x180cm',
    externalSizeLabel: '200x200cm',
    personsLabel: '2-4',

    vatRatePercent: VAT,
    priceIncl: 3895,
    priceExcl: toPriceExcl(3895, VAT),

    image: '/placeholders/product-3.png',
    details: [
      '/placeholders/product-details-1.png',
      '/placeholders/product-details-2.png',
      '/placeholders/product-details-3.png',
    ],
    features: [
      'Gemaakt van duurzaam hout',
      'Capaciteit: 2-4 personen',
      'Afmeting: 200x200cm',
      'Hoogte: 100 cm',
      'Inclusief isolerend deksel',
      'Eenvoudige installatie',
    ],

    delivery: '2-4 weken',
    inStock: true,
    rating: 4.9,
    reviewCount: 27,

    attributes: {
      widthCm: 200,
      lengthCm: 200,
      heightCm: 100,
      allowsIntegratedHeater: true,
      allowsExternalHeater: true,
    },
  },

  {
    slug: 'hottub-vierkant-220',
    key: 'HOTTUB_SQUARE_220',
    name: 'Vierkant 220',
    description: 'Ruime vierkante hottub voor 4-6 personen.',
    productType: ProductType.HOTTUB,
    shape: BaseShape.SQUARE,

    sizeLabel: '220x220cm',
    internalSizeLabel: '200x200cm',
    externalSizeLabel: '220x220cm',
    personsLabel: '4-6',

    vatRatePercent: VAT,
    priceIncl: 4595,
    priceExcl: toPriceExcl(4595, VAT),

    image: '/placeholders/product-4.png',
    details: [
      '/placeholders/product-details-1.png',
      '/placeholders/product-details-2.png',
      '/placeholders/product-details-3.png',
    ],
    features: [
      'Gemaakt van duurzaam hout',
      'Capaciteit: 4-6 personen',
      'Afmeting: 220x220cm',
      'Hoogte: 100 cm',
      'Inclusief isolerend deksel',
      'Eenvoudige installatie',
    ],

    delivery: '2-4 weken',
    inStock: true,
    rating: 3.9,
    reviewCount: 4,

    attributes: {
      widthCm: 220,
      lengthCm: 220,
      heightCm: 100,
      allowsIntegratedHeater: true,
      allowsExternalHeater: true,
    },
  },

  {
    slug: 'hottub-vierkant-245',
    key: 'HOTTUB_SQUARE_245',
    name: 'Vierkant 245',
    description: 'Grote vierkante hottub, ideaal voor groepen.',
    productType: ProductType.HOTTUB,
    shape: BaseShape.SQUARE,

    sizeLabel: '245x245cm',
    internalSizeLabel: '225x225cm',
    externalSizeLabel: '245x245cm',
    personsLabel: '6-8',

    vatRatePercent: VAT,
    priceIncl: 5695,
    priceExcl: toPriceExcl(5695, VAT),

    image: '/placeholders/product-5.png',
    details: [
      '/placeholders/product-details-1.png',
      '/placeholders/product-details-2.png',
      '/placeholders/product-details-3.png',
    ],
    features: [
      'Gemaakt van duurzaam hout',
      'Capaciteit: 6-8 personen',
      'Afmeting: 245x245cm',
      'Hoogte: 100 cm',
      'Inclusief isolerend deksel',
      'Eenvoudige installatie',
    ],

    delivery: '2-4 weken',
    inStock: true,
    rating: 4.5,
    reviewCount: 31,

    attributes: {
      widthCm: 245,
      lengthCm: 245,
      heightCm: 100,
      allowsIntegratedHeater: true,
      allowsExternalHeater: true, // fixed per your note
    },
  },
];
