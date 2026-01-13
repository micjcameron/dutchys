import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PaymentStatus } from './payment-status.enum';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'mollie_payment_id', type: 'varchar', nullable: true })
  molliePaymentId!: string | null;

  @Column({ type: 'varchar' })
  status!: PaymentStatus;

  @Column({ type: 'varchar' })
  amountValue!: string;

  @Column({ type: 'varchar' })
  currency!: string;

  @Column({ type: 'varchar', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', nullable: true })
  redirectUrl!: string | null;

  @Column({ type: 'varchar', nullable: true })
  webhookUrl!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
