import { Injectable, Logger } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SalesRepository } from './sales.repository';

@Injectable()
export class SalesService {
  private readonly logger = new Logger(SalesService.name);

  constructor(private readonly salesRepository: SalesRepository) {}

  async createSale(dto: CreateSaleDto) {
    this.logger.log('Creating sale', {
      cartId: dto.cartId,
      productType: dto.productType,
      email: dto.email,
    });
    const sale = this.salesRepository.create({
      cartId: dto.cartId,
      productType: dto.productType ?? null,
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

    this.logger.log('Sale created', { saleId: saved.id, cartId: saved.cartId });
    return {
      id: saved.id,
      cartId: saved.cartId,
      createdAt: saved.createdAt,
    };
  }
}
