import type { OptionColorVariant } from '../../../catalog/entities/option.entity';

export enum OptionGroupKey {
  HEATING_BASE = 'HEATING_BASE',
  EXTRAS_BASE = 'EXTRAS_BASE',
  MATERIALS_INTERNAL_BASE = 'MATERIALS-INTERNAL_BASE',
  MATERIALS_EXTERNAL_BASE = 'MATERIALS-EXTERNAL_BASE',
  INSULATION_BASE = 'INSULATION_BASE',
  SPASYSTEM_BASE = 'SPASYSTEM_BASE',
  LEDS_BASE = 'LEDS_BASE',
  FILTRATION_BASE = 'FILTRATION_BASE',
  CONTROLUNIT_BASE = 'CONTROLUNIT_BASE',
  LID_BASE = 'LID_BASE',
  STAIRS_BASE = 'STAIRS_BASE',
  SANDFILTER_BASE = 'SANDFILTER_BASE',
}

export enum OptionTag {
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
  STRIP = 'STRIP',
  FILTRATION = 'FILTRATION',
  CONNECTION = 'CONNECTION',
  FILTER = 'FILTER',
  UV = 'UV',
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
  SAND_FILTER_BOX = 'SAND-FILTER-BOX',
}

export enum HeatingType {
  WOOD = 'WOOD',
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID',
}

export enum HeatingCategory {
  HOUTKACHEL = 'HOUTKACHEL',
  VOLLEDIG_ELEKTRISCH = 'VOLLEDIG_ELEKTRISCH',
  HYBRIDE = 'HYBRIDE',
}

export enum HeatingPlacement {
  INTERN = 'intern',
  EXTERN = 'extern',
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
}

export enum FiltrationType {
  CONNECTION = 'CONNECTION',
  FILTER = 'FILTER',
  UV = 'UV',
}

export enum FiltrationRole {
  MAIN = 'MAIN',
  ADDON = 'ADDON',
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
  vatRatePercent: number;
  images: string[];
  tags: OptionTag[];
  isActive: boolean;
};

export type HeatingAttributes = {
  type: HeatingType;
  category: HeatingCategory;
  heatingTime: string | null;
  power: string | null;
  voltage: string | null;
  placement: HeatingPlacement | null;
  size: HeatingSize | null;
  pros: string[];
  cons: string[];
  extraOptionKeys: string[];
};

export type MaterialAttributes = {
  colors: OptionColorVariant[];
  pros: string[];
  cons: string[];
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

export type SandFilterAttributes = {
  inheritsExternalColor: boolean;
};

export type CatalogOptionSeed =
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
      groupKey: OptionGroupKey.EXTRAS_BASE;
      attributes: ExtraAttributes | SourceAttributes;
    })
  | (CatalogOptionBase & {
      groupKey: OptionGroupKey.SANDFILTER_BASE;
      attributes: SandFilterAttributes;
    });
