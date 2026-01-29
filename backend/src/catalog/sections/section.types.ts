import { BaseProductEntity } from '../entities/base-product.entity';
import { OptionGroupEntity } from '../entities/option-group.entity';

export type ConfigSelections = {
  baseProductId?: string | null;
  answers?: {
    hideFilterUnderStairs?: boolean | null;
  };
  touchedKeys?: string[];
  heaterInstallation?: { optionId?: string | null };
  cooler?: { optionId?: string | null };
  heating?: { optionId?: string | null; extras?: string[] };
  materials?: {
    internalMaterialId?: string | null;
    externalMaterialId?: string | null;
  };
  insulation?: { optionId?: string | null };
  spa?: { systemId?: string | null; leds?: Record<string, number> | string[] };
  lid?: { optionId?: string | null };
  filtration?: {
    connections?: string[];
    filterId?: string | null;
    uv?: string[];
    addons?: string[];
    filterBoxId?: string | null;
  };
  stairs?: { optionId?: string | null };
  controlUnit?: { optionId?: string | null };
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

export type CatalogOption = {
  key: string;
  groupKey: string;
  name: string;
  subKey?: string | null;
  description?: string | null;
  priceExcl: number;
  priceIncl?: number;
  vatRatePercent: number;
  images?: string[];
  tags?: string[];
  attributes?: Record<string, unknown>;
  appliesTo?: Record<string, unknown>;
  quantityRule?: Record<string, unknown> | null;
};

export type SectionResult = {
  selections: ConfigSelections;
  requirements: Array<{ key: string; message: string }>;
  disabledOptions: Record<string, { reason: string }>;
  hiddenOptions: Record<string, { reason: string }>;
  validationErrors: string[];
  priceOverrides: Record<string, number>;
};

export type SectionContext = {
  product: BaseProductEntity;
  options: CatalogOption[];
  groups: OptionGroupEntity[];
  selections: ConfigSelections;
};

export type SectionHandler = (context: SectionContext) => SectionResult;
