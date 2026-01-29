import { SectionContext, SectionResult } from './section.types';

const emptyResult = (selections: SectionContext['selections']): SectionResult => ({
  selections,
  requirements: [],
  disabledOptions: {},
  hiddenOptions: {},
  validationErrors: [],
  priceOverrides: {},
});

const ensureArray = (value?: string[] | null) => (Array.isArray(value) ? value.filter(Boolean) : []);

const clampToSingle = (value?: string | null) => (value ? value : null);

const getOption = (options: SectionContext['options'], key?: string | null) =>
  key ? options.find((option) => option.key === key) : undefined;

const filterOptionsByGroup = (options: SectionContext['options'], groupKey: string) =>
  options.filter((option) => option.groupKey === groupKey);

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

const clampQty = (qty: number, min: number, max: number, step: number) => {
  const snapped = step > 1 ? Math.round(qty / step) * step : qty;
  return Math.max(min, Math.min(max, snapped));
};

export const baseSection: (context: SectionContext) => SectionResult = (context) => {
  const selections = {
    ...context.selections,
    baseProductId: context.selections.baseProductId ?? context.product.id,
  };
  return emptyResult(selections);
};

export const heaterInstallationSection = (context: SectionContext): SectionResult => {
  const selections = { ...context.selections };
  const option = getOption(context.options, selections.heaterInstallation?.optionId ?? null);
  selections.heaterInstallation = {
    optionId: option?.key ?? null,
  };
  return emptyResult(selections);
};

export const coolerSection = (context: SectionContext): SectionResult => {
  const selections = { ...context.selections };
  const option = getOption(context.options, selections.cooler?.optionId ?? null);
  selections.cooler = {
    optionId: option?.key ?? null,
  };
  return emptyResult(selections);
};

export const heatingSection = (context: SectionContext): SectionResult => {
  const selections = { ...context.selections };
  const heatingSelection = selections.heating ?? {};
  const heatingOptions = filterOptionsByGroup(context.options, 'HEATING_BASE');
  const heatingTypes = context.product.heatingTypes;
  const allowedTags = Array.isArray(heatingTypes)
    ? heatingTypes.map((type) => String(type).toUpperCase())
    : null;
  const availableHeatingOptions =
    !allowedTags || allowedTags.length === 0
      ? []
      : heatingOptions.filter((option) => option.tags?.some((tag) => allowedTags.includes(tag)));

  const selectedOption = availableHeatingOptions.find((option) => option.key === heatingSelection.optionId) ?? null;

  const extras = ensureArray(heatingSelection.extras);
  const heatingExtras = [
    ...filterOptionsByGroup(context.options, 'HEATER_ADDONS_INTERNAL'),
    ...filterOptionsByGroup(context.options, 'HEATER_ADDONS_EXTERNAL'),
  ];
  const extraOptionKeys = Array.isArray(selectedOption?.attributes?.extraOptionKeys)
    ? (selectedOption?.attributes?.extraOptionKeys as string[])
    : null;
  const allowedExtras =
    selectedOption && extraOptionKeys
      ? heatingExtras.filter((option) => extraOptionKeys.includes(option.key))
      : [];
  const validExtras = extras.filter((key) => allowedExtras.some((option) => option.key === key));

  const nextExtras = selectedOption ? validExtras : [];
  const disabledOptions: Record<string, { reason: string }> = {};
  if (!allowedTags) {
    heatingOptions.forEach((option) => {
      disabledOptions[option.key] = { reason: 'Verwarming niet van toepassing' };
    });
  } else if (!selectedOption) {
    heatingExtras.forEach((option) => {
      disabledOptions[option.key] = { reason: 'Selecteer eerst een verwarmingssysteem' };
    });
  }

  selections.heating = {
    optionId: clampToSingle(selectedOption?.key ?? null),
    extras: nextExtras,
  };

  return { ...emptyResult(selections), disabledOptions };
};

export const materialsSection = (context: SectionContext): SectionResult => {
  const selections = { ...context.selections };
  const materialSelection = selections.materials ?? {};
  const internal = context.options.find(
    (option) => option.groupKey === 'MATERIALS_INTERNAL_BASE' && option.key === materialSelection.internalMaterialId,
  );
  const external = context.options.find(
    (option) => option.groupKey === 'MATERIALS_EXTERNAL_BASE' && option.key === materialSelection.externalMaterialId,
  );

  selections.materials = {
    internalMaterialId: internal?.key ?? null,
    externalMaterialId: external?.key ?? null,
  };

  return emptyResult(selections);
};

