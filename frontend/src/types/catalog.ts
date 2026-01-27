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
  description: string;
  priceExcl: number;
  vatRate: number;
  tags?: string[];
  attributes?: Record<string, any>;
};

export type BaseProduct = {
  id: string;
  name: string;
  description: string;
  type: string;
  shape?: string | null;
  basePriceExcl: number;
  vatRate: number;
  images?: string[];
  attributes?: Record<string, any>;
  heatingTypes?: string[] | null;
};

export type ConfigSelections = {
  baseProductId?: string | null;
  heating?: { optionId?: string | null; extras?: string[] };
  materials?: {
    internalMaterialId?: string | null;
    externalMaterialId?: string | null;
  };
  insulation?: { optionId?: string | null };
  spa?: { systemId?: string | null; leds?: string[] };
  lid?: { optionId?: string | null };
  filtration?: {
    connections?: string[];
    filterId?: string | null;
    uv?: string[];
    sandFilterBox?: string | null;
  };
  stairs?: { optionId?: string | null };
  controlUnit?: { optionId?: string | null };
  extras?: { optionIds?: string[] };
};

export type PriceItem = {
  type: 'base' | 'option';
  key: string;
  name: string;
  priceExcl: number;
  vatRate: number;
  priceIncl: number;
  included?: boolean;
};

export type EvaluationResult = {
  templateKey: string;
  resolvedSelections: ConfigSelections;
  disabledOptions: Record<string, { reason: string }>;
  hiddenOptions: Record<string, { reason: string }>;
  requirements: Array<{ key: string; message: string }>;
  validationErrors: string[];
  pricing: {
    totalExcl: number;
    totalIncl: number;
    vatTotal: number;
    breakdown: PriceItem[];
  };
};

export type SectionKey =
  | 'BASE'
  | 'HEATING'
  | 'MATERIALS'
  | 'INSULATION'
  | 'SPA'
  | 'LEDS'
  | 'LID'
  | 'FILTRATION'
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
};

export type ConfiguratorTemplate = {
  key: string;
  productTypes: string[];
  steps: TemplateStep[];
};
