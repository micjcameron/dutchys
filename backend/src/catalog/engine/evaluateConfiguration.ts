import { ProductType } from '../../common/product-type.enum';
import { OptionGroupSelectionType } from '../entities/option-group.entity';
import { RuleScope } from '../entities/rule.entity';

export type SelectionInput = Record<string, string[] | string | boolean | null | undefined>;

export interface BaseProduct {
  id: string;
  type: ProductType;
  basePriceExcl: number;
  vatRate: number;
}

export interface CatalogOptionGroup {
  key: string;
  selectionType: OptionGroupSelectionType;
  min?: number | null;
  max?: number | null;
}

export interface CatalogOption {
  key: string;
  groupKey: string;
  name: string;
  priceExcl: number;
  vatRate: number;
  tags?: string[];
  attributes?: Record<string, unknown>;
}

export interface RuleDefinition {
  key: string;
  scope: RuleScope;
  scopeRef?: string | null;
  priority?: number;
  isActive?: boolean;
  when?: Array<Record<string, unknown>>;
  then?: Array<Record<string, unknown>>;
}

export interface EvaluationResult {
  resolvedSelections: Record<string, string[]>;
  disabledOptions: Record<string, { reason: string }>;
  hiddenOptions: Record<string, { reason: string }>;
  requirements: Array<{ optionKey: string; reason: string }>;
  validationErrors: string[];
  pricing: {
    totalExcl: number;
    totalIncl: number;
    vatTotal: number;
    breakdown: Array<{
      type: 'base' | 'option';
      key: string;
      name: string;
      priceExcl: number;
      vatRate: number;
      priceIncl: number;
      included?: boolean;
    }>;
  };
}

const BOOLEAN_TRUE_SENTINEL = '__boolean_true__';

const coerceArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === 'string');
  }
  if (typeof value === 'string' && value.length > 0) {
    return [value];
  }
  return [];
};

const normalizeSelections = (
  groups: CatalogOptionGroup[],
  selections: SelectionInput,
): Record<string, string[]> => {
  const groupMap = new Map(groups.map((group) => [group.key, group]));
  const normalized: Record<string, string[]> = {};

  for (const group of groups) {
    const rawValue = selections?.[group.key];
    if (group.selectionType === OptionGroupSelectionType.BOOLEAN) {
      normalized[group.key] = rawValue === true ? [BOOLEAN_TRUE_SENTINEL] : [];
      continue;
    }
    normalized[group.key] = coerceArray(rawValue);
  }

  for (const [key, value] of Object.entries(selections ?? {})) {
    if (!groupMap.has(key)) {
      continue;
    }
    if (!normalized[key]) {
      normalized[key] = coerceArray(value);
    }
  }

  return normalized;
};

const getSelectedOptionKeys = (
  selections: Record<string, string[]>,
  optionMap: Map<string, CatalogOption>,
): Set<string> => {
  const selected = new Set<string>();
  for (const optionKeys of Object.values(selections)) {
    for (const optionKey of optionKeys) {
      if (optionMap.has(optionKey)) {
        selected.add(optionKey);
      }
    }
  }
  return selected;
};

const isConditionMet = (
  condition: Record<string, unknown>,
  selections: Record<string, string[]>,
  optionMap: Map<string, CatalogOption>,
): boolean => {
  const type = condition.type;
  if (typeof type !== 'string') {
    return false;
  }

  if (type === 'optionSelected') {
    const optionKey = condition.optionKey as string | undefined;
    if (!optionKey) {
      return false;
    }
    return getSelectedOptionKeys(selections, optionMap).has(optionKey);
  }

  if (type === 'optionTagSelected') {
    const tag = condition.tag as string | undefined;
    if (!tag) {
      return false;
    }
    for (const optionKey of getSelectedOptionKeys(selections, optionMap)) {
      const option = optionMap.get(optionKey);
      if (option?.tags?.includes(tag)) {
        return true;
      }
    }
    return false;
  }

  if (type === 'optionTagSelectedAny') {
    const tags = condition.tags as string[] | undefined;
    if (!Array.isArray(tags) || tags.length === 0) {
      return false;
    }
    for (const optionKey of getSelectedOptionKeys(selections, optionMap)) {
      const option = optionMap.get(optionKey);
      if (!option?.tags) {
        continue;
      }
      if (tags.some((tag) => option.tags?.includes(tag))) {
        return true;
      }
    }
    return false;
  }

  if (type === 'groupEmpty') {
    const groupKey = condition.groupKey as string | undefined;
    if (!groupKey) {
      return false;
    }
    const optionKeys = selections[groupKey] ?? [];
    return optionKeys.filter((optionKey) => optionMap.has(optionKey)).length === 0;
  }

  return false;
};

