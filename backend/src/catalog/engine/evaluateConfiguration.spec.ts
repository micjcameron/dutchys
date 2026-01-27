import { evaluateConfiguration } from './evaluateConfiguration';
import { OptionGroupSelectionType } from '../entities/option-group.entity';
import { RuleScope } from '../entities/rule.entity';
import { ProductType } from '../../common/product-type.enum';

describe('evaluateConfiguration', () => {
  const product = {
    id: 'product-1',
    type: ProductType.HOTTUB,
    basePriceExcl: 1000,
    vatRate: 0.21,
  };

  const groups = [
    { key: 'FILTRATION', selectionType: OptionGroupSelectionType.MULTI },
    { key: 'SANDFILTER', selectionType: OptionGroupSelectionType.SINGLE },
    { key: 'EXTRAS', selectionType: OptionGroupSelectionType.MULTI },
    { key: 'SPASYSTEM', selectionType: OptionGroupSelectionType.SINGLE },
    { key: 'HEATING', selectionType: OptionGroupSelectionType.SINGLE },
    { key: 'STAIRS', selectionType: OptionGroupSelectionType.SINGLE },
  ];

  const options = [
    { key: 'SAND-FILTER', groupKey: 'FILTRATION', name: 'Sand filter', priceExcl: 100, vatRate: 0.21 },
    { key: 'STAINLESS-SF-CONNECTIONS', groupKey: 'FILTRATION', name: 'Stainless', priceExcl: 50, vatRate: 0.21 },
    { key: 'SAND-FILTER-BOX', groupKey: 'SANDFILTER', name: 'Sand filter box', priceExcl: 80, vatRate: 0.21 },
    { key: 'CUPHOLDER-STANDARD', groupKey: 'EXTRAS', name: 'Cupholder', priceExcl: 0, vatRate: 0.21 },
    { key: 'CIRCULATION-PUMP', groupKey: 'SPASYSTEM', name: 'Circulation pump', priceExcl: 150, vatRate: 0.21 },
    { key: 'ELECTRIC-6KW', groupKey: 'HEATING', name: 'Electric heater', priceExcl: 800, vatRate: 0.21, tags: ['ELECTRIC'] },
    { key: 'STAIRS-XL', groupKey: 'STAIRS', name: 'XL stairs', priceExcl: 120, vatRate: 0.21, tags: ['COVERS-SAND-FILTER'] },
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
      when: [{ type: 'groupEmpty', groupKey: 'FILTRATION' }],
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
      selections: { FILTRATION: ['SAND-FILTER'] },
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
      selections: { SANDFILTER: ['SAND-FILTER-BOX'], EXTRAS: ['CUPHOLDER-STANDARD'] },
      catalog: { groups, options },
      rules,
    });

    expect(result.disabledOptions['CUPHOLDER-STANDARD']).toBeDefined();
    expect(result.resolvedSelections.EXTRAS).toEqual([]);
  });

  it('auto selects circulation pump for electric heating with zero price', () => {
    const result = evaluateConfiguration({
      product,
      selections: { HEATING: 'ELECTRIC-6KW' },
      catalog: { groups, options },
      rules,
    });

    expect(result.resolvedSelections.SPASYSTEM).toContain('CIRCULATION-PUMP');
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

    expect(result.resolvedSelections.FILTRATION).toContain('STAINLESS-SF-CONNECTIONS');
  });

  it('removes sand filter selections when stairs cover sand filter', () => {
    const result = evaluateConfiguration({
      product,
      selections: {
        FILTRATION: ['SAND-FILTER'],
        SANDFILTER: ['SAND-FILTER-BOX'],
        STAIRS: 'STAIRS-XL',
      },
      catalog: { groups, options },
      rules,
    });

    expect(result.resolvedSelections.FILTRATION).not.toContain('SAND-FILTER');
    expect(result.resolvedSelections.SANDFILTER).not.toContain('SAND-FILTER-BOX');
  });
});
