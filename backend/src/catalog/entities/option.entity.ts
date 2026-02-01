import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { OptionGroupEntity } from './option-group.entity';
import { ProductType } from '../catalog.types'; // adjust import path

const numericTransformer = {
  to: (value?: number | null) =>
    typeof value === 'number' ? value : value ?? null,
  from: (value?: string | null) =>
    value === null || value === undefined ? null : Number(value),
};

export type OptionAppliesTo = {
  productModelKeys?: string[];
  productTypes?: ProductType[];
};

export type OptionQuantityRule = {
  min: number;
  max: number;
  step?: number;
};

@Entity({ name: 'options' })
@Index(['groupId', 'isActive'])
export class OptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Proper FK relation (prevents typos like "MATERIAL-INTERNAL" breaking stuff silently)
   */
  @Column({ type: 'uuid', nullable: true })
  groupId!: string | null;

  @ManyToOne(() => OptionGroupEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'groupId' })
  group!: OptionGroupEntity | null;

  @Index({ unique: true })
  @Column({ type: 'varchar' })
  key!: string;

  /**
   * UI subsection within a group (e.g. FILTRATION -> CONNECTION/FILTER/ADDONS)
   */
  @Column({ type: 'varchar', nullable: true })
  subKey!: string | null;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  /**
   * PRICE POLICY:
   * - priceIncl is the source of truth
   * - priceExcl derived (still stored for convenience)
   */
  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: numericTransformer,
    default: 0,
  })
  priceIncl!: number;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: numericTransformer,
    default: 0,
  })
  priceExcl!: number;

  @Column({ type: 'smallint', default: 21 })
  vatRatePercent!: number;

  @Column({ type: 'jsonb', default: [] })
  images!: string[];

  @Column({ type: 'jsonb', default: [] })
  tags!: string[];

  /**
   * Drives UI only. Do not treat as "hard rules engine".
   * Examples:
   * { installationType: "EXTERNAL" }
   * { material: "WPC", notes: [...] }
   * { warnings: ["..."] }
   */
  @Column({ type: 'jsonb', default: () => "'{}'" })
  attributes!: Record<string, unknown>;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  appliesTo!: OptionAppliesTo;

  @Column({ type: 'jsonb', nullable: true })
  quantityRule!: OptionQuantityRule | null;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
