import { BaseProductEntity } from '../entities/base-product.entity';
import { OptionEntity } from '../entities/option.entity';
import { OptionGroupEntity } from '../entities/option-group.entity';
import { SectionContext, ConfigSelections, SectionResult, PriceItem } from '../sections/section.types';
import {
  baseSection,
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

const sectionHandlers = {
  BASE: baseSection,
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

const getOptionMap = (options: OptionEntity[]) =>
  new Map(options.map((option) => [option.key, option]));

const getSelectedOptionKeys = (selections: ConfigSelections) => {
  const keys = new Set<string>();

  if (selections.heating?.optionId) {
    keys.add(selections.heating.optionId);
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

const applyGlobalConstraints = (
  selections: ConfigSelections,
  options: OptionEntity[],
  disabledOptions: Record<string, { reason: string }>,
  priceOverrides: Record<string, number>,
) => {
  const optionMap = getOptionMap(options);

  const heatingOption = selections.heating?.optionId ? optionMap.get(selections.heating.optionId) : undefined;
  const heatingTags = (heatingOption?.tags ?? []).map((tag) => tag.toUpperCase());
  if (heatingOption && (heatingTags.includes('ELECTRIC') || heatingTags.includes('HYBRID'))) {
    selections.spa = {
      ...selections.spa,
      systemId: selections.spa?.systemId ?? 'CIRCULATION-PUMP',
    };
    priceOverrides['CIRCULATION-PUMP'] = 0;
  }

  const stairsOption = selections.stairs?.optionId ? optionMap.get(selections.stairs.optionId) : undefined;
  if (stairsOption?.attributes?.coversSandFilter) {
    if (selections.filtration?.filterId === 'SAND-FILTER') {
      selections.filtration = { ...selections.filtration, filterId: null };
    }
    if (selections.filtration?.sandFilterBox) {
      selections.filtration = { ...selections.filtration, sandFilterBox: null };
    }
  }

  if (selections.filtration?.sandFilterBox) {
    const extraOptions = selections.extras?.optionIds ?? [];
    const filteredExtras = extraOptions.filter((key) => !key.startsWith('CUPHOLDER'));
    if (filteredExtras.length !== extraOptions.length) {
      selections.extras = { optionIds: filteredExtras };
    }
    options
      .filter((option) => option.groupKey === 'EXTRAS' && option.key.startsWith('CUPHOLDER'))
      .forEach((option) => {
        disabledOptions[option.key] = { reason: 'Niet beschikbaar met zandfilterbox' };
      });
  }
};

export const evaluateTemplate = (params: {
  product: BaseProductEntity;
  selections: ConfigSelections;
  template: ConfiguratorTemplate;
  catalog: { options: OptionEntity[]; groups: OptionGroupEntity[] };
}): EvaluationResult => {
  const { product, selections, template, catalog } = params;
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
    options: catalog.options,
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

  applyGlobalConstraints(resolved.selections, catalog.options, resolved.disabledOptions, resolved.priceOverrides);

  const optionMap = getOptionMap(catalog.options);
  const breakdown: PriceItem[] = [];
  const basePriceExcl = product.basePriceExcl ?? 0;
  const baseVatRate = product.vatRate ?? 0;
  const basePriceIncl = basePriceExcl * (1 + baseVatRate);

  breakdown.push({
    type: 'base',
    key: product.id,
    name: product.name,
    priceExcl: basePriceExcl,
    vatRate: baseVatRate,
    priceIncl: basePriceIncl,
  });

  let totalExcl = basePriceExcl;
  let totalIncl = basePriceIncl;

  const selectedKeys = getSelectedOptionKeys(resolved.selections);
  selectedKeys.forEach((key) => {
    const option = optionMap.get(key);
    if (!option) {
      return;
    }
    const override = resolved.priceOverrides[key];
    const priceExcl = typeof override === 'number' ? override : option.priceExcl ?? 0;
    const vatRate = option.vatRate ?? baseVatRate;
    const priceIncl = priceExcl * (1 + vatRate);
    breakdown.push({
      type: 'option',
      key,
      name: option.name,
      priceExcl,
      vatRate,
      priceIncl,
      included: typeof override === 'number' && override === 0 ? true : undefined,
    });
    totalExcl += priceExcl;
    totalIncl += priceIncl;
  });

  return {
    templateKey: template.key,
    resolvedSelections: resolved.selections,
    disabledOptions: resolved.disabledOptions,
    hiddenOptions: resolved.hiddenOptions,
    requirements: resolved.requirements,
    validationErrors: resolved.validationErrors,
    pricing: {
      totalExcl,
      totalIncl,
      vatTotal: totalIncl - totalExcl,
      breakdown,
    },
  };
};
