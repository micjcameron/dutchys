import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

const numericTransformer = {
  to: (value?: number | null) => (typeof value === 'number' ? value : value ?? null),
  from: (value?: string | null) => (value === null || value === undefined ? null : Number(value)),
};

@Entity({ name: 'options' })
export class OptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  groupKey!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar' })
  key!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, transformer: numericTransformer })
  priceExcl!: number;

  @Column({ type: 'numeric', precision: 5, scale: 4, transformer: numericTransformer })
  vatRate!: number;

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
