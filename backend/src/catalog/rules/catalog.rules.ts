// src/catalog/rules/catalog.rules.ts
import { HeaterInstallationType, OptionGroupKey } from '../catalog-option-seed.types';
import { CatalogOption } from '../sections/section.types';
import { Rule, RuleEffect } from './rule.types';

const CONNECTION_KEYS = ['SF-CONNECTIONS', 'STAINLESS-SF-CONNECTIONS'];
const FILTER_KEYS = ['SAND-FILTER'];

// =========================
// FILTRATION helpers
// =========================
const getFiltrationType = (option: CatalogOption | undefined | null) =>
  String(option?.attributes?.type ?? '').toUpperCase();

const getFiltrationBaseOptions = (options: CatalogOption[]) =>
  options.filter((o) => o.groupKey === OptionGroupKey.FILTRATION_BASE);

const getSelectedFiltrationFilterKey = (selected: Set<string>, options: CatalogOption[]) => {
  const base = getFiltrationBaseOptions(options);
  const selectedBase = base.filter((o) => selected.has(o.key));
  const filter = selectedBase.find((o) => getFiltrationType(o) === 'FILTER' && o.key !== "NONE");
  return filter?.key ?? null;
};

const hasAnyFiltrationFilterSelected = (selected: Set<string>, options: CatalogOption[]) =>
  Boolean(getSelectedFiltrationFilterKey(selected, options));

// =========================
// FILTER BOX helpers
// =========================
const getFilterBoxOptions = (options: CatalogOption[]) =>
  options.filter((option) => option.groupKey === OptionGroupKey.FILTRATION_BOX);

const hasFilterBoxSelected = (selected: Set<string>, options: CatalogOption[]) =>
  getFilterBoxOptions(options).some((option) => selected.has(option.key));

// =========================
// HEATER helpers
// =========================
const getHeaterInstallType = (option: CatalogOption) =>
  String(option.attributes?.type ?? '').toUpperCase();

// =========================
// MATERIALS helpers (WPC pricing differs by shape)
// =========================
const WPC_SQUARE_KEY = 'EXTERNAL-WPC'; // €499, only for square (includes corners requirement)
const WPC_HKC_KEY = 'EXTERNAL-WPC-HKC'; // €395, for non-square (round etc.)

const getExternalMaterialKey = (selections: any) =>
  selections.materials?.externalMaterialId ?? null;

// prefer explicit attrs, fall back to productKey/model key contains SQUARE, last resort isSquare flag
const isSquareProduct = (product: any) => {
  const shape = String(product?.attributes?.shape ?? '').toUpperCase();
  if (shape.includes('SQUARE')) return true;

  const productKey = String(product?.attributes?.productKey ?? product?.slug ?? '').toUpperCase();
  if (productKey.includes('SQUARE')) return true;

  const modelKey = String(product?.key ?? product?.modelKey ?? '').toUpperCase();
  if (modelKey.includes('SQUARE')) return true;

  return product?.attributes?.isSquare === true;
};

// =========================
// SPA constants (TODO: move to DB)
// =========================
const SPA_KEYS = [
  'CIRCULATION-PUMP',
  'HYDRO-MASSAGE-8',
  'HYDRO-MASSAGE-12',
  'HYDRO-MASSAGE-16',
  'AIR-BUBBLE-12',
];

const SPA_INCLUDES_CIRCULATION_KEYS = [
  'HYDRO-MASSAGE-8',
  'HYDRO-MASSAGE-12',
  'HYDRO-MASSAGE-16',
  'AIR-BUBBLE-12',
];

