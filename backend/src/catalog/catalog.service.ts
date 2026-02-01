// src/catalog/catalog.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { getTemplateForProductType } from './templates/templates';
import { BaseProductEntity } from './entities/base-product.entity';
import { OptionEntity } from './entities/option.entity';
import { OptionGroupEntity } from './entities/option-group.entity';
import { ProductType } from './catalog.types';

const CACHE_TTL_MS = 60_000;

type CatalogSnapshot = {
  baseProducts: BaseProductEntity[];
  optionGroups: OptionGroupEntity[];
  options: OptionEntity[];
};

type PublicOption = {
  id: string;
  key: string;
  subKey: string | null;
  name: string;
  description: string | null;
  priceExcl: number;
  priceIncl: number;
  vatRatePercent: number;
  images: string[];
  tags: string[];
  attributes: Record<string, unknown>;
  appliesTo: unknown;
  quantityRule: unknown;
  groupKey: string;
  isActive: boolean;
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
  ) {}

  private async getCatalogSnapshot(type?: ProductType): Promise<CatalogSnapshot> {
    const cacheKey = type ?? 'all';
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    const [baseProducts, optionGroups, options] = await Promise.all([
      this.baseProductsRepository.find({
        where: {
          isActive: true,
          ...(type ? { type } : {}),
        },
      }),
      // Option groups no longer have isActive
      this.optionGroupsRepository.find(),
      // Options still have isActive
      this.optionsRepository.find({ where: { isActive: true } }),
    ]);

    const snapshot: CatalogSnapshot = { baseProducts, optionGroups, options };
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

  private mapOptionsWithGroupKey(options: OptionEntity[], groups: OptionGroupEntity[]): PublicOption[] {
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

  async getPublicCatalog(type?: ProductType) {
    const snapshot = await this.getCatalogSnapshot(type);

    const optionGroups = this.filterGroupsByType(snapshot.optionGroups, type);
    const groupIds = new Set(optionGroups.map((group) => group.id));

    const options = this.mapOptionsWithGroupKey(
      snapshot.options.filter((option) => option.groupId && groupIds.has(option.groupId)),
      optionGroups,
    );

    return {
      baseProducts: snapshot.baseProducts,
      optionGroups,
      options,
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

  // ---- admin CRUD helpers ----

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
}
