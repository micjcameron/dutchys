import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ProductType } from '../catalog/entities/base-product.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'boolean', nullable: true })
  step1!: boolean | null;

  @Column({ type: 'boolean', nullable: true })
  step2!: boolean | null;

  @Column({ type: 'boolean', nullable: true })
  step3!: boolean | null;

  @Column({ type: 'boolean', nullable: true })
  step4!: boolean | null;

  @Column({ type: 'boolean', nullable: true })
  step5!: boolean | null;

  @Column({ type: 'boolean', nullable: true })
  step6!: boolean | null;

  @Column({ type: 'boolean', nullable: true })
  step7!: boolean | null;

  @Column({ type: 'boolean', nullable: true })
  step8!: boolean | null;

  @Column({ type: 'boolean', nullable: true })
  step9!: boolean | null;

  @Column({ type: 'boolean', nullable: true })
  step10!: boolean | null;

  @Column({ type: 'boolean', nullable: true })
  step11!: boolean | null;

  @Column({ type: 'boolean', nullable: true })
  step12!: boolean | null;

  @Column({ type: 'boolean', nullable: true })
  step13!: boolean | null;

  @Column({ type: 'boolean', nullable: true })
  step14!: boolean | null;

  @Column({ type: 'boolean', nullable: true })
  step15!: boolean | null;

  @Column({ type: 'boolean', nullable: true })
  step16!: boolean | null;

  @Column({ type: 'boolean', nullable: true })
  step17!: boolean | null;

  @Column({ type: 'boolean', nullable: true })
  step18!: boolean | null;

  @Column({ type: 'jsonb', nullable: true })
  currentProduct!: Record<string, unknown> | null;

  @Column({ name: 'cart_id', type: 'uuid', nullable: true })
  cartId!: string | null;

  @Column({ name: 'product_type', type: 'enum', enum: ProductType, nullable: true })
  productType!: ProductType | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
