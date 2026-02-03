export enum OptionGroupKey {
  HEATER_INSTALLATION = 'HEATER_INSTALLATION',

  COOLER_BASE = 'COOLER_BASE',
  COOLER_ADD_ON = 'COOLER_ADD_ON',

  HEATING_BASE = 'HEATING_BASE',
  HEATER_ADDONS_INTERNAL = 'HEATER_ADDONS_INTERNAL',
  HEATER_ADDONS_EXTERNAL = 'HEATER_ADDONS_EXTERNAL',

  EXTRAS_BASE = 'EXTRAS_BASE',
  MATERIALS_INTERNAL_BASE = 'MATERIALS_INTERNAL_BASE',
  MATERIALS_EXTERNAL_BASE = 'MATERIALS_EXTERNAL_BASE',
  INSULATION_BASE = 'INSULATION_BASE',
  SPASYSTEM_BASE = 'SPASYSTEM_BASE',
  LEDS_BASE = 'LEDS_BASE',
  FILTRATION_CONNECTOR_BASE = 'FILTRATION_CONNECTOR_BASE',
  FILTRATION_FILTER_BASE = 'FILTRATION_FILTER_BASE',
  FILTRATION_ADDONS = 'FILTRATION_ADDONS',
  FILTRATION_BOX = 'FILTRATION_BOX',
  COVER_BASE = 'COVER_BASE',
  CONTROLUNIT_BASE = 'CONTROLUNIT_BASE',
  LID_BASE = 'LID_BASE',
  STAIRS_BASE = 'STAIRS_BASE',
  STAIRS_COVER_FILTER = 'STAIRS_COVER_FILTER',
}

export enum HeatingType {
  WOOD = 'WOOD',
  ELECTRIC = 'ELECTRIC',
}

/**
 * This is what the customer chooses in the "Heater Installation" step.
 * It decides whether they pick:
 * - INTERNAL: one internal heater (wood OR electric)
 * - EXTERNAL: one external wood stove
 * - HYBRID: external wood + internal electric (two pickers in Heating step)
 */
export enum HeatingMode {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
  HYBRID = 'HYBRID',
}

/**
 * This is NOT the mode. It's where a specific heater SKU sits / is compatible.
 * (Electric heaters can be BOTH, if you want to allow them for INTERNAL and HYBRID.)
 */
export enum HeaterLocation {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
  BOTH = 'BOTH',
}

export enum LEDInstallationType {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
}

export enum ProductType {
  HOTTUB = 'HOTTUB',
  SAUNA = 'SAUNA',
  COLD_PLUNGE = 'COLD_PLUNGE',
}

export enum SpaSystemType {
  CIRCULATION = 'CIRCULATION',
  HYDRO_MASSAGE = 'HYDRO-MASSAGE',
  AIR_BUBBLE = 'AIR-BUBBLE',
}

export enum LedType {
  INDIVIDUAL = 'INDIVIDUAL',
  INSTALLATION = 'INSTALLATION',
  BAND = 'BAND',
}

export enum FiltrationType {
  CONNECTION = 'CONNECTION',
  FILTER = 'FILTER',
  UV = 'UV',
  NONE = 'NONE',
}

export enum CoverType {
  THERMAL = 'THERMAL',
  FIBERGLASS = 'FIBERGLASS',
}

export enum BaseShape {
  ROUND = 'ROUND',
  SQUARE = 'SQUARE',
  OFURO = 'OFURO',
  PLUNGE = 'PLUNGE',
}

export enum ControlUnitType {
  TRADITIONAL = 'TRADITIONAL',
  LED_DISPLAY = 'LED-DISPLAY',
  TOUCHSCREEN = 'TOUCHSCREEN',
}

export enum LidType {
  STANDARD = 'STANDARD',
  LEATHER = 'LEATHER',
  FIBERGLASS = 'FIBERGLASS',
  ACRYLIC = 'ACRYLIC',
}

