import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { DataSource, QueryDeepPartialEntity } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';
import { AppModule } from '../src/app.module';
import { ProductType } from '../src/common/product-type.enum';
import { allHeatingOptions } from '../../backend/src/data/heatingOptions';
import { allMaterials } from '../../backend/src/data/saunaMaterials';
import { allOptions } from '../../backend/src/data/saunaOptions';
import { BaseProductEntity, HeatingType } from '../src/catalog/entities/base-product.entity';
import { OptionEntity } from '../src/catalog/entities/option.entity';
import { OptionGroupEntity, OptionGroupSelectionType } from '../src/catalog/entities/option-group.entity';

config();

const VAT_RATE_DEFAULT = 0.21;

const toUpper = (value?: string | null) => (typeof value === 'string' ? value.toUpperCase() : value);

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

type SeedOption = Partial<OptionEntity> & {
  key: string;
  attributes?: Record<string, unknown>;
  tags?: string[];
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
      ? []
      : [HeatingType.WOOD, HeatingType.ELECTRIC, HeatingType.HYBRID];
  baseProductsSeed.push({
    slug: slugify(product.name ?? String(product.id)),
    type: productType,
    shape: product.shape ? String(product.shape).toLowerCase() : null,
    name: product.name ?? 'Hottub',
    description: product.description ?? 'Hottub configuratie',
    heatingTypes,
    basePriceExcl: Number(product.priceExcl ?? 0),
    vatRate: VAT_RATE_DEFAULT,
    attributes: {
      size: product.size,
      internalSize: product.internalSize,
      externalSize: product.externalSize,
      personsMin,
      personsMax,
      heating: product.verwarming ?? product.heating ?? null,
      features: product.features ?? [],
    },
    images: [product.image, ...(product.details ?? [])].filter(Boolean),
    isActive: true,
  });
});

const optionGroupsSeed: Partial<OptionGroupEntity>[] = [
  {
    key: 'HEATING',
    title: 'Verwarming',
    selectionType: OptionGroupSelectionType.SINGLE,
    min: null,
    max: 1,
    sortOrder: 10,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA],
    isActive: true,
  },
  {
    key: 'MATERIALS-INTERNAL',
    title: 'Interne materialen',
    selectionType: OptionGroupSelectionType.SINGLE,
    min: null,
    max: 1,
    sortOrder: 20,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA, ProductType.COLD_PLUNGE],
    isActive: true,
  },
  {
    key: 'MATERIALS-EXTERNAL',
    title: 'Externe materialen',
    selectionType: OptionGroupSelectionType.SINGLE,
    min: null,
    max: 1,
    sortOrder: 30,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA, ProductType.COLD_PLUNGE],
    isActive: true,
  },
  {
    key: 'INSULATION',
    title: 'Isolatie',
    selectionType: OptionGroupSelectionType.SINGLE,
    min: null,
    max: 1,
    sortOrder: 40,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA, ProductType.COLD_PLUNGE],
    isActive: true,
  },
  {
    key: 'SPASYSTEM',
    title: 'Spa systemen',
    selectionType: OptionGroupSelectionType.SINGLE,
    min: null,
    max: 1,
    sortOrder: 50,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA],
    isActive: true,
  },
  {
    key: 'LEDS',
    title: 'LED-verlichting',
    selectionType: OptionGroupSelectionType.MULTI,
    min: null,
    max: null,
    sortOrder: 60,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA],
    isActive: true,
  },
  {
    key: 'LID',
    title: 'Deksels',
    selectionType: OptionGroupSelectionType.SINGLE,
    min: null,
    max: 1,
    sortOrder: 70,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA, ProductType.COLD_PLUNGE],
    isActive: true,
  },
  {
    key: 'FILTRATION',
    title: 'Filtratie',
    selectionType: OptionGroupSelectionType.MULTI,
    min: null,
    max: null,
    sortOrder: 80,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA],
    isActive: true,
  },
  {
    key: 'SANDFILTER',
    title: 'Zandfilter box',
    selectionType: OptionGroupSelectionType.SINGLE,
    min: null,
    max: 1,
    sortOrder: 90,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA],
    isActive: true,
  },
  {
    key: 'STAIRS',
    title: 'Trappen',
    selectionType: OptionGroupSelectionType.SINGLE,
    min: null,
    max: 1,
    sortOrder: 100,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA, ProductType.COLD_PLUNGE],
    isActive: true,
  },
  {
    key: 'CONTROLUNIT',
    title: 'Bediening',
    selectionType: OptionGroupSelectionType.SINGLE,
    min: null,
    max: 1,
    sortOrder: 110,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA],
    isActive: true,
  },
  {
    key: 'EXTRAS',
    title: 'Extra opties',
    selectionType: OptionGroupSelectionType.MULTI,
    min: null,
    max: null,
    sortOrder: 120,
    productTypes: [ProductType.HOTTUB, ProductType.SAUNA, ProductType.COLD_PLUNGE],
    isActive: true,
  },
];

