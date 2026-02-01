import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogAdminController } from './catalog-admin.controller';
import { CatalogPublicController } from './catalog-public.controller';
import { CatalogService } from './catalog.service';
import { BaseProductEntity } from './entities/base-product.entity';
import { OptionEntity } from './entities/option.entity';
import { OptionGroupEntity } from './entities/option-group.entity';

const isDev = (process.env.NODE_ENV ?? 'development') === 'development';

@Module({
  imports: [
    TypeOrmModule.forFeature([BaseProductEntity, OptionGroupEntity, OptionEntity]),
  ],
  controllers: [
    CatalogPublicController,
    ...(isDev ? [] : [CatalogAdminController]),
  ],
  providers: [CatalogService],
  exports: [CatalogService],
})
export class CatalogModule {}
