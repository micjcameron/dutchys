import { OptionGroupKey } from '../catalog-option-seed.types';
import { BaseProductEntity } from '../entities/base-product.entity';
import { CatalogOption, ConfigSelections } from '../sections/section.types';
import { catalogRules } from './catalog.rules';
import {
  Rule,
  RuleContext,
  RuleEffect,
  RuleEvaluationResult,
  RuleRecommendation,
  RuleWarning,
} from './rule.types';

const getSelectedOptionKeys = (selections: ConfigSelections): Set<string> => {
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
  const leds = normalizeLedQuantities(selections.spa?.leds);
  Object.keys(leds).forEach((key) => keys.add(key));
  if (selections.lid?.optionId) {
    keys.add(selections.lid.optionId);
  }
  selections.filtration?.connections?.forEach((key) => keys.add(key));
  if (selections.filtration?.filterId) {
    keys.add(selections.filtration.filterId);
  }
  selections.filtration?.uv?.forEach((key) => keys.add(key));
  if (selections.filtration?.filterBoxId) {
    keys.add(selections.filtration.filterBoxId);
  }
  if (selections.stairs?.optionId) {
    keys.add(selections.stairs.optionId);
  }
  if (selections.controlUnit?.optionId) {
    keys.add(selections.controlUnit.optionId);
  }
  selections.extras?.optionIds?.forEach((key) => keys.add(key));

  return keys;
};


const removeKeyFromArray = (value: string[] | undefined, key: string) =>
  Array.isArray(value) ? value.filter((entry) => entry !== key) : [];

const addKeyToArray = (value: string[] | undefined, key: string) => {
  const next = Array.isArray(value) ? [...value] : [];
  if (!next.includes(key)) {
    next.push(key);
  }
  return next;
};

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

const applyOptionKey = (
  selections: ConfigSelections,
  option: CatalogOption,
  action: 'add' | 'remove',
): ConfigSelections => {
  const next = { ...selections };
  const key = option.key;

  const toggleValue = (value: string | null | undefined) =>
    action === 'add' ? key : value === key ? null : value ?? null;

  switch (option.groupKey) {
    case OptionGroupKey.HEATING_BASE:
      next.heating = { ...(next.heating ?? {}), optionId: toggleValue(next.heating?.optionId ?? null) };
      break;
    case OptionGroupKey.COOLER_BASE:
      next.cooler = { ...(next.cooler ?? {}), optionId: toggleValue(next.cooler?.optionId ?? null) };
      break;
    case OptionGroupKey.HEATER_INSTALLATION:
      next.heaterInstallation = {
        ...(next.heaterInstallation ?? {}),
        optionId: toggleValue(next.heaterInstallation?.optionId ?? null),
      };
      break;
    case OptionGroupKey.MATERIALS_INTERNAL_BASE:
      next.materials = {
        ...(next.materials ?? {}),
        internalMaterialId: toggleValue(next.materials?.internalMaterialId ?? null),
      };
      break;
    case OptionGroupKey.MATERIALS_EXTERNAL_BASE:
      next.materials = {
        ...(next.materials ?? {}),
        externalMaterialId: toggleValue(next.materials?.externalMaterialId ?? null),
      };
      break;
    case OptionGroupKey.INSULATION_BASE:
      next.insulation = { ...(next.insulation ?? {}), optionId: toggleValue(next.insulation?.optionId ?? null) };
      break;
    case OptionGroupKey.SPASYSTEM_BASE:
      next.spa = { ...(next.spa ?? {}), systemId: toggleValue(next.spa?.systemId ?? null) };
      break;
    case OptionGroupKey.LEDS_BASE:
      next.spa = {
        ...(next.spa ?? {}),
        leds: (() => {
          const current = normalizeLedQuantities(next.spa?.leds);
          if (action === 'add') {
            current[key] = current[key] && current[key] > 0 ? current[key] : 1;
          } else {
            delete current[key];
          }
          return current;
        })(),
      };
      break;
    case OptionGroupKey.LID_BASE:
      next.lid = { ...(next.lid ?? {}), optionId: toggleValue(next.lid?.optionId ?? null) };
      break;
    case OptionGroupKey.FILTRATION_BASE: {
      const filterType = option.attributes?.type;
      if (filterType === 'CONNECTION') {
        next.filtration = {
          ...(next.filtration ?? {}),
          connections:
            action === 'add'
              ? addKeyToArray(next.filtration?.connections, key)
              : removeKeyFromArray(next.filtration?.connections, key),
        };
      } else if (filterType === 'UV') {
        next.filtration = {
          ...(next.filtration ?? {}),
          uv:
            action === 'add'
              ? addKeyToArray(next.filtration?.uv, key)
              : removeKeyFromArray(next.filtration?.uv, key),
        };
      } else {
        next.filtration = {
          ...(next.filtration ?? {}),
          filterId: toggleValue(next.filtration?.filterId ?? null),
        };
      }
      break;
    }
    case OptionGroupKey.FILTRATION_BOX:
      next.filtration = {
        ...(next.filtration ?? {}),
        filterBoxId: toggleValue(next.filtration?.filterBoxId ?? null),
      };
      break;
    case OptionGroupKey.STAIRS_BASE:
      next.stairs = { ...(next.stairs ?? {}), optionId: toggleValue(next.stairs?.optionId ?? null) };
      break;
    case OptionGroupKey.CONTROLUNIT_BASE:
      next.controlUnit = {
        ...(next.controlUnit ?? {}),
        optionId: toggleValue(next.controlUnit?.optionId ?? null),
      };
      break;
    case OptionGroupKey.HEATER_ADDONS_INTERNAL:
    case OptionGroupKey.HEATER_ADDONS_EXTERNAL:
      next.heating = {
        ...(next.heating ?? {}),
        extras:
          action === 'add'
            ? addKeyToArray(next.heating?.extras, key)
            : removeKeyFromArray(next.heating?.extras, key),
      };
      break;
    case OptionGroupKey.EXTRAS_BASE: {
      next.extras = {
        ...(next.extras ?? {}),
        optionIds:
          action === 'add'
            ? addKeyToArray(next.extras?.optionIds, key)
            : removeKeyFromArray(next.extras?.optionIds, key),
      };
      break;
    }
    default:
      break;
  }

  return next;
};

