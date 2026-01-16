import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './sale.entity';

@Injectable()
export class SalesRepository {
  constructor(
    @InjectRepository(Sale)
    private readonly repository: Repository<Sale>,
  ) {}

  create(data: Partial<Sale>): Sale {
    return this.repository.create(data);
  }

  save(sale: Sale): Promise<Sale> {
    return this.repository.save(sale);
  }

  findById(id: string): Promise<Sale | null> {
    return this.repository.findOne({ where: { id } });
  }
}