export const insulationSection = (context: SectionContext): SectionResult => {
  const selections = { ...context.selections };
  const option = getOption(context.options, selections.insulation?.optionId ?? null);
  selections.insulation = {
    optionId: option?.key ?? null,
  };
  return emptyResult(selections);
};

export const spaSection = (context: SectionContext): SectionResult => {
  const selections = { ...context.selections };
  const spaSelection = selections.spa ?? {};
  const systemOption = context.options.find(
    (option) => option.groupKey === 'SPASYSTEM_BASE' && option.key === spaSelection.systemId,
  );
  const ledsInput = normalizeLedQuantities(spaSelection.leds);
  const leds: Record<string, number> = {};
  Object.entries(ledsInput).forEach(([key, qty]) => {
    const option = context.options.find((item) => item.key === key);
    if (option?.groupKey !== 'LEDS_BASE') {
      return;
    }
    const rule = option.quantityRule ?? {};
    const min = typeof rule.min === 'number' ? rule.min : 0;
    const max = typeof rule.max === 'number' ? rule.max : 999;
    const step = typeof rule.step === 'number' ? rule.step : 1;
    const clamped = clampQty(qty, min, max, step);
    if (clamped > 0) {
      leds[key] = clamped;
    }
  });

  selections.spa = {
    systemId: systemOption?.key ?? null,
    leds,
  };
  return emptyResult(selections);
};

export const lidSection = (context: SectionContext): SectionResult => {
  const selections = { ...context.selections };
  const option = getOption(context.options, selections.lid?.optionId ?? null);
  selections.lid = {
    optionId: option?.key ?? null,
  };
  return emptyResult(selections);
};

export const filtrationSection = (context: SectionContext): SectionResult => {
  const selections = { ...context.selections };
  const filtrationSelection = selections.filtration ?? {};

  // Base options: connections + filter/no-filter live here
  const baseOptions = filterOptionsByGroup(context.options, 'FILTRATION_BASE');

  // Addons: UV lives here
  const addonOptions = filterOptionsByGroup(context.options, 'FILTRATION_ADDONS');

  const connections = ensureArray(filtrationSelection.connections).filter((key) => {
    const option = getOption(baseOptions, key);
    return option?.attributes?.type === 'CONNECTION' || option?.tags?.includes('CONNECTION');
  });

  const filterOption = getOption(baseOptions, filtrationSelection.filterId ?? null);

  // ✅ validate UV against ADDON options (not base)
  const uv = ensureArray(filtrationSelection.uv).filter((key) => {
    const option = getOption(addonOptions, key);
    return option?.attributes?.type === 'UV' || option?.tags?.includes('UV');
  });

  // ✅ build next filtration by merging existing filtrationSelection (NOT selections)
  const nextFiltration = {
    ...filtrationSelection,
    connections,
    filterId: filterOption?.key ?? null,
    uv,
    filterBoxId: filterOption?.key === 'SAND-FILTER' ? filtrationSelection.filterBoxId ?? null : null,
  };

  // ✅ optional: clear UV when no filter or explicit NO-FILTER selected
  const hasFilter = !!nextFiltration.filterId && nextFiltration.filterId !== 'NO-FILTER';
  if (!hasFilter) {
    nextFiltration.uv = [];
  }

  selections.filtration = nextFiltration;

  return {
    selections,
    requirements: [],
    disabledOptions: {},
    hiddenOptions: {},
    validationErrors: [],
    priceOverrides: {},
  };
};


export const filterBoxSection = (context: SectionContext): SectionResult => {
  const selections = { ...context.selections };
  const filtrationSelection = selections.filtration ?? {};
  const option = getOption(context.options, filtrationSelection.filterBoxId ?? null);
  selections.filtration = {
    ...filtrationSelection,
    filterBoxId: option?.key ?? null,
  };
  return emptyResult(selections);
};

export const stairsSection = (context: SectionContext): SectionResult => {
  const selections = { ...context.selections };
  const option = getOption(context.options, selections.stairs?.optionId ?? null);
  selections.stairs = {
    optionId: option?.key ?? null,
  };
  return emptyResult(selections);
};

export const controlUnitSection = (context: SectionContext): SectionResult => {
  const selections = { ...context.selections };
  const option = getOption(context.options, selections.controlUnit?.optionId ?? null);
  selections.controlUnit = {
    optionId: option?.key ?? null,
  };
  return emptyResult(selections);
};

export const extrasSection = (context: SectionContext): SectionResult => {
  const selections = { ...context.selections };
  const extras = ensureArray(selections.extras?.optionIds).filter((key) => {
    const option = getOption(context.options, key);
    return option?.groupKey === 'EXTRAS_BASE';
  });
  selections.extras = { optionIds: extras };
  return emptyResult(selections);
};