const buildRuleContext = (
  product: BaseProductEntity,
  selections: ConfigSelections,
  options: CatalogOption[],
): RuleContext => {
  const selected = getSelectedOptionKeys(selections);
  const optionMap = new Map(options.map((option) => [option.key, option]));
  return {
    product,
    selections,
    selected,
    has: (key) => selected.has(key),
    getGroupSelection: (groupKey) => {
      switch (groupKey) {
        case OptionGroupKey.HEATING_BASE:
          return selections.heating?.optionId ?? null;
        case OptionGroupKey.COOLER_BASE:
          return selections.cooler?.optionId ?? null;
        case OptionGroupKey.HEATER_INSTALLATION:
          return selections.heaterInstallation?.optionId ?? null;
        case OptionGroupKey.MATERIALS_INTERNAL_BASE:
          return selections.materials?.internalMaterialId ?? null;
        case OptionGroupKey.MATERIALS_EXTERNAL_BASE:
          return selections.materials?.externalMaterialId ?? null;
        case OptionGroupKey.INSULATION_BASE:
          return selections.insulation?.optionId ?? null;
        case OptionGroupKey.SPASYSTEM_BASE:
          return selections.spa?.systemId ?? null;
        case OptionGroupKey.LEDS_BASE:
          return Object.keys(normalizeLedQuantities(selections.spa?.leds));
        case OptionGroupKey.LID_BASE:
          return selections.lid?.optionId ?? null;
        case OptionGroupKey.FILTRATION_BASE:
          return selections.filtration?.filterId ?? null;
        case OptionGroupKey.FILTRATION_BOX:
          return selections.filtration?.filterBoxId ?? null;
        case OptionGroupKey.STAIRS_BASE:
          return selections.stairs?.optionId ?? null;
        case OptionGroupKey.CONTROLUNIT_BASE:
          return selections.controlUnit?.optionId ?? null;
        case OptionGroupKey.HEATER_ADDONS_INTERNAL:
        case OptionGroupKey.HEATER_ADDONS_EXTERNAL:
          return selections.heating?.extras ?? [];
        case OptionGroupKey.EXTRAS_BASE:
          return selections.extras?.optionIds ?? [];
        default:
          return null;
      }
    },
    getOption: (key) => optionMap.get(key),
    answers: {
      hideFilterUnderStairs: selections.answers?.hideFilterUnderStairs ?? null,
    },
    options,
  };
};

const runRules = (rules: Rule[], context: RuleContext): RuleEffect[] => {
  const effects: RuleEffect[] = [];
  for (const rule of rules) {
    if (!rule.when(context)) {
      continue;
    }
    effects.push(...rule.then(context));
  }
  return effects;
};

