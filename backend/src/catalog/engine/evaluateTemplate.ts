import { BaseProductEntity } from '../entities/base-product.entity';
import { OptionGroupEntity } from '../entities/option-group.entity';
import { SectionContext, ConfigSelections, SectionResult, PriceItem, CatalogOption } from '../sections/section.types';
import {
  baseSection,
  coolerSection,
  heaterInstallationSection,
  heatingSection,
  materialsSection,
  insulationSection,
  spaSection,
  lidSection,
  filtrationSection,
  sandFilterSection,
  stairsSection,
  controlUnitSection,
  extrasSection,
} from '../sections/handlers';
import { ConfiguratorTemplate } from '../templates/template.types';
import { evaluateRules } from '../rules/evaluateRules';
import { RuleRecommendation, RuleWarning } from '../rules/rule.types';

const sectionHandlers = {
  BASE: baseSection,
  COOLER: coolerSection,
  HEATER_INSTALLATION: heaterInstallationSection,
  HEATING: heatingSection,
  MATERIALS: materialsSection,
  INSULATION: insulationSection,
  SPA: spaSection,
  LEDS: spaSection,
  LID: lidSection,
  FILTRATION: filtrationSection,
  SANDFILTER: sandFilterSection,
  STAIRS: stairsSection,
  CONTROLUNIT: controlUnitSection,
  EXTRAS: extrasSection,
};

type EvaluationResult = {
  templateKey: string;
  resolvedSelections: ConfigSelections;
  disabledOptions: Record<string, { reason: string }>;
  hiddenOptions: Record<string, { reason: string }>;
  requirements: Array<{ key: string; message: string }>;
  validationErrors: string[];
  recommendations: RuleRecommendation[];
  warnings: RuleWarning[];
  pricing: {
    totalExcl: number;
    totalIncl: number;
    vatTotal: number;
    breakdown: PriceItem[];
  };
};

const mergeSectionResults = (target: SectionResult, patch: SectionResult): SectionResult => ({
  selections: patch.selections,
  requirements: [...target.requirements, ...patch.requirements],
  disabledOptions: { ...target.disabledOptions, ...patch.disabledOptions },
  hiddenOptions: { ...target.hiddenOptions, ...patch.hiddenOptions },
  validationErrors: [...target.validationErrors, ...patch.validationErrors],
  priceOverrides: { ...target.priceOverrides, ...patch.priceOverrides },
});

const getOptionMap = (options: CatalogOption[]) =>
  new Map(options.map((option) => [option.key, option]));

const matchesAppliesTo = (option: CatalogOption, product: BaseProductEntity) => {
  if (!option.appliesTo) {
    return true;
  }
  const appliesTo = option.appliesTo as {
    productTypes?: string[];
    productModelKeys?: string[];
  };
  const productKey =
    typeof product.attributes?.productKey === 'string' ? (product.attributes?.productKey as string) : null;
  const modelKeys = Array.isArray(appliesTo.productModelKeys) ? appliesTo.productModelKeys : [];
  const typeKeys = Array.isArray(appliesTo.productTypes) ? appliesTo.productTypes : [];
  if (
    modelKeys.length > 0 &&
    !modelKeys.includes(product.slug) &&
    !modelKeys.includes(product.id) &&
    (!productKey || !modelKeys.includes(productKey))
  ) {
    return false;
  }
  if (typeKeys.length > 0 && !typeKeys.includes(product.type)) {
    return false;
  }
  return true;
};

const filterOptionsForProduct = (options: CatalogOption[], product: BaseProductEntity) =>
  options.filter((option) => matchesAppliesTo(option, product));

const getSelectedOptionKeys = (selections: ConfigSelections) => {
  const keys = new Set<string>();

  if (selections.heating?.optionId) {
    keys.add(selections.heating.optionId);
  }
  if (selections.heaterInstallation?.optionId) {
    keys.add(selections.heaterInstallation.optionId);
  }
  if (selections.cooler?.optionId) {
    keys.add(selections.cooler.optionId);
  }
  selections.heating?.extras?.forEach((key) => keys.add(key));
  if (selections.materials?.internalMaterialId) {
    keys.add(selections.materials.internalMaterialId);
  }
  if (selections.materials?.externalMaterialId) {
    keys.add(selections.materials.externalMaterialId);
  }
  if (selections.insulation?.optionId) {
    keys.add(selections.insulation.optionId);
  }
  if (selections.spa?.systemId) {
    keys.add(selections.spa.systemId);
  }
  selections.spa?.leds?.forEach((key) => keys.add(key));
  if (selections.lid?.optionId) {
    keys.add(selections.lid.optionId);
  }
  selections.filtration?.connections?.forEach((key) => keys.add(key));
  if (selections.filtration?.filterId) {
    keys.add(selections.filtration.filterId);
  }
  selections.filtration?.uv?.forEach((key) => keys.add(key));
  if (selections.filtration?.sandFilterBox) {
    keys.add(selections.filtration.sandFilterBox);
  }
  if (selections.stairs?.optionId) {
    keys.add(selections.stairs.optionId);
  }
  if (selections.controlUnit?.optionId) {
    keys.add(selections.controlUnit.optionId);
  }
  selections.extras?.optionIds?.forEach((key) => keys.add(key));

  return Array.from(keys);
};

