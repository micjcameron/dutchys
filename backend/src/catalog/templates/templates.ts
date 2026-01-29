import { OptionGroupKey } from '../catalog-option-seed.types';
import { ProductType } from '../entities/base-product.entity';
import { ConfiguratorTemplate } from './template.types';


// If your TemplateStep type doesn’t have this yet, add:
// optionGroupKeys?: OptionGroupKey[];
type StepWithGroups = ConfiguratorTemplate['steps'][number] & {
  optionGroupKeys?: OptionGroupKey[];
};

const STEPS: Record<string, StepWithGroups> = {
  BASE: {
    id: 'BASE',
    section: 'BASE',
    title: 'Model',
    description: 'Kies uw basisproduct',
  },

  HEATER_INSTALLATION: {
    id: 'HEATER_INSTALLATION',
    section: 'HEATER_INSTALLATION',
    title: 'Installatie',
    description: 'Kies geïntegreerd of extern',
    optionGroupKeys: [OptionGroupKey.HEATER_INSTALLATION],
  },

  HEATING: {
    id: 'HEATING',
    section: 'HEATING',
    title: 'Verwarming',
    description: 'Kies uw verwarmingssysteem',
    optionGroupKeys: [OptionGroupKey.HEATING_BASE],
  },

  COOLER: {
    id: 'COOLER',
    section: 'COOLER',
    title: 'Koeling',
    description: 'Kies uw koeling',
    optionGroupKeys: [OptionGroupKey.COOLER_BASE],
  },

  MATERIALS: {
    id: 'MATERIALS',
    section: 'MATERIALS',
    title: 'Materialen',
    description: 'Kies interne en externe materialen',
    optionGroupKeys: [
      OptionGroupKey.MATERIALS_INTERNAL_BASE,
      OptionGroupKey.MATERIALS_EXTERNAL_BASE,
    ],
  },

  INSULATION: {
    id: 'INSULATION',
    section: 'INSULATION',
    title: 'Isolatie',
    description: 'Kies uw isolatie',
    optionGroupKeys: [OptionGroupKey.INSULATION_BASE],
  },

  SPA: {
    id: 'SPA',
    section: 'SPA',
    title: 'Spa systemen',
    description: 'Kies uw spa systeem',
    optionGroupKeys: [OptionGroupKey.SPASYSTEM_BASE],
  },

  LEDS: {
    id: 'LEDS',
    section: 'LEDS',
    title: 'LED verlichting',
    description: 'Kies uw verlichting',
    optionGroupKeys: [OptionGroupKey.LEDS_BASE],
  },

  LID: {
    id: 'LID',
    section: 'LID',
    title: 'Deksels',
    description: 'Kies uw deksel',
    optionGroupKeys: [OptionGroupKey.LID_BASE],
  },

  FILTRATION: {
    id: 'FILTRATION',
    section: 'FILTRATION',
    title: 'Filtratie',
    description: 'Kies uw filtratie',
    optionGroupKeys: [
      OptionGroupKey.FILTRATION_BASE,
      OptionGroupKey.FILTRATION_ADDONS,
      OptionGroupKey.FILTRATION_BOX,
    ],
  },

  STAIRS: {
    id: 'STAIRS',
    section: 'STAIRS',
    title: 'Trappen',
    description: 'Kies uw trap',
    optionGroupKeys: [OptionGroupKey.STAIRS_BASE],
  },

  CONTROLUNIT: {
    id: 'CONTROLUNIT',
    section: 'CONTROLUNIT',
    title: 'Bediening',
    description: 'Kies uw bediening',
    optionGroupKeys: [OptionGroupKey.CONTROLUNIT_BASE],
  },

  EXTRAS: {
    id: 'EXTRAS',
    section: 'EXTRAS',
    title: 'Extra opties',
    description: 'Kies extra opties',
    optionGroupKeys: [OptionGroupKey.EXTRAS_BASE],
  },

  SUMMARY: {
    id: 'SUMMARY',
    section: 'SUMMARY',
    title: 'Samenvatting',
    description: 'Controleer uw configuratie',
  },
};

export const configuratorTemplates: ConfiguratorTemplate[] = [
  {
    key: 'HOTTUB-V1',
    productTypes: [ProductType.HOTTUB],
    steps: [
      STEPS.BASE,
      STEPS.HEATER_INSTALLATION,
      STEPS.HEATING,
      STEPS.MATERIALS,
      STEPS.INSULATION,
      STEPS.SPA,
      STEPS.LEDS,
      STEPS.LID,
      STEPS.FILTRATION,
      STEPS.STAIRS,
      STEPS.CONTROLUNIT,
      STEPS.EXTRAS,
      STEPS.SUMMARY,
    ],
  },
  {
    key: 'SAUNA-V1',
    productTypes: [ProductType.SAUNA],
    steps: [
      STEPS.BASE,
      STEPS.HEATING,
      STEPS.MATERIALS,
      STEPS.INSULATION,
      STEPS.SPA,
      STEPS.LEDS,
      STEPS.LID,
      STEPS.FILTRATION,
      STEPS.STAIRS,
      STEPS.CONTROLUNIT,
      STEPS.EXTRAS,
      STEPS.SUMMARY,
    ],
  },
  {
    key: 'COLDPLUNGE-V1',
    productTypes: [ProductType.COLD_PLUNGE],
    steps: [
      STEPS.BASE,
      STEPS.COOLER,
      STEPS.MATERIALS,
      STEPS.INSULATION,
      STEPS.LID,
      STEPS.STAIRS,
      STEPS.EXTRAS,
      STEPS.SUMMARY,
    ],
  },
];

export class ConfiguratorTemplateRegistry {
  private templates: ConfiguratorTemplate[] = configuratorTemplates;

  getTemplateForProductType(productType: ProductType) {
    return this.templates.find((template) => template.productTypes.includes(productType));
  }

  listTemplates() {
    return this.templates;
  }
}

export const templateRegistry = new ConfiguratorTemplateRegistry();

export const getTemplateForProductType = (productType: ProductType) =>
  templateRegistry.getTemplateForProductType(productType);
