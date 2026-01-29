import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { ProductType } from './entities/base-product.entity';
import { evaluateTemplate, SelectionInput } from './engine/evaluateTemplate';
import { getTemplateForProductType } from './templates/templates';
import { BaseProductEntity } from './entities/base-product.entity';
import { OptionEntity } from './entities/option.entity';
import { OptionGroupEntity } from './entities/option-group.entity';
import { RuleEntity, RuleScope } from './entities/rule.entity';

const CACHE_TTL_MS = 60_000;

type CatalogSnapshot = {
  baseProducts: BaseProductEntity[];
  optionGroups: OptionGroupEntity[];
  options: OptionEntity[];
  rules: RuleEntity[];
};

@Injectable()
export class CatalogService {
  private cache = new Map<string, { expiresAt: number; data: CatalogSnapshot }>();

  constructor(
    @InjectRepository(BaseProductEntity)
    private readonly baseProductsRepository: Repository<BaseProductEntity>,
    @InjectRepository(OptionGroupEntity)
    private readonly optionGroupsRepository: Repository<OptionGroupEntity>,
    @InjectRepository(OptionEntity)
    private readonly optionsRepository: Repository<OptionEntity>,
    @InjectRepository(RuleEntity)
    private readonly rulesRepository: Repository<RuleEntity>,
  ) {}

