import { Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SalesRepository } from './sales.repository';

@Injectable()
export class SalesService {
  constructor(private readonly salesRepository: SalesRepository) {}

  async createSale(dto: CreateSaleDto) {
    const sale = this.salesRepository.create({
      cartId: dto.cartId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone ?? null,
      street: dto.street,
      houseNumber: dto.houseNumber,
      postalCode: dto.postalCode,
      city: dto.city,
      country: dto.country,
      deliveryNotes: dto.deliveryNotes ?? null,
    });

    const saved = await this.salesRepository.save(sale);

    return {
      id: saved.id,
      cartId: saved.cartId,
      createdAt: saved.createdAt,
    };
  }
}
