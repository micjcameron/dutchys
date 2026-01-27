import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum HeatingType {
  WOOD = 'WOOD',
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID',
}

export enum ProductType {
  HOTTUB = 'HOTTUB',
  SAUNA = 'SAUNA',
  COLD_PLUNGE = 'COLD_PLUNGE',
}

const numericTransformer = {
  to: (value?: number | null) =>
    typeof value === 'number' ? value : value ?? null,
  from: (value?: string | null) =>
    value === null || value === undefined ? null : Number(value),
};

@Entity({ name: 'base_products' })
@Index(['type', 'isActive'])
export class BaseProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Slug is ideal for stable URLs:
   * - /products/ofuro instead of /products/<uuid>
   * - can keep public URLs stable even if DB ids change
   */
  @Index({ unique: true })
  @Column({ type: 'varchar' })
  slug!: string;

  @Column({ type: 'enum', enum: ProductType })
  type!: ProductType;

  @Column({ type: 'varchar', nullable: true })
  shape!: string | null;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'enum', enum: HeatingType, array: true, nullable: true })
  heatingTypes!: HeatingType[] | null;

  @Column({ type: 'numeric', precision: 12, scale: 2, transformer: numericTransformer })
  basePriceExcl!: number;

  /**
   * Store VAT as integer percent (e.g. 21) to match how humans think.
   * Convert in code: vatMultiplier = vatRatePercent / 100
   */
  @Column({ type: 'smallint', default: 21 })
  vatRatePercent!: number;

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