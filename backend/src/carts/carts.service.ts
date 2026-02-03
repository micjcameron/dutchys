import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartsRepository } from './carts.repository';

@Injectable()
export class CartsService {
  constructor(private readonly cartsRepository: CartsRepository) {}

  async createCart(dto: CreateCartDto) {
    const cart = this.cartsRepository.create({
      items: dto.items,
      sessionId: dto.sessionId ?? null,
    });

    const saved = await this.cartsRepository.save(cart);

    return {
      id: saved.id,
      createdAt: saved.createdAt,
    };
  }

  async updateCart(id: string, dto: UpdateCartDto) {
    const cart = await this.cartsRepository.findById(id);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    cart.items = dto.items;
    const saved = await this.cartsRepository.save(cart);

    return {
      id: saved.id,
      updatedAt: saved.updatedAt,
    };
  }

  async deleteCart(id: string) {
    const deleted = await this.cartsRepository.deleteById(id);
    if (!deleted) {
      throw new NotFoundException('Cart not found');
    }

    return { deleted: true };
  }

  async getCartById(id: string) {
    const cart = await this.cartsRepository.findById(id);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }
}
