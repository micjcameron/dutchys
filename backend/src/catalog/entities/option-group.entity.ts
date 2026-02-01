import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ProductType } from '../catalog.types'; // adjust import path

export enum OptionGroupSelectionType {
  SINGLE = 'SINGLE',
  MULTI = 'MULTI',
  BOOLEAN = 'BOOLEAN',
}

export type OptionGroupSubSection = {
  key: string; // e.g. "CONNECTION", "FILTER", "ADDONS"
  title: string; // e.g. "Verbindingen"
  selectionType: OptionGroupSelectionType; // SINGLE/MULTI/BOOLEAN
};

@Entity({ name: 'option_groups' })
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

  /**
   * Optional: UI subsections/buckets inside a group.
   * Example for filtration group:
   * - CONNECTION
   * - FILTER
   * - ADDONS
   */
  @Column({ type: 'jsonb', nullable: true })
  subSections!: OptionGroupSubSection[] | null;

  /**
   * Fast + flexible.
   * If later you want strict relational modeling, make a join table.
   */
  @Column({ type: 'jsonb', default: [] })
  productTypes!: ProductType[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