export const catalogRules = (): Rule[] => [
  // =========================
  // HEATER INSTALLATION RULES
  // =========================
  {
    id: 'heater-installation.product-constraints',
    when: () => true,
    then: ({ product, options }) => {
      const allowsIntegrated = product.attributes?.allowsIntegratedHeater !== false;
      const allowsExternal = product.attributes?.allowsExternalHeater !== false;

      if (allowsIntegrated && allowsExternal) {
        return [];
      }

      return options
        .filter((option) => option.groupKey === OptionGroupKey.HEATER_INSTALLATION)
        .filter((option) => {
          const installType = getHeaterInstallType(option);
          if (!installType) return false;

          if (!allowsIntegrated && installType === 'INTEGRATED') return true;
          if (!allowsExternal && installType === 'EXTERNAL') return true;

          return false;
        })
        .map((option) => ({
          type: 'HIDE' as const,
          key: option.key,
          reason: 'Niet beschikbaar voor dit model.',
        }));
    },
  },
  {
    id: 'heating.installation-restrict-heaters',
    when: ({ selections }) => Boolean(selections.heaterInstallation?.optionId),
    then: ({ selections, options, getOption }) => {
      const installKey = selections.heaterInstallation?.optionId ?? null;
      if (!installKey) return [];

      const installOption = getOption(installKey);
      const installType = String(installOption?.attributes?.type ?? '').toUpperCase();
      if (!installType) return [];

      const forbiddenPlacement =
        installType === 'INTEGRATED'
          ? HeaterInstallationType.EXTERNAL
          : HeaterInstallationType.INTEGRATED;

      return options
        .filter((option) => option.groupKey === OptionGroupKey.HEATING_BASE)
        .filter((option) => option.attributes?.placement === forbiddenPlacement)
        .map((option) => ({
          type: 'HIDE' as const,
          key: option.key,
          reason:
            installType === 'INTEGRATED'
              ? 'Alleen interne kachels passen bij geïntegreerde installatie.'
              : 'Alleen externe kachels passen bij externe installatie.',
        }));
    },
  },

  // =========================
  // MATERIALS RULES (WPC by shape / pricing)
  // =========================
  {
    id: 'materials.external.wpc.variant-visibility',
    when: () => true,
    then: ({ product }) => {
      const square = isSquareProduct(product);

      if (square) {
        return [
          {
            type: 'HIDE' as const,
            key: WPC_HKC_KEY,
            reason: 'Gebruik WPC (incl. RVS hoeken) bij vierkante hottubs.',
          },
        ];
      }

      return [
        {
          type: 'HIDE' as const,
          key: WPC_SQUARE_KEY,
          reason: 'Alleen beschikbaar bij vierkante hottubs.',
        },
      ];
    },
  },
  {
    id: 'materials.external.wpc.variant-auto-switch',
    when: ({ selections }) => Boolean(getExternalMaterialKey(selections)),
    then: ({ product, selections }) => {
      const square = isSquareProduct(product);
      const selected = getExternalMaterialKey(selections);

      if (square && selected === WPC_HKC_KEY) {
        return [
          {
            type: 'DEFAULT_SELECT',
            key: WPC_SQUARE_KEY,
            reason: 'WPC bij vierkante hottubs vereist RVS hoeken (andere prijs).',
            priority: 100,
          },
          {
            type: 'FORBID',
            key: WPC_HKC_KEY,
            reason: 'Niet beschikbaar bij vierkante hottubs.',
          },
        ];
      }

      if (!square && selected === WPC_SQUARE_KEY) {
        return [
          {
            type: 'DEFAULT_SELECT',
            key: WPC_HKC_KEY,
            reason: 'WPC (incl. RVS hoeken) is alleen voor vierkante hottubs.',
            priority: 100,
          },
          {
            type: 'FORBID',
            key: WPC_SQUARE_KEY,
            reason: 'Alleen beschikbaar bij vierkante hottubs.',
          },
        ];
      }

      return [];
    },
  },
  {
    id: 'materials.external.wpc.square-warning',
    when: ({ selections, product }) =>
      getExternalMaterialKey(selections) === WPC_SQUARE_KEY && isSquareProduct(product),
    then: () => [
      {
        type: 'WARNING' as const,
        message: 'WPC wordt geleverd i.c.m. RVS hoekafwerking (verplicht bij WPC op vierkante modellen).',
      },
    ],
  },

  // =========================
  // SPA RULES (circulation required unless spa includes it)
  // =========================
  {
    id: 'spa.require-at-least-circulation',
    when: () => true,
    then: ({ selections, options }) => {
      const spaOptions = options.filter((o) => o.groupKey === OptionGroupKey.SPASYSTEM_BASE);
      if (spaOptions.length === 0) return [];

      const selectedSpaKey = selections.spa?.systemId ?? null;

      if (selectedSpaKey && SPA_KEYS.includes(selectedSpaKey)) {
        return [];
      }

      return [
        {
          type: 'DEFAULT_SELECT',
          key: 'CIRCULATION-PUMP',
          reason: 'Een circulatiepomp is minimaal vereist (of kies een hydromassage/luchtbel systeem).',
          priority: 50,
        },
        {
          type: 'REQUIRE',
          key: 'CIRCULATION-PUMP',
          reason: 'Kies minimaal een circulatiepomp, hydromassage of luchtbel systeem.',
        },
      ];
    },
  },
  {
    id: 'spa.info-includes-circulation',
    when: ({ selections }) => SPA_INCLUDES_CIRCULATION_KEYS.includes(selections.spa?.systemId ?? ''),
    then: ({ selections }) => [
      {
        type: 'INFO',
        key: selections.spa!.systemId!,
        reason: 'Circulatiepomp is inbegrepen bij het gekozen spa-systeem.',
      },
    ],
  },

  // =========================
  // FILTRATION RULES
  // =========================
  {
    id: 'filtration.require-connections-if-filter',
    when: ({ selected, options }) => hasAnyFiltrationFilterSelected(selected, options),
    then: ({ selected }) => {
      const hasConnection = CONNECTION_KEYS.some((key) => selected.has(key));
      if (hasConnection) return [];
  
      return [
        {
          type: 'DEFAULT_SELECT',
          key: 'SF-CONNECTIONS',
          reason: 'Verbindingen zijn nodig bij een filter.',
          priority: 10,
        },
        {
          type: 'REQUIRE',
          key: 'SF-CONNECTIONS',
          reason: 'Selecteer SF-verbindingen of RVS-verbindingen.',
        },
      ];
    },
  },
  
  {
    id: 'filtration.warn-no-filter-selected',
    when: ({ selected }) => selected.has('NO-FILTER-SELECTED'),
    then: () => [
      {
        type: 'WARNING' as const,
        message:
          'Geen filter gekozen. Je hebt dan eigen filtratie nodig en er is geen plek voor een zandfilter.',
      },
    ],
  },

  {
    // Still safe even if UI enforces SINGLE: this prevents invalid data from being persisted.
    id: 'filtration.disallow-both-connections',
    when: ({ has }) => has('SF-CONNECTIONS') && has('STAINLESS-SF-CONNECTIONS'),
    then: () => [
      {
        type: 'FORBID',
        key: 'SF-CONNECTIONS',
        reason: 'Kies één type verbindingen (standaard of RVS).',
      },
    ],
  },
  {
    id: 'filtration.recommend-uv',
    when: ({ has }) => has('SAND-FILTER'),
    then: () => [
      {
        type: 'RECOMMEND',
        key: 'UV-LAMP',
        reason: 'UV-lamp is een aanbevolen aanvulling bij zandfilter.',
        strength: 'med',
      },
    ],
  },

  // =========================
  // FILTER BOX VISIBILITY (✅ what you mean)
  // - Hide filter boxes unless a FILTRATION_BASE option of type FILTER is selected.
  // =========================
  {
    id: 'filtration-box.hide-without-selected-filter-type',
    when: ({ selected, options }) => !hasAnyFiltrationFilterSelected(selected, options),
    then: ({ options }) =>
      getFilterBoxOptions(options).map((option) => ({
        type: 'HIDE' as const,
        key: option.key,
        reason: 'Alleen beschikbaar wanneer een filter gekozen is.',
      })),
  },

  // =========================
  // STAIRS RULES (filter under stairs)
  // =========================
  {
    id: 'stairs.hide-filter-under-stairs-remove-box',
    when: ({ answers, selected, options }) =>
      answers.hideFilterUnderStairs === true && hasAnyFiltrationFilterSelected(selected, options),
    then: ({ options }) =>
      getFilterBoxOptions(options).map((option) => ({
        type: 'FORBID' as const,
        key: option.key,
        reason: 'Filterbox niet nodig wanneer de filter onder de trap komt.',
      })),
  },
  
  {
    id: 'stairs.hide-filter-under-stairs-validate',
    when: ({ answers, selected, options }) =>
      answers.hideFilterUnderStairs === true && hasAnyFiltrationFilterSelected(selected, options),
    then: ({ selections, getOption }) => {
      const stairsKey = selections.stairs?.optionId ?? null;
      if (!stairsKey) return [];
  
      const stairs = getOption(stairsKey);
  
      // ✅ renamed attribute: not sand-specific anymore
      const coversExternalFilter = Boolean(stairs?.attributes?.coversExternalFilter);
      if (coversExternalFilter) return [];
  
      return [
        {
          type: 'FORBID',
          key: stairsKey,
          reason: 'Deze trap kan de (externe) filter niet afdekken.',
        },
      ];
    },
  },

  {
    id: 'stairs.default-filter-box-when-visible',
    when: ({ answers, selected, options }) =>
      answers.hideFilterUnderStairs === false && hasAnyFiltrationFilterSelected(selected, options),
    then: ({ selected, options }) =>
      hasFilterBoxSelected(selected, options)
        ? []
        : [
            {
              type: 'DEFAULT_SELECT',
              key: 'SAND-FILTER-BOX-SPRUCE',
              reason: 'Filterbox toegevoegd zodat de filter apart kan staan.',
              priority: 5,
            },
          ],
  },

  // =========================
  // UPSELL RULES
  // =========================
  {
    id: 'upsell.black-plate-black-bands',
    when: ({ has }) => has('BLACK-HEATER-PLATE'),
    then: () => [
      {
        type: 'RECOMMEND',
        key: 'STEEL-BANDS-BLACK',
        reason: 'Past mooi bij de zwarte kachelplaat.',
        strength: 'med',
      },
    ],
  },
  {
    id: 'upsell.hide-under-stairs-snack-deck',
    when: ({ answers, has }) => answers.hideFilterUnderStairs === true && has('SAND-FILTER'),
    then: () => [
      {
        type: 'RECOMMEND',
        key: 'SNACK-DECK',
        reason: 'Handig als extra plateau wanneer de filter onder de trap zit.',
        strength: 'low',
      },
    ],
  },

  // =========================
  // HEATING -> SPA interaction
  // =========================
  {
    id: 'heating.include-circulation-pump',
    when: ({ selections, getOption, has }) => {
      const heatingKey = selections.heating?.optionId ?? null;
      const heatingOption = heatingKey ? getOption(heatingKey) : undefined;

      const heatingTags = (heatingOption?.tags ?? []).map((tag) => String(tag).toUpperCase());
      const isElectric = heatingTags.includes('ELECTRIC') || heatingTags.includes('HYBRID');

      const hasSpa =
        has('HYDRO-MASSAGE-8') ||
        has('HYDRO-MASSAGE-12') ||
        has('HYDRO-MASSAGE-16') ||
        has('AIR-BUBBLE-12');

      return Boolean(heatingKey && isElectric && !hasSpa);
    },
    then: () => [
      {
        type: 'DEFAULT_SELECT',
        key: 'CIRCULATION-PUMP',
        reason: 'Circulatiepomp is vereist bij elektrisch verwarmen zonder hydromassage.',
        priority: 20,
      },
      {
        type: 'PRICE_OVERRIDE',
        key: 'CIRCULATION-PUMP',
        priceExcl: 0,
        reason: 'Circulatiepomp inbegrepen.',
      },
    ],
  },

  // =========================
  // EXTRAS constraints
  // =========================
  {
    id: 'extras.disable-cupholders-when-filter-box',
    when: ({ selected, options }) => hasFilterBoxSelected(selected, options),
    then: ({ options }) =>
      options
        .filter(
          (option) =>
            option.groupKey === OptionGroupKey.EXTRAS_BASE && option.key.startsWith('CUPHOLDER'),
        )
        .map((option) => ({
          type: 'FORBID' as const,
          key: option.key,
          reason: 'Niet beschikbaar met zandfilterbox.',
        })),
  },

  // =========================
  // UV visibility + connections pricing
  // =========================
  {
    id: 'filtration.hide-uv-without-filter',
    when: ({ selections }) => !selections.filtration?.filterId,
    then: () => [
      {
        type: 'HIDE',
        key: 'UV-LAMP',
        reason: 'Alleen relevant wanneer een filter gekozen is.',
      },
    ],
  },
  {
    id: 'filtration.include-connections-with-sand-filter',
    when: ({ has }) => has('SAND-FILTER'),
    then: ({ selected }) => {
      const effects: RuleEffect[] = [];

      if (selected.has('SF-CONNECTIONS')) {
        effects.push({
          type: 'PRICE_OVERRIDE' as const,
          key: 'SF-CONNECTIONS',
          priceExcl: 0,
          reason: 'SF-verbindingen inbegrepen bij zandfilter.',
        });
      }

      if (selected.has('STAINLESS-SF-CONNECTIONS')) {
        effects.push({
          type: 'PRICE_OVERRIDE' as const,
          key: 'STAINLESS-SF-CONNECTIONS',
          priceExcl: 53.71,
          reason: 'Meerprijs RVS t.o.v. standaard SF-verbindingen.',
        });
      }

      return effects;
    },
  },
];
