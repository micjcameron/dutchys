import { Body, Controller, Post } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  async createSale(@Body() dto: CreateSaleDto) {
    return this.salesService.createSale(dto);
  }
}