export enum LidMaterial {
  LEATHER = 'leather',
  FIBERGLASS = 'fiberglass',
  ACRYLIC = 'acrylic',
}

export enum LidColor {
  BLACK = 'black',
  BROWN = 'brown',
}

export enum StairsType {
  STANDARD = 'STANDARD',
  XL = 'XL',
  _3_STEP = '3-STEP',
}

export enum StairsMaterial {
  SPRUCE = 'spruce',
  THERMAL = 'thermal',
  WPC = 'wpc',
}

type CatalogOptionBase = {
  key: string;
  groupKey: OptionGroupKey;
  name: string;
  description: string;
  included?: boolean;
  priceExcl: number;
  priceIncl?: number;
  vatRatePercent: number;
  images: string[];
  appliesTo?: AppliesTo;
  quantityRule?: QuantityRule;
  subKey?: string | null;
};

export type AppliesTo = {
  productModelKeys?: string[];
  productTypes?: ProductType[];
};

export type QuantityRule = {
  min: number;
  max: number;
  step?: number;
};

// -------------------------
// HEATING types
// -------------------------

export type HeatingAttributes = {
  type: HeatingType;                 // WOOD | ELECTRIC
  location: HeaterLocation;          // INTERNAL | EXTERNAL | BOTH
  heatingTime: string | null;
  power: string | null;
  voltage: string | null;
  pros: string[];
  cons: string[];
  doorType?: 'METAL' | 'GLASS';
  kW?: number | null;

  /**
   * Optional: if a specific heater only applies to certain product types/models.
   * (You can also use appliesTo at option level. This is just here if you prefer attributes.)
   */
};

export type HeaterInstallationAttributes = {
  mode: HeatingMode;                 // INTERNAL | EXTERNAL | HYBRID
};

export type HeatingAddonAttributes = {
  /**
   * Which heating modes allow this add-on to be selected.
   * Example: black plate is valid for INTERNAL and HYBRID.
   * Example: chimney is valid for EXTERNAL and HYBRID.
   */
  modes: HeatingMode[];
  heatingType: HeatingType;
};

// -------------------------
// other attributes (unchanged)
// -------------------------
export type CoolerAttributes = {
  power?: string | null;
  coolingCapacity?: string | null;
};

export type MaterialFamily = 'FIBERGLASS' | 'ACRYLIC' | 'WOOD' | 'WPC' | 'WPC_HKC';

export type MaterialFinish = 'STANDARD' | 'PEARL' | 'GRANITE' | 'MARBLE';

export type WoodMaterial = 'SPRUCE' | 'THERMO';

export type FilterBoxMaterial = 'SPRUCE' | 'THERMO' | 'WPC';

export type MaterialProfile = 'STANDARD' | 'W_PROFILE';

export type PremiumLevel = 'STANDARD' | 'NONE' | 'PREMIUM';

export type MaterialAttributes = {
  material: MaterialFamily;
  variant?: string;
  finish?: MaterialFinish | null;
  profile?: MaterialProfile | null;
  notes?: string[];
  woodType?: WoodMaterial | null;
  constraints?: string[] | null;
};

export type InsulationAttributes = {
  level: PremiumLevel;
  pros: string[];
  cons: string[];
};

export type SpaSystemAttributes = {
  type: SpaSystemType;
  powerKw: number | null;
  nozzles: number | null;
  minimumRequire?: boolean;
};

export type LedAttributes = {
  type: LedType;
  installationType: LEDInstallationType;
};

export type FiltrationAttributes = {
  requiresFilter?: boolean;
  constraints?: string[];
  warnings?: string[];
  material?: FilterBoxMaterial;
};

export type CoverAttributes = {
  type: CoverType;
  shape: BaseShape;
  sizeCm?: number | null;
};

export type ControlUnitAttributes = {
  type: ControlUnitType;
  capabilities?: string[];
  pros?: string[];
  cons?: string[];
  included?: boolean;
};

