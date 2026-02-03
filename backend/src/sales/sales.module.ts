import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartsModule } from '../carts/carts.module';
import { CommunicationModule } from '../communication/communication.module';
import { Sale } from './sale.entity';
import { SalesController } from './sales.controller';
import { SalesRepository } from './sales.repository';
import { SalesService } from './sales.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sale]), CartsModule, CommunicationModule],
  controllers: [SalesController],
  providers: [SalesRepository, SalesService],
})
export class SalesModule {}