const optionsByKey = new Map<string, SeedOption>();

const upsertOption = (option: SeedOption) => {
  if (!option.key) {
    return;
  }
  optionsByKey.set(option.key, option);
};

allHeatingOptions.forEach((option) => {
  upsertOption({
    groupKey: 'HEATING',
    key: toUpper(option.id) as string,
    name: option.name,
    description: option.description,
    priceExcl: option.priceExcl,
    vatRate: VAT_RATE_DEFAULT,
    tags: [toUpper(option.type) as string],
    attributes: {
      type: toUpper(option.type),
      category: toUpper(option.category),
      heatingTime: option.heatingTime,
      power: option.power,
      voltage: option.voltage,
      placement: (option as any).placement ?? null,
      size: (option as any).size ?? null,
      pros: option.pros,
      cons: option.cons,
      image: option.image,
      extraOptionKeys: ((option as any).extraOptions ?? []).map((extra: Record<string, any>) =>
        toUpper(extra.id),
      ),
    },
    isActive: true,
  });

  const extraOptions = (option as any).extraOptions as Array<Record<string, any>> | undefined;
  if (extraOptions && extraOptions.length > 0) {
    extraOptions.forEach((extra) => {
      upsertOption({
        groupKey: 'EXTRAS',
        key: toUpper(extra.id) as string,
        name: extra.name,
        description: extra.description,
        priceExcl: extra.priceExcl,
        vatRate: VAT_RATE_DEFAULT,
        tags: ['HEATING-EXTRA'],
        attributes: {
          source: 'heating',
        },
        isActive: true,
      });
    });
  }
});

allMaterials.internal.forEach((material) => {
  upsertOption({
    groupKey: 'MATERIALS-INTERNAL',
    key: toUpper(material.id) as string,
    name: material.name,
    description: material.description,
    priceExcl: material.priceExcl,
    vatRate: VAT_RATE_DEFAULT,
    tags: ['INTERNAL'],
    attributes: {
      colors: material.colors.map((color) => {
        const { priceIncl: _priceIncl, ...rest } = color;
        return {
          ...rest,
          id: toUpper(color.id),
          priceExcl: color.priceExcl,
          vatRate: VAT_RATE_DEFAULT,
        };
      }),
      pros: material.pros,
      cons: material.cons,
      image: material.image,
    },
    isActive: true,
  });
});

allMaterials.external.forEach((material) => {
  upsertOption({
    groupKey: 'MATERIALS-EXTERNAL',
    key: toUpper(material.id) as string,
    name: material.name,
    description: material.description,
    priceExcl: material.priceExcl,
    vatRate: VAT_RATE_DEFAULT,
    tags: ['EXTERNAL'],
    attributes: {
      colors: material.colors.map((color) => {
        const { priceIncl: _priceIncl, ...rest } = color;
        return {
          ...rest,
          id: toUpper(color.id),
          priceExcl: color.priceExcl,
          vatRate: VAT_RATE_DEFAULT,
        };
      }),
      pros: material.pros,
      cons: material.cons,
      image: material.image,
    },
    isActive: true,
  });
});

allMaterials.insulation.forEach((insulation) => {
  upsertOption({
    groupKey: 'INSULATION',
    key: toUpper(insulation.id) as string,
    name: insulation.name,
    description: insulation.description,
    priceExcl: insulation.priceExcl,
    vatRate: VAT_RATE_DEFAULT,
    tags: ['INSULATION'],
    attributes: {
      pros: insulation.pros,
      cons: insulation.cons,
    },
    isActive: true,
  });
});

allOptions.spaSystems.forEach((option) => {
  upsertOption({
    groupKey: 'SPASYSTEM',
    key: toUpper(option.id) as string,
    name: option.name,
    description: option.description,
    priceExcl: option.priceExcl,
    vatRate: VAT_RATE_DEFAULT,
    tags: ['SPA', toUpper(option.type) as string],
    attributes: {
      type: toUpper(option.type),
      power: option.power ?? null,
      nozzles: option.nozzles ?? null,
      included: option.included ?? false,
    },
    isActive: true,
  });
});

