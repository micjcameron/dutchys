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

const numericTransformer = {
  to: (value?: number | null) =>
    typeof value === 'number' ? value : value ?? null,
  from: (value?: string | null) =>
    value === null || value === undefined ? null : Number(value),
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

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'numeric', precision: 12, scale: 2, transformer: numericTransformer })
  priceExcl!: number;

  @Column({ type: 'smallint', default: 21 })
  vatRatePercent!: number;

  @Column({ type: 'jsonb', default: [] })
  images!: string[];

  @Column({ type: 'jsonb', default: [] })
  tags!: string[];

  @Column({ type: 'jsonb', default: {} })
  attributes!: Record<string, unknown>;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}

export type OptionColorVariant = {
  id: string;
  name: string;
  hex: string;
  priceExcl: number;
  vatRatePercent: number;
  images?: string[];
  sortOrder?: number;
  isActive?: boolean;
};
