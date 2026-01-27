import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductType } from '../../common/product-type.enum';

export enum HeatingType {
  WOOD = 'WOOD',
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID',
}

const numericTransformer = {
  to: (value?: number | null) => (typeof value === 'number' ? value : value ?? null),
  from: (value?: string | null) => (value === null || value === undefined ? null : Number(value)),
};

@Entity({ name: 'base_products' })
export class BaseProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

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

  @Column({ type: 'numeric', precision: 5, scale: 4, transformer: numericTransformer })
  vatRate!: number;

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