allOptions.ledOptions.forEach((option) => {
  upsertOption({
    groupKey: 'LEDS',
    key: toUpper(option.id) as string,
    name: option.name,
    description: option.description,
    priceExcl: option.priceExcl,
    vatRate: VAT_RATE_DEFAULT,
    tags: ['LED', toUpper(option.type) as string],
    attributes: {
      type: toUpper(option.type),
      count: option.count ?? null,
      size: option.size ?? null,
    },
    isActive: true,
  });
});

allOptions.filtrationOptions.forEach((option) => {
  upsertOption({
    groupKey: 'FILTRATION',
    key: toUpper(option.id) as string,
    name: option.name,
    description: option.description,
    priceExcl: option.priceExcl,
    vatRate: VAT_RATE_DEFAULT,
    tags: ['FILTRATION', toUpper(option.type) as string],
    attributes: {
      type: toUpper(option.type),
      required: option.required ?? false,
    },
    isActive: true,
  });
});

allOptions.controlUnits.forEach((option) => {
  upsertOption({
    groupKey: 'CONTROLUNIT',
    key: toUpper(option.id) as string,
    name: option.name,
    description: option.description,
    priceExcl: option.priceExcl,
    vatRate: VAT_RATE_DEFAULT,
    tags: ['CONTROL', toUpper(option.type) as string],
    attributes: {
      type: toUpper(option.type),
      wifi: option.wifi ?? null,
    },
    isActive: true,
  });
});

allOptions.lidOptions.forEach((option) => {
  upsertOption({
    groupKey: 'LID',
    key: toUpper(option.id) as string,
    name: option.name,
    description: option.description,
    priceExcl: option.priceExcl,
    vatRate: VAT_RATE_DEFAULT,
    tags: ['LID', toUpper(option.type) as string],
    attributes: {
      type: toUpper(option.type),
      material: option.material ?? null,
      color: option.color ?? null,
      inheritMaterial: option.inheritMaterial ?? false,
    },
    isActive: true,
  });
});

allOptions.stairsOptions.forEach((option) => {
  upsertOption({
    groupKey: 'STAIRS',
    key: toUpper(option.id) as string,
    name: option.name,
    description: option.description,
    priceExcl: option.priceExcl,
    vatRate: VAT_RATE_DEFAULT,
    tags: option.coversSandFilter ? ['COVERS-SAND-FILTER'] : [],
    attributes: {
      type: toUpper(option.type),
      material: option.material ?? null,
      coversSandFilter: option.coversSandFilter ?? false,
    },
    isActive: true,
  });
});

allOptions.extraOptions.forEach((option) => {
  upsertOption({
    groupKey: 'EXTRAS',
    key: toUpper(option.id) as string,
    name: option.name,
    description: option.description,
    priceExcl: option.priceExcl,
    vatRate: VAT_RATE_DEFAULT,
    tags: [toUpper(option.category) as string],
    attributes: {
      category: toUpper(option.category),
      required: option.required ?? false,
    },
    isActive: true,
  });
});

upsertOption({
  groupKey: 'SANDFILTER',
  key: 'SAND-FILTER-BOX',
  name: 'Zandfilter Box',
  description: 'Zandfilter in bijpassende box',
  priceExcl: 82.64,
  vatRate: VAT_RATE_DEFAULT,
  tags: ['SAND-FILTER-BOX'],
  attributes: {
    inheritsExternalColor: true,
  },
  isActive: true,
});

export const seedProducts = async (dataSource: DataSource) => {
  const logger = new Logger('SeedProducts');

  const baseProductRepo = dataSource.getRepository(BaseProductEntity);
  const optionGroupRepo = dataSource.getRepository(OptionGroupEntity);
  const optionRepo = dataSource.getRepository(OptionEntity);

  logger.log('Seeding base products...');
  await baseProductRepo.upsert(
    baseProductsSeed as QueryDeepPartialEntity<BaseProductEntity>[],
    ['slug'],
  );

  logger.log('Seeding option groups...');
  await optionGroupRepo.upsert(
    optionGroupsSeed as QueryDeepPartialEntity<OptionGroupEntity>[],
    ['key'],
  );

  logger.log('Seeding options...');
  await optionRepo.upsert(
    Array.from(optionsByKey.values()) as QueryDeepPartialEntity<OptionEntity>[],
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
