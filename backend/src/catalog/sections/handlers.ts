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
  const heatingExtras = filterOptionsByGroup(context.options, 'EXTRAS_BASE').filter((option) =>
    option.tags?.includes('HEATING-EXTRA'),
  );
  const extraOptionKeys = Array.isArray(selectedOption?.attributes?.extraOptionKeys)
    ? (selectedOption?.attributes?.extraOptionKeys as string[])
    : [];
  const allowedExtras =
    selectedOption && extraOptionKeys.length > 0
      ? heatingExtras.filter((option) => extraOptionKeys.includes(option.key))
      : selectedOption
        ? heatingExtras
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
    (option) => option.groupKey === 'MATERIALS-INTERNAL_BASE' && option.key === materialSelection.internalMaterialId,
  );
  const external = context.options.find(
    (option) => option.groupKey === 'MATERIALS-EXTERNAL_BASE' && option.key === materialSelection.externalMaterialId,
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
  const leds = ensureArray(spaSelection.leds).filter((key) => {
    const option = context.options.find((item) => item.key === key);
    return option?.groupKey === 'LEDS_BASE';
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
  const filtrationOptions = filterOptionsByGroup(context.options, 'FILTRATION_BASE');

  const connections = ensureArray(filtrationSelection.connections).filter((key) => {
    const option = getOption(filtrationOptions, key);
    return option?.attributes?.type === 'CONNECTION' || option?.tags?.includes('CONNECTION');
  });

  const filterOption = getOption(filtrationOptions, filtrationSelection.filterId ?? null);
  const uv = ensureArray(filtrationSelection.uv).filter((key) => {
    const option = getOption(filtrationOptions, key);
    return option?.attributes?.type === 'UV' || option?.tags?.includes('UV');
  });

  selections.filtration = {
    connections,
    filterId: filterOption?.key ?? null,
    uv,
    sandFilterBox: filterOption?.key === 'SAND-FILTER' ? filtrationSelection.sandFilterBox ?? null : null,
  };

  return emptyResult(selections);
};

export const sandFilterSection = (context: SectionContext): SectionResult => {
  const selections = { ...context.selections };
  const filtrationSelection = selections.filtration ?? {};
  const option = getOption(context.options, filtrationSelection.sandFilterBox ?? null);
  selections.filtration = {
    ...filtrationSelection,
    sandFilterBox: option?.key ?? null,
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
