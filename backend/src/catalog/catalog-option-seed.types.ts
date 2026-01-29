import type { OptionColorVariant } from '../catalog/entities/option.entity';
import type { ProductType } from '../catalog/entities/base-product.entity';

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
  FILTRATION_BASE = 'FILTRATION_BASE',
  FILTRATION_ADDONS = 'FILTRATION_ADDONS',
  FILTRATION_BOX = 'FILTRATION_BOX',
  COVER_BASE = 'COVER_BASE',
  CONTROLUNIT_BASE = 'CONTROLUNIT_BASE',
  LID_BASE = 'LID_BASE',
  STAIRS_BASE = 'STAIRS_BASE',
}

export enum OptionTag {
  COOLER = 'COOLER',
  WOOD = 'WOOD',
  HEATING_EXTRA = 'HEATING-EXTRA',
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID',
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
  INSULATION = 'INSULATION',
  SPA = 'SPA',
  CIRCULATION = 'CIRCULATION',
  HYDRO_MASSAGE = 'HYDRO-MASSAGE',
  AIR_BUBBLE = 'AIR-BUBBLE',
  LED = 'LED',
  INDIVIDUAL = 'INDIVIDUAL',
  LED_STRIP = 'LED_STRIP',
  LED_BAND = 'LED_BAND',
  FILTRATION = 'FILTRATION',
  CONNECTION = 'CONNECTION',
  FILTER = 'FILTER',
  FILTER_BOX = 'FILTER_BOX',
  UV = 'UV',
  COVER = 'COVER',
  THERMAL_COVER = 'THERMAL-COVER',
  FIBERGLASS_COVER = 'FIBERGLASS-COVER',
  CONTROL = 'CONTROL',
  TRADITIONAL = 'TRADITIONAL',
  LED_DISPLAY = 'LED-DISPLAY',
  TOUCHSCREEN = 'TOUCHSCREEN',
  LID = 'LID',
  INCLUDED = 'INCLUDED',
  LEATHER = 'LEATHER',
  FIBERGLASS = 'FIBERGLASS',
  ACRYLIC = 'ACRYLIC',
  COVERS_SAND_FILTER = 'COVERS-SAND-FILTER',
  CONVENIENCE = 'CONVENIENCE',
  COMFORT = 'COMFORT',
  SAFETY = 'SAFETY',
  MAINTENANCE = 'MAINTENANCE',
}

export enum HeatingType {
  WOOD = 'WOOD',
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID',
}

export enum HeaterInstallationType {
  INTEGRATED = 'INTEGRATED',
  EXTERNAL = 'EXTERNAL',
}

export enum CoolerType {
  CHILLER = 'CHILLER',
}

export enum HeatingCategory {
  HOUTKACHEL = 'HOUTKACHEL',
  VOLLEDIG_ELEKTRISCH = 'VOLLEDIG_ELEKTRISCH',
  HYBRIDE = 'HYBRIDE',
}

export enum HeatingSize {
  KLEIN = 'Klein',
  GROOT = 'Groot',
}

export enum OptionSource {
  HEATING = 'HEATING',
}

export enum SpaSystemType {
  CIRCULATION = 'CIRCULATION',
  HYDRO_MASSAGE = 'HYDRO-MASSAGE',
  AIR_BUBBLE = 'AIR-BUBBLE',
}

export enum LedType {
  INDIVIDUAL = 'INDIVIDUAL',
  STRIP = 'STRIP',
  BAND = 'STRIP',
}

export enum FiltrationType {
  CONNECTION = 'CONNECTION',
  FILTER = 'FILTER',
  UV = 'UV',
  NONE = 'NONE'
}

export enum FiltrationRole {
  MAIN = 'MAIN',
  ADDON = 'ADDON',
}

export enum CoverType {
  THERMAL = 'THERMAL',
  FIBERGLASS = 'FIBERGLASS',
}

