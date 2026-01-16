import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { CartsController } from './carts.controller';
import { CartsRepository } from './carts.repository';
import { CartsService } from './carts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cart])],
  controllers: [CartsController],
  providers: [CartsRepository, CartsService],
})
export class CartsModule {}
