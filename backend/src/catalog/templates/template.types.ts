import { OptionGroupKey } from '../catalog-option-seed.types';
import { ProductType } from '../entities/base-product.entity';

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
  config?: Record<string, unknown>;
};

export type ConfiguratorTemplate = {
  key: string;
  productTypes: ProductType[];
  opioptionGroupKeys?: OptionGroupKey[];
  steps: TemplateStep[];
};
