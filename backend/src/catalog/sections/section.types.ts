import { BaseProductEntity } from '../entities/base-product.entity';
import { OptionEntity } from '../entities/option.entity';
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
  vatRate: number;
  priceIncl: number;
  included?: boolean;
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
  options: OptionEntity[];
  groups: OptionGroupEntity[];
  selections: ConfigSelections;
};

export type SectionHandler = (context: SectionContext) => SectionResult;
