import { OptionGroupKey } from '../../modules/catalog/types/catalog-option-seed.types';
import { CatalogOption } from '../sections/section.types';
import { Rule } from './rule.types';

const CONNECTION_KEYS = ['SF-CONNECTIONS', 'STAINLESS-SF-CONNECTIONS'];
const FILTER_KEYS = ['SAND-FILTER', 'COTTON-BALLS'];

export const catalogRules = (): Rule[] => [
  {
    id: 'heating.installation-restrict-heaters',
    when: ({ selections }) => Boolean(selections.heaterInstallation?.optionId),
    then: ({ selections, options, getOption }) => {
      const installKey = selections.heaterInstallation?.optionId ?? null;
      if (!installKey) {
        return [];
      }
      const installOption = getOption(installKey);
      const installType = String(installOption?.attributes?.type ?? '').toUpperCase();
      if (!installType) {
        return [];
      }
      const forbiddenPlacement = installType === 'INTEGRATED' ? 'extern' : 'intern';
      return options
        .filter((option) => option.groupKey === OptionGroupKey.HEATING_BASE)
        .filter((option) => option.attributes?.placement === forbiddenPlacement)
        .map((option) => ({
          type: 'FORBID' as const,
          key: option.key,
          reason:
            installType === 'INTEGRATED'
              ? 'Alleen interne kachels passen bij geïntegreerde installatie.'
              : 'Alleen externe kachels passen bij externe installatie.',
        }));
    },
  },
  {
    id: 'filtration.require-connections-if-filter',
    when: ({ has }) => FILTER_KEYS.some((key) => has(key)),
    then: ({ selected }) => {
      const hasConnection = CONNECTION_KEYS.some((key) => selected.has(key));
      if (hasConnection) {
        return [];
      }
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
    id: 'filtration.warn-no-filter',
    when: ({ has }) => !FILTER_KEYS.some((key) => has(key)),
    then: () => [
      {
        type: 'WARNING',
        message:
          'Geen filter gekozen. Je hebt dan eigen filtratie nodig en er is geen plek voor een zandfilter.',
      },
    ],
  },
  {
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
  {
    id: 'sandfilter.hide-box-without-sand-filter',
    when: ({ has }) => !has('SAND-FILTER'),
    then: () => [
      {
        type: 'HIDE',
        key: 'SAND-FILTER-BOX',
        reason: 'Alleen beschikbaar bij zandfilter.',
      },
    ],
  },
  {
    id: 'stairs.hide-filter-under-stairs-remove-box',
    when: ({ answers, has }) => answers.hideFilterUnderStairs === true && has('SAND-FILTER'),
    then: () => [
      {
        type: 'FORBID',
        key: 'SAND-FILTER-BOX',
        reason: 'Filterbox niet nodig wanneer de filter onder de trap komt.',
      },
    ],
  },
  {
    id: 'stairs.hide-filter-under-stairs-validate',
    when: ({ answers, has }) => answers.hideFilterUnderStairs === true && has('SAND-FILTER'),
    then: ({ selections, getOption }) => {
      const stairsKey = selections.stairs?.optionId ?? null;
      if (!stairsKey) {
        return [];
      }
      const stairs = getOption(stairsKey);
      const coversSandFilter = Boolean(stairs?.attributes?.coversSandFilter);
      if (coversSandFilter) {
        return [];
      }
      return [
        {
          type: 'FORBID',
          key: stairsKey,
          reason: 'Deze trap kan de filter niet afdekken.',
        },
      ];
    },
  },
  {
    id: 'stairs.default-filter-box-when-visible',
    when: ({ answers, has }) => answers.hideFilterUnderStairs === false && has('SAND-FILTER'),
    then: ({ has }) =>
      has('SAND-FILTER-BOX')
        ? []
        : [
            {
              type: 'DEFAULT_SELECT',
              key: 'SAND-FILTER-BOX',
              reason: 'Filterbox toegevoegd zodat de filter apart kan staan.',
              priority: 5,
            },
          ],
  },
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
  {
    id: 'heating.include-circulation-pump',
    when: ({ selections, getOption, has }) => {
      const heatingKey = selections.heating?.optionId ?? null;
      const heatingOption = heatingKey ? getOption(heatingKey) : undefined;
      const heatingTags = (heatingOption?.tags ?? []).map((tag) => String(tag).toUpperCase());
      const isElectric = heatingTags.includes('ELECTRIC') || heatingTags.includes('HYBRID');
      const hasSpa = has('HYDRO-MASSAGE-8') || has('HYDRO-MASSAGE-12') || has('HYDRO-MASSAGE-16') || has('AIR-BUBBLE-12');
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
  {
    id: 'extras.disable-cupholders-when-filter-box',
    when: ({ has }) => has('SAND-FILTER-BOX'),
    then: ({ options }) =>
      options
        .filter((option) => option.groupKey === OptionGroupKey.EXTRAS_BASE && option.key.startsWith('CUPHOLDER'))
        .map((option) => ({
          type: 'FORBID' as const,
          key: option.key,
          reason: 'Niet beschikbaar met zandfilterbox.',
        })),
  },
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
 
];