export const evaluateTemplate = (params: {
  product: BaseProductEntity;
  selections: ConfigSelections;
  template: ConfiguratorTemplate;
  catalog: { options: CatalogOption[]; groups: OptionGroupEntity[] };
}): EvaluationResult => {
  const { product, selections, template, catalog } = params;
  const applicableOptions = filterOptionsForProduct(catalog.options, product);
  const baseResult: SectionResult = {
    selections: selections ?? {},
    requirements: [],
    disabledOptions: {},
    hiddenOptions: {},
    validationErrors: [],
    priceOverrides: {},
  };

  const contextBase: SectionContext = {
    product,
    options: applicableOptions,
    groups: catalog.groups,
    selections: baseResult.selections,
  };

  const resolved = template.steps.reduce((acc, step) => {
    const handler = sectionHandlers[step.section as keyof typeof sectionHandlers];
    if (!handler) {
      return acc;
    }
    const nextContext = { ...contextBase, selections: acc.selections };
    const sectionResult = handler(nextContext);
    return mergeSectionResults(acc, sectionResult);
  }, baseResult);

  const rulesResult = evaluateRules({
    product,
    selections: resolved.selections,
    options: applicableOptions,
  });

  const postRulesBase: SectionResult = {
    selections: rulesResult.selections,
    requirements: [],
    disabledOptions: {},
    hiddenOptions: {},
    validationErrors: [],
    priceOverrides: {},
  };

  const normalized = template.steps.reduce((acc, step) => {
    const handler = sectionHandlers[step.section as keyof typeof sectionHandlers];
    if (!handler) {
      return acc;
    }
    const nextContext = { ...contextBase, selections: acc.selections };
    const sectionResult = handler(nextContext);
    return mergeSectionResults(acc, sectionResult);
  }, postRulesBase);

  const finalRules = evaluateRules({
    product,
    selections: normalized.selections,
    options: applicableOptions,
  });

  const optionMap = getOptionMap(applicableOptions);
  const breakdown: PriceItem[] = [];
  const basePriceExcl = product.basePriceExcl ?? 0;
  const baseVatRatePercent = product.vatRatePercent ?? 0;
  const basePriceIncl = basePriceExcl * (1 + baseVatRatePercent / 100);

  breakdown.push({
    type: 'base',
    key: product.id,
    name: product.name,
    priceExcl: basePriceExcl,
    vatRatePercent: baseVatRatePercent,
    priceIncl: basePriceIncl,
  });

  let totalExcl = basePriceExcl;
  let totalIncl = basePriceIncl;

  const selectedKeys = getSelectedOptionKeys(finalRules.selections);
  selectedKeys.forEach((key) => {
    const option = optionMap.get(key);
    if (!option) {
      return;
    }
    const override = finalRules.priceOverrides[key] ?? normalized.priceOverrides[key];
    const priceExcl = typeof override === 'number' ? override : option.priceExcl ?? 0;
    const vatRatePercent = option.vatRatePercent ?? baseVatRatePercent;
    const priceIncl = priceExcl * (1 + vatRatePercent / 100);
    breakdown.push({
      type: 'option',
      key,
      name: option.name,
      priceExcl,
      vatRatePercent,
      priceIncl,
      included: typeof override === 'number' && override === 0 ? true : undefined,
    });
    totalExcl += priceExcl;
    totalIncl += priceIncl;
  });

  return {
    templateKey: template.key,
    resolvedSelections: finalRules.selections,
    disabledOptions: { ...normalized.disabledOptions, ...finalRules.disabledOptions },
    hiddenOptions: { ...normalized.hiddenOptions, ...finalRules.hiddenOptions },
    requirements: [...normalized.requirements, ...finalRules.requirements],
    validationErrors: [...normalized.validationErrors, ...finalRules.validationErrors],
    recommendations: finalRules.recommendations,
    warnings: finalRules.warnings,
    pricing: {
      totalExcl,
      totalIncl,
      vatTotal: totalIncl - totalExcl,
      breakdown,
    },
  };
};