const enforceCardinality = (
  groups: CatalogOptionGroup[],
  selections: Record<string, string[]>,
): { selections: Record<string, string[]>; errors: string[] } => {
  const next = { ...selections };
  const errors: string[] = [];

  for (const group of groups) {
    const groupSelections = [...(next[group.key] ?? [])];

    if (group.selectionType === OptionGroupSelectionType.SINGLE && groupSelections.length > 1) {
      next[group.key] = groupSelections.slice(0, 1);
    }

    if (typeof group.max === 'number' && groupSelections.length > group.max) {
      next[group.key] = groupSelections.slice(0, group.max);
      errors.push(`Group ${group.key} exceeds maximum selections (${group.max}).`);
    }

    if (typeof group.min === 'number' && groupSelections.length < group.min) {
      errors.push(`Group ${group.key} requires at least ${group.min} selection(s).`);
    }
  }

  return { selections: next, errors };
};

export const evaluateConfiguration = (params: {
  product: BaseProduct;
  selections: SelectionInput;
  catalog: { groups: CatalogOptionGroup[]; options: CatalogOption[] };
  rules: RuleDefinition[];
}): EvaluationResult => {
  const { product, selections, catalog, rules } = params;
  const optionMap = new Map(catalog.options.map((option) => [option.key, option]));
  const groupMap = new Map(catalog.groups.map((group) => [group.key, group]));
  const groupKeys = new Set(catalog.groups.map((group) => group.key));

  let resolvedSelections = normalizeSelections(catalog.groups, selections);

  const applicableRules = rules
    .filter((rule) => rule.isActive !== false)
    .filter((rule) => {
      if (rule.scope === RuleScope.GLOBAL) {
        return true;
      }
      if (rule.scope === RuleScope.PRODUCT_TYPE) {
        return rule.scopeRef === product.type;
      }
      if (rule.scope === RuleScope.PRODUCT) {
        return rule.scopeRef === product.id;
      }
      if (rule.scope === RuleScope.GROUP) {
        return rule.scopeRef ? groupKeys.has(rule.scopeRef) : false;
      }
      return false;
    })
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  const disabledOptions: Record<string, { reason: string }> = {};
  const hiddenOptions: Record<string, { reason: string }> = {};
  const requirements: Array<{ optionKey: string; reason: string }> = [];
  const requirementSet = new Set<string>();
  const priceOverrides = new Map<string, number>();

  const applyAutoSelect = (optionKey: string): boolean => {
    const option = optionMap.get(optionKey);
    if (!option) {
      return false;
    }
    const group = groupMap.get(option.groupKey);
    if (!group) {
      return false;
    }
    const current = resolvedSelections[option.groupKey] ?? [];
    if (current.includes(optionKey)) {
      return false;
    }
    if (group.selectionType === OptionGroupSelectionType.SINGLE) {
      resolvedSelections[option.groupKey] = [optionKey];
    } else if (group.selectionType === OptionGroupSelectionType.BOOLEAN) {
      resolvedSelections[option.groupKey] = [BOOLEAN_TRUE_SENTINEL];
    } else {
      resolvedSelections[option.groupKey] = [...current, optionKey];
    }
    return true;
  };

  const applyAutoRemove = (optionKey: string): boolean => {
    const option = optionMap.get(optionKey);
    if (!option) {
      return false;
    }
    const current = resolvedSelections[option.groupKey] ?? [];
    if (!current.includes(optionKey)) {
      return false;
    }
    resolvedSelections[option.groupKey] = current.filter((key) => key !== optionKey);
    return true;
  };

  const applyDisable = (optionKey: string, reason: string) => {
    disabledOptions[optionKey] = { reason };
    applyAutoRemove(optionKey);
  };

  const applyHide = (optionKey: string, reason: string) => {
    hiddenOptions[optionKey] = { reason };
    applyAutoRemove(optionKey);
  };

  for (let iteration = 0; iteration < 5; iteration += 1) {
    let changed = false;

    for (const rule of applicableRules) {
      const when = rule.when ?? [];
      const then = rule.then ?? [];
      const allConditionsMet = when.length === 0 || when.every((condition) => isConditionMet(condition, resolvedSelections, optionMap));
      if (!allConditionsMet) {
        continue;
      }

      for (const action of then) {
        const type = action.type as string | undefined;
        const optionKey = action.optionKey as string | undefined;
        const reason = (action.reason as string | undefined) ?? rule.key;

        if (type === 'autoSelect' && optionKey) {
          if (applyAutoSelect(optionKey)) {
            changed = true;
          }
          if (typeof action.priceOverrideExcl === 'number') {
            priceOverrides.set(optionKey, action.priceOverrideExcl);
          }
          continue;
        }

        if (type === 'autoRemove' && optionKey) {
          if (applyAutoRemove(optionKey)) {
            changed = true;
          }
          continue;
        }

        if (type === 'requireOption' && optionKey) {
          if (!getSelectedOptionKeys(resolvedSelections, optionMap).has(optionKey)) {
            if (!requirementSet.has(optionKey)) {
              requirements.push({ optionKey, reason });
              requirementSet.add(optionKey);
            }
          }
          continue;
        }

        if (type === 'disableOption' && optionKey) {
          applyDisable(optionKey, reason);
          continue;
        }

        if (type === 'disableByPrefix') {
          const prefix = action.prefix as string | undefined;
          if (!prefix) {
            continue;
          }
          for (const key of optionMap.keys()) {
            if (key.startsWith(prefix)) {
              applyDisable(key, reason);
            }
          }
          continue;
        }

        if (type === 'hideOption' && optionKey) {
          applyHide(optionKey, reason);
          continue;
        }

        if (type === 'setPriceOverride' && optionKey) {
          const override = action.priceExcl as number | undefined;
          if (typeof override === 'number') {
            priceOverrides.set(optionKey, override);
          }
          continue;
        }
      }
    }

    if (!changed) {
      break;
    }
  }

  const cardinalityResult = enforceCardinality(catalog.groups, resolvedSelections);
  resolvedSelections = cardinalityResult.selections;

  const validationErrors = [...cardinalityResult.errors];
  for (const requirement of requirements) {
    validationErrors.push(`Required option missing: ${requirement.optionKey}.`);
  }

  const breakdown: EvaluationResult['pricing']['breakdown'] = [];
  const baseVatRate = product.vatRate ?? 0;
  const basePriceExcl = product.basePriceExcl ?? 0;
  const basePriceIncl = basePriceExcl * (1 + baseVatRate);
  breakdown.push({
    type: 'base',
    key: product.id,
    name: 'Base product',
    priceExcl: basePriceExcl,
    vatRate: baseVatRate,
    priceIncl: basePriceIncl,
  });

  let totalExcl = basePriceExcl;
  let totalIncl = basePriceIncl;

  const selectedOptionKeys = getSelectedOptionKeys(resolvedSelections, optionMap);
  for (const optionKey of selectedOptionKeys) {
    const option = optionMap.get(optionKey);
    if (!option) {
      continue;
    }
    const priceExcl = priceOverrides.get(optionKey) ?? option.priceExcl ?? 0;
    const vatRate = option.vatRate ?? baseVatRate;
    const priceIncl = priceExcl * (1 + vatRate);
    const included = priceOverrides.has(optionKey) && priceExcl === 0;

    breakdown.push({
      type: 'option',
      key: optionKey,
      name: option.name,
      priceExcl,
      vatRate,
      priceIncl,
      included: included || undefined,
    });

    totalExcl += priceExcl;
    totalIncl += priceIncl;
  }

  return {
    resolvedSelections,
    disabledOptions,
    hiddenOptions,
    requirements,
    validationErrors,
    pricing: {
      totalExcl,
      totalIncl,
      vatTotal: totalIncl - totalExcl,
      breakdown,
    },
  };
};
