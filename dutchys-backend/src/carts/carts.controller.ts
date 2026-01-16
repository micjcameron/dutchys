import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartsService } from './carts.service';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  async createCart(@Body() dto: CreateCartDto) {
    return this.cartsService.createCart(dto);
  }

  @Patch(':id')
  async updateCart(@Param('id') id: string, @Body() dto: UpdateCartDto) {
    return this.cartsService.updateCart(id, dto);
  }

  @Delete(':id')
  async deleteCart(@Param('id') id: string) {
    return this.cartsService.deleteCart(id);
  }
}
