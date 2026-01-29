import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductType } from './base-product.entity';

export enum OptionGroupSelectionType {
  SINGLE = 'SINGLE',
  MULTI = 'MULTI',
  BOOLEAN = 'BOOLEAN',
}

export type OptionGroupSubSection = {
  key: string;                 // e.g. "CONNECTION", "FILTER", "UV"
  title: string;               // e.g. "Verbindingen"
  selectionType: OptionGroupSelectionType; // SINGLE/MULTI/BOOLEAN
  min?: number | null;
  max?: number | null;
  sortOrder?: number;
};


@Entity({ name: 'option_groups' })
@Index(['sortOrder', 'isActive'])
export class OptionGroupEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar' })
  key!: string;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'enum', enum: OptionGroupSelectionType })
  selectionType!: OptionGroupSelectionType;

  @Column({ type: 'int', nullable: true })
  min!: number | null;

  @Column({ type: 'int', nullable: true })
  max!: number | null;

  @Column({ type: 'int', default: 0 })
  sortOrder!: number;

  @Column({ type: 'jsonb', nullable: true })
  subSections!: OptionGroupSubSection[] | null;
  /**
   * This is fine as jsonb for now (fast + flexible).
   * If later you want strict relational modeling, make a join table.
   */
  @Column({ type: 'jsonb', default: [] })
  productTypes!: ProductType[];

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}