export type LidAttributes = {
  type?: LidType;
  included?: boolean;
  material?: LidMaterial | null;
  color?: LidColor | null;
  pros?: string[];
  cons?: string[];
};

export type StairsAttributes = {
  type: StairsType;
  material?: StairsMaterial | null;
  included?: boolean;
  coversSandFilter: boolean;
  pros?: string[];
  cons?: string[];
};

export type StairsExtra = {
  removesFilterBox?: boolean | null;
};

export type ExtraAttributes = {
  required: boolean;
};

export type FilterBoxAttributes = {
  inheritsExternalColor: boolean;
};

// -------------------------
// Union
// -------------------------
export type CatalogOptionSeed =
  | (CatalogOptionBase & {
      groupKey: OptionGroupKey.COOLER_BASE;
      attributes: CoolerAttributes;
    })
  | (CatalogOptionBase & {
      groupKey: OptionGroupKey.COOLER_ADD_ON;
      attributes: ExtraAttributes;
    })
  | (CatalogOptionBase & {
      groupKey: OptionGroupKey.HEATER_INSTALLATION;
      attributes: HeaterInstallationAttributes;
    })
  | (CatalogOptionBase & {
      groupKey: OptionGroupKey.HEATING_BASE;
      attributes: HeatingAttributes;
    })
  | (CatalogOptionBase & {
      groupKey: OptionGroupKey.HEATER_ADDONS_INTERNAL;
      attributes: HeatingAddonAttributes;
    })
  | (CatalogOptionBase & {
      groupKey: OptionGroupKey.HEATER_ADDONS_EXTERNAL;
      attributes: HeatingAddonAttributes;
    })
  | (CatalogOptionBase & {
      groupKey: OptionGroupKey.MATERIALS_INTERNAL_BASE;
      attributes: MaterialAttributes | null;
    })
  | (CatalogOptionBase & {
      groupKey: OptionGroupKey.MATERIALS_EXTERNAL_BASE;
      attributes: MaterialAttributes | null;
    })
  | (CatalogOptionBase & {
      groupKey: OptionGroupKey.INSULATION_BASE;
      attributes: InsulationAttributes;
    })
  | (CatalogOptionBase & {
      groupKey: OptionGroupKey.SPASYSTEM_BASE;
      attributes: SpaSystemAttributes;
    })
  | (CatalogOptionBase & {
      groupKey: OptionGroupKey.LEDS_BASE;
      attributes: LedAttributes;
    })
  | (CatalogOptionBase & {
      groupKey: OptionGroupKey.FILTRATION_FILTER_BASE;
      attributes: FiltrationAttributes | null;
    })
  | (CatalogOptionBase & {
      groupKey: OptionGroupKey.FILTRATION_CONNECTOR_BASE;
      attributes: FiltrationAttributes | null;
    })
  | (CatalogOptionBase & {
      groupKey: OptionGroupKey.FILTRATION_ADDONS;
      attributes: FiltrationAttributes | null;
    })
  | (CatalogOptionBase & {
      groupKey: OptionGroupKey.FILTRATION_BOX;
      attributes: FiltrationAttributes | null;
    })
  | (CatalogOptionBase & {
      groupKey: OptionGroupKey.COVER_BASE;
      attributes: CoverAttributes;
    })
  | (CatalogOptionBase & {
      groupKey: OptionGroupKey.CONTROLUNIT_BASE;
      attributes: ControlUnitAttributes;
    })
  | (CatalogOptionBase & {
      groupKey: OptionGroupKey.LID_BASE;
      attributes: LidAttributes;
    })
  | (CatalogOptionBase & {
      groupKey: OptionGroupKey.STAIRS_BASE;
      attributes: StairsAttributes;
    })
  | (CatalogOptionBase & {
      groupKey: OptionGroupKey.STAIRS_COVER_FILTER;
      attributes: StairsExtra | null;
    })
  | (CatalogOptionBase & {
      groupKey: OptionGroupKey.EXTRAS_BASE;
    });
