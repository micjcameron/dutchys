import { OptionGroupKey } from '../catalog-option-seed.types';
import { BaseProductEntity } from '../entities/base-product.entity';
import { CatalogOption, ConfigSelections } from '../sections/section.types';

export type RuleEffect =
  | { type: 'INFO'; key: string; reason: string }
  | { type: 'REQUIRE'; key: string; reason: string }
  | { type: 'FORBID'; key: string; reason: string }
  | { type: 'HIDE'; key: string; reason: string }
  | { type: 'DEFAULT_SELECT'; key: string; reason: string; priority?: number }
  | { type: 'RECOMMEND'; key: string; reason: string; strength?: 'low' | 'med' | 'high' }
  | { type: 'WARNING'; message: string; key?: string }
  | { type: 'PRICE_OVERRIDE'; key: string; priceExcl: number; reason: string };

export type Rule = {
  id: string;
  when: (ctx: RuleContext) => boolean;
  then: (ctx: RuleContext) => RuleEffect[];
};

export type RuleContext = {
  product: BaseProductEntity;
  selections: ConfigSelections;
  selected: Set<string>;
  has: (key: string) => boolean;
  getGroupSelection: (groupKey: OptionGroupKey) => string | string[] | null;
  getOption: (key: string) => CatalogOption | undefined;
  answers: {
    hideFilterUnderStairs?: boolean | null;
  };
  options: CatalogOption[];
};

export type RuleRecommendation = {
  key: string;
  reason: string;
  strength?: 'low' | 'med' | 'high';
};

export type RuleWarning = {
  message: string;
  key?: string;
};

export type RuleEvaluationResult = {
  selections: ConfigSelections;
  requirements: Array<{ key: string; message: string }>;
  selectedKeys: string[]; // ✅ add this
  disabledOptions: Record<string, { reason: string }>;
  hiddenOptions: Record<string, { reason: string }>;
  validationErrors: string[];
  priceOverrides: Record<string, number>;
  recommendations: RuleRecommendation[];
  warnings: RuleWarning[];
};
