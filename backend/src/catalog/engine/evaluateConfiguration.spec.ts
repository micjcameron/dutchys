import { evaluateConfiguration } from './evaluateConfiguration';
import { OptionGroupSelectionType } from '../entities/option-group.entity';
import { RuleScope } from '../entities/rule.entity';
import { ProductType } from '../entities/base-product.entity';

describe('evaluateConfiguration', () => {
  const product = {
    id: 'product-1',
    type: ProductType.HOTTUB,
    basePriceExcl: 1000,
    vatRatePercent: 21,
  };

  const groups = [
    { key: 'FILTRATION_BASE', selectionType: OptionGroupSelectionType.SINGLE },
    { key: 'SANDFILTER_BASE', selectionType: OptionGroupSelectionType.SINGLE },
    { key: 'EXTRAS_BASE', selectionType: OptionGroupSelectionType.MULTI },
    { key: 'SPASYSTEM_BASE', selectionType: OptionGroupSelectionType.SINGLE },
    { key: 'HEATING_BASE', selectionType: OptionGroupSelectionType.SINGLE },
    { key: 'STAIRS_BASE', selectionType: OptionGroupSelectionType.SINGLE },
  ];

  const options = [
    { key: 'SAND-FILTER', groupKey: 'FILTRATION_BASE', name: 'Sand filter', priceExcl: 100, vatRatePercent: 21 },
    { key: 'STAINLESS-SF-CONNECTIONS', groupKey: 'FILTRATION_BASE', name: 'Stainless', priceExcl: 50, vatRatePercent: 21 },
    { key: 'SAND-FILTER-BOX', groupKey: 'SANDFILTER_BASE', name: 'Sand filter box', priceExcl: 80, vatRatePercent: 21 },
    { key: 'CUPHOLDER-STANDARD', groupKey: 'EXTRAS_BASE', name: 'Cupholder', priceExcl: 0, vatRatePercent: 21 },
    { key: 'CIRCULATION-PUMP', groupKey: 'SPASYSTEM_BASE', name: 'Circulation pump', priceExcl: 150, vatRatePercent: 21 },
    { key: 'ELECTRIC-6KW', groupKey: 'HEATING_BASE', name: 'Electric heater', priceExcl: 800, vatRatePercent: 21, tags: ['ELECTRIC'] },
    { key: 'STAIRS-XL', groupKey: 'STAIRS_BASE', name: 'XL stairs', priceExcl: 120, vatRatePercent: 21, tags: ['COVERS-SAND-FILTER'] },
  ];

  const rules = [
    {
      key: 'REQUIRE-SAND-FILTER-BOX',
      scope: RuleScope.GLOBAL,
      when: [{ type: 'optionSelected', optionKey: 'SAND-FILTER' }],
      then: [{ type: 'requireOption', optionKey: 'SAND-FILTER-BOX', reason: 'Sand filter requires box' }],
    },
    {
      key: 'DISABLE-CUPHOLDER-WHEN-BOX',
      scope: RuleScope.GLOBAL,
      when: [{ type: 'optionSelected', optionKey: 'SAND-FILTER-BOX' }],
      then: [{ type: 'disableByPrefix', prefix: 'CUPHOLDER-', reason: 'Box takes space' }],
    },
    {
      key: 'AUTO-CIRCULATION-FOR-ELECTRIC',
      scope: RuleScope.GLOBAL,
      when: [{ type: 'optionTagSelected', tag: 'ELECTRIC' }],
      then: [{ type: 'autoSelect', optionKey: 'CIRCULATION-PUMP', priceOverrideExcl: 0 }],
    },
    {
      key: 'DEFAULT-FILTRATION',
      scope: RuleScope.GLOBAL,
      when: [{ type: 'groupEmpty', groupKey: 'FILTRATION_BASE' }],
      then: [{ type: 'autoSelect', optionKey: 'STAINLESS-SF-CONNECTIONS' }],
    },
    {
      key: 'STAIRS-REMOVE-SAND-FILTER',
      scope: RuleScope.GLOBAL,
      when: [{ type: 'optionTagSelected', tag: 'COVERS-SAND-FILTER' }],
      then: [
        { type: 'autoRemove', optionKey: 'SAND-FILTER' },
        { type: 'autoRemove', optionKey: 'SAND-FILTER-BOX' },
      ],
    },
  ];

  it('requires sand-filter-box when sand-filter is selected', () => {
    const result = evaluateConfiguration({
      product,
      selections: { FILTRATION_BASE: ['SAND-FILTER'] },
      catalog: { groups, options },
      rules,
    });

    expect(result.requirements).toEqual([
      { optionKey: 'SAND-FILTER-BOX', reason: 'Sand filter requires box' },
    ]);
    expect(result.validationErrors).toContain('Required option missing: SAND-FILTER-BOX.');
  });

  it('disables cupholder options when sand-filter-box is selected', () => {
    const result = evaluateConfiguration({
      product,
      selections: { SANDFILTER_BASE: ['SAND-FILTER-BOX'], EXTRAS_BASE: ['CUPHOLDER-STANDARD'] },
      catalog: { groups, options },
      rules,
    });

    expect(result.disabledOptions['CUPHOLDER-STANDARD']).toBeDefined();
    expect(result.resolvedSelections.EXTRAS_BASE).toEqual([]);
  });

  it('auto selects circulation pump for electric heating with zero price', () => {
    const result = evaluateConfiguration({
      product,
      selections: { HEATING_BASE: 'ELECTRIC-6KW' },
      catalog: { groups, options },
      rules,
    });

    expect(result.resolvedSelections.SPASYSTEM_BASE).toContain('CIRCULATION-PUMP');
    const pump = result.pricing.breakdown.find((item) => item.key === 'CIRCULATION-PUMP');
    expect(pump?.priceExcl).toBe(0);
  });

  it('auto selects stainless connections when filtration is empty', () => {
    const result = evaluateConfiguration({
      product,
      selections: {},
      catalog: { groups, options },
      rules,
    });

    expect(result.resolvedSelections.FILTRATION_BASE).toContain('STAINLESS-SF-CONNECTIONS');
  });

  it('removes sand filter selections when stairs cover sand filter', () => {
    const result = evaluateConfiguration({
      product,
      selections: {
        FILTRATION_BASE: ['SAND-FILTER'],
        SANDFILTER_BASE: ['SAND-FILTER-BOX'],
        STAIRS_BASE: 'STAIRS-XL',
      },
      catalog: { groups, options },
      rules,
    });

    expect(result.resolvedSelections.FILTRATION_BASE).not.toContain('SAND-FILTER');
    expect(result.resolvedSelections.SANDFILTER_BASE).not.toContain('SAND-FILTER-BOX');
  });
});
