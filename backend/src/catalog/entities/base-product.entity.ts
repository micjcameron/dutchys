import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BaseShape, HeatingType, ProductType } from '../catalog.types'; // adjust path if needed

const numericTransformer = {
  to: (value?: number | null) => (typeof value === 'number' ? value : value ?? null),
  from: (value?: string | null) => (value === null || value === undefined ? null : Number(value)),
};

@Entity({ name: 'base_products' })
@Index(['type', 'isActive'])
export class BaseProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Canonical business key used by configurator + frontend + appliesTo.productModelKeys.
   * DO NOT change this once published, unless you also migrate related references.
   */
  @Index({ unique: true })
  @Column({ type: 'varchar' })
  key!: string;

  /**
   * Slug for stable URLs:
   * - /products/ofuro instead of /products/<uuid>
   * - keep public URLs stable even if DB ids change
   */
  @Index({ unique: true })
  @Column({ type: 'varchar' })
  slug!: string;

  @Column({ type: 'enum', enum: ProductType })
  type!: ProductType;

  @Column({ type: 'enum', enum: BaseShape, nullable: true })
  shape!: BaseShape | null;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  /**
   * Heater kinds supported by this product (NOT "mode").
   * - "Hybrid" is no longer a HeatingType; it's a HeatingMode in the FE (internal/external/hybrid).
   * - For hottubs/saunas you typically allow WOOD and/or ELECTRIC.
   */
  @Column({ type: 'enum', enum: HeatingType, array: true, nullable: true })
  heatingTypes!: HeatingType[] | null;

  /**
   * PRICE POLICY:
   * - priceIncl is the source of truth (what customer sees)
   * - priceExcl is derived (store for reporting / convenience if you want)
   */
  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: numericTransformer,
    default: 0,
  })
  basePriceIncl!: number;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: numericTransformer,
    default: 0,
  })
  basePriceExcl!: number;

  /**
   * Store VAT as integer percent (e.g. 21).
   * Convert in code: vatMultiplier = vatRatePercent / 100
   */
  @Column({ type: 'smallint', default: 21 })
  vatRatePercent!: number;

  /**
   * Flexible bucket for product model flags/dimensions.
   * Example:
   * { diameterCm: 200, allowsIntegratedHeater: true, allowsExternalHeater: true }
   */
  @Column({ type: 'jsonb', default: {} })
  attributes!: Record<string, unknown>;

  @Column({ type: 'jsonb', default: [] })
  images!: string[];

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}

