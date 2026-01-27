import { ProductType } from '../../common/product-type.enum';
import { ConfiguratorTemplate } from './template.types';

export const configuratorTemplates: ConfiguratorTemplate[] = [
  {
    key: 'HOTTUB-V1',
    productTypes: [ProductType.HOTTUB],
    steps: [
      { id: 'BASE', section: 'BASE', title: 'Model', description: 'Kies uw basisproduct' },
      { id: 'HEATING', section: 'HEATING', title: 'Verwarming', description: 'Kies uw verwarmingssysteem' },
      { id: 'MATERIALS', section: 'MATERIALS', title: 'Materialen', description: 'Kies interne en externe materialen' },
      { id: 'INSULATION', section: 'INSULATION', title: 'Isolatie', description: 'Kies uw isolatie' },
      { id: 'SPA', section: 'SPA', title: 'Spa systemen', description: 'Kies uw spa systeem' },
      { id: 'LEDS', section: 'LEDS', title: 'LED verlichting', description: 'Kies uw verlichting' },
      { id: 'LID', section: 'LID', title: 'Deksels', description: 'Kies uw deksel' },
      { id: 'FILTRATION', section: 'FILTRATION', title: 'Filtratie', description: 'Kies uw filtratie' },
      { id: 'SANDFILTER', section: 'SANDFILTER', title: 'Zandfilter box', description: 'Kies uw zandfilter box' },
      { id: 'STAIRS', section: 'STAIRS', title: 'Trappen', description: 'Kies uw trap' },
      { id: 'CONTROLUNIT', section: 'CONTROLUNIT', title: 'Bediening', description: 'Kies uw bediening' },
      { id: 'EXTRAS', section: 'EXTRAS', title: 'Extra opties', description: 'Kies extra opties' },
      { id: 'SUMMARY', section: 'SUMMARY', title: 'Samenvatting', description: 'Controleer uw configuratie' },
    ],
  },
  {
    key: 'SAUNA-V1',
    productTypes: [ProductType.SAUNA],
    steps: [
      { id: 'BASE', section: 'BASE', title: 'Model', description: 'Kies uw basisproduct' },
      { id: 'HEATING', section: 'HEATING', title: 'Verwarming', description: 'Kies uw verwarmingssysteem' },
      { id: 'MATERIALS', section: 'MATERIALS', title: 'Materialen', description: 'Kies interne en externe materialen' },
      { id: 'INSULATION', section: 'INSULATION', title: 'Isolatie', description: 'Kies uw isolatie' },
      { id: 'SPA', section: 'SPA', title: 'Spa systemen', description: 'Kies uw spa systeem' },
      { id: 'LEDS', section: 'LEDS', title: 'LED verlichting', description: 'Kies uw verlichting' },
      { id: 'LID', section: 'LID', title: 'Deksels', description: 'Kies uw deksel' },
      { id: 'FILTRATION', section: 'FILTRATION', title: 'Filtratie', description: 'Kies uw filtratie' },
      { id: 'SANDFILTER', section: 'SANDFILTER', title: 'Zandfilter box', description: 'Kies uw zandfilter box' },
      { id: 'STAIRS', section: 'STAIRS', title: 'Trappen', description: 'Kies uw trap' },
      { id: 'CONTROLUNIT', section: 'CONTROLUNIT', title: 'Bediening', description: 'Kies uw bediening' },
      { id: 'EXTRAS', section: 'EXTRAS', title: 'Extra opties', description: 'Kies extra opties' },
      { id: 'SUMMARY', section: 'SUMMARY', title: 'Samenvatting', description: 'Controleer uw configuratie' },
    ],
  },
  {
    key: 'COLDPLUNGE-V1',
    productTypes: [ProductType.COLD_PLUNGE],
    steps: [
      { id: 'BASE', section: 'BASE', title: 'Model', description: 'Kies uw basisproduct' },
      { id: 'MATERIALS', section: 'MATERIALS', title: 'Materialen', description: 'Kies interne en externe materialen' },
      { id: 'INSULATION', section: 'INSULATION', title: 'Isolatie', description: 'Kies uw isolatie' },
      { id: 'LID', section: 'LID', title: 'Deksels', description: 'Kies uw deksel' },
      { id: 'STAIRS', section: 'STAIRS', title: 'Trappen', description: 'Kies uw trap' },
      { id: 'EXTRAS', section: 'EXTRAS', title: 'Extra opties', description: 'Kies extra opties' },
      { id: 'SUMMARY', section: 'SUMMARY', title: 'Samenvatting', description: 'Controleer uw configuratie' },
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
