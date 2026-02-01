import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { DataSource, QueryDeepPartialEntity } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';
import { AppModule } from '../src/app.module';

import { catalogOptions } from '../src/data/options';

import { BaseProductEntity } from '../src/catalog/entities/base-product.entity';
import { OptionEntity } from '../src/catalog/entities/option.entity';
import { OptionGroupEntity } from '../src/catalog/entities/option-group.entity';

// ✅ use your canonical enums (adjust import path if needed)
import { BaseShape, HeatingType, ProductType } from '../src/catalog/catalog.types';
import { toPriceExcl, toPriceIncl } from '../src/utils/price-util';
import { optionGroupsSeed } from '../src/data/option-groups';

// ✅ use your pricing util (adjust import path if needed)

config();

const VAT_RATE_DEFAULT_PERCENT = 21;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// e.g. "2-4" => { personsMin:2, personsMax:4 }
const parsePersons = (value?: string) => {
  if (!value) return { personsMin: null, personsMax: null };
  const match = value.match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return { personsMin: null, personsMax: null };
  return { personsMin: Number(match[1]), personsMax: Number(match[2]) };
};

const normalizeVat = (vat?: unknown) => {
  const n = typeof vat === 'number' ? vat : Number(vat);
  return Number.isFinite(n) ? n : VAT_RATE_DEFAULT_PERCENT;
};

const normalizeNumber = (v?: unknown) => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
};

const toBaseShape = (raw?: unknown): BaseShape | null => {
  const s = String(raw ?? '').trim().toUpperCase();

  // accept a bunch of incoming values from JSON
  if (s === 'ROUND') return BaseShape.ROUND;
  if (s === 'SQUARE') return BaseShape.SQUARE;
  if (s === 'OFURO') return BaseShape.OFURO;
  if (s === 'PLUNGE') return BaseShape.PLUNGE;

  // legacy / inconsistent inputs
  if (s === 'RECTANGLE') return BaseShape.SQUARE; // you said sauna is rectangle; treat as SQUARE for now
  if (s === '') return null;

  return null;
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

  // canonical product type
  const normalizedType = String(product.productType ?? '').toUpperCase();
  const productType =
    normalizedType === ProductType.COLD_PLUNGE
      ? ProductType.COLD_PLUNGE
      : normalizedType === ProductType.SAUNA
        ? ProductType.SAUNA
        : ProductType.HOTTUB;

  // keep this for now (you said it matters for sauna; cold plunge none)
  const heatingTypes =
    productType === ProductType.COLD_PLUNGE
      ? null
      : [HeatingType.WOOD, HeatingType.ELECTRIC, HeatingType.HYBRID];

  // PRICE POLICY: priceIncl is truth
  const vatRatePercent = normalizeVat(product.vatRatePercent ?? VAT_RATE_DEFAULT_PERCENT);
  const priceIncl = normalizeNumber(product.priceIncl);
  const computedIncl =
    priceIncl > 0 ? priceIncl : toPriceIncl(normalizeNumber(product.priceExcl), vatRatePercent);
  const priceExcl = toPriceExcl(computedIncl, vatRatePercent);

  // key is canonical; id is DB-only and should not be seeded from JSON
  const key = String(product.key ?? '').trim();
  if (!key) {
    // If you ever have missing keys in products.json this prevents silent bad data.
    // eslint-disable-next-line no-console
    console.warn('Skipping product without key:', product);
    return;
  }

  const slugSource = product.slug ?? key ?? product.name;
  const slug = slugify(String(slugSource));

  baseProductsSeed.push({
    key, // ✅ NEW canonical key
    slug,
    type: productType,
    shape: toBaseShape(product.shape),
    name: product.name ?? key,
    description: product.description ?? 'Product configuratie',
    heatingTypes,

    // ✅ priceIncl truth; priceExcl derived
    basePriceIncl: computedIncl,
    basePriceExcl: priceExcl,
    vatRatePercent,

    attributes: {
      size: product.size ?? null,
      internalSize: product.internalSize ?? null,
      externalSize: product.externalSize ?? null,
      personsMin,
      personsMax,
      features: product.features ?? [],
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
  // ✅ Upsert by canonical key (NOT slug)
  await baseProductRepo.upsert(
    baseProductsSeed as QueryDeepPartialEntity<BaseProductEntity>[],
    ['key'],
  );

  logger.log('Seeding options...');
  const groupIdByKey = new Map(
    (await optionGroupRepo.find()).map((group) => [group.key, group.id]),
  );

  const optionsSeed = catalogOptions.map((option) => {
    const { groupKey, attributes, appliesTo, ...rest } = option as any;
  
    const vatRatePercent = normalizeVat(rest.vatRatePercent ?? VAT_RATE_DEFAULT_PERCENT);
  
    // PRICE POLICY: priceIncl truth
    const priceInclCandidate =
      typeof rest.priceIncl === 'number'
        ? rest.priceIncl
        : toPriceIncl(normalizeNumber(rest.priceExcl ?? 0), vatRatePercent);
  
    const priceIncl = normalizeNumber(priceInclCandidate);
    const priceExcl = toPriceExcl(priceIncl, vatRatePercent);
  
    return {
      ...rest,
      vatRatePercent,
      priceIncl,
      priceExcl,
      groupId: groupKey ? groupIdByKey.get(groupKey) ?? null : null,
  
      // 🔥 IMPORTANT: never allow null into NOT NULL jsonb columns
      attributes: attributes ?? {},
      appliesTo: appliesTo ?? {},
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
