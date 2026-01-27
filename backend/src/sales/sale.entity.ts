import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ProductType } from '../catalog/entities/base-product.entity';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'cart_id', type: 'uuid' })
  cartId!: string;

  @Column({ name: 'product_type', type: 'enum', enum: ProductType, nullable: true })
  productType!: ProductType | null;

  @Column({ name: 'first_name', type: 'varchar' })
  firstName!: string;

  @Column({ name: 'last_name', type: 'varchar' })
  lastName!: string;

  @Column({ type: 'varchar' })
  email!: string;

  @Column({ type: 'varchar', nullable: true })
  phone!: string | null;

  @Column({ type: 'varchar' })
  street!: string;

  @Column({ name: 'house_number', type: 'varchar' })
  houseNumber!: string;

  @Column({ name: 'postal_code', type: 'varchar' })
  postalCode!: string;

  @Column({ type: 'varchar' })
  city!: string;

  @Column({ type: 'varchar' })
  country!: string;

  @Column({ name: 'delivery_notes', type: 'varchar', nullable: true })
  deliveryNotes!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
