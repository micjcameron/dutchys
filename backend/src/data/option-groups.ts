import { OptionGroupKey, ProductType } from '../catalog/catalog.types';
import { OptionGroupEntity, OptionGroupSelectionType } from '../catalog/entities/option-group.entity';

export const optionGroupsSeed: Partial<OptionGroupEntity>[] = [
  {
    key: OptionGroupKey.HEATER_INSTALLATION,
    title: 'Kachel installatie',
    selectionType: OptionGroupSelectionType.SINGLE,
    productTypes: [ProductType.HOTTUB],
  },
  {
    key: OptionGroupKey.COOLER_BASE,
    title: 'Koeling',
    selectionType: OptionGroupSelectionType.SINGLE,
    productTypes: [ProductType.COLD_PLUNGE],
  },
  {
    key: OptionGroupKey.COOLER_ADD_ON,
    title: "Koeling extra's",
    selectionType: OptionGroupSelectionType.MULTI,
    productTypes: [ProductType.COLD_PLUNGE],
  },
  {
    key: OptionGroupKey.HEATING_BASE,
    title: 'Verwarming',
    selectionType: OptionGroupSelectionType.SINGLE,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA],
  },
  {
    key: OptionGroupKey.HEATER_ADDONS_INTERNAL,
    title: "Verwarming extra's (intern)",
    selectionType: OptionGroupSelectionType.MULTI,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA],
  },
  {
    key: OptionGroupKey.HEATER_ADDONS_EXTERNAL,
    title: "Verwarming extra's (extern)",
    selectionType: OptionGroupSelectionType.MULTI,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA],
  },
  {
    key: OptionGroupKey.MATERIALS_INTERNAL_BASE,
    title: 'Interne materialen',
    selectionType: OptionGroupSelectionType.SINGLE,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA, ProductType.COLD_PLUNGE],
  },
  {
    key: OptionGroupKey.MATERIALS_EXTERNAL_BASE,
    title: 'Externe materialen',
    selectionType: OptionGroupSelectionType.SINGLE,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA, ProductType.COLD_PLUNGE],
  },
  {
    key: OptionGroupKey.INSULATION_BASE,
    title: 'Isolatie',
    selectionType: OptionGroupSelectionType.SINGLE,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA, ProductType.COLD_PLUNGE],
  },
  {
    key: OptionGroupKey.SPASYSTEM_BASE,
    title: 'Spa systemen',
    selectionType: OptionGroupSelectionType.SINGLE,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA],
  },
  {
    key: OptionGroupKey.LEDS_BASE,
    title: 'LED-verlichting',
    selectionType: OptionGroupSelectionType.MULTI,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA],
  },
  {
    key: OptionGroupKey.LID_BASE,
    title: 'Deksels',
    selectionType: OptionGroupSelectionType.SINGLE,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA, ProductType.COLD_PLUNGE],
  },
  {
    key: OptionGroupKey.COVER_BASE,
    title: 'Covers',
    selectionType: OptionGroupSelectionType.SINGLE,
    productTypes: [ProductType.HOTTUB, ProductType.COLD_PLUNGE],
  },
  {
    key: OptionGroupKey.FILTRATION_CONNECTOR_BASE,
    title: 'Filtratie – aansluitingen',
    selectionType: OptionGroupSelectionType.SINGLE,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA],
  },
  {
    key: OptionGroupKey.FILTRATION_FILTER_BASE,
    title: 'Filtratie – filters',
    selectionType: OptionGroupSelectionType.SINGLE,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA],
  },
  {
    key: OptionGroupKey.FILTRATION_ADDONS,
    title: "Filtratie extra's",
    selectionType: OptionGroupSelectionType.MULTI,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA],
  },
  {
    key: OptionGroupKey.FILTRATION_BOX,
    title: 'Filter box',
    selectionType: OptionGroupSelectionType.SINGLE,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA, ProductType.COLD_PLUNGE],
  },
  {
    key: OptionGroupKey.STAIRS_BASE,
    title: 'Trappen',
    selectionType: OptionGroupSelectionType.SINGLE,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA, ProductType.COLD_PLUNGE],
  },
  {
    key: OptionGroupKey.STAIRS_COVER_FILTER,
    title: 'Trappen Cover',
    selectionType: OptionGroupSelectionType.SINGLE,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA, ProductType.COLD_PLUNGE],
  },
  {
    key: OptionGroupKey.CONTROLUNIT_BASE,
    title: 'Bediening',
    selectionType: OptionGroupSelectionType.SINGLE,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA],
  },
  {
    key: OptionGroupKey.EXTRAS_BASE,
    title: 'Extra opties',
    selectionType: OptionGroupSelectionType.MULTI,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA, ProductType.COLD_PLUNGE],
  },
];
