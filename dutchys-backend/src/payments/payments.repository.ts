import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';

@Injectable()
export class PaymentsRepository {
  constructor(
    @InjectRepository(Payment)
    private readonly repository: Repository<Payment>,
  ) {}

  create(data: Partial<Payment>): Payment {
    return this.repository.create(data);
  }

  save(payment: Payment): Promise<Payment> {
    return this.repository.save(payment);
  }

  findByMollieId(molliePaymentId: string): Promise<Payment | null> {
    return this.repository.findOne({ where: { molliePaymentId } });
  }
}
