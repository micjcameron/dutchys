import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { DataSource, QueryDeepPartialEntity } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';
import { AppModule } from '../src/app.module';
import { catalogOptions } from '../src/data/options';
import { BaseProductEntity, HeatingType, ProductType } from '../src/catalog/entities/base-product.entity';
import { OptionEntity } from '../src/catalog/entities/option.entity';
import { OptionGroupEntity, OptionGroupSelectionType } from '../src/catalog/entities/option-group.entity';

config();

const VAT_RATE_DEFAULT_PERCENT = 21;

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

const optionGroupsSeed: Partial<OptionGroupEntity>[] = [
  {
    key: 'HEATER_INSTALLATION',
    title: 'Kachel installatie',
    selectionType: OptionGroupSelectionType.SINGLE,
    min: 1,
    max: 1,
    sortOrder: 9,
    productTypes: [ProductType.HOTTUB],
    isActive: true,
  },
  {
    key: 'COOLER_BASE',
    title: 'Koeling',
    selectionType: OptionGroupSelectionType.SINGLE,
    min: null,
    max: 1,
    sortOrder: 9,
    productTypes: [ProductType.COLD_PLUNGE],
    isActive: true,
  },
  {
    key: 'COOLER_ADD_ON',
    title: "Koeling extra's",
    selectionType: OptionGroupSelectionType.MULTI,
    min: null,
    max: null,
    sortOrder: 10,
    productTypes: [ProductType.COLD_PLUNGE],
    isActive: true,
  },
  {
    key: 'HEATING_BASE',
    title: 'Verwarming',
    selectionType: OptionGroupSelectionType.SINGLE,
    min: null,
    max: 1,
    sortOrder: 10,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA],
    isActive: true,
  },
  {
    key: 'HEATING_ADDONS',
    title: "Verwarming extra's",
    selectionType: OptionGroupSelectionType.MULTI,
    min: null,
    max: null, 
    sortOrder: 11,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA],
    isActive: true,
  },
  {
    key: 'COOLING_BASE',
    title: 'Koeling',
    selectionType: OptionGroupSelectionType.SINGLE,
    min: null,
    max: 1,
    sortOrder: 12,
    productTypes: [ProductType.COLD_PLUNGE],
    isActive: true,
  },
  {
    key: 'COOLING_ADDONS',
    title: "Koeling extra's",
    selectionType: OptionGroupSelectionType.MULTI,
    min: null,
    max: null,
    sortOrder: 13,
    productTypes: [ProductType.COLD_PLUNGE],
    isActive: true,
  },
  {
    key: 'MATERIALS-INTERNAL_BASE',
    title: 'Interne materialen',
    selectionType: OptionGroupSelectionType.SINGLE,
    min: null,
    max: 1,
    sortOrder: 20,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA, ProductType.COLD_PLUNGE],
    isActive: true,
  },
  {
    key: 'MATERIALS-INTERNAL_ADDONS',
    title: "Interne materialen extra's",
    selectionType: OptionGroupSelectionType.MULTI,
    min: null,
    max: null,
    sortOrder: 21,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA, ProductType.COLD_PLUNGE],
    isActive: true,
  },
  {
    key: 'MATERIALS-EXTERNAL_BASE',
    title: 'Externe materialen',
    selectionType: OptionGroupSelectionType.SINGLE,
    min: null,
    max: 1,
    sortOrder: 30,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA, ProductType.COLD_PLUNGE],
    isActive: true,
  },
  {
    key: 'MATERIALS-EXTERNAL_ADDONS',
    title: "Externe materialen extra's",
    selectionType: OptionGroupSelectionType.MULTI,
    min: null,
    max: null,
    sortOrder: 31,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA, ProductType.COLD_PLUNGE],
    isActive: true,
  },
  {
    key: 'INSULATION_BASE',
    title: 'Isolatie',
    selectionType: OptionGroupSelectionType.SINGLE,
    min: null,
    max: 1,
    sortOrder: 40,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA, ProductType.COLD_PLUNGE],
    isActive: true,
  },
  {
    key: 'INSULATION_ADDONS',
    title: "Isolatie extra's",
    selectionType: OptionGroupSelectionType.MULTI,
    min: null,
    max: null,
    sortOrder: 41,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA, ProductType.COLD_PLUNGE],
    isActive: true,
  },
  {
    key: 'SPASYSTEM_BASE',
    title: 'Spa systemen',
    selectionType: OptionGroupSelectionType.SINGLE,
    min: null,
    max: 1,
    sortOrder: 50,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA],
    isActive: true,
  },
  {
    key: 'SPASYSTEM_ADDONS',
    title: "Spa systemen extra's",
    selectionType: OptionGroupSelectionType.MULTI,
    min: null,
    max: null,
    sortOrder: 51,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA],
    isActive: true,
  },
  {
    key: 'LEDS_BASE',
    title: 'LED-verlichting',
    selectionType: OptionGroupSelectionType.MULTI,
    min: null,
    max: null,
    sortOrder: 60,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA],
    isActive: true,
  },
  {
    key: 'LEDS_ADDONS',
    title: "LED-verlichting extra's",
    selectionType: OptionGroupSelectionType.MULTI,
    min: null,
    max: null,
    sortOrder: 61,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA],
    isActive: true,
  },
  {
    key: 'LID_BASE',
    title: 'Deksels',
    selectionType: OptionGroupSelectionType.SINGLE,
    min: null,
    max: 1,
    sortOrder: 70,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA, ProductType.COLD_PLUNGE],
    isActive: true,
  },
  {
    key: 'LID_ADDONS',
    title: "Deksels extra's",
    selectionType: OptionGroupSelectionType.MULTI,
    min: null,
    max: null,
    sortOrder: 71,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA, ProductType.COLD_PLUNGE],
    isActive: true,
  },
  {
    key: 'FILTRATION_BASE',
    title: 'Filtratie',
    selectionType: OptionGroupSelectionType.SINGLE,
    min: null,
    max: 1,
    sortOrder: 80,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA],
    isActive: true,
  },
  {
    key: 'FILTRATION_ADDONS',
    title: "Filtratie extra's",
    selectionType: OptionGroupSelectionType.MULTI,
    min: null,
    max: null,
    sortOrder: 81,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA],
    isActive: true,
  },
  {
    key: 'SANDFILTER_BASE',
    title: 'Zandfilter box',
    selectionType: OptionGroupSelectionType.SINGLE,
    min: null,
    max: 1,
    sortOrder: 90,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA],
    isActive: true,
  },
  {
    key: 'SANDFILTER_ADDONS',
    title: "Zandfilter box extra's",
    selectionType: OptionGroupSelectionType.MULTI,
    min: null,
    max: null,
    sortOrder: 91,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA],
    isActive: true,
  },
  {
    key: 'STAIRS_BASE',
    title: 'Trappen',
    selectionType: OptionGroupSelectionType.SINGLE,
    min: null,
    max: 1,
    sortOrder: 100,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA, ProductType.COLD_PLUNGE],
    isActive: true,
  },
  {
    key: 'STAIRS_ADDONS',
    title: "Trappen extra's",
    selectionType: OptionGroupSelectionType.MULTI,
    min: null,
    max: null,
    sortOrder: 101,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA, ProductType.COLD_PLUNGE],
    isActive: true,
  },
  {
    key: 'CONTROLUNIT_BASE',
    title: 'Bediening',
    selectionType: OptionGroupSelectionType.SINGLE,
    min: null,
    max: 1,
    sortOrder: 110,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA],
    isActive: true,
  },
  {
    key: 'CONTROLUNIT_ADDONS',
    title: "Bediening extra's",
    selectionType: OptionGroupSelectionType.MULTI,
    min: null,
    max: null,
    sortOrder: 111,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA],
    isActive: true,
  },
  {
    key: 'EXTRAS_BASE',
    title: 'Extra opties',
    selectionType: OptionGroupSelectionType.MULTI,
    min: null,
    max: null,
    sortOrder: 120,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA, ProductType.COLD_PLUNGE],
    isActive: true,
  },
  {
    key: 'EXTRAS_ADDONS',
    title: "Extra opties extra's",
    selectionType: OptionGroupSelectionType.MULTI,
    min: null,
    max: null,
    sortOrder: 121,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA, ProductType.COLD_PLUNGE],
    isActive: true,
  },
];

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
    return {
      ...rest,
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