export const evaluateRules = (params: {
  product: BaseProductEntity;
  selections: ConfigSelections;
  options: CatalogOption[];
  rules?: Rule[];
}): RuleEvaluationResult => {
  const { product, selections, options } = params;
  const rules = params.rules ?? catalogRules();
  const touchedKeys = new Set(selections.touchedKeys ?? []);
  const optionMap = new Map(options.map((option) => [option.key, option]));
  const touchedGroups = new Set<string>();
  const groupKeys = new Set(
    (Object.values(OptionGroupKey).filter((value) => typeof value === 'string') as string[]),
  );

  touchedKeys.forEach((key) => {
    if (groupKeys.has(key as OptionGroupKey)) {
      touchedGroups.add(key);
      return;
    }
    const option = optionMap.get(key);
    if (option?.groupKey) {
      touchedGroups.add(option.groupKey);
    }
  });

  let workingSelections = { ...selections };
  const validationErrors = new Set<string>();
  const maxIterations = 10;
  let iterations = 0;

  for (; iterations < maxIterations; iterations += 1) {
    const context = buildRuleContext(product, workingSelections, options);
    const effects = runRules(rules, context);

    const forbidEffects = effects.filter((effect) => effect.type === 'FORBID');
    const defaultEffects = effects
      .filter((effect) => effect.type === 'DEFAULT_SELECT')
      .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

    let changed = false;

    forbidEffects.forEach((effect) => {
      if (!context.selected.has(effect.key)) {
        return;
      }
      const option = context.getOption(effect.key);
      if (!option) {
        return;
      }
      workingSelections = applyOptionKey(workingSelections, option, 'remove');
      validationErrors.add(effect.reason);
      changed = true;
    });

    let selectedKeys = getSelectedOptionKeys(workingSelections);

    defaultEffects.forEach((effect) => {
      if (selectedKeys.has(effect.key)) {
        return;
      }
      const option = context.getOption(effect.key);
      if (!option) {
        return;
      }
      if (touchedKeys.has(effect.key) || touchedGroups.has(option.groupKey)) {
        return;
      }
      workingSelections = applyOptionKey(workingSelections, option, 'add');
      selectedKeys = getSelectedOptionKeys(workingSelections);
      changed = true;
    });

    if (!changed) {
      break;
    }
  }

  const finalContext = buildRuleContext(product, workingSelections, options);
  const finalEffects = runRules(rules, finalContext);

  const hiddenOptions: Record<string, { reason: string }> = {};
  const disabledOptions: Record<string, { reason: string }> = {};
  const requirements: Array<{ key: string; message: string }> = [];
  const priceOverrides: Record<string, number> = {};
  const recommendations: RuleRecommendation[] = [];
  const warnings: RuleWarning[] = [];

  const forbidEffects = finalEffects.filter((effect) => effect.type === 'FORBID');
  const hideEffects = finalEffects.filter((effect) => effect.type === 'HIDE');
  const requireEffects = finalEffects.filter((effect) => effect.type === 'REQUIRE');
  const recommendEffects = finalEffects.filter((effect) => effect.type === 'RECOMMEND');
  const warningEffects = finalEffects.filter((effect) => effect.type === 'WARNING');
  const priceEffects = finalEffects.filter((effect) => effect.type === 'PRICE_OVERRIDE');

  hideEffects.forEach((effect) => {
    hiddenOptions[effect.key] = { reason: effect.reason };
  });

  forbidEffects.forEach((effect) => {
    disabledOptions[effect.key] = { reason: effect.reason };
    if (finalContext.selected.has(effect.key)) {
      validationErrors.add(effect.reason);
    }
  });

  // const finalSelectedKeys = finalContext.selected;
  const finalSelectedKeys = getSelectedOptionKeys(workingSelections);

  requireEffects.forEach((effect) => {
    if (!finalSelectedKeys.has(effect.key)) {
      requirements.push({ key: effect.key, message: effect.reason });
    }
  });

  recommendEffects.forEach((effect) => {
    recommendations.push({ key: effect.key, reason: effect.reason, strength: effect.strength });
  });

  warningEffects.forEach((effect) => {
    warnings.push({ message: effect.message, key: effect.key });
  });

  if (iterations >= maxIterations) {
    warnings.push({
      message: 'Regel-evaluatie bereikte de iteratielimiet; controleer op conflicterende regels.',
    });
  }

  priceEffects.forEach((effect) => {
    priceOverrides[effect.key] = effect.priceExcl;
  });

  return {
    selections: workingSelections,
    selectedKeys: Array.from(finalSelectedKeys), 
    requirements,
    disabledOptions,
    hiddenOptions,
    validationErrors: Array.from(validationErrors),
    priceOverrides,
    recommendations,
    warnings,
  };
};