  private async getCatalogSnapshot(type?: ProductType): Promise<CatalogSnapshot> {
    const cacheKey = type ?? 'all';
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    const [baseProducts, optionGroups, options, rules] = await Promise.all([
      this.baseProductsRepository.find({
        where: {
          isActive: true,
          ...(type ? { type } : {}),
        },
      }),
      this.optionGroupsRepository.find({ where: { isActive: true } }),
      this.optionsRepository.find({ where: { isActive: true } }),
      this.rulesRepository.find({ where: { isActive: true } }),
    ]);

    const snapshot = { baseProducts, optionGroups, options, rules };
    this.cache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, data: snapshot });
    return snapshot;
  }

  private filterGroupsByType(groups: OptionGroupEntity[], type?: ProductType) {
    if (!type) {
      return groups;
    }
    return groups.filter((group) =>
      Array.isArray(group.productTypes) && group.productTypes.length > 0
        ? group.productTypes.includes(type)
        : true,
    );
  }

  private mapOptionsWithGroupKey(
    options: OptionEntity[],
    groups: OptionGroupEntity[],
  ) {
    const groupKeyById = new Map(groups.map((group) => [group.id, group.key]));
    return options
      .filter((option) => option.groupId && groupKeyById.has(option.groupId))
      .map((option) => ({
        id: option.id,
        key: option.key,
        subKey: option.subKey,
        name: option.name,
        description: option.description,
        priceExcl: option.priceExcl,
        priceIncl: option.priceIncl,
        vatRatePercent: option.vatRatePercent,
        images: option.images,
        tags: option.tags,
        attributes: option.attributes,
        appliesTo: option.appliesTo,
        quantityRule: option.quantityRule,
        groupKey: groupKeyById.get(option.groupId!) as string,
        isActive: option.isActive,
      }));
  }

  private filterRulesForContext(
    rules: RuleEntity[],
    context: { product?: BaseProductEntity; groupKeys?: Set<string> },
  ) {
    const { product, groupKeys } = context;
    return rules.filter((rule) => {
      if (!rule.isActive) {
        return false;
      }
      if (rule.scope === RuleScope.GLOBAL) {
        return true;
      }
      if (rule.scope === RuleScope.PRODUCT_TYPE) {
        return !!product && rule.scopeRef === product.type;
      }
      if (rule.scope === RuleScope.PRODUCT) {
        return !!product && rule.scopeRef === product.id;
      }
      if (rule.scope === RuleScope.GROUP) {
        return !!groupKeys && !!rule.scopeRef && groupKeys.has(rule.scopeRef);
      }
      return false;
    });
  }

  async getPublicCatalog(type?: ProductType) {
    const snapshot = await this.getCatalogSnapshot(type);
    const optionGroups = this.filterGroupsByType(snapshot.optionGroups, type);
    const groupKeys = new Set(optionGroups.map((group) => group.key));
    const groupIds = new Set(optionGroups.map((group) => group.id));
    const options = this.mapOptionsWithGroupKey(
      snapshot.options.filter((option) => option.groupId && groupIds.has(option.groupId)),
      optionGroups,
    );
    const rules = type
      ? this.filterRulesForContext(snapshot.rules, { product: { type } as BaseProductEntity, groupKeys })
      : snapshot.rules;

    return {
      baseProducts: snapshot.baseProducts,
      optionGroups,
      options,
      rules,
    };
  }

  async getPublicTemplate(type: ProductType) {
    const template = getTemplateForProductType(type);
    if (!template) {
      throw new NotFoundException('Template not found');
    }
    return template;
  }

  async getPublicProductIds(type?: ProductType) {
    const products = await this.baseProductsRepository.find({
      select: ['id', 'slug'],
      where: {
        isActive: true,
        ...(type ? { type } : {}),
      },
    });
    return products.map((product) => ({ id: product.id, slug: product.slug }));
  }

  async getPublicProductById(id: string) {
    const product = isUUID(id)
      ? await this.baseProductsRepository.findOne({
          where: { id, isActive: true },
        })
      : await this.baseProductsRepository.findOne({
          where: { slug: id, isActive: true },
        });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async evaluateConfiguration(productId: string, selections: SelectionInput) {
    const product = await this.baseProductsRepository.findOne({
      where: { id: productId, isActive: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const snapshot = await this.getCatalogSnapshot(product.type);
    const optionGroups = this.filterGroupsByType(snapshot.optionGroups, product.type);
    const groupKeys = new Set(optionGroups.map((group) => group.key));
    const groupIds = new Set(optionGroups.map((group) => group.id));
    const options = this.mapOptionsWithGroupKey(
      snapshot.options.filter((option) => option.groupId && groupIds.has(option.groupId)),
      optionGroups,
    );
    const rules = this.filterRulesForContext(snapshot.rules, { product, groupKeys });

    const template = getTemplateForProductType(product.type);
    if (!template) {
      throw new NotFoundException('Template not found');
    }

    const flattenedSelections = this.flattenSelectionsToGroupInput(selections, options);


    return evaluateTemplate({
      product,
      selections: flattenedSelections as any,
      template,
      catalog: { groups: optionGroups, options },
    });
  }

  async listBaseProducts() {
    return this.baseProductsRepository.find();
  }

  async createBaseProduct(data: Partial<BaseProductEntity>) {
    return this.baseProductsRepository.save(this.baseProductsRepository.create(data));
  }

  async updateBaseProduct(id: string, data: Partial<BaseProductEntity>) {
    await this.baseProductsRepository.save({ id, ...(data as DeepPartial<BaseProductEntity>) });
    return this.baseProductsRepository.findOne({ where: { id } });
  }

  async deleteBaseProduct(id: string) {
    await this.baseProductsRepository.delete(id);
    return { id };
  }

  async listOptionGroups() {
    return this.optionGroupsRepository.find();
  }

  async createOptionGroup(data: Partial<OptionGroupEntity>) {
    return this.optionGroupsRepository.save(this.optionGroupsRepository.create(data));
  }

  async updateOptionGroup(id: string, data: Partial<OptionGroupEntity>) {
    await this.optionGroupsRepository.update(id, data);
    return this.optionGroupsRepository.findOne({ where: { id } });
  }

  async deleteOptionGroup(id: string) {
    await this.optionGroupsRepository.delete(id);
    return { id };
  }

  async listOptions() {
    return this.optionsRepository.find();
  }

  async createOption(data: Partial<OptionEntity>) {
    return this.optionsRepository.save(this.optionsRepository.create(data));
  }

  async updateOption(id: string, data: Partial<OptionEntity>) {
    await this.optionsRepository.save({ id, ...(data as DeepPartial<OptionEntity>) });
    return this.optionsRepository.findOne({ where: { id } });
  }

  async deleteOption(id: string) {
    await this.optionsRepository.delete(id);
    return { id };
  }

  async listRules() {
    return this.rulesRepository.find();
  }

  async createRule(data: Partial<RuleEntity>) {
    return this.rulesRepository.save(this.rulesRepository.create(data));
  }

  async updateRule(id: string, data: Partial<RuleEntity>) {
    await this.rulesRepository.save({ id, ...(data as DeepPartial<RuleEntity>) });
    return this.rulesRepository.findOne({ where: { id } });
  }

  async deleteRule(id: string) {
    await this.rulesRepository.delete(id);
    return { id };
  }

  private flattenSelectionsToGroupInput(
    raw: any,
    options: Array<{ key: string; groupKey: string }>,
  ): SelectionInput {
    const optionToGroup = new Map(options.map((o) => [o.key, o.groupKey]));
    const out: Record<string, string[]> = {};
  
    const add = (optionKey: string) => {
      const groupKey = optionToGroup.get(optionKey);
      if (!groupKey) return;
  
      if (!out[groupKey]) out[groupKey] = [];
      out[groupKey].push(optionKey); // keep duplicates (quantity / repeated keys model)
    };
  
    const walk = (v: any) => {
      if (v == null) return;
  
      if (typeof v === 'string') {
        add(v);
        return;
      }
  
      if (Array.isArray(v)) {
        for (const item of v) walk(item);
        return;
      }
  
      if (typeof v === 'object') {
        for (const val of Object.values(v)) walk(val);
        return;
      }
  
      // ignore booleans/numbers/etc.
    };
  
    walk(raw);
  
    // ensure all groups exist (optional – evaluator can handle missing keys)
    return out;
  }
  
}
