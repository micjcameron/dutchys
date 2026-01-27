import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RuleScope {
  GLOBAL = 'GLOBAL',
  PRODUCT_TYPE = 'PRODUCT_TYPE',
  PRODUCT = 'PRODUCT',
  GROUP = 'GROUP',
}

@Entity({ name: 'catalog_rules' })
export class RuleEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar' })
  key!: string;

  @Column({ type: 'enum', enum: RuleScope })
  scope!: RuleScope;

  @Column({ type: 'varchar', nullable: true })
  scopeRef!: string | null;

  @Column({ type: 'int', default: 0 })
  priority!: number;

  @Column({ type: 'jsonb', default: [] })
  when!: Array<Record<string, unknown>>;

  @Column({ type: 'jsonb', default: [] })
  then!: Array<Record<string, unknown>>;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
