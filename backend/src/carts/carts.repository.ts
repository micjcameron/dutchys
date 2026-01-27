import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';

@Injectable()
export class CartsRepository {
  constructor(
    @InjectRepository(Cart)
    private readonly repository: Repository<Cart>,
  ) {}

  create(data: Partial<Cart>): Cart {
    return this.repository.create(data);
  }

  save(cart: Cart): Promise<Cart> {
    return this.repository.save(cart);
  }

  findById(id: string): Promise<Cart | null> {
    return this.repository.findOne({ where: { id } });
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.repository.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