export enum CoverShape {
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
  INCLUDED = 'INCLUDED',
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

export enum ExtraCategory {
  CONVENIENCE = 'CONVENIENCE',
  COMFORT = 'COMFORT',
  SAFETY = 'SAFETY',
  MAINTENANCE = 'MAINTENANCE',
}

export const ColorEnum = {
  SPRUCE_NATURAL: { id: 'SPRUCE-NATURAL', name: 'Naturel' },
  SPRUCE_LIGHT: { id: 'SPRUCE-LIGHT', name: 'Licht' },
  SPRUCE_MEDIUM: { id: 'SPRUCE-MEDIUM', name: 'Midden' },
  SPRUCE_DARK: { id: 'SPRUCE-DARK', name: 'Donker' },
  CEDAR_NATURAL: { id: 'CEDAR-NATURAL', name: 'Naturel' },
  CEDAR_LIGHT: { id: 'CEDAR-LIGHT', name: 'Licht' },
  CEDAR_MEDIUM: { id: 'CEDAR-MEDIUM', name: 'Midden' },
  CEDAR_DARK: { id: 'CEDAR-DARK', name: 'Donker' },
  HEMLOCK_NATURAL: { id: 'HEMLOCK-NATURAL', name: 'Naturel' },
  HEMLOCK_LIGHT: { id: 'HEMLOCK-LIGHT', name: 'Licht' },
  HEMLOCK_MEDIUM: { id: 'HEMLOCK-MEDIUM', name: 'Midden' },
  HEMLOCK_DARK: { id: 'HEMLOCK-DARK', name: 'Donker' },
  SPRUCE_EXT_NATURAL: { id: 'SPRUCE-EXT-NATURAL', name: 'Naturel' },
  SPRUCE_EXT_WHITE: { id: 'SPRUCE-EXT-WHITE', name: 'Wit' },
  SPRUCE_EXT_GREY: { id: 'SPRUCE-EXT-GREY', name: 'Grijs' },
  SPRUCE_EXT_BROWN: { id: 'SPRUCE-EXT-BROWN', name: 'Bruin' },
  SPRUCE_EXT_BLACK: { id: 'SPRUCE-EXT-BLACK', name: 'Zwart' },
  THERMAL_NATURAL: { id: 'THERMAL-NATURAL', name: 'Naturel' },
  THERMAL_DARK: { id: 'THERMAL-DARK', name: 'Donker' },
  THERMAL_CHARCOAL: { id: 'THERMAL-CHARCOAL', name: 'Antraciet' },
  WPC_BROWN: { id: 'WPC-BROWN', name: 'Bruin' },
  WPC_GREY: { id: 'WPC-GREY', name: 'Grijs' },
  WPC_BLACK: { id: 'WPC-BLACK', name: 'Zwart' },
} as const;

export type ColorEnumKey = keyof typeof ColorEnum;

type CatalogOptionBase = {
  key: string;
  groupKey: OptionGroupKey;
  name: string;
  description: string;
  priceExcl: number;
  priceIncl?: number;
  vatRatePercent: number;
  images: string[];
  tags: OptionTag[];
  appliesTo?: AppliesTo;
  quantityRule?: QuantityRule;
  subKey?: string | null;
  isActive: boolean;
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

export type HeatingAttributes = {
  type: HeatingType;
  category: HeatingCategory;
  heatingTime: string | null;
  power: string | null;
  voltage: string | null;
  placement: HeaterInstallationType | null;
  size: HeatingSize | null;
  pros: string[];
  cons: string[];
  extraOptionKeys: string[];
  doorType?: 'METAL' | 'GLASS';
  kW?: number | null;
};

export type HeaterInstallationAttributes = {
  type: HeaterInstallationType;
};

export type CoolerAttributes = {
  type: CoolerType;
  power?: string | null;
  coolingCapacity?: string | null;
};

export type MaterialFamily =
  | 'FIBERGLASS'
  | 'ACRYLIC'
  | 'WOOD'
  | 'WPC'
  | 'WPC_HKC';

export type MaterialFinish =
  | 'STANDARD'
  | 'PEARL'
  | 'GRANITE'
  | 'MARBLE';

export type MaterialProfile = 'STANDARD' | 'W_PROFILE';

export type MaterialAttributes = {
  family: MaterialFamily;
  finish?: MaterialFinish | null;   // internal
  profile?: MaterialProfile | null; // external wood
  notes?: string[];                 // optional, for UI text
};
export type InsulationAttributes = {
  pros: string[];
  cons: string[];
};

export type SpaSystemAttributes = {
  type: SpaSystemType;
  power: string | null;
  nozzles: number | null;
  included: boolean;
};

export type LedAttributes = {
  type: LedType;
  count: number | null;
  size: string | null;
};

export type FiltrationAttributes = {
  type: FiltrationType;
  role: FiltrationRole;
  required: boolean;
};

export type CoverAttributes = {
  type: CoverType;
  shape: CoverShape;
  sizeCm?: number | null;
};

export type ControlUnitAttributes = {
  type: ControlUnitType;
  wifi: boolean | null;
};

export type LidAttributes = {
  type: LidType;
  material: LidMaterial | null;
  color: LidColor | null;
  inheritMaterial: boolean;
};

export type StairsAttributes = {
  type: StairsType;
  material: StairsMaterial | null;
  coversSandFilter: boolean;
};

export type ExtraAttributes = {
  category: ExtraCategory;
  required: boolean;
};

export type SourceAttributes = {
  source: OptionSource;
};

export type FilterBoxAttributes = {
  inheritsExternalColor: boolean;
};

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
      groupKey: OptionGroupKey.MATERIALS_INTERNAL_BASE;
      attributes: MaterialAttributes;
    })
  | (CatalogOptionBase & {
      groupKey: OptionGroupKey.MATERIALS_EXTERNAL_BASE;
      attributes: MaterialAttributes;
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
      groupKey: OptionGroupKey.FILTRATION_BASE;
      attributes: FiltrationAttributes;
    })
  | (CatalogOptionBase & {
    groupKey: OptionGroupKey.FILTRATION_ADDONS;
    attributes: FiltrationAttributes;
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
      groupKey: OptionGroupKey.HEATER_ADDONS_INTERNAL;
      attributes: ExtraAttributes | SourceAttributes;
    })
  | (CatalogOptionBase & {
      groupKey: OptionGroupKey.HEATER_ADDONS_EXTERNAL;
      attributes: ExtraAttributes | SourceAttributes;
    })
  | (CatalogOptionBase & {
      groupKey: OptionGroupKey.EXTRAS_BASE;
      attributes: ExtraAttributes | SourceAttributes;
    })
  | (CatalogOptionBase & {
      groupKey: OptionGroupKey.FILTRATION_BOX;
      attributes: FilterBoxAttributes;
    });
