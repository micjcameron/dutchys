import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './sale.entity';
import { SalesController } from './sales.controller';
import { SalesRepository } from './sales.repository';
import { SalesService } from './sales.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sale])],
  controllers: [SalesController],
  providers: [SalesRepository, SalesService],
})
export class SalesModule {}
