import { Injectable, Logger } from '@nestjs/common';
import { CartsService } from '../carts/carts.service';
import { CommunicationService } from '../communication/communication.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SalesRepository } from './sales.repository';

@Injectable()
export class SalesService {
  private readonly logger = new Logger(SalesService.name);

  constructor(
    private readonly salesRepository: SalesRepository,
    private readonly cartsService: CartsService,
    private readonly communicationService: CommunicationService,
  ) {}

  async createSale(dto: CreateSaleDto) {
    this.logger.log('Creating sale', {
      cartId: dto.cartId,
      productType: dto.productType,
      email: dto.email,
      delivery: dto.delivery,
    });
    const sale = this.salesRepository.create({
      cartId: dto.cartId,
      productType: dto.productType ?? null,
      delivery: dto.delivery,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      street: dto.street,
      houseNumber: dto.houseNumber,
      postalCode: dto.postalCode,
      city: dto.city,
      country: dto.country,
      deliveryNotes: dto.deliveryNotes ?? null,
    });

    const saved = await this.salesRepository.save(sale);

    this.processsSaleNotification(sale.id, dto)

    this.logger.log('Sale created', { saleId: saved.id, cartId: saved.cartId });
    return {
      id: saved.id,
      cartId: saved.cartId,
      createdAt: saved.createdAt,
    };
  }

  private async processsSaleNotification(saleId: string, saleDto: CreateSaleDto){
    this.logger.log('Processing sale communications', {
      saleId,
      cartId: saleDto.cartId,
      email: saleDto.email,
    });
    try {
      const [sale, cart] = await Promise.all([
        this.salesRepository.findById(saleId),
        this.cartsService.getCartById(saleDto.cartId),
      ]);

      if (!sale) {
        this.logger.warn('Sale not found for delivery offer request', { saleId });
        return;
      }

      if (!saleDto.delivery) {
        await this.communicationService.sendDeliveryQuoteRequest(sale!, cart);
      } else {
        await this.communicationService.sendSaleNotification(sale!, cart);
      }
    } catch (error) {
      this.logger.error('Failed to send delivery offer email', error as Error);
    }
  }
}
