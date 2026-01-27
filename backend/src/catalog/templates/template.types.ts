import { ProductType } from '../../common/product-type.enum';

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
  config?: Record<string, unknown>;
};

export type ConfiguratorTemplate = {
  key: string;
  productTypes: ProductType[];
  steps: TemplateStep[];
};
