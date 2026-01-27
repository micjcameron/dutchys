import { BaseProductEntity } from '../entities/base-product.entity';
import { OptionGroupEntity } from '../entities/option-group.entity';

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
  vatRatePercent: number;
  priceIncl: number;
  included?: boolean;
};

export type CatalogOption = {
  key: string;
  groupKey: string;
  name: string;
  description?: string | null;
  priceExcl: number;
  vatRatePercent: number;
  images?: string[];
  tags?: string[];
  attributes?: Record<string, unknown>;
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
