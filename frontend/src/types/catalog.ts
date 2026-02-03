// types/catalog.ts

import { GroupKey } from "./optionGroups";

export type CatalogOptionGroup = {
  key: string;
  title: string;
  selectionType: 'SINGLE' | 'MULTI' | 'BOOLEAN';
  min?: number | null;
  max?: number | null;
  sortOrder?: number | null;
};

export type CatalogOption = {
  key: string;
  groupKey: string;
  name: string;
  subKey?: string | null;
  description: string;
  priceExcl: number;
  priceIncl: number;
  vatRatePercent: number;
  images?: string[];
  tags?: string[];
  attributes?: Record<string, any>;
  appliesTo?: Record<string, any>;
  quantityRule?: Record<string, any> | null;
};

export type OptionMap = Map<string, CatalogOption>;
export type GetOption = (key: string) => CatalogOption | undefined;

export interface CatalogContext {
  optionMap: OptionMap;
  getOption: GetOption;
}

export type BaseProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  type: string;
  shape?: string | null;
  basePriceExcl: number;
  basePriceIncl?: number;
  vatRatePercent: number;
  images?: string[];
  attributes?: Record<string, any>;
  heatingTypes?: string[] | null;
};

// types/catalog.ts

export type LedSelection = Record<string, number>;

export type ConfigSelections = {
  baseProductId?: string | null;
  answers?: { hideFilterUnderStairs?: boolean | null };
  touchedKeys?: string[];

  heaterInstallation?: { optionId?: string | null };
  cooler?: { optionId?: string | null };
  heating?: { 
    optionId?: string | null;          // used for INTERNAL-only or EXTERNAL-only
    internalOptionId?: string | null;  // used for HYBRID
    externalOptionId?: string | null;  // used for HYBRID
    extras?: string[];                 // add-ons (still multi)
  };

  materials?: { internalMaterialId?: string | null; externalMaterialId?: string | null };
  insulation?: { optionId?: string | null };

  spa?: { systemId?: string | null; leds?: LedSelection | string[] };

  lid?: { optionId?: string | null };
  filtration?: { 
    connections?: string[]; 
    filterId?: string | null; 
    uv?: string[]; 
    filterBoxId?: string | null;
  };
  stairs?: { optionId?: string | null };
  controlUnit?: { optionId?: string | null };
  cover?: { optionId?: string | null };
  extras?: { optionIds?: string[] };
};


export type PriceItem = {
  type: 'base' | 'option';
  key: string;
  name: string;
  quantity?: number;
  priceExcl: number;
  vatRatePercent: number;
  priceIncl: number;
  included?: boolean;
};

export type EvaluationResult = {
  templateKey: string;
  resolvedSelections: ConfigSelections;
  selectedKeys: string[];
  applicableOptionKeys?: string[];
  disabledOptions: Record<string, { reason: string }>;
  hiddenOptions: Record<string, { reason: string }>;
  requirements: Array<{ key: string; message: string }>;
  validationErrors: string[];
  recommendations: any[];
  warnings: any[];
  pricing: {
    totalExcl: number;
    totalIncl: number;
    vatTotal: number;
    breakdown: PriceItem[];
  };
};

export type SectionKey =
  | 'BASE'
  | 'COOLER'
  | 'HEATER_INSTALLATION'
  | 'HEATING'
  | 'MATERIALS'
  | 'INSULATION'
  | 'SPA'
  | 'LEDS'
  | 'LID'
  | 'FILTRATION'
  | 'COVER'
  | 'SANDFILTER'
  | 'STAIRS'
  | 'CONTROLUNIT'
  | 'EXTRAS'
  | 'SUMMARY';

export type TemplateStep = {
  id: string;
  section: SectionKey;
  title: string;
  description?: string;
  config?: Record<string, any>;
  optionGroupKeys?: GroupKey[]; // ✅ add this
};

export type ConfiguratorTemplate = {
  key: string;
  productTypes: string[];
  steps: TemplateStep[];
};

export type OptionGroupSubSectionDTO = {
  key: string;
  title: string;
  selectionType: OptionGroupSelectionType;
  min?: number | null;
  max?: number | null;
  sortOrder?: number;
};

export type OptionGroupDTO = {
  id: string;
  key: string;
  title: string;
  selectionType: OptionGroupSelectionType;
  min: number | null;
  max: number | null;
  sortOrder: number;
  subSections: OptionGroupSubSectionDTO[] | null;
};

export enum OptionGroupSelectionType {
  SINGLE = 'SINGLE',
  MULTI = 'MULTI',
  BOOLEAN = 'BOOLEAN',
}
