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
  filterBoxSection,
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
  SANDFILTER: filterBoxSection,
  STAIRS: stairsSection,
  CONTROLUNIT: controlUnitSection,
  EXTRAS: extrasSection,
};

export type SelectionInput = Record<string, string[] | string | boolean | null | undefined>;

type EvaluationResult = {
  templateKey: string;
  resolvedSelections: ConfigSelections;
  applicableOptionKeys: string[];
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

// ---------------------------------------------------------
// 🔥 FIX: project "group array selections" -> structured FE selections
// ---------------------------------------------------------
const projectSelections = (raw: any): ConfigSelections => {
  const sel: any = raw && typeof raw === 'object' ? { ...raw } : {};

  const pickFirst = (key: string): string | null => {
    const v = sel[key];
    if (Array.isArray(v)) return (v[0] as string) ?? null;
    if (typeof v === 'string') return v;
    return null;
  };

  // Ensure nested objects exist (don’t crash on undefined)
  sel.heaterInstallation = sel.heaterInstallation && typeof sel.heaterInstallation === 'object'
    ? { ...sel.heaterInstallation }
    : { optionId: null };

  sel.heating = sel.heating && typeof sel.heating === 'object'
    ? { ...sel.heating, extras: Array.isArray(sel.heating?.extras) ? sel.heating.extras : [] }
    : { optionId: null, extras: [] };

  // Map group arrays -> structured fields (only if structured is missing)
  const heaterInstallFromGroup = pickFirst('HEATER_INSTALLATION');
  if (!sel.heaterInstallation.optionId && heaterInstallFromGroup) {
    sel.heaterInstallation.optionId = heaterInstallFromGroup;
  }

  const heatingFromGroup = pickFirst('HEATING_BASE');
  if (!sel.heating.optionId && heatingFromGroup) {
    sel.heating.optionId = heatingFromGroup;
  }

  // Optional: keep ONE truth in API response (prevents FE confusion / loops)
  // If you still need these internally somewhere else, comment these out.
  delete sel.HEATER_INSTALLATION;
  delete sel.HEATING_BASE;

  return sel as ConfigSelections;
};

const matchesAppliesTo = (option: CatalogOption, product: BaseProductEntity) => {
  if (!option.appliesTo) {
    return true;
  }
  const appliesTo = option.appliesTo as {
    productTypes?: string[];
    productModelKeys?: string[];
  };

  if (option.groupKey === 'HEATER_INSTALLATION') {
    console.log('[matchesAppliesTo]', {
      optionKey: option.key,
      appliesTo: option.appliesTo,
      productModelKeys: (option.appliesTo as any)?.productModelKeys,
      productSlug: product.slug,
      productId: product.id,
      productKeyAttr: (product.attributes as any)?.productKey,
    });
  }

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

const normalizeLedQuantities = (value: Record<string, number> | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value.reduce<Record<string, number>>((acc, key) => {
      if (!key) return acc;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value);
    return entries.reduce<Record<string, number>>((acc, [key, qty]) => {
      const nextQty = Number(qty ?? 0);
      if (!key || !Number.isFinite(nextQty) || nextQty <= 0) return acc;
      acc[key] = nextQty;
      return acc;
    }, {});
  }
  return {};
};

const getSelectedOptionQuantities = (selections: ConfigSelections) => {
  const quantities = new Map<string, number>();
  const add = (key: string | null | undefined, qty = 1) => {
    if (!key) return;
    quantities.set(key, (quantities.get(key) ?? 0) + qty);
  };

  add(selections.heating?.optionId);
  add(selections.heaterInstallation?.optionId);
  add(selections.cooler?.optionId);
  selections.heating?.extras?.forEach((key) => add(key));
  add(selections.materials?.internalMaterialId);
  add(selections.materials?.externalMaterialId);
  add(selections.insulation?.optionId);
  add(selections.spa?.systemId);
  const leds = normalizeLedQuantities(selections.spa?.leds);
  Object.entries(leds).forEach(([key, qty]) => add(key, qty));
  add(selections.lid?.optionId);
  selections.filtration?.connections?.forEach((key) => add(key));
  add(selections.filtration?.filterId);
  selections.filtration?.uv?.forEach((key) => add(key));
  add(selections.filtration?.filterBoxId);
  add(selections.stairs?.optionId);
  add(selections.controlUnit?.optionId);
  selections.extras?.optionIds?.forEach((key) => add(key));

  return quantities;
};

export const evaluateTemplate = (params: {
  product: BaseProductEntity;
  selections: ConfigSelections;
  template: ConfiguratorTemplate;
  catalog: { options: CatalogOption[]; groups: OptionGroupEntity[] };
}): EvaluationResult => {
  const { product, selections, template, catalog } = params;

  const applicableOptions = filterOptionsForProduct(catalog.options, product);
  const applicableOptionKeys = applicableOptions.map((o) => o.key);

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

  // -------------------------
  // 1) section handlers pass
  // -------------------------
  const resolved = template.steps.reduce((acc, step) => {
    const handler = sectionHandlers[step.section as keyof typeof sectionHandlers];
    if (!handler) return acc;
    const nextContext = { ...contextBase, selections: acc.selections };
    const sectionResult = handler(nextContext);
    return mergeSectionResults(acc, sectionResult);
  }, baseResult);

  // 🔥 Project BEFORE rules (rules expect structured selections)
  const resolvedProjected: SectionResult = {
    ...resolved,
    selections: projectSelections(resolved.selections as any),
  };

  // -------------------------
  // 2) rules pass #1
  // -------------------------
  const rulesResult = evaluateRules({
    product,
    selections: resolvedProjected.selections,
    options: applicableOptions,
  });

  const postRulesBase: SectionResult = {
    selections: projectSelections(rulesResult.selections as any),
    requirements: [],
    disabledOptions: {},
    hiddenOptions: {},
    validationErrors: [],
    priceOverrides: {},
  };

  // -------------------------
  // 3) normalize via section handlers again
  // -------------------------
  const normalized = template.steps.reduce((acc, step) => {
    const handler = sectionHandlers[step.section as keyof typeof sectionHandlers];
    if (!handler) return acc;
    const nextContext = { ...contextBase, selections: acc.selections };
    const sectionResult = handler(nextContext);
    return mergeSectionResults(acc, sectionResult);
  }, postRulesBase);

  // 🔥 Project BEFORE rules again
  const normalizedProjected: SectionResult = {
    ...normalized,
    selections: projectSelections(normalized.selections as any),
  };

  // -------------------------
  // 4) rules pass #2 (final)
  // -------------------------
  const finalRules = evaluateRules({
    product,
    selections: normalizedProjected.selections,
    options: applicableOptions,
  });

  // 🔥 Final projection before pricing + returning to FE
  const finalSelections = projectSelections(finalRules.selections as any);

  // -------------------------
  // pricing
  // -------------------------
  const optionMap = getOptionMap(applicableOptions);
  const breakdown: PriceItem[] = [];

  const basePriceExcl = product.basePriceExcl ?? 0;
  const baseVatRatePercent = product.vatRatePercent ?? 0;
  const basePriceIncl =
    typeof product.basePriceIncl === 'number'
      ? product.basePriceIncl
      : basePriceExcl * (1 + baseVatRatePercent / 100);

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

  const selectedQuantities = getSelectedOptionQuantities(finalSelections);
  selectedQuantities.forEach((quantity, key) => {
    const option = optionMap.get(key);
    if (!option) return;

    const override = (finalRules.priceOverrides[key] ?? normalizedProjected.priceOverrides[key]) as any;
    const unitPriceExcl = typeof override === 'number' ? override : option.priceExcl ?? 0;
    const vatRatePercent = option.vatRatePercent ?? baseVatRatePercent;

    const unitBasePriceIncl =
      typeof option.priceIncl === 'number'
        ? option.priceIncl
        : unitPriceExcl * (1 + vatRatePercent / 100);

    const unitPriceIncl =
      typeof override === 'number'
        ? unitPriceExcl * (1 + vatRatePercent / 100)
        : unitBasePriceIncl;

    const linePriceExcl = unitPriceExcl * (quantity || 1);
    const linePriceIncl = unitPriceIncl * (quantity || 1);

    breakdown.push({
      type: 'option',
      key,
      name: option.name,
      quantity: quantity > 1 ? quantity : undefined,
      priceExcl: linePriceExcl,
      vatRatePercent,
      priceIncl: linePriceIncl,
      included: typeof override === 'number' && override === 0 ? true : undefined,
    });

    totalExcl += linePriceExcl;
    totalIncl += linePriceIncl;
  });

  return {
    templateKey: template.key,
    resolvedSelections: finalSelections, // ✅ canonical structured selections
    applicableOptionKeys,
    disabledOptions: { ...normalizedProjected.disabledOptions, ...finalRules.disabledOptions },
    hiddenOptions: { ...normalizedProjected.hiddenOptions, ...finalRules.hiddenOptions },
    requirements: [...normalizedProjected.requirements, ...finalRules.requirements],
    validationErrors: [...normalizedProjected.validationErrors, ...finalRules.validationErrors],
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
