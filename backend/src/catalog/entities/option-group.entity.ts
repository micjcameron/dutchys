import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductType } from '../../common/product-type.enum';

export enum OptionGroupSelectionType {
  SINGLE = 'SINGLE',
  MULTI = 'MULTI',
  BOOLEAN = 'BOOLEAN',
}

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

  @Column({ type: 'int', nullable: true })
  min!: number | null;

  @Column({ type: 'int', nullable: true })
  max!: number | null;

  @Column({ type: 'int', default: 0 })
  sortOrder!: number;

  @Column({ type: 'jsonb', default: [] })
  productTypes!: ProductType[];

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
