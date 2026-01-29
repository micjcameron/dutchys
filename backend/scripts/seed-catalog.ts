import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { DataSource, QueryDeepPartialEntity } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';
import { AppModule } from '../src/app.module';
import { catalogOptions } from '../src/data/options';
import { optionGroupsSeed } from '../src/data/option-groupe';
import { BaseProductEntity, HeatingType, ProductType } from '../src/catalog/entities/base-product.entity';
import { OptionEntity } from '../src/catalog/entities/option.entity';
import { OptionGroupEntity, OptionGroupSelectionType } from '../src/catalog/entities/option-group.entity';

config();

const VAT_RATE_DEFAULT_PERCENT = 21;
const toIncl = (value: number, vatRatePercent = VAT_RATE_DEFAULT_PERCENT) =>
  Math.round(value * (1 + vatRatePercent / 100) * 100) / 100;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const parsePersons = (value?: string) => {
  if (!value) {
    return { personsMin: null, personsMax: null };
  }
  const match = value.match(/(\d+)\s*-\s*(\d+)/);
  if (!match) {
    return { personsMin: null, personsMax: null };
  }
  return { personsMin: Number(match[1]), personsMax: Number(match[2]) };
};

const productsPath = path.resolve(__dirname, '../src/data/products.json');
type ProductRecord = Record<string, any>;
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8')) as ProductRecord[];

type SeedBaseProduct = Partial<BaseProductEntity> & {
  attributes?: Record<string, unknown>;
  images?: string[];
};

const baseProductsSeed: SeedBaseProduct[] = [];

productsData.forEach((product) => {
  const { personsMin, personsMax } = parsePersons(product.persons);
  const normalizedType = String(product.productType ?? '').toUpperCase();
  const productType =
    normalizedType === ProductType.COLD_PLUNGE
      ? ProductType.COLD_PLUNGE
      : normalizedType === ProductType.SAUNA
        ? ProductType.SAUNA
        : ProductType.HOTTUB;
  const heatingTypes =
    productType === ProductType.COLD_PLUNGE
      ? null
      : [HeatingType.WOOD, HeatingType.ELECTRIC, HeatingType.HYBRID];
  baseProductsSeed.push({
    slug: slugify(product.slug ?? product.key ?? product.name ?? String(product.id)),
    type: productType,
    shape: product.shape ? String(product.shape).toLowerCase() : null,
    name: product.name ?? 'Hottub',
    description: product.description ?? 'Hottub configuratie',
    heatingTypes,
    basePriceExcl: Number(product.priceExcl ?? 0),
    basePriceIncl: Number(product.priceIncl ?? toIncl(Number(product.priceExcl ?? 0))),
    vatRatePercent: VAT_RATE_DEFAULT_PERCENT,
    attributes: {
      size: product.size,
      internalSize: product.internalSize,
      externalSize: product.externalSize,
      personsMin,
      personsMax,
      heating: product.verwarming ?? product.heating ?? null,
      features: product.features ?? [],
      productKey: product.key ?? null,
      ...(product.attributes ?? {}),
    },
    images: [product.image, ...(product.details ?? [])].filter(Boolean),
    isActive: true,
  });
});

export const seedProducts = async (dataSource: DataSource) => {
  const logger = new Logger('SeedProducts');

  const baseProductRepo = dataSource.getRepository(BaseProductEntity);
  const optionGroupRepo = dataSource.getRepository(OptionGroupEntity);
  const optionRepo = dataSource.getRepository(OptionEntity);

  logger.log('Seeding option groups...');
  await optionGroupRepo.upsert(
    optionGroupsSeed as QueryDeepPartialEntity<OptionGroupEntity>[],
    ['key'],
  );

  logger.log('Seeding base products...');
  await baseProductRepo.upsert(
    baseProductsSeed as QueryDeepPartialEntity<BaseProductEntity>[],
    ['slug'],
  );

  logger.log('Seeding options...');
  const groupIdByKey = new Map(
    (await optionGroupRepo.find()).map((group) => [group.key, group.id]),
  );
  const optionsSeed = catalogOptions.map((option) => {
    const { groupKey, ...rest } = option;
    const priceExcl = Number((rest as any).priceExcl ?? 0);
    const vatRatePercent = Number((rest as any).vatRatePercent ?? VAT_RATE_DEFAULT_PERCENT);
    const priceIncl =
      typeof (rest as any).priceIncl === 'number'
        ? (rest as any).priceIncl
        : toIncl(priceExcl, vatRatePercent);
    return {
      ...rest,
      priceIncl,
      groupId: groupKey ? groupIdByKey.get(groupKey) ?? null : null,
    };
  });
  await optionRepo.upsert(
    optionsSeed as QueryDeepPartialEntity<OptionEntity>[],
    ['key'],
  );

};

const runSeeder = async () => {
  const logger = new Logger('Seeder');
  logger.log('Initializing Nest application context...');

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const dataSource = app.get(DataSource);
    logger.log('Running seeders...');
    await seedProducts(dataSource);
    logger.log('Seeding complete!');
  } catch (error) {
    logger.error('Seeding failed', error as Error);
    throw error;
  } finally {
    await app.close();
  }
};

runSeeder().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Seed failed', error);
  process.exit(1);
});